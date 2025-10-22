'use client';

import React from 'react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import {MegaMenu} from './mega-menu';

type TreeCategory = {
  id: number;
  name: string;
  slug: string;
  kind: 'ROOT' | 'SECTION' | 'DROPDOWN';
  children: TreeCategory[];
};

const CLOSE_DELAY = 200; // мс — небольшая инерция закрытия

export const Categories: React.FC<{ className?: string; initialRoots?: TreeCategory[] }> = ({
  className,
  initialRoots,
}) => {
  const [tree, setTree] = React.useState<TreeCategory[]>(initialRoots ?? []);
  const [loading, setLoading] = React.useState(!initialRoots);
  const [error, setError] = React.useState<string | null>(null);
  const [activeSlug, setActiveSlug] = React.useState<string | null>(null);

  // таймер на закрытие, чтобы не хлопать меню мгновенно
  const closeTimerRef = React.useRef<number | null>(null);
  const cancelClose = React.useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);
  const scheduleClose = React.useCallback(() => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => setActiveSlug(null), CLOSE_DELAY);
  }, [cancelClose]);

  React.useEffect(() => {
    if (initialRoots?.length) return;
    let cancel = false;
    const ctl = new AbortController();
    const base = process.env.NEXT_PUBLIC_API_URL || '';

    setLoading(true);
    axios
      .get<TreeCategory[]>(`${base}/categories`, { signal: ctl.signal })
      .then(({ data }) => {
        if (!cancel) {
          setTree(Array.isArray(data) ? data : []);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancel) setError(e?.message || 'Не удалось загрузить категории');
      })
      .finally(() => !cancel && setLoading(false));

    return () => {
      cancel = true;
      ctl.abort();
    };
  }, [initialRoots]);

  const roots = tree;

  return (
    // Родитель — якорь для абсолютного меню
    <div
      className={cn('relative w-full', className)}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose} // вместо мгновенного закрытия — с задержкой
    >
      <div className="inline-flex min-h-11 items-center gap-1 bg-gray-50 p-1 rounded-2xl">
        {loading && <div className="h-9 w-48 animate-pulse rounded-xl bg-gray-200" />}
        {!loading && error && <span className="text-xs text-red-500 px-2">Категории не загрузились</span>}

        {!loading &&
          !error &&
          roots.map((root) => (
            <button
              key={root.id}
              onMouseEnter={() => {
                cancelClose();
                setActiveSlug(root.slug);
              }}
              className={cn(
                'flex items-center font-bold h-11 rounded-2xl px-5 transition',
                activeSlug === root.slug
                  ? 'bg-white shadow-md shadow-gray-200 text-primary'
                  : 'hover:bg-white hover:shadow-sm'
              )}
            >
              {root.name}
            </button>
          ))}
      </div>

      {/* «Мостик» между кнопками и панелью, чтобы не выпадать в зазоре mt-2 */}
      {activeSlug && (
        <div
          className="absolute left-0 right-0 top-full h-2"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        />
      )}

      <MegaMenu
        activeSlug={activeSlug}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        tree={tree}
      />
    </div>
  );
};










