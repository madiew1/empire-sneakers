'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, Minus, Plus, Trash2 } from 'lucide-react';

import { cn, formatCurrency } from '@/lib/utils';
import type { CartLine } from '@/store/cart';
import { useCartStore } from '@/store/cart';

const controlButtonStyles =
  'flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50';

const favoriteButtonStyles =
  'flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-400 transition hover:border-neutral-300 hover:text-rose-500';

type CartBagItemProps = {
  item: CartLine;
  className?: string;
};

const CartBagItemComponent: React.FC<CartBagItemProps> = ({ item, className }) => {
  const incrementItemQuantity = useCartStore((state) => state.incrementItemQuantity);
  const decrementItemQuantity = useCartStore((state) => state.decrementItemQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const toggleItemFavorite = useCartStore((state) => state.toggleItemFavorite);

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      removeItem(item.variantId);
      return;
    }

    decrementItemQuantity(item.variantId);
  };

  const handleIncrease = () => {
    incrementItemQuantity(item.variantId);
  };

  const handleRemove = () => {
    removeItem(item.variantId);
  };

  const handleToggleFavorite = () => {
    toggleItemFavorite(item.variantId);
  };

  return (
    <article className={cn('flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:flex-row md:gap-6', className)}>
      <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 md:h-36 md:w-36">
        {item.previewImage ? (
          <Image src={item.previewImage} alt={item.productName} fill className="object-cover" sizes="144px" priority={false} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">Нет фото</div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-neutral-900">{item.productName}</h3>
            {item.sizeLabel ? <p className="text-sm text-neutral-500">Размер: {item.sizeLabel}</p> : null}
            <p className="text-sm text-neutral-500">Количество: {item.quantity}</p>
          </div>
          <p className="text-lg font-semibold text-neutral-900">{formatCurrency(item.unitPrice * item.quantity)}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDecrease}
              className={controlButtonStyles}
              aria-label={item.quantity <= 1 ? 'Удалить товар' : 'Уменьшить количество'}
            >
              {item.quantity <= 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            </button>
            <span className="min-w-[2ch] text-center text-base font-medium">{item.quantity}</span>
            <button type="button" onClick={handleIncrease} className={controlButtonStyles} aria-label="Увеличить количество">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggleFavorite}
            className={cn(favoriteButtonStyles, item.isFavorite && 'border-rose-400 text-rose-500')}
            aria-pressed={item.isFavorite}
            aria-label={item.isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          >
            <Heart className="h-4 w-4" fill={item.isFavorite ? 'currentColor' : 'none'} />
          </button>

          <button
            type="button"
            onClick={handleRemove}
            className="text-sm font-medium text-neutral-500 underline-offset-4 transition hover:text-neutral-800 hover:underline"
          >
            Удалить
          </button>
        </div>

        <div className="mt-4 space-y-2 text-sm text-neutral-500">
          <div>
            <span className="font-medium text-neutral-700">Доставка:</span> бесплатно, в течение 2-4 рабочих дней
          </div>
          <div>
            <span className="font-medium text-neutral-700">Самовывоз:</span> доступен в выбранных магазинах
          </div>
        </div>
      </div>
    </article>
  );
};

export const CartBagItem = React.memo(CartBagItemComponent);

CartBagItem.displayName = 'CartBagItem';
