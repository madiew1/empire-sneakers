'use client';

import React, { useEffect, useRef } from 'react';
import { useIntersection } from 'react-use';
import { Title } from './title';
import { ProductCard } from './product-card';
import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/store/category';
import type { CardProduct } from '@/app/page';

interface Props {
  title: string;
  products: CardProduct[];   // уже нормализованные данные
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

  const intersectionRef = useRef<HTMLDivElement | null>(null);
  const intersection = useIntersection(
    intersectionRef as unknown as React.RefObject<HTMLElement>,
    { threshold: 0.4 },
  );

  useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId);
    }
  }, [categoryId, intersection?.isIntersecting, setActiveCategoryId]);

  return (
    <div className={className} id={title} ref={intersectionRef}>
      <Title text={title} size="lg" className="font-extrabold mb-5" />

      <div className={cn('grid grid-cols-3 gap-[50px]', listClassName)}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            slug={p.slug ?? undefined}
            name={p.name}
            imageUrl={p.imageUrl ?? ''}
            price={p.price ?? 0}
          />
        ))}
      </div>
    </div>
  );
};


