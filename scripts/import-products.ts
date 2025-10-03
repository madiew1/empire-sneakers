/**
 * scripts/import-products.ts
 * Импорт товаров из CSV (data/products.csv) в Prisma.
 *
 * Ожидаемые колонки CSV:
 * groupKey,slug,name,brandSlug,categorySlugs,materialSlugs,colorSlug,price,currency,discountPercent,description,sizeNames,sizeStocks,stock,images
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL },
  },
});

type Row = {
  groupKey?: string;
  slug: string;
  name: string;
  brandSlug: string;
  categorySlugs?: string;  // pipe-separated
  materialSlugs?: string;  // pipe-separated
  colorSlug?: string;      // pipe-separated
  price?: string;
  currency?: string;
  discountPercent?: string;
  description?: string;
  sizeNames?: string;      // pipe-separated
  sizeStocks?: string;     // "40:2|41:5|..."
  stock?: string;          // fallback общий stock
  images?: string;         // pipe-separated urls
};

const list = (value?: string) =>
  (value ?? '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);

/** "40:3|41:2" → Map("40"->3,"41"->2) */
const parseSizeStocks = (value?: string) => {
  const m = new Map<string, number>();
  if (!value) return m;
  for (const chunk of list(value)) {
    const [name, qtyRaw] = chunk.split(':').map((s) => s.trim());
    if (!name) continue;
    const qty = Number(qtyRaw);
    m.set(name, Number.isFinite(qty) ? qty : 0);
  }
  return m;
};

/* ===== Цветовая палитра из твоих данных ===== */
const COLOR_HEX: Record<string, string> = {
  white:  '#FFFFFF',
  black:  '#000000',
  grey:   '#9CA3AF',
  gray:   '#9CA3AF',
  blue:   '#3B82F6',
  green:  '#16A34A',
  orange: '#F97316',
  brown:  '#92400E',
  gold:   '#EAB308',
  red:    '#EF4444',
};

async function loadDictionaries() {
  const [brandList, materialList, colorList, sizeList, categoryList] = await Promise.all([
    prisma.brand.findMany(),
    prisma.material.findMany(),
    prisma.color.findMany(),
    prisma.size.findMany(),
    prisma.category.findMany(),
  ]);

  const brandBySlug = new Map(brandList.map((b) => [b.slug, b.id]));
  const materialBySlug = new Map(materialList.map((m) => [m.slug, m.id]));
  const colorBySlug = new Map(colorList.map((c) => [c.slug, c.id]));
  const sizeByName = new Map(sizeList.map((s) => [s.name, s.id]));
  const categoryBySlug = new Map(categoryList.map((c) => [c.slug, c.id]));

  return { brandBySlug, materialBySlug, colorBySlug, sizeByName, categoryBySlug };
}

type Dict = Awaited<ReturnType<typeof loadDictionaries>>;

async function ensureBrand(slug: string, dict: Dict) {
  if (dict.brandBySlug.has(slug)) return dict.brandBySlug.get(slug)!;
  const name = slug.replace(/-/g, ' ');
  const created = await prisma.brand.create({ data: { slug, name } });
  dict.brandBySlug.set(slug, created.id);
  return created.id;
}

async function ensureMaterial(slug: string, dict: Dict) {
  if (dict.materialBySlug.has(slug)) return dict.materialBySlug.get(slug)!;
  const name = slug.replace(/-/g, ' ');
  const created = await prisma.material.create({ data: { slug, name } });
  dict.materialBySlug.set(slug, created.id);
  return created.id;
}

async function ensureColor(slug: string, dict: Dict) {
  if (dict.colorBySlug.has(slug)) return dict.colorBySlug.get(slug)!;
  const name = slug.replace(/-/g, ' ');
  const hex = COLOR_HEX[slug] ?? '#000000';
  const created = await prisma.color.create({ data: { slug, name, hex } });
  dict.colorBySlug.set(slug, created.id);
  return created.id;
}

async function ensureSize(name: string, dict: Dict) {
  if (dict.sizeByName.has(name)) return dict.sizeByName.get(name)!;
  const created = await prisma.size.create({ data: { name } });
  dict.sizeByName.set(name, created.id);
  return created.id;
}

async function main() {
  const csvPath = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve('data/products.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV не найден: ${csvPath}`);
  }

  const csv = fs.readFileSync(csvPath, 'utf8');
  const rows = parse(csv, { columns: true, skip_empty_lines: true }) as Row[];

  const dict = await loadDictionaries();

  let ok = 0;
  let fail = 0;

  for (const row of rows) {
    try {
      const slug = row.slug?.trim();
      if (!slug) { console.warn('skip: пустой slug'); continue; }

      const name = row.name?.trim() || slug;
      const groupKey = row.groupKey?.trim() || null;

      // Бренд
      const brandSlug = row.brandSlug?.trim();
      const brandId = brandSlug ? await ensureBrand(brandSlug, dict) : null;
      if (!brandId) {
        console.warn(`WARN: у товара ${slug} нет brandSlug — пропущено`);
        fail++; continue;
      }

      // Категории (только существующие)
      const categoryIds: number[] = [];
      for (const cSlug of list(row.categorySlugs)) {
        const id = dict.categoryBySlug.get(cSlug);
        if (id) categoryIds.push(id);
        else console.warn(`WARN: категория "${cSlug}" не найдена (товар ${slug})`);
      }

      // Материалы
      const materialIds = await Promise.all(list(row.materialSlugs).map((m) => ensureMaterial(m, dict)));

      // Цвета
      const colorSlugs = list(row.colorSlug).map((s) => s.toLowerCase());
      if (!colorSlugs.length) {
        console.warn(`WARN: у товара ${slug} не указан colorSlug — пропуск`);
        fail++; continue;
      }
      const colorIds = await Promise.all(colorSlugs.map((c) => ensureColor(c, dict)));

      // Размеры
      const sizeNames = list(row.sizeNames);
      const sizeIds = await Promise.all(sizeNames.map((n) => ensureSize(n, dict)));

      // Stock per size
      const sizeQtyMap = parseSizeStocks(row.sizeStocks);
      const defaultStock = Number(row.stock ?? 0) || 0;

      // Картинки
      const imageList: string[] = list(row.images);
      const imageUrl: string = imageList[0] || '';

      // Числовые поля
      const price: number = Number(row.price ?? 0) || 0;

      // ВАЖНО: для Float? — number|null, НИКАКОГО Prisma.Decimal
      const discountPercent: number | null =
        row.discountPercent != null && row.discountPercent !== ''
          ? Number(row.discountPercent)
          : null;

      const currency: string = (row.currency?.trim() || 'EUR').toUpperCase();

      // === UPSERT продукта ===
      const product = await prisma.product.upsert({
        where: { slug },
        update: {
          name,
          imageUrl,
          images: imageList,
          price,
          currency,
          discountPercent,            // <- number|null
          description: row.description ?? null,
          brandId,
          groupKey,
          isActive: true,
        },
        create: {
          slug,
          name,
          imageUrl,
          images: imageList,
          price,
          currency,
          discountPercent,            // <- number|null
          description: row.description ?? null,
          brandId,
          groupKey,
          isActive: true,
        },
        select: { id: true },
      });

      // === M2M привязки ===
      await prisma.productCategory.deleteMany({ where: { productId: product.id } });
      if (categoryIds.length) {
        await prisma.productCategory.createMany({
          data: categoryIds.map((categoryId) => ({ productId: product.id, categoryId })),
          skipDuplicates: true,
        });
      }

      await prisma.productMaterial.deleteMany({ where: { productId: product.id } });
      if (materialIds.length) {
        await prisma.productMaterial.createMany({
          data: materialIds.map((materialId) => ({ productId: product.id, materialId })),
          skipDuplicates: true,
        });
      }

      await prisma.productColor.deleteMany({ where: { productId: product.id } });
      if (colorIds.length) {
        await prisma.productColor.createMany({
          data: colorIds.map((colorId) => ({ productId: product.id, colorId })),
          skipDuplicates: true,
        });
      }

      await prisma.productSize.deleteMany({ where: { productId: product.id } });
      if (sizeIds.length) {
        await prisma.productSize.createMany({
          data: sizeIds.map((sizeId) => ({ productId: product.id, sizeId })),
          skipDuplicates: true,
        });
      }

      // Варианты (size × color)
      await prisma.productVariant.deleteMany({ where: { productId: product.id } });
      const variants: Prisma.ProductVariantCreateManyInput[] = [];
      for (let i = 0; i < colorIds.length; i++) {
        const colorId = colorIds[i];
        const colorSlug = colorSlugs[i] || 'color';
        for (const sizeName of sizeNames) {
          const sizeId = dict.sizeByName.get(sizeName)!;
          const stock = sizeQtyMap.has(sizeName) ? (sizeQtyMap.get(sizeName) || 0) : defaultStock;
          const sku = `${slug}-${sizeName}-${colorSlug}`.slice(0, 191);
          variants.push({ productId: product.id, sizeId, colorId, sku, stock });
        }
      }
      if (variants.length) {
        await prisma.productVariant.createMany({ data: variants, skipDuplicates: true });
      }

      ok++;
      console.log(`OK: ${slug} (${name})`);
    } catch (e) {
      fail++;
      // eslint-disable-next-line no-console
      console.error(`FAIL: ${(e as Error)?.message ?? e}`);
    }
  }

  console.log(`\nDone. Imported OK=${ok}, FAIL=${fail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

