'use client';

import { CartBagItem } from './cart-bag-item';
import { CartEmptyState } from './cart-empty-state';
import type { CartLine } from '@/store/cart';
import { cn } from '@/lib/utils';

type CartBagListProps = {
  items: CartLine[];
  className?: string;
};

export const CartBagList: React.FC<CartBagListProps> = ({ items, className }) => {
  if (!items.length) {
    return <CartEmptyState className={cn('min-h-[200px] rounded-3xl border border-dashed border-neutral-300 bg-white p-12', className)} />;
  }

  return (
    <div className={cn('space-y-6', className)}>
      {items.map((item) => (
        <CartBagItem key={item.variantId} item={item} />
      ))}
    </div>
  );
};
