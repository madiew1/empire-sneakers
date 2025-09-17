'use client';

import React, { useEffect, useRef } from 'react';
import { useIntersection } from 'react-use';
import { Title } from './title';
import { ProductCard } from './product-card';
import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/store/category';
import type { Product } from '@prisma/client';

interface Props {
  title: string;
  products: Product[];          // именно товары
  categoryId: number;
  className?: string;
  listClassName?: string;
}

export const ProductsGroupList: React.FC<Props> = ({
  className,
  title,
  products,
  categoryId,
  listClassName,
}) => {
  const setActiveCategoryId = useCategoryStore((s) => s.setActiveId);

  // ВАЖНО: типизируем ref под div
  const intersectionRef = useRef<HTMLDivElement | null>(null);
  const intersection = useIntersection(
    intersectionRef as unknown as React.RefObject<HTMLElement>,
    { threshold: 0.4 }
  )

  useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId);
    }
  }, [categoryId, intersection?.isIntersecting, setActiveCategoryId]);

  console.log(products)

  return (
    <div className={className} id={title} ref={intersectionRef}>
      <Title text={title} size="lg" className="font-extrabold mb-5" />

      <div className={cn('grid grid-cols-3 gap-[50px]', listClassName)}>
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            id={i}
            name={product.name}
            imageUrl={product.imageUrl}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
};
