/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';
import { Plus } from 'lucide-react';

interface Props {
  id: number;
  slug?: string;
  name: string;
  price: number;        // уже нормализовано (0 если неизвестно)
  imageUrl: string;     // уже нормализовано ('' если нет)
  className?: string;
}

export const ProductCard: React.FC<Props> = ({ id, slug, name, price, imageUrl, className }) => {
  const href = slug ? `/product/${slug}` : `/product/${id}`;
  const formatted = Number.isFinite(price) ? price.toFixed(2) : '0.00';

  return (
    <div className={className}>
      <Link href={href}>
        <div className="flex justify-center bg-secondary rounded-lg h-[300px]">
          <img className="w-full h-full object-cover" src={imageUrl} alt={name} />
        </div>
      </Link>

      <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />
      <p className="text-sm text-gray-400">SALE %%%</p>

      <div className="flex justify-between items-center mt-4">
        <span className="text-[20px]">
          от <b>{formatted} $</b>
        </span>

        <Button variant="secondary">
          <Plus className="mr-1" />
          Добавить
        </Button>
      </div>
    </div>
  );
};

