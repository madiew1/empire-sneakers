import { Container, Title, TopBar, Filters} from "@/components/shared";
import { ProductsGroupList } from "@/components/shared/products-group-list";

export default function Home() {
  return (
    <>
    <Container className="mt-10">
      <Title text="Все товары" size="lg" className="font-extrabold"/>
    </Container>
    <TopBar/>
    <Container className="mt-10 pb-14">
      <div className="flex gap-[80px]">
        {/* фильтрация*/}
        <div className="w-[250px]">
          <Filters/>
        </div>
        {/*Список товаров*/}
        <div className="flex-1">
          <div className="flex flex-col gap-16">
            <ProductsGroupList title="HIT" categoryId={1} products={[
                {
                id: 1,
                name: "Nike-Cortez.webp",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
                },
              {
                id: 2,
                name: "Nike-Cortez.webp",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 3,
                name: "Nike-Cortez.webp",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 4,
                name: "Nike-Cortez.webp",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 5,
                name: "Nike-Cortez.webp",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 6,
                name: "Nike-Cortez.webp",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 7,
                name: "Nike-Cortez.webp",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              }
            ]}/>
          <ProductsGroupList title="NEW" categoryId={2} products={[
              {
              id: 1,
              name: "Nike-Cortez.webp",
              imageUrl: "./public/Nike=Cortez.webp",
              price: 7990,
              items: [{price: 7990}]
              },
              {
                id: 2,
                name: "Nike-Cortez.webp",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 3,
                name: "Nike-Cortez.webp",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 4,
                name: "Nike-Cortez.webp",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 5,
                name: "Nike-Cortez.webp",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 6,
                name: "Nike-Cortez.webp",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 7,
                name: "Nike-Cortez.webp",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              }
            ]}/>
          </div>
        </div>
      </div>
    </Container>
    </>
  );
}
