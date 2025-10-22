'use client';

import Image from 'next/image';
import { X as RemoveIcon } from 'lucide-react';

import type { CartLine } from '@/store/cart';
import { cn, formatCurrency } from '@/lib/utils';
import { getCartLineTotal } from '@/lib/cart';

type CartItemCardProps = {
  item: CartLine;
  onRemove: () => void;
  className?: string;
};

export const CartItemCard: React.FC<CartItemCardProps> = ({ item, onRemove, className }) => {
  const lineTotal = getCartLineTotal(item);

  return (
    <article className={cn('flex gap-3 rounded-2xl bg-white p-4 shadow-sm', className)}>
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        {item.previewImage ? (
          <Image
            src={item.previewImage}
            alt={item.productName}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
            Нет фото
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-1 flex-col">
            <p className="line-clamp-2 text-sm font-medium text-neutral-900">{item.productName}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-neutral-500">
              {item.sizeLabel ? <span>Размер {item.sizeLabel}</span> : null}
              {item.quantity > 1 ? <span>{item.quantity} шт.</span> : null}
            </div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label="Удалить из корзины"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <RemoveIcon size={14} strokeWidth={2} />
          </button>
        </div>

        <p className="mt-auto text-sm font-semibold text-neutral-900">{formatCurrency(lineTotal)}</p>
      </div>
    </article>
  );
};
