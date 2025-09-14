'use client';

import React, { useEffect, useRef } from 'react';
import { useIntersection} from 'react-use';
import { Title } from './title';
import { ProductCard } from './product-card';
import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/store/category';

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
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId)
  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    threshold: 0.4,
  });

  useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId)
    }
  }, [categoryId, intersection?.isIntersecting, title])

  return (
    <div className={className} id={title} ref={intersectionRef}>
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