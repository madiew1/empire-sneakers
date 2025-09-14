'use client';

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Item shape for color filters
interface ColorItem {
  value: string;
  label: string;
  // CSS color value (hex, rgb, etc.)
  color: string;
}

interface Props {
  title: string;
  items: ColorItem[];
  className?: string;
  onChange?: (values: string[]) => void;
  defaultValue?: string[];
}

export const CheckboxFilterColor: React.FC<Props> = ({
  title,
  items,
  className,
  onChange,
  defaultValue = [],
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);

  const handleToggle = () => setIsOpen(prev => !prev);

  const handleItemClick = (value: string) => {
    const isSelected = selectedValues.includes(value);
    const newValues = isSelected
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  return (
    <div className={className}>
      {/* Header with collapse toggle */}
      <div className="flex items-center justify-between cursor-pointer" onClick={handleToggle}>
        <p className="font-bold">{title}</p>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {/* Color swatch grid */}
      {isOpen && (
        <div className="grid grid-cols-4 gap-4 mt-3">
          {items.map((item, idx) => {
            const isSelected = selectedValues.includes(item.value);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleItemClick(item.value)}
                className="flex flex-col items-center"
              >
                <span
                  className={cn(
                    'w-8 h-8 rounded-full border-2',
                    isSelected ? 'border-blue-500' : 'border-transparent'
                  )}
                  style={{ backgroundColor: item.color }}
                />
                <span className="mt-2 text-sm text-center whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
