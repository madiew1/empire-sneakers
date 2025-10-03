import { PrismaClient, CategoryKind } from '@prisma/client'

// ⚠️ Используем твои словари; при необходимости подправь путь:
import {
  brands,
  materials,
  colors,
  sizes,
  categories as CATEGORIES_CONST, // древовидная структура
} from './constans' // ← если файл лежит в другом месте — поменяй путь

const prisma = new PrismaClient()
async function seedDictionaries() {
  console.log('Seeding dictionaries...')

  // Brands
  for (const b of brands) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name },
      create: { name: b.name, slug: b.slug },
    })
  }

  // Materials
  for (const m of materials) {
    await prisma.material.upsert({
      where: { slug: m.slug },
      update: { name: m.name },
      create: { name: m.name, slug: m.slug },
    })
  }

  // Colors (важно: hex обязателен в твоей схеме)
  for (const c of colors) {
    await prisma.color.upsert({
      where: { slug: c.slug },
      update: { name: c.name, hex: c.hex },
      create: { name: c.name, slug: c.slug, hex: c.hex },
    })
  }

  // Sizes (ключ — name)
  for (const s of sizes) {
    await prisma.size.upsert({
      where: { name: s.name },
      update: {},
      create: { name: s.name },
    })
  }

  console.log('Dictionaries seeded')
}

/**
 * Превращаем константы в плоский список узлов с привязкой к родителю.
 */
type FlatNode = {
  name: string
  slug: string
  kind: CategoryKind
  parentSlug: string | null
  ord: number
}

function flattenCategoryTree(): FlatNode[] {
  const result: FlatNode[] = []
  let rootOrd = 0

  for (const root of CATEGORIES_CONST) {
    result.push({
      name: root.name,
      slug: root.slug,
      kind: CategoryKind.ROOT,
      parentSlug: null,
      ord: rootOrd++,
    })

    if (Array.isArray(root.sections)) {
      let sectionOrd = 0
      for (const section of root.sections) {
        result.push({
          name: section.name,
          slug: section.slug,
          kind: CategoryKind.SECTION,
          parentSlug: root.slug,
          ord: sectionOrd++,
        })

        if (Array.isArray(section.dropdown)) {
          let ddOrd = 0
          for (const dd of section.dropdown) {
            result.push({
              name: dd.name,
              slug: dd.slug,
              kind: CategoryKind.DROPDOWN,
              parentSlug: section.slug,
              ord: ddOrd++,
            })
          }
        }
      }
    }
  }

  return result
}

/**
 * Синхронизация категорий: удаляем лишнее, потом upsert всех нужных в правильном порядке.
 */
async function seedCategories() {
  console.log('Seeding categories (tree)...')

  const desired = flattenCategoryTree()
  const desiredSlugs = new Set(desired.map((n) => n.slug))

  // 1) удалить то, чего нет в constans.ts (чтобы база = константам)
  // порядок важен: сначала листья (DROPDOWN) -> SECTION -> ROOT
  await prisma.category.deleteMany({
    where: {
      kind: CategoryKind.DROPDOWN,
      slug: { notIn: Array.from(desiredSlugs) },
    },
  })
  await prisma.category.deleteMany({
    where: {
      kind: CategoryKind.SECTION,
      slug: { notIn: Array.from(desiredSlugs) },
    },
  })
  await prisma.category.deleteMany({
    where: {
      kind: CategoryKind.ROOT,
      slug: { notIn: Array.from(desiredSlugs) },
    },
  })

  // 2) upsert корней
  const roots = desired.filter((n) => n.kind === CategoryKind.ROOT)
  for (const node of roots) {
    await prisma.category.upsert({
      where: { slug: node.slug },
      update: {
        name: node.name,
        kind: node.kind,
        order: node.ord,
        parentId: null,
        parentSlug: null,
      },
      create: {
        name: node.name,
        slug: node.slug,
        kind: node.kind,
        order: node.ord,
        parentId: null,
        parentSlug: null,
      },
    })
  }

  // 3) upsert секций (нужен id родителя-ROOT)
  const sections = desired.filter((n) => n.kind === CategoryKind.SECTION)
  for (const node of sections) {
    const parent = await prisma.category.findUnique({
      where: { slug: node.parentSlug! },
      select: { id: true },
    })
    if (!parent) {
      console.warn(`[WARN] parent ROOT not found for section ${node.slug} (parentSlug=${node.parentSlug})`)
      continue
    }

    await prisma.category.upsert({
      where: { slug: node.slug },
      update: {
        name: node.name,
        kind: node.kind,
        order: node.ord,
        parentId: parent.id,
        parentSlug: node.parentSlug,
      },
      create: {
        name: node.name,
        slug: node.slug,
        kind: node.kind,
        order: node.ord,
        parentId: parent.id,
        parentSlug: node.parentSlug,
      },
    })
  }

  // 4) upsert dropdown (нужен id родителя-SECTION)
  const dropdowns = desired.filter((n) => n.kind === CategoryKind.DROPDOWN)
  for (const node of dropdowns) {
    const parent = await prisma.category.findUnique({
      where: { slug: node.parentSlug! },
      select: { id: true },
    })
    if (!parent) {
      console.warn(`[WARN] parent SECTION not found for dropdown ${node.slug} (parentSlug=${node.parentSlug})`)
      continue
    }

    await prisma.category.upsert({
      where: { slug: node.slug },
      update: {
        name: node.name,
        kind: node.kind,
        order: node.ord,
        parentId: parent.id,
        parentSlug: node.parentSlug,
      },
      create: {
        name: node.name,
        slug: node.slug,
        kind: node.kind,
        order: node.ord,
        parentId: parent.id,
        parentSlug: node.parentSlug,
      },
    })
  }

  console.log('Categories (tree) seeded')
}

async function main() {
  await seedDictionaries()   // было и осталось
  await seedCategories()     // новая/исправленная логика
  console.log('Seed finished')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



