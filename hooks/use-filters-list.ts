'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
// import instance from '@/services/instance';
import axios from 'axios';

type FilterKind = 'brands' | 'materials' | 'colors' | 'sizes';

const endpoints: Record<FilterKind, string> = {
  brands: '/api/brands',
  materials: '/api/materials',
  colors: '/api/colors',
  sizes: '/api/sizes',
};

export function useFilterList<T>(kind: FilterKind) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const url = useMemo(() => endpoints[kind], [kind]);

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        // замени axios на instance, если используешь свой клиент
        const { data } = await axios.get<T[]>(url, { signal });
        setData(data);
      } catch (e) {
        if (!axios.isCancel(e)) setError(e);
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  useEffect(() => {
    const ctrl = new AbortController();
    fetchData(ctrl.signal);
    return () => ctrl.abort();
  }, [fetchData]);

  return { data, loading, error, refetch: () => fetchData() };
}

