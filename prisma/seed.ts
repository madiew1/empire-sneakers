import { PrismaClient } from '@prisma/client'
import { brands, materials, colors, sizes, categories, products } from './constans'

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL! } },
})

async function main() {
  console.log('Seeding…')

  // 1) справочники
  if (brands.length)    await prisma.brand.createMany({ data: brands, skipDuplicates: true })
  if (materials.length) await prisma.material.createMany({ data: materials, skipDuplicates: true })
  if (colors.length)    await prisma.color.createMany({ data: colors, skipDuplicates: true })
  if (sizes.length)     await prisma.size.createMany({ data: sizes,  skipDuplicates: true })
  if (categories.length)await prisma.category.createMany({ data: categories, skipDuplicates: true })

  // 2) словари id
  const [brandList, materialList, colorList, sizeList, categoryList] = await Promise.all([
    prisma.brand.findMany(),
    prisma.material.findMany(),
    prisma.color.findMany(),
    prisma.size.findMany(),
    prisma.category.findMany(),
  ])
  const brandMap    = new Map(brandList.map(b => [b.slug, b.id]))
  const materialMap = new Map(materialList.map(m => [m.slug, m.id]))
  const colorMap    = new Map(colorList.map(c => [c.slug, c.id]))
  const sizeMap     = new Map(sizeList.map(s => [s.name, s.id]))
  const categoryMap = new Map(categoryList.map(c => [c.slug, c.id]))

  // 3) товары + связи + вариации
  for (const p of products) {
    const brandId = brandMap.get(p.brandSlug)
    if (!brandId) { console.warn(`Skip ${p.slug}: brand "${p.brandSlug}" not found`); continue }

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        imageUrl: p.imageUrl,
        images: p.images ?? [],
        price: p.price,
        currency: p.currency ?? 'EUR',
        discountPercent: p.discountPercent ?? null,
        description: p.description ?? null,
        brandId,
        isActive: true,
      },
      create: {
        name: p.name,
        slug: p.slug,
        imageUrl: p.imageUrl,
        images: p.images ?? [],
        price: p.price,
        currency: p.currency ?? 'EUR',
        discountPercent: p.discountPercent ?? null,
        description: p.description ?? null,
        brandId,
        isActive: true,
      },
    })

    await Promise.all([
      prisma.productCategory.deleteMany({ where: { productId: product.id } }),
      prisma.productMaterial.deleteMany({ where: { productId: product.id } }),
      prisma.productColor.deleteMany({ where: { productId: product.id } }),
      prisma.productSize.deleteMany({ where: { productId: product.id } }),
      prisma.productVariant.deleteMany({ where: { productId: product.id } }),
    ])

    const catLinks = (p.categorySlugs ?? [])
      .map(slug => categoryMap.get(slug))
      .filter((v): v is number => typeof v === 'number')
      .map(categoryId => ({ productId: product.id, categoryId }))
    if (catLinks.length) await prisma.productCategory.createMany({ data: catLinks, skipDuplicates: true })

    const matLinks = (p.materialSlugs ?? [])
      .map(slug => materialMap.get(slug))
      .filter((v): v is number => typeof v === 'number')
      .map(materialId => ({ productId: product.id, materialId }))
    if (matLinks.length) await prisma.productMaterial.createMany({ data: matLinks, skipDuplicates: true })

    const colorIds = (p.colorSlugs ?? [])
      .map(slug => colorMap.get(slug))
      .filter((v): v is number => typeof v === 'number')
    if (colorIds.length) {
      await prisma.productColor.createMany({
        data: colorIds.map(colorId => ({ productId: product.id, colorId })),
        skipDuplicates: true,
      })
    }

    const sizeIds = (p.sizeNames ?? [])
      .map(name => sizeMap.get(name))
      .filter((v): v is number => typeof v === 'number')
    if (sizeIds.length) {
      await prisma.productSize.createMany({
        data: sizeIds.map(sizeId => ({ productId: product.id, sizeId })),
        skipDuplicates: true,
      })
    }

    const variants: { productId: number; colorId: number; sizeId: number; sku?: string; price?: number; stock: number }[] = []
    for (const colorId of colorIds) for (const sizeId of sizeIds) {
      variants.push({
        productId: product.id,
        colorId,
        sizeId,
        sku: `${p.slug}-${colorId}-${sizeId}`.toUpperCase(),
        price: p.price,
        stock: p.stock ?? 10,
      })
    }
    if (variants.length) await prisma.productVariant.createMany({ data: variants, skipDuplicates: true })
    console.log(`✓ ${p.slug}: ${variants.length} variants`)
  }

  // 4) DEMO ПОЛЬЗОВАТЕЛИ + DEMO КОРЗИНЫ (guest + user)
 await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: { role: 'ADMIN' },
    create: { name: 'Admin', email: 'admin@test.com', role: 'ADMIN' },
  })

  const demoUser = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: { name: 'Demo User', email: 'user@test.com', role: 'USER' },
  })

  // возьмём несколько вариантов для корзин
  const someVariants = await prisma.productVariant.findMany({
    take: 4,
    orderBy: { id: 'asc' },
  })

  // 4.1 гостевая корзина по sessionId
  const guestSessionId = 'guest-session-demo-123'
  const guestCart = await prisma.cart.upsert({
    where: { sessionId: guestSessionId },
    update: {},
    create: { sessionId: guestSessionId, isActive: true },
  })
  if (someVariants.length) {
    await prisma.cartItem.createMany({
      data: someVariants.slice(0, 2).map(v => ({
        cartId: guestCart.id,
        variantId: v.id,
        qty: 1,
        price: v.price ?? 0,
      })),
      skipDuplicates: true,
    })
  }
  console.log(`✓ guest cart created (sessionId=${guestSessionId})`)

  // 4.2 корзина пользователя Demo User
  const userCart = await prisma.cart.upsert({
    where: { sessionId: `user-${demoUser.id}` }, // используем sessionId-ключ, чтобы upsert работал
    update: { userId: demoUser.id },
    create: { sessionId: `user-${demoUser.id}`, userId: demoUser.id, isActive: true },
  })
  if (someVariants.length) {
    await prisma.cartItem.createMany({
      data: someVariants.slice(2, 4).map(v => ({
        cartId: userCart.id,
        variantId: v.id,
        qty: 2,
        price: v.price ?? 0,
      })),
      skipDuplicates: true,
    })
  }
  console.log(`✓ user cart created for ${demoUser.email}`)

  // итоговая статистика
  const [bc, cc, mc, colc, sc, pc, pvc, cartCnt, cartItemCnt] = await Promise.all([
    prisma.brand.count(),
    prisma.category.count(),
    prisma.material.count(),
    prisma.color.count(),
    prisma.size.count(),
    prisma.product.count(),
    prisma.productVariant.count(),
    prisma.cart.count(),
    prisma.cartItem.count(),
  ])
  console.log(`Done. brands=${bc}, categories=${cc}, materials=${mc}, colors=${colc}, sizes=${sc}, products=${pc}, variants=${pvc}, carts=${cartCnt}, cartItems=${cartItemCnt}`)
}

main()
  .catch((e) => { console.error('Seed error:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })

