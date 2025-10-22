'use client';

import { cn } from '@/lib/utils';

type CartEmptyStateProps = {
  className?: string;
};

export const CartEmptyState: React.FC<CartEmptyStateProps> = ({ className }) => {
  return (
    <div className={cn('flex h-full flex-col items-center justify-center text-center text-sm text-neutral-500', className)}>
      <p>В корзине пока пусто. Добавь понравившиеся товары, чтобы увидеть их здесь.</p>
    </div>
  );
};
