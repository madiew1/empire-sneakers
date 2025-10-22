'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui';
import { cn, formatCurrency } from '@/lib/utils';

const defaultCheckoutHref = '/cart';

type CartSummaryProps = {
  totalAmount: number;
  taxAmount: number;
  taxRate: number;
  checkoutHref?: string;
  className?: string;
};

const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center text-sm text-neutral-500">
    <span className="flex-1">{label}</span>
    <span className="text-base font-semibold text-neutral-900">{value}</span>
  </div>
);

export const CartSummary: React.FC<CartSummaryProps> = ({
  totalAmount,
  taxAmount,
  taxRate,
  checkoutHref = defaultCheckoutHref,
  className,
}) => {
  return (
    <div className={cn('w-full space-y-4', className)}>
      <SummaryRow label="Итого" value={formatCurrency(totalAmount)} />
      <SummaryRow label={`Налог ${Math.round(taxRate * 100)}%`} value={formatCurrency(taxAmount)} />

      <Button asChild className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-base font-semibold">
        <Link href={checkoutHref}>
          <span>Оформить заказ</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
};
