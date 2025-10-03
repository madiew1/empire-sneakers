// scripts/cloudinary-export.ts
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

type Asset = { public_id: string; secure_url: string }

const slug = (s: string) =>
  s.toLowerCase()
   .normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
   .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')

const withTransform = (url: string, t = 'f_auto,q_auto') =>
  url.replace('/upload/', `/upload/${t}/`)

/** тянем все картинки из products/ */
async function listAll(prefix = 'products/'): Promise<Asset[]> {
  const out: Asset[] = []
  let next: string | undefined
  do {
    const res = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix,
      max_results: 500,
      next_cursor: next,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    out.push(...res.resources.map((r: any) => ({
      public_id: r.public_id as string,
      secure_url: r.secure_url as string,
    })))
    next = res.next_cursor
  } while (next)
  return out
}

/** отбираем до 5 изображений: в приоритете 1..5, иначе первые 5 по алфавиту */
function pickUpTo5(publicIds: string[], secureUrls: string[]) {
  const pairs = publicIds.map((id, i) => ({ id, url: secureUrls[i] }))
  const numbered = pairs
    .map(p => {
      const m = p.id.match(/\/(\d+)$|-(\d+)$/) // .../1 или ...-1
      return { ...p, n: m ? Number(m[1] ?? m[2]) : NaN }
    })
    .filter(p => Number.isFinite(p.n))
    .sort((a,b) => (a.n as number) - (b.n as number))

  const inOrder = [1,2,3,4,5].map(n => numbered.find(p => p.n === n)?.url).filter(Boolean) as string[]
  if (inOrder.length) return inOrder.slice(0,5)

  return pairs.sort((a,b) => a.id.localeCompare(b.id)).slice(0,5).map(p => p.url)
}

async function main() {
  const assets = await listAll('products/')
  if (!assets.length) {
    console.log('В Cloudinary нет файлов под products/. Сначала запусти upload:cloudinary')
    return
  }

  // группируем по папке-цвету (products/.../<color>)
  const groups = new Map<string, Asset[]>()
  for (const a of assets) {
    const dir = path.posix.dirname(a.public_id) // products/brand/model/.../color
    if (!groups.has(dir)) groups.set(dir, [])
    groups.get(dir)!.push(a)
  }

  const rows: string[] = []
  rows.push([
    'groupKey','slug','name','brandSlug','categorySlugs','materialSlugs',
    'colorSlug','price','currency','discountPercent','description',
    'sizeNames','stock','images'
  ].join(','))

  let skipped = 0

  for (const [dir, list] of groups) {
    const pids = list.map(a => a.public_id)
    const urls = list.map(a => withTransform(a.secure_url))
    const chosen = pickUpTo5(pids, urls)        // <= здесь берём 1..5

    if (chosen.length === 0) {                   // нужно хотя бы одно фото
      skipped++
      continue
    }

    const parts = dir.split('/')                         // ['products','brand',...,'color']
    const brandName = parts[1] || 'brand'
    const colorName = parts[parts.length - 1] || 'color'
    const modelParts = parts.slice(2, parts.length - 1)  // между brand и color
    const modelName = modelParts.join(' ') || 'model'

    const brandSlug = slug(brandName)
    const modelSlug = slug(modelName)
    const colorSlug = slug(colorName)

    const groupKey = `${brandSlug}-${modelSlug}`
    const productSlug = `${groupKey}-${colorSlug}`
    const name = `${brandName} ${modelName} ${colorName}`

    // <<< ВОТ ЭТА СТРОКА
    const imagesField = `"${chosen.join('|')}"`   // кладём СКОЛЬКО ЕСТЬ (1..5)

    rows.push([
      groupKey, productSlug, `"${name}"`, brandSlug,
      '', '', colorSlug, '', 'EUR', '', '',
      '', '', imagesField
    ].join(','))
  }

  if (!rows.length) {
    console.log('Ни одной группы не собрано.')
    return
  }

  fs.mkdirSync('data', { recursive: true })
  const out = 'data/cloudinary_export.csv'
  fs.writeFileSync(out, rows.join('\n'), 'utf8')
  console.log(`Готово: ${out}. Строк: ${rows.length - 1}. Пропущено (без фото): ${skipped}.`)
}

main().catch(e => { console.error(e); process.exit(1) })

