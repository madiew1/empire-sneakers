import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const colors = await prisma.color.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(colors)
}