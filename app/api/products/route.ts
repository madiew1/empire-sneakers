import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const page  = Math.max(1, Number(url.searchParams.get('page')  ?? '1'))
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') ?? '12')))
  const skip  = (page - 1) * limit

  const brandIds    = url.searchParams.getAll('brandId').map(Number)
  const categoryIds = url.searchParams.getAll('categoryId').map(Number)
  const colorIds    = url.searchParams.getAll('colorId').map(Number)
  const sizeNames   = url.searchParams.getAll('size')
  const q           = (url.searchParams.get('q') ?? '').trim()

  const where: Prisma.ProductWhereInput = { isActive: true }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { slug: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (brandIds.length)    where.brandId   = { in: brandIds }
  if (categoryIds.length) where.categories = { some: { categoryId: { in: categoryIds } } }
  if (colorIds.length)    where.colors     = { some: { colorId: { in: colorIds } } }
  if (sizeNames.length)   where.sizes      = { some: { size: { name: { in: sizeNames } } } }

  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: {
        brand: true,
        categories: { include: { category: true } },
        materials:  { include: { material: true } },
        colors:     { include: { color: true } },
        sizes:      { include: { size: true } },
        variants:   { include: { color: true, size: true }, orderBy: { id: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ])

  const data = items.map(p => ({
    ...p,
    priceWithDiscount: p.discountPercent ? Number((p.price * (1 - p.discountPercent / 100)).toFixed(2)) : p.price,
  }))

  return NextResponse.json({ page, limit, total, pages: Math.ceil(total / limit), items: data })
}

