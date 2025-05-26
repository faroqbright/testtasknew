'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Facet, FacetOption } from '@/types';
import React, { useState, useEffect } from 'react';

interface FilterPanelProps {
  facets: Facet[];
}

export default function FilterPanel({ facets }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    const filtersFromUrl = searchParams.get('filters');
    if (filtersFromUrl) {
      try {
        setActiveFilters(JSON.parse(filtersFromUrl));
      } catch (e) {
        setActiveFilters({});
      }
    } else {
      setActiveFilters({});
    }
  }, [searchParams]);

  const handleFilterChange = (attributeKey: string, value: string | number, type: string) => {
    const newFilters = { ...activeFilters };
    const currentValue = newFilters[attributeKey];

    if (type === 'checkbox') {
        let currentArray = Array.isArray(currentValue) ? [...currentValue] : (currentValue ? [String(currentValue)] : []);
        const valueStr = String(value);
        if (currentArray.includes(valueStr)) {
            currentArray = currentArray.filter(item => item !== valueStr);
        } else {
            currentArray.push(valueStr);
        }
        if (currentArray.length === 0) {
            delete newFilters[attributeKey];
        } else {
            newFilters[attributeKey] = currentArray.length === 1 ? currentArray[0] : currentArray;
        }
    } else { // dropdown or other single-select types
        if (currentValue === value || value === "") {
            delete newFilters[attributeKey];
        } else {
            newFilters[attributeKey] = String(value);
        }
    }
    
    const params = new URLSearchParams(searchParams.toString());
    if (Object.keys(newFilters).length > 0) {
      params.set('filters', JSON.stringify(newFilters));
    } else {
      params.delete('filters');
    }
    params.set('page', '1');
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-3">Filters</h3>
      {facets.map((facet) => (
        <div key={facet.attributeKey} className="mb-4">
          <h4 className="font-medium mb-1">{facet.name}</h4>
          {facet.type === 'checkbox' && facet.options.map((option) => (
            <label key={String(option.value)} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={
                    Array.isArray(activeFilters[facet.attributeKey]) 
                        ? (activeFilters[facet.attributeKey] as string[]).includes(String(option.value)) 
                        : activeFilters[facet.attributeKey] === String(option.value)
                }
                onChange={() => handleFilterChange(facet.attributeKey, option.value, facet.type)}
              />
              <span>{option.label} ({option.count})</span>
            </label>
          ))}
          {facet.type === 'dropdown' && (
            <select
              className="w-full p-2 border rounded-md text-sm"
              value={String(activeFilters[facet.attributeKey] || '')}
              onChange={(e) => handleFilterChange(facet.attributeKey, e.target.value, facet.type)}
            >
              <option value="">All</option>
              {facet.options.map((option) => (
                <option key={String(option.value)} value={String(option.value)}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
    </div>
  );
}