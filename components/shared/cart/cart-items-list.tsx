'use client';

import { CartEmptyState } from './cart-empty-state';
import { CartItemCard } from './cart-item-card';
import type { CartLine } from '@/store/cart';
import { cn } from '@/lib/utils';

type CartItemsListProps = {
  items: CartLine[];
  onItemRemove: (variantId: number) => void;
  className?: string;
};

export const CartItemsList: React.FC<CartItemsListProps> = ({ items, onItemRemove, className }) => {
  if (items.length === 0) {
    return <CartEmptyState className={className} />;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => (
        <CartItemCard key={item.variantId} item={item} onRemove={() => onItemRemove(item.variantId)} />
      ))}
    </div>
  );
};
