// components/shared/size-picker.tsx
'use client';

import { useState } from 'react';

export type SizeItem = { label: string; available: boolean };

export default function SizePicker({ sizes }: { sizes: SizeItem[] }) {
  if (!sizes?.length) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-2 text-sm text-black/60">Выбери размер</div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {sizes.map((s) => {
          const disabled = !s.available;
          const isActive = selected === s.label;
          return (
            <button
              key={s.label}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && setSelected(s.label)}
              className={[
                'h-11 rounded-xl border text-sm font-medium transition',
                disabled
                  ? 'border-black/10 text-black/30 cursor-not-allowed bg-black/5'
                  : isActive
                  ? 'border-black bg-black text-white'
                  : 'border-black/20 hover:border-black',
              ].join(' ')}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

