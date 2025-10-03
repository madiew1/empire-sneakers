import { Container, Title, TopBar, Filters } from '@/components/shared';
import { ProductsGroupList } from '@/components/shared/products-group-list';
import { prisma } from '@/prisma/prisma-client';
import type { Prisma, Product, ProductVariant } from '@prisma/client';

/** Что отдаём в карточки */
export type CardProduct = {
  id: number;
  name: string;
  slug: string | null;
  imageUrl: string | null;
  price: number | null;
};

/** Продукт + варианты (цена может быть в Product или в Variant) */
type ProductWithVariants = Product & {
  images: string[]; // массив URLов из поля Product.images
  variants: Pick<ProductVariant, 'price'>[];
  price?: number | null;
};

/** Нормализация продукта к виду для карточки */
function normalizeProduct(p: ProductWithVariants): CardProduct {
  const mainImage = p.imageUrl || (p.images?.length ? p.images[0] : null);

  const variantPrices = p.variants
    .map((v) => (typeof v.price === 'number' ? v.price : null))
    .filter((v): v is number => v !== null);

  const minVariantPrice = variantPrices.length ? Math.min(...variantPrices) : null;
  const finalPrice = typeof p.price === 'number' ? p.price : minVariantPrice;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug ?? null,
    imageUrl: mainImage,
    price: finalPrice,
  };
}

/** Тип категории с линками на продукты */
type CategoryWithLinks = Prisma.CategoryGetPayload<{
  include: {
    productLinks: {
      include: {
        product: {
          include: {
            // images — scalar, их включать не нужно
            variants: { select: { price: true } },
          };
        };
      };
    };
  };
}>;

export default async function Home() {
  // Категории с продуктами (через join-таблицу productLinks)
  const categories: CategoryWithLinks[] = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      productLinks: {
        include: {
          product: {
            include: {
              variants: { select: { price: true } }, // цены из вариаций
            },
          },
        },
      },
    },
  });

  const categoriesWithProducts = categories.filter((c) => c.productLinks.length > 0);

  return (
    <>
      <Container className="mt-10">
        <Title text="Все товары" size="lg" className="font-extrabold" />
      </Container>

      <TopBar />

      <Container className="mt-10 pb-14">
        <div className="flex gap-[80px]">
          <div className="w-[250px]">
            <Filters />
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categoriesWithProducts.map((category) => {
                const products: CardProduct[] = category.productLinks.map(
                  (link: CategoryWithLinks['productLinks'][number]) =>
                    normalizeProduct(link.product as ProductWithVariants),
                );

                return (
                  <ProductsGroupList
                    key={category.id}
                    title={category.name}
                    categoryId={category.id}
                    products={products}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}






