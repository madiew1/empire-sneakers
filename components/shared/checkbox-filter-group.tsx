'use client';

import React from 'react';
import { FilterCheckbox, FilterChecboxProps } from './filter-checkbox';
import { ChevronUp, ChevronDown } from 'lucide-react';

type Item = FilterChecboxProps;

interface Props {
  title: string;
  items: Item[];
  className?: string;
  onChange?: (values: string[]) => void;
  defaultValue?: string[];
}

export const CheckboxFiltersGroup: React.FC<Props> = ({
  title,
  items,
  className,
  onChange,
  defaultValue = [],
}) => {
  // State to track if the list is expanded
  const [isOpen, setIsOpen] = React.useState(true);
  // State to track selected checkbox values
  const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);

  // Toggle list visibility
  const handleToggle = () => setIsOpen(prev => !prev);

  // Handle checkbox selection change
  const handleCheckedChange = (value: string, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter(v => v !== value);
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  return (
    <div className={className}>
      {/* Header: clickable to expand/collapse */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={handleToggle}
      >
        <p className="font-bold">{title}</p>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {/* Conditionally render the checkbox list */}
      {isOpen && (
        <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar mt-3">
          {items.map((item, idx) => (
            <FilterCheckbox
              key={idx}
              value={item.value}
              text={item.text}
              endAdornment={item.endAdornment}
              checked={selectedValues.includes(item.value)}
              onCheckedChange={(checked) =>
                handleCheckedChange(item.value, !!checked)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};
