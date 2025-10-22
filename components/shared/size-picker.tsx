// components/shared/size-picker.tsx
'use client';

export type SizeItem = {
  label: string;
  available: boolean;
  variantId: number | null;
};

type SizePickerProps = {
  sizes: SizeItem[];
  selectedSize?: string | null;
  onSelect?: (size: SizeItem) => void;
};

export function SizePicker({ sizes, selectedSize = null, onSelect }: SizePickerProps) {
  if (!sizes?.length) return null;

  return (
    <div>
      <div className="mb-2 text-sm text-black/60">Выбери размер</div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {sizes.map((sizeOption) => {
          const disabled = !sizeOption.available;
          const isActive = selectedSize === sizeOption.label;

          return (
            <button
              key={sizeOption.label}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (disabled) return;
                onSelect?.(sizeOption);
              }}
              className={[
                'h-11 rounded-xl border text-sm font-medium transition',
                disabled
                  ? 'border-black/10 text-black/30 cursor-not-allowed bg-black/5'
                  : isActive
                  ? 'border-black bg-black text-white'
                  : 'border-black/20 hover:border-black',
              ].join(' ')}
            >
              {sizeOption.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
