'use client';

import Link from 'next/link';

import { Container } from '@/components/shared/container';
import { CartBagList } from '@/components/shared/cart/cart-bag-list';
import { CartSummaryPanel } from '@/components/shared/cart/cart-summary-panel';
import { useCartItems, useCartSummary } from '@/store/cart';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const cartItems = useCartItems();
  const { totalAmount, totalQuantity } = useCartSummary();

  return (
    <Container className="py-10 lg:py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Корзина</h1>
          <p className="text-sm text-neutral-500">В корзине {totalQuantity || 'нет'} товаров на сумму {formatCurrency(totalAmount)}.</p>
        </div>
        <Link href="/" className="text-sm font-semibold text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline">
          Продолжить покупки
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)]">
        <section className="space-y-6">
          <CartBagList items={cartItems} />
        </section>

        <CartSummaryPanel subtotal={totalAmount} itemCount={totalQuantity} />
      </div>
    </Container>
  );
}
