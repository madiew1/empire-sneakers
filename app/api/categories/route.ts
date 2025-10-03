import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import type { CategoryKind } from '@prisma/client';

type Tree = {
  id: number;
  name: string;
  slug: string;
  kind: CategoryKind;
  children: Tree[];
};

export const revalidate = 60;

export async function GET() {
  const roots = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { order: 'asc' },
    include: {
      children: {
        orderBy: { order: 'asc' },
        include: { children: { orderBy: { order: 'asc' } } },
      },
    },
  });

  const data: Tree[] = roots.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    kind: r.kind,
    children: r.children.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      kind: s.kind,
      children: s.children.map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        kind: d.kind,
        children: [],
      })),
    })),
  }));

  return NextResponse.json(data);
}



