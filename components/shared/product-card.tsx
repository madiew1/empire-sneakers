/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';
import { Plus } from 'lucide-react';

interface Props {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    className?: string;
}

export const ProductCard: React.FC<Props> = ({id, name, price, imageUrl, className }) => {
  return (
    <div className={className}>
      <Link href={`/product/${id}`}>
      <div className="flex justify-center bg-secondary rounded-lg h-[300px]">
        <img className="w-[100%] h-[100%]" src={imageUrl} alt={name} />
      </div>
      </Link>
      <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />
      <p className="text-sm text-gray-400">
        SALE %%%
      </p>

      <div className="flex justify-between items-center mt-4">
        <span className="text-[20px]">
          от <b>{price} $</b>
        </span>

        <Button variant="secondary">
            <Plus className="mr-1" />
             Добавить
        </Button>
      </div>
    </div>
  );
};