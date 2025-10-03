'use client';

import Link from 'next/link';
import { useMemo } from 'react';

export type MegaItem = { label: string; href?: string; badge?: string };
export type MegaSection = { title: string; items: MegaItem[] };

type TreeCategory = {
  id: number;
  name: string;
  slug: string;
  kind: 'ROOT' | 'SECTION' | 'DROPDOWN';
  children: TreeCategory[];
};

function slugToHref(slug: string) {
  return '/c/' + slug.split('-').join('/');
}

export default function MegaMenu({
  activeSlug,
  onMouseEnter,
  onMouseLeave,
  tree,
}: {
  activeSlug: string | null;
  onMouseEnter: () => void;   // отменяем закрытие, когда заходим в панель
  onMouseLeave: () => void;   // планируем закрытие, когда уходим с панели
  tree?: TreeCategory[];
}) {
  const sections: MegaSection[] = useMemo(() => {
    if (!activeSlug || !tree?.length) return [];
    const root = tree.find((r) => r.slug === activeSlug);
    if (!root) return [];

    // Плоские NEW/SALE
    if (root.slug === 'new' || root.slug === 'sale') {
      const items: MegaItem[] = root.children.map((s) => ({ label: s.name, href: slugToHref(s.slug) }));
      return items.length ? [{ title: root.name, items }] : [];
    }

    // Иначе — секции второго уровня
    const out: MegaSection[] = [];
    for (const second of root.children) {
      const items: MegaItem[] = second.children.length
        ? second.children.map((ch) => ({ label: ch.name, href: slugToHref(ch.slug) }))
        : [{ label: second.name, href: slugToHref(second.slug) }];
      out.push({ title: second.name, items });
    }
    return out;
  }, [activeSlug, tree]);

  const MIN_COL = 200; // px

  return (
    <div
      className={[
        'absolute left-0 right-0 top-full mt-2 z-50',
        'transition-[opacity,transform] duration-150 ease-out',
        activeSlug ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none',
      ].join(' ')}
      role="menu"
      aria-hidden={!activeSlug}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="w-full rounded-3xl bg-white shadow-2xl shadow-black/10 ring-1 ring-black/5 overflow-hidden">
        <div className="max-h-[70vh] overflow-y-auto">
          <div
            className="grid gap-x-8 gap-y-4 p-6 sm:p-8"
            style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${MIN_COL}px, 1fr))` }}
          >
            {sections.map((sec, i) => (
              <div key={i} className="min-w-[240px]">
                <div className="font-semibold mb-3 leading-tight">{sec.title}</div>
                <ul className="space-y-1.5 text-sm">
                  {sec.items.map((it, j) => (
                    <li key={j}>
                      {it.href ? (
                        <Link
                          href={it.href}
                          className="block rounded-md px-2 py-1 hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                          role="menuitem"
                        >
                          <span className="break-words">{it.label}</span>
                          {it.badge && (
                            <span className="ml-2 text-[10px] rounded px-1.5 py-0.5 bg-black text-white align-middle">
                              {it.badge}
                            </span>
                          )}
                        </Link>
                      ) : (
                        <span className="block rounded-md px-2 py-1 text-black/70 hover:text-black" role="menuitem">
                          <span className="break-words">{it.label}</span>
                          {it.badge && (
                            <span className="ml-2 text-[10px] rounded px-1.5 py-0.5 bg-black text-white align-middle">
                              {it.badge}
                            </span>
                          )}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}













