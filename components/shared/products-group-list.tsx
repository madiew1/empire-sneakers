import React from 'react';
import { Title } from './title';
import { ProductCard } from './product-card';
import { cn } from '@/lib/utils';

interface Props {
    title: string;
    products: any[];
    categoryId: number;
    className?: string;
    listClassName?: string;
}

export const ProductsGroupList: React.FC<Props> = ({ 
    className,
    title,
    products,
    categoryId,
    listClassName 
}) => {
  return (
    <div className={className}>
      <Title text={title} size="lg" className="font-extrabold mb-5"/>

      <div className={cn("grid grid-cols-3 gap-[50px]",listClassName)}>
      {products.map((product, i) => (
          <ProductCard
          key={product.id}
          name="Nike Cortez"
          imageUrl="Nike-Cortez.webp"
          price={7990} id={0}/>
        ))}
      </div>
    </div>
  );
};