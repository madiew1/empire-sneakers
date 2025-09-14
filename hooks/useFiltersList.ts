// hooks/useFilterList.ts
'use client'
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { axiosInstance } from '../services/instance';

type FilterKind = 'brands' | 'materials' | 'colors' | 'sizes'

const endpoints: Record<FilterKind, string> = {
  brands: '/brands',
  materials: '/materials',
  colors: '/colors',
  sizes: '/sizes',
}

function isCanceled(err: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (axios as any).isCancel?.(err) ||
         (typeof err === 'object' && err !== null && 'name' in err && (err as { name?: string }).name === 'CanceledError')
}

export function useFilterList<T>(kind: FilterKind) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  const url = useMemo(() => endpoints[kind], [kind])

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true); setError(null)
    try {
      const { data } = await axiosInstance.get<T[]>(url, { signal })
      setData(data)
    } catch (e) {
      if (!isCanceled(e)) setError(e)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    const ctrl = new AbortController()
    fetchData(ctrl.signal)
    return () => ctrl.abort()
  }, [fetchData])

  return { data, loading, error, refetch: () => fetchData() }
}
