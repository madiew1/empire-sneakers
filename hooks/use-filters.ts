'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'qs';

export type FilterConfig = {
  priceFrom: number;
  priceTo: number;
  brands: number[];
  materials: number[];
  colors: number[];
};

// дефолты для «чистого» состояния
const DEFAULTS = { priceFrom: 0, priceTo: 30000 } as const;

function toStringArray(val: unknown): string[] {
  if (val == null) return [];
  return Array.isArray(val) ? val.map(String) : [String(val)];
}

export function useFilters(opts?: {
  onChange?: (f: FilterConfig) => void;
  defaults?: Partial<typeof DEFAULTS>;
}) {
  const { onChange, defaults } = opts ?? {};
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1) читаем query ОДИН РАЗ на маунте (не завязываем на searchParams в зависимостях)
  const parsed = useMemo(
    () =>
      qs.parse(searchParams.toString(), {
        ignoreQueryPrefix: true,
        comma: true, // brands=1,2,3
      }) as Partial<FilterConfig>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // 2) локальное состояние
  const [prices, setPrice] = useState(() => ({
    priceFrom: Number(
      parsed.priceFrom ?? (defaults?.priceFrom ?? DEFAULTS.priceFrom)
    ),
    priceTo: Number(parsed.priceTo ?? (defaults?.priceTo ?? DEFAULTS.priceTo)),
  }));

  const [brandValues, setBrandValues] = useState<string[]>(
    toStringArray(parsed.brands)
  );
  const [materialValues, setMaterialValues] = useState<string[]>(
    toStringArray(parsed.materials)
  );
  const [colorValues, setColorValues] = useState<string[]>(
    toStringArray(parsed.colors)
  );

  const updatePrice = (name: 'priceFrom' | 'priceTo', value: number) =>
    setPrice((p) => ({ ...p, [name]: value }));

  // 3) агрегированная конфигурация
  const config: FilterConfig = useMemo(
    () => ({
      priceFrom: prices.priceFrom,
      priceTo: prices.priceTo,
      brands: brandValues.map(Number),
      materials: materialValues.map(Number),
      colors: colorValues.map(Number),
    }),
    [prices, brandValues, materialValues, colorValues]
  );

  // 4) синхронизация с URL (без мусора на первом рендере)
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      return; // не трогаем URL на первом рендере
    }

    const eff = {
      priceFrom: defaults?.priceFrom ?? DEFAULTS.priceFrom,
      priceTo: defaults?.priceTo ?? DEFAULTS.priceTo,
    };

    const isDefault =
      config.priceFrom === eff.priceFrom &&
      config.priceTo === eff.priceTo &&
      config.brands.length === 0 &&
      config.materials.length === 0 &&
      config.colors.length === 0;

    if (isDefault) {
      // чистим query, чтобы главная была «/»
      router.replace('/', { scroll: false });
    } else {
      const query = qs.stringify(config, { arrayFormat: 'comma' });
      router.replace(`?${query}`, { scroll: false });
    }

    onChange?.(config);
  }, [config, router, onChange, defaults]);

  return {
    // всё, что нужно UI
    config,

    prices,
    brandValues,
    materialValues,
    colorValues,

    setPrice,
    setBrandValues,
    setMaterialValues,
    setColorValues,
    updatePrice,
  };
}

