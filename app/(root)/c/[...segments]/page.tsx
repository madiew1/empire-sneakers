/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation';
import { prisma } from '@/prisma/prisma-client';
import { Container } from '@/components/shared';
import Image from 'next/image';
import Link from 'next/link';

/** Универсальный парсер картинок из разных форматов поля `images` */
function extractImages(val: any): string[] {
  // Массив строк или объектов { url } / { src }
  if (Array.isArray(val)) {
    const arr = val
      .map((x) => (typeof x === 'string' ? x : x?.url ?? x?.src ?? null))
      .filter(Boolean);
    if (arr.length) return arr as string[];
  }
  // JSON-строка
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      const viaJson = extractImages(parsed);
      if (viaJson.length) return viaJson;
    } catch {
      /* not JSON, fall through */
    }
    // CSV-строка с разделителем | или ,
    if (val.includes('|') || val.includes(',')) {
      const sep = val.includes('|') ? '|' : ',';
      const arr = val.split(sep).map((s) => s.trim()).filter(Boolean);
      if (arr.length) return arr;
    }
  }
  return [];
}

export default async function CategoryPage({
  params,
}: {
  params: { segments?: string[] };
}) {
  const slug = (params.segments ?? []).join('-');
  if (!slug) return notFound();

  const category = await prisma.category.findFirst({ where: { slug } } as any);
  if (!category) return notFound();

  // ID продуктов, привязанных к категории
  const links = await prisma.productCategory.findMany({
    where: { categoryId: (category as any).id },
    select: { productId: true },
  } as any);
  const productIds = links.map((l: any) => l.productId);

  // Список продуктов этой категории (с изображениями прямо из продукта)
  const products = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        orderBy: { id: 'desc' },
        select: {
          id: true,
          slug: true,
          name: true,
          price: true,
          imageUrl: true,
          images: true, // может быть String[] / Json / CSV-строка
        },
      } as any)
    : [];

  // Первая картинка для превью
  const firstByProduct = new Map<number, string>();
  for (const p of products) {
    const imgs = extractImages((p as any).images);
    const first = imgs[0] ?? (p as any).imageUrl ?? '/placeholder.png';
    firstByProduct.set(p.id, first);
  }

  return (
    <Container className="py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">{(category as any).name}</h1>
      </div>

      {products.length === 0 ? (
        <p className="text-black/60">В этой категории пока нет товаров.</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p: any) => (
            <li
              key={p.id}
              className="rounded-2xl ring-1 ring-black/10 overflow-hidden bg-white hover:shadow-lg transition"
            >
              {/* Детальная карточка у тебя по /product/[id] */}
              <Link href={`/product/${p.id}`} className="block">
                <div className="relative aspect-square">
                  <Image
                    src={firstByProduct.get(p.id) ?? '/placeholder.png'}
                    alt={p.name ?? 'Product'}
                    fill
                    sizes="(min-width:1024px) 25vw, 50vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-sm text-black/60 truncate">{p.slug}</div>
                  <div className="font-semibold line-clamp-2">{p.name}</div>
                  {p.price ? (
                    <div className="text-black/80">
                      {Number(p.price).toLocaleString('ru-RU')} ₽
                    </div>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

