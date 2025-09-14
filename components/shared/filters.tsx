import React from 'react';
import { Title } from './title';
import { Input } from '../ui';
import { RangeSlider } from './range-slider';
import { CheckboxFiltersGroup } from './checkbox-filter-group';
import { CheckboxFilterColor } from './checkbox-filter-color';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold"/>

      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          <Input type="number" placeholder="0" min={0} max={30000} defaultValue={0} />
          <Input type="number" min={100} max={30000} placeholder="30000" />
        </div>
        <RangeSlider min={0} max={30000} step={10} value={[0, 30000]} />
      </div>
      <div className={cn('sticky shadow-lg shadow-black/5 bg-gray-50 rounded-2xl', className)}>
        <CheckboxFiltersGroup
          className="mt-5 mb-5"
          title="Бренд"
          items={[
            {
              text: 'Adidas',
              value: '1',
            },
            {
              text: 'Asics',
              value: '2',
            },
            {
              text: 'Ecco',
              value: '3',
            },
            {
              text: 'Hoko',
              value: '4',
            },
            {
              text: 'Lacoste',
              value: '5',
            },
            {
              text: 'Nike',
              value: '6',
            },
            {
              text: 'Premiata',
              value: '7',
            },
          ]}/>
      </div>
      <div className={cn('sticky shadow-lg shadow-black/5 bg-gray-50 rounded-2xl', className)}>
        <CheckboxFiltersGroup
          className="mt-5 mb-5"
          title="Материал"
          items={[
            {
              text: 'Натуральная Кожа',
              value: '1',
            },
            {
              text: 'Искусственная Кожа',
              value: '2',
            },
            {
              text: 'Замша',
              value: '3',
            },
            {
              text: 'Кожзам',
              value: '4',
            },
            {
              text: 'Войлок',
              value: '5',
            },
            {
              text: 'Нубук',
              value: '6',
            },
            {
              text: 'Нубук Искусственный',
              value: '7',
            },
          ]}/>
      </div>
      <div className={cn('sticky shadow-lg shadow-black/5 bg-gray-50 rounded-2xl', className)}>
        <CheckboxFilterColor
          className="mt-5 mb-5"
          title="Цвет"
          items={[
            { value: 'black',  label: 'black',  color: '#000000' },
            { value: 'white',  label: 'white',  color: '#FFFFFF' },
            { value: 'brown',  label: 'brown',  color: '#5E3B36' },
            { value: 'blue',   label: 'blue',   color: '#3366FF' },
            { value: 'red',    label: 'red',    color: '#C23B17' },
            { value: 'pink',   label: 'pink',   color: '#E8BEB7' },
            { value: 'grey',   label: 'grey',   color: '#A7A9AC' },
            { value: 'yellow', label: 'yellow', color: '#EDC24B' },
            { value: 'purple', label: 'purple', color: '#584BB1' },
            { value: 'green',  label: 'green',  color: '#22663F' },
            { value: 'orange', label: 'orange', color: '#EB6B40' },
          ]}/>
      </div>
    </div>
  );
};