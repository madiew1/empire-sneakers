'use client';

import Link from 'next/link';
import { ArrowRight, Percent } from 'lucide-react';

import { Button } from '@/components/ui';
import { cn, formatCurrency } from '@/lib/utils';
import { calculateTaxAmount, CART_TAX_RATE } from '@/lib/cart';

const DEFAULT_CHECKOUT_PATH = '/checkout';
const FREE_SHIPPING_THRESHOLD = 20000;

const SummaryRow: React.FC<{ label: string; value: string; description?: string }> = ({ label, value, description }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-sm text-neutral-500">
      <span>{label}</span>
      <span className="font-semibold text-neutral-900">{value}</span>
    </div>
    {description ? <p className="text-xs text-neutral-400">{description}</p> : null}
  </div>
);

type CartSummaryPanelProps = {
  subtotal: number;
  itemCount: number;
  checkoutPath?: string;
  className?: string;
};

export const CartSummaryPanel: React.FC<CartSummaryPanelProps> = ({
  subtotal,
  itemCount,
  checkoutPath = DEFAULT_CHECKOUT_PATH,
  className,
}) => {
  const taxAmount = calculateTaxAmount(subtotal, CART_TAX_RATE);
  const total = subtotal + taxAmount;

  const progress = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return (
    <aside className={cn('rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">Итого</h2>
        <span className="text-sm text-neutral-500">{itemCount} товар(ов)</span>
      </div>

      <div className="mt-6 space-y-4">
        <SummaryRow label="Сумма" value={formatCurrency(subtotal)} />
        <SummaryRow label="Налог" value={formatCurrency(taxAmount)} description={`Ставка ${Math.round(CART_TAX_RATE * 100)}%`} />
        <SummaryRow label="Доставка" value={subtotal >= FREE_SHIPPING_THRESHOLD ? 'Бесплатно' : formatCurrency(0)} description="Экспресс и стандартная доставка" />
      </div>

      <div className="mt-6 border-t border-neutral-200 pt-4">
        <div className="flex items-center justify-between text-base font-semibold text-neutral-900">
          <span>Всего</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          {remainingForFreeShipping > 0 ? (
            <p className="text-sm text-emerald-700">
              Добавь товары еще на {formatCurrency(remainingForFreeShipping)}, чтобы получить бесплатную доставку.
            </p>
          ) : (
            <p className="text-sm font-medium text-emerald-700">Бесплатная доставка в подарок! 💚</p>
          )}
          <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-100">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        <Button
          asChild
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-base font-semibold"
          disabled={itemCount === 0}
        >
          <Link href={checkoutPath}>
            <span>Оформить заказ</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>

        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900"
        >
          <Percent className="h-4 w-4" />
          Ввести промокод
        </button>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-neutral-400">
        Нажимая «Оформить заказ», ты подтверждаешь, что ознакомился с условиями сервиса и политикой возврата. Мы используем защищенные
        платежные шлюзы для сохранности твоих данных.
      </p>
    </aside>
  );
};
