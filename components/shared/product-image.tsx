import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  className?: string;
  imageUrl: string;
}

export const ProductImage: React.FC<Props> = ({imageUrl, className }) => {
  return (
    <div className={cn('flex items-center justify-center flex-1 relative w-full', className)}>
      <img
        src={imageUrl}
        alt='Logo'
        className={cn('relative left-2 top-2 transition-all z-10 duration-300')}/>
    </div>
  );
};