'use client';

import { IListing, SearchResults } from '@/types';
import ProductCard from './ProductCard';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

interface ProductListProps {
  results: IListing[];
  pagination: SearchResults['pagination'];
}

export default function ProductList({ results, pagination }: ProductListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`/search?${params.toString()}`);
  };

  if (results.length === 0) {
    return <p className="text-center text-gray-600">No products found matching your criteria.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((product) => (
          <ProductCard key={String(product._id)} product={product} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
             (page === 1 || page === pagination.totalPages || Math.abs(page - pagination.currentPage) < 2 || 
              (pagination.currentPage < 4 && page < 5) || (pagination.currentPage > pagination.totalPages - 3 && page > pagination.totalPages - 4)) && (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border rounded-md ${
                    pagination.currentPage === page ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
                    }`}
                >
                    {page}
                </button>
             ) 
          ))}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
       <p className="text-center text-sm text-gray-500 mt-4">
        Showing {results.length} of {pagination.totalResults} results. Page {pagination.currentPage} of {pagination.totalPages}.
      </p>
    </div>
  );
}