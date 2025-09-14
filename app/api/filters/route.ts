// app/api/filters/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const [brands, categories, colors, sizes] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.color.findMany({ orderBy: { name: 'asc' } }),
    prisma.size.findMany({ orderBy: { name: 'asc' } }),
  ])

  return NextResponse.json({ brands, categories, colors, sizes })
}
