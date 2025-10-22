// components/shared/product-gallery.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

export function ProductGallery({ images }: { images: string[] }) {
  const safeImages = images?.length ? images : ['/placeholder.png'];
  const [active, setActive] = useState(0);

  return (
    <div className="w-full">
      <div className="flex gap-6">
        {/* Вертикальные превью */}
        <div className="hidden sm:flex flex-col gap-3 max-h-[520px] overflow-auto pr-1">
          {safeImages.map((src, idx) => (
            <button
              key={idx}
              onMouseEnter={() => setActive(idx)}
              onClick={() => setActive(idx)}
              className={`relative h-16 w-16 rounded-xl ring-1 overflow-hidden
                          ${active === idx ? 'ring-black' : 'ring-black/10 hover:ring-black/30'}`}
            >
              <Image
                src={src}
                alt={`preview-${idx}`}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>

        {/* Большое фото */}
        <div className="relative flex-1 aspect-[3/4] rounded-2xl ring-1 ring-black/10 overflow-hidden">
          <Image
            key={safeImages[active]}
            src={safeImages[active]}
            alt="product"
            fill
            sizes="(min-width:1024px) 700px, 100vw"
            className="object-cover bg-[rgb(247,247,247)]"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
