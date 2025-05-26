'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ICategory } from '@/types';

interface SearchBarProps {
  categories: ICategory[];
  currentCategorySlug: string;
}

export default function SearchBar({ categories, currentCategorySlug }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(currentCategorySlug || (categories.length > 0 ? categories[0].slug : ''));

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || currentCategorySlug || (categories.length > 0 ? categories[0].slug : ''));
  }, [searchParams, currentCategorySlug, categories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', searchTerm);
    params.set('category', selectedCategory);
    params.delete('filters'); 
    params.set('page', '1');
    router.push(`/search?${params.toString()}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', searchTerm); 
    params.set('category', newCategory);
    params.delete('filters');
    params.set('page', '1');
    router.push(`/search?${params.toString()}`);
  };


  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-4 items-center">
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="p-2 border rounded-md w-full sm:w-auto"
      >
        {categories.map(cat => (
          <option key={cat.slug} value={cat.slug}>{cat.name}</option>
        ))}
      </select>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="p-2 border rounded-md flex-grow w-full sm:w-auto"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full sm:w-auto hover:bg-blue-600">
        Search
      </button>
    </form>
  );
}