'use client';

import React, { useState } from 'react';
import { Title } from './title';
import { Input } from '../ui';
import { RangeSlider } from './range-slider';
import { CheckboxFiltersGroup } from './checkbox-filter-group';
import { CheckboxFilterColor } from './checkbox-filter-color';
import { cn } from '@/lib/utils';
import { useFilterList } from '../../hooks/useFiltersList';
import type { Brand, Material, Color} from '@prisma/client';

interface Props {
  className?: string;
}

interface PriceProps {
  priceFrom: number;
  priceTo: number;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const { data: brands,    loading: brandsLoading }    = useFilterList<Brand>('brands');
  const { data: materials, loading: materialsLoading } = useFilterList<Material>('materials')
  const { data: colors,    loading: colorsLoading }    = useFilterList<Color>('colors');
  const [prices, setPrice] = useState<PriceProps>({priceFrom: 0, priceTo: 30000});

  const items = brands.map((item) => ({value: String(item.id), text: item.name}));
  const mItems = materials.map((mItem) => ({value: String(mItem.id), text: mItem.name}));
  const cItems = colors.map((cItem) => ({value: String(cItem.id), label: cItem.name, color: cItem.hex}));
  
  const updatePrice = (name: keyof PriceProps, value: number) => {
    setPrice({
      ...prices,
      [name]: value
    })
  }

  return (
    <div className={className}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold"/>

      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          <Input 
            type="number" 
            placeholder="0" 
            min={0} 
            max={30000} 
            value={String(prices.priceFrom)} 
            onChange={(e) => updatePrice('priceFrom', Number(e.target.value))}
            />
          <Input 
            type="number" 
            min={100} 
            max={30000} 
            placeholder="30000"  
            value={String(prices.priceTo)} 
            onChange={(e) => updatePrice('priceTo', Number(e.target.value))}
            />
        </div>
        <RangeSlider 
          min={0} 
          max={30000} 
          step={100}
          onValueChange={([priceFrom, priceTo]) => setPrice({priceFrom, priceTo})}
          value={[
          prices.priceFrom,
          prices.priceTo
        ]}/>
      </div>
      <div className={cn('sticky shadow-lg shadow-black/5 bg-gray-50 rounded-2xl', className)}>
        <CheckboxFiltersGroup
          className="mt-5 mb-5"
          title="Бренд"
          items={items}
          loading={brandsLoading}
          onChange={(id) => console.log(id)}/>
      </div>
      <div className={cn('sticky shadow-lg shadow-black/5 bg-gray-50 rounded-2xl', className)}>
        <CheckboxFiltersGroup
          className="mt-5 mb-5"
          title="Материал"
          items={mItems}
          loading={materialsLoading}/>
      </div>
      <div className={cn('sticky shadow-lg shadow-black/5 bg-gray-50 rounded-2xl', className)}>
        <CheckboxFilterColor
          className="mt-5 mb-5"
          title="Цвет"
          loading={colorsLoading}
          items={cItems}/>
      </div>
    </div>
  );
};

