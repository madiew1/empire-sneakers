'use client';

import { useEffect, useMemo, useState } from 'react';

import { SizePicker, type SizeItem } from '@/components/shared/size-picker';
import { Button } from '@/components/ui';
import { useCartStore } from '@/store/cart';

type PurchasePanelProps = {
  productId: number;
  productName: string;
  unitPrice: number;
  sizes: SizeItem[];
  defaultVariantId: number | null;
  previewImage: string | null;
};

type FeedbackState = {
  type: 'error' | 'success';
  message: string;
};

const resolveInitialSize = (sizes: SizeItem[]): string | null => {
  if (!sizes.length) return null;
  const firstAvailable = sizes.find((option) => option.available);
  return (firstAvailable ?? sizes[0]).label;
};

export function PurchasePanel({
  productId,
  productName,
  unitPrice,
  sizes,
  defaultVariantId,
  previewImage,
}: PurchasePanelProps) {
  const addItemToCart = useCartStore((state) => state.addItem);

  const initialSize = useMemo(() => resolveInitialSize(sizes), [sizes]);

  const [selectedSize, setSelectedSize] = useState<string | null>(initialSize);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  useEffect(() => {
    setSelectedSize(initialSize);
  }, [initialSize]);

  const selectedSizeItem = sizes.find((item) => item.label === selectedSize) ?? null;
  const hasSizeOptions = sizes.length > 0;

  const variantIdForCart = hasSizeOptions
    ? selectedSizeItem?.variantId ?? null
    : defaultVariantId;

  const isAddDisabled = hasSizeOptions
    ? !selectedSizeItem?.available || !variantIdForCart
    : !variantIdForCart;

  const handleSizeSelect = (size: SizeItem) => {
    setSelectedSize(size.label);
    setFeedback(null);
  };

  const handleAddToCart = () => {
    if (!variantIdForCart) {
      setFeedback({ type: 'error', message: 'Не удалось определить вариант товара. Попробуй обновить страницу.' });
      return;
    }

    if (hasSizeOptions) {
      if (!selectedSizeItem) {
        setFeedback({ type: 'error', message: 'Сначала выбери размер.' });
        return;
      }

      if (!selectedSizeItem.available) {
        setFeedback({ type: 'error', message: `Размер ${selectedSizeItem.label} временно недоступен.` });
        return;
      }
    }

    addItemToCart({
      productId,
      variantId: variantIdForCart,
      productName,
      unitPrice,
      sizeLabel: selectedSizeItem?.label ?? null,
      previewImage: previewImage ?? null,
    });

    setFeedback({ type: 'success', message: 'Товар добавлен в корзину.' });
  };

  return (
    <div className="space-y-4">
      <SizePicker sizes={sizes} selectedSize={selectedSize} onSelect={handleSizeSelect} />

      <div className="flex gap-3">
        <Button
          className="flex-1 h-12 rounded-xl text-white font-semibold hover:bg-black/90 transition"
          onClick={handleAddToCart}
          disabled={isAddDisabled}
        >
          Добавить в корзину
        </Button>
        <Button className="h-12 px-5 rounded-xl text-white font-semibold hover:bg-black/90 transition">
          В избранное
        </Button>
      </div>

      {feedback ? (
        <p
          className={`text-sm ${feedback.type === 'error' ? 'text-red-600' : 'text-primary-600'}`}
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
}
