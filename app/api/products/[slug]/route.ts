import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      brand: true,
      categories: { include: { category: true } },
      materials:  { include: { material: true } },
      colors:     { include: { color: true } },
      sizes:      { include: { size: true } },
      variants:   { include: { color: true, size: true }, orderBy: { id: 'asc' } },
    },
  })

  if (!product) return new NextResponse('Not found', { status: 404 })

  const priceWithDiscount =
    product.discountPercent ? Number((product.price * (1 - product.discountPercent / 100)).toFixed(2)) : product.price

  return NextResponse.json({ ...product, priceWithDiscount })
}

