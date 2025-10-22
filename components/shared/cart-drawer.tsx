'use client';

import React, { useMemo } from 'react';

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CartItemsList } from './cart/cart-items-list';
import { CartSummary } from './cart/cart-summary';
import { CART_TAX_RATE, calculateTaxAmount, formatCartTitle } from '@/lib/cart';
import { useCartItems, useCartStore, useCartSummary } from '@/store/cart';

type CartDrawerProps = {
  className?: string;
  trigger: React.ReactElement;
};

export const CartDrawer: React.FC<CartDrawerProps> = ({ className, trigger }) => {
  const cartItems = useCartItems();
  const removeItem = useCartStore((state) => state.removeItem);
  const { totalAmount, totalQuantity } = useCartSummary();

  const cartTitle = useMemo(() => formatCartTitle(totalQuantity), [totalQuantity]);
  const taxAmount = useMemo(() => calculateTaxAmount(totalAmount, CART_TAX_RATE), [totalAmount]);

  return (
    <div className={className}>
      <Sheet>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent className="flex h-full max-w-lg flex-col bg-[#F4F1EE] p-0">
          <SheetHeader className="px-6 pb-4 pt-6 text-left">
            <SheetTitle className="text-2xl font-semibold text-neutral-900">{cartTitle}</SheetTitle>
          </SheetHeader>

          <CartItemsList
            className="flex-1 overflow-y-auto px-6 pb-6"
            items={cartItems}
            onItemRemove={removeItem}
          />

          <SheetFooter className="-mx bg-white p-8">
            <CartSummary totalAmount={totalAmount} taxAmount={taxAmount} taxRate={CART_TAX_RATE} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
