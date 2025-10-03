/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation';
import { prisma } from '@/prisma/prisma-client';
import ProductGallery from '@/components/shared/product-gallery';
import Colorways, { type ColorwayItem } from '@/components/shared/color-ways';
import SizePicker, { type SizeItem } from '@/components/shared/size-picker';
import { Container } from '@/components/shared';
import { Button } from '@/components/ui';

/** Универсальный парсер поля images (String[], Json[], [{url}], "a|b|c", JSON-строка и т.п.) */
function extractImages(val: any): string[] {
  // Array: ["...", "..."] или [{url:"..."}]
  if (Array.isArray(val)) {
    const arr = val
      .map((x) => {
        if (typeof x === 'string') return x;
        if (x && typeof x === 'object') return x.url ?? x.src ?? null;
        return null;
      })
      .filter(Boolean);
    if (arr.length) return arr as string[];
  }

  // JSON-строка: '["...","..."]' или '[{"url":"..."}]'
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      const viaJson = extractImages(parsed);
      if (viaJson.length) return viaJson;
    } catch {
      // не JSON — падаем ниже
    }
    // Разделители | или ,
    if (val.includes('|') || val.includes(',')) {
      const arr = val.split(val.includes('|') ? '|' : ',').map((s) => s.trim()).filter(Boolean);
      if (arr.length) return arr;
    }
  }

  return [];
}

export default async function ProductPage({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: { variant?: string };
}) {
  // Базовый продукт + варианты (для размеров/цветов)
  const product = (await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      variants: { include: { color: true, size: true }, orderBy: { id: 'asc' } },
    },
  } as any)) as any;

  if (!product) return notFound();

  /* ===================== ГАЛЕРЕЯ ТЕКУЩЕГО ТОВАРА ===================== */
  // 1) пробуем вытащить из самого продукта (String[]/Json/CSV/объекты)
  let images = extractImages(product.images);

  // 2) если пусто — пробуем взять relation-модель картинок с любым популярным именем
  if (!images.length) {
    const imageModelKey = ['productImage', 'productImages', 'image', 'images', 'media'].find(
      (k) => typeof (prisma as any)[k]?.findMany === 'function'
    );
    if (imageModelKey) {
      const rows = await (prisma as any)[imageModelKey].findMany({
        where: { productId: product.id },
        orderBy: [{ position: 'asc' }, { id: 'asc' }],
      } as any);
      images = (rows ?? []).map((r: any) => r.url).filter(Boolean);
    }
  }

  // 3) fallback — главное изображение
  if (!images.length && product.imageUrl) images = [product.imageUrl];
  if (!images.length) images = ['/placeholder.png'];

  /* ===================== АКТИВНЫЙ ВАРИАНТ / РАЗМЕРЫ ===================== */
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const activeVariant =
    variants.find((v: any) => String(v.id) === String(searchParams?.variant ?? '')) ??
    variants.find((v: any) => v.isDefault) ??
    variants[0] ??
    null;

  const activeColor = activeVariant?.color?.name ?? activeVariant?.colorName ?? null;
  const sameColor = activeColor
    ? variants.filter((v: any) => (v.color?.name ?? v.colorName ?? null) === activeColor)
    : variants;

  const sizes: SizeItem[] = sameColor
    .map((v: any) => v.size?.label ?? v.size?.name ?? v.sizeLabel ?? null)
    .filter(Boolean)
    .reduce((acc: SizeItem[], label: string) => {
      if (!acc.some((x) => x.label === label)) acc.push({ label, available: true });
      return acc;
    }, []);

  /* ===================== ДРУГИЕ РАСЦВЕТКИ В РАМКАХ ОДНОЙ ГРУППЫ ===================== */
  // Строго фильтруем по группе. Если группы нет — не тянем весь каталог.
  let whereByGroup: any = null;
  if (product.groupId != null) whereByGroup = { groupId: product.groupId };
  else if (product.groupKey) whereByGroup = { groupKey: product.groupKey };
  else if (product.groupSlug) whereByGroup = { groupSlug: product.groupSlug };

  const siblings = whereByGroup
    ? ((await prisma.product.findMany({
        where: whereByGroup,
        orderBy: { id: 'asc' },
        include: {
          variants: { select: { color: { select: { name: true } } }, take: 1 },
        },
      } as any)) as any[])
    : [product];

  const siblingIds = siblings.map((s) => s.id);

  // Подготовим миниатюры: сначала попробуем взять из поля images каждого товара,
  // затем одним запросом подтянем первую картинку из relation-таблицы (если есть),
  // и в конце — fallback на imageUrl.
  const thumbById = new Map<number, string>();

  for (const s of siblings) {
    const pics = extractImages(s.images);
    if (pics[0]) thumbById.set(s.id, pics[0]);
  }

  const relImageKey = ['productImage', 'productImages', 'image', 'images', 'media'].find(
    (k) => typeof (prisma as any)[k]?.findMany === 'function'
  );
  if (relImageKey) {
    const rows = await (prisma as any)[relImageKey].findMany({
      where: { productId: { in: siblingIds } },
      orderBy: [{ productId: 'asc' }, { position: 'asc' }, { id: 'asc' }],
    } as any);
    for (const r of rows as any[]) {
      if (!thumbById.has(r.productId) && r.url) thumbById.set(r.productId, r.url);
    }
  }

  for (const s of siblings) {
    if (!thumbById.has(s.id) && s.imageUrl) thumbById.set(s.id, s.imageUrl);
  }

  const colorways: ColorwayItem[] = siblings.map((s) => ({
    id: s.id,
    label: s.variants?.[0]?.color?.name ?? 'Variant',
    thumb: thumbById.get(s.id) ?? '/placeholder.png',
    href: `/product/${s.id}`,
  }));

  /* ===================== РЕНДЕР ===================== */
  return (
    <Container className="flex flex-col my-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,520px] gap-10">
        {/* Левый блок: вертикальные превью + большое фото */}
        <ProductGallery images={images} />

        {/* Правый блок: инфо, расцветки этой же группы и размеры */}
        <aside className="space-y-6">
          <div className="bg-red-600/90 text-white rounded-3xl p-6 ring-1 ring-white/10 shadow-xl">
            <h1 className="text-2xl font-extrabold mb-2">{product.name ?? product.title ?? 'Product'}</h1>
            {product.price ? (
              <div className="text-lg font-semibold mb-4">
                {Number(product.price).toLocaleString('ru-RU')} ₽
              </div>
            ) : null}
            <p className="text-white/80 text-sm">
              {product.description || 'Короткое описание товара: материалы, технологии и т.п.'}
            </p>
          </div>

          {colorways.length > 1 && <Colorways items={colorways} />}
          <SizePicker sizes={sizes} />

          <div className="flex gap-3">
            <Button className="flex-1 h-12 rounded-xl text-white font-semibold hover:bg-black/90 transition">
              Добавить в корзину
            </Button>
            <Button className="h-12 px-5 rounded-xl text-white font-semibold hover:bg-black/90 transition">
              В избранное
            </Button>
          </div>
        </aside>
      </div>
    </Container>
  );
}





