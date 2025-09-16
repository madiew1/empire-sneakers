'use client';

import React from 'react';
import { Title } from './title';
import { Input } from '../ui';
import { RangeSlider } from './range-slider';
import { CheckboxFiltersGroup } from './checkbox-filter-group';
import { CheckboxFilterColor } from './checkbox-filter-color';
import { cn } from '@/lib/utils';

import { useFilterList } from '../../hooks/use-filters-list';
import { useFilters, type FilterConfig } from '../../hooks/use-filters';

import type { Brand, Material, Color } from '@prisma/client';

type Props = { className?: string; onChange?: (f: FilterConfig) => void };

export const Filters: React.FC<Props> = ({ className, onChange }) => {
  // контроллер фильтров (состояние + URL)
  const ctrl = useFilters({ onChange });

  // справочники
  const { data: brands,    loading: brandsLoading }    = useFilterList<Brand>('brands');
  const { data: materials, loading: materialsLoading } = useFilterList<Material>('materials');
  const { data: colors,    loading: colorsLoading }    = useFilterList<Color>('colors');

  // маппинг для UI-компонентов
  const brandItems    = brands.map((b) => ({ value: String(b.id), text: b.name }));
  const materialItems = materials.map((m) => ({ value: String(m.id), text: m.name }));
  const colorItems    = colors.map((c) => ({ value: String(c.id), label: c.name, color: c.hex }));

  return (
    <div className={className}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />

      {/* Цена */}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>

        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={30000}
            value={String(ctrl.prices.priceFrom)}
            onChange={(e) => ctrl.updatePrice('priceFrom', Number(e.target.value))}
          />
        <Input
            type="number"
            min={0}
            max={30000}
            placeholder="30000"
            value={String(ctrl.prices.priceTo)}
            onChange={(e) => ctrl.updatePrice('priceTo', Number(e.target.value))}
          />
        </div>

        <RangeSlider
          min={0}
          max={30000}
          step={100}
          value={[ctrl.prices.priceFrom, ctrl.prices.priceTo]}
          onValueChange={([priceFrom, priceTo]) => ctrl.setPrice({ priceFrom, priceTo })}
        />
      </div>

      {/* Бренды */}
      <div className={cn('sticky shadow-lg shadow-black/5 bg-gray-50 rounded-2xl', className)}>
        <CheckboxFiltersGroup
          className="mt-5 mb-5"
          title="Бренд"
          items={brandItems}
          loading={brandsLoading}
          defaultValue={ctrl.brandValues}
          onChange={ctrl.setBrandValues}
        />
      </div>

      {/* Материалы */}
      <div className={cn('sticky shadow-lg shadow-black/5 bg-gray-50 rounded-2xl', className)}>
        <CheckboxFiltersGroup
          className="mt-5 mb-5"
          title="Материал"
          items={materialItems}
          loading={materialsLoading}
          defaultValue={ctrl.materialValues}
          onChange={ctrl.setMaterialValues}
        />
      </div>

      {/* Цвета */}
      <div className={cn('sticky shadow-lg shadow-black/5 bg-gray-50 rounded-2xl', className)}>
        <CheckboxFilterColor
          className="mt-5 mb-5"
          title="Цвет"
          items={colorItems}
          loading={colorsLoading}
          defaultValue={ctrl.colorValues}
          onChange={ctrl.setColorValues}
        />
      </div>
    </div>
  );
};





