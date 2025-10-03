import 'dotenv/config'
import path from 'path'
import fg from 'fast-glob'
import { v2 as cloudinary } from 'cloudinary'
import type { UploadApiResponse } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

const ROOT = 'public/assets'
const GLOB = 'public/assets/products/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}'

async function main(): Promise<void> {
  const files: string[] = await fg(GLOB, { dot: false })
  if (!files.length) throw new Error(`Не найдено файлов по пути: ${GLOB}`)

  for (const f of files) {
    // products/brand/model/color/1.jpg
    const relPosix = path.relative(ROOT, f).replace(/\\/g, '/')
    const withoutExt = relPosix.replace(/\.[^.]+$/, '')         // products/.../1
    const parts = withoutExt.split('/')
    const fileId = parts.pop()!                                 // "1"
    const folder = parts.join('/')                              // "products/brand/model/color"

    // на всякий случай убеждаемся, что грузим только в products/...
    if (!folder.startsWith('products/')) {
      console.warn('SKIP (вне products/):', f)
      continue
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _res: UploadApiResponse = await cloudinary.uploader.upload(f, {
        folder,                      // <-- ВАЖНО: папка отдельным полем
        public_id: fileId,           // только имя файла без расширения
        overwrite: true,
        use_filename: false,
        unique_filename: false,
        resource_type: 'image',
      })
      console.log('OK:', `${folder}/${fileId}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('FAIL:', `${folder}/${fileId}`, msg)
    }
  }
}

main().catch(e => { console.error(e); process.exit(1) })


