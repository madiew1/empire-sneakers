'use client';

import React from 'react';
import { ArrowRight, ShoppingCart } from 'lucide-react';

import { Button } from '../ui';
import { cn, formatCurrency } from '@/lib/utils';
import { CartDrawer } from './cart-drawer';
import { useCartSummary } from '@/store/cart';

interface Props {
  className?: string;
}

export const CartButton: React.FC<Props> = ({ className }) => {
  const { totalAmount, totalQuantity } = useCartSummary();

  const formattedTotal = formatCurrency(totalAmount);

  return (
    <CartDrawer
      trigger={
        <Button className={cn('group relative flex h-12 items-center rounded-xl px-5 text-base font-semibold text-white', className)}>
          <b>{formattedTotal}</b>
          <span className="mx-3 h-6 w-px bg-white/30" />
          <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
            <ShoppingCart size={16} strokeWidth={2} />
            <b>{totalQuantity}</b>
          </div>
          <ArrowRight
            size={20}
            className="absolute right-5 -translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          />
        </Button>
      }
    />
  );
};
