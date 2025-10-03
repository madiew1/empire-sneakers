// components/shared/color-ways.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export type ColorwayItem = {
  id: number | string;
  label: string;
  thumb: string;
  href?: string; // ссылка на вариант/цвет
};

export default function Colorways({ items }: { items: ColorwayItem[] }) {
  const [active, setActive] = useState(items?.[0]?.id ?? null);

  if (!items?.length) return null;

  return (
    <div>
      <div className="mb-2 text-sm text-black/60">Другие расцветки</div>

      <div className="flex flex-wrap gap-3">
        {items.map((c) => {
          const selected = c.id === active;
          const content = (
            <div
              className={`relative h-16 w-16 rounded-xl ring-2 overflow-hidden
                          ${selected ? 'ring-black' : 'ring-black/10 hover:ring-black/30'}`}
              title={c.label}
            >
              <Image
                src={c.thumb || '/placeholder.png'}
                alt={String(c.label)}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            </div>
          );

          return c.href ? (
            <Link
              key={c.id}
              href={c.href}
              onMouseEnter={() => setActive(c.id)}
              className="block"
            >
              {content}
            </Link>
          ) : (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="block"
              title={c.label}
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}

