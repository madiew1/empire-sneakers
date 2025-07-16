import { Container, Title, TopBar, Filters} from "@/components/shared";
import { ProductCard } from "@/components/shared/product-card";
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
            <ProductsGroupList title="Кроссовки" categoryId={1} products={[
              {
              id: 1,
              name: "Nike-Cortez",
              imageUrl: "./public/Nike=Cortez.webp",
              price: 7990,
              items: [{price: 7990}]
              },
              {
                id: 1,
                name: "Nike-Cortez",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 1,
                name: "Nike-Cortez",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 1,
                name: "Nike-Cortez",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 1,
                name: "Nike-Cortez",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 1,
                name: "Nike-Cortez",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 1,
                name: "Nike-Cortez",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              }
            ]}/>
          <ProductsGroupList title="Одежда" categoryId={1} products={[
              {
              id: 1,
              name: "Nike-Cortez",
              imageUrl: "./public/Nike=Cortez.webp",
              price: 7990,
              items: [{price: 7990}]
              },
              {
                id: 1,
                name: "Nike-Cortez",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 1,
                name: "Nike-Cortez",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 1,
                name: "Nike-Cortez",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 1,
                name: "Nike-Cortez",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 1,
                name: "Nike-Cortez",
                imageUrl: "./public/Nike=Cortez.webp",
                price: 7990,
                items: [{price: 7990}]
              },
              {
                id: 1,
                name: "Nike-Cortez",
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
