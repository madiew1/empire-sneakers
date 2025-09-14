'use client';

import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/store/category';
import React from 'react';

interface Props {
  className?: string;
}

const cats = [
  { id: 1, name: 'HIT' },
  { id: 2, name: 'NEW' },
  { id: 3, name: 'SALE' },
  { id: 4, name: 'Мужчины' },
  { id: 5, name: 'Женщины' },
  { id: 6, name: 'Дети' },
  { id: 7, name: 'Обувь' },
  { id: 8, name: 'Одежда' },
];


export const Categories: React.FC<Props> = ({ className }) => {
  const categoryActiveId = useCategoryStore((state) => state.activeId)
  return (
    <div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl',className)}>
      {
        cats.map(({name, id}, index) => (
            <a className={cn('flex items-center font-bold h-11 rounded-2xl px-5', categoryActiveId === id && 'bg-white shadow-md shadow-gray-200 text-primary')} 
              href={`/#${name}`}
              key={index}>
                <button>{name}</button>
            </a>
        ))
      }
    </div>
  );
};