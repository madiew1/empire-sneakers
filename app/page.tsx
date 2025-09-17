import { Container, Title, TopBar, Filters } from '@/components/shared';
import { ProductsGroupList } from '@/components/shared/products-group-list';
import { prisma } from '@/prisma/prisma-client';

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: {
      productLinks: {
        include: {
          product: true,
          category: true,
        },
      },
    },
  });

  return (
    <>
      <Container className="mt-10">
        <Title text="Все товары" size="lg" className="font-extrabold" />
      </Container>

      <TopBar categories={categories.filter((category) => category.productLinks.length > 0)}/>

      <Container className="mt-10 pb-14">
        <div className="flex gap-[80px]">
          {/* фильтрация */}
          <div className="w-[250px]">
            <Filters />
          </div>

          {/* список товаров */}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categories.map((category) =>
                category.productLinks.length > 0 ? (
                  <ProductsGroupList
                    key={category.id}
                    title={category.name}
                    categoryId={category.id}
                    // ПЕРЕДАЁМ ИМЕННО МАССИВ ТОВАРОВ
                    products={category.productLinks.map((l) => l.product)}
                  />
                ) : null
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

