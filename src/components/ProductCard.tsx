import { IListing } from '@/types';
import React from 'react';

interface ProductCardProps {
  product: IListing;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow bg-white">
      <h3 className="text-lg font-semibold mb-1 truncate" title={product.title}>{product.title}</h3>
      <p className="text-gray-700 text-sm mb-2 h-10 overflow-hidden text-ellipsis">{product.description}</p>
      <p className="text-green-600 font-bold text-xl mb-2">₹{product.price.toFixed(2)}</p>
      {product.location && <p className="text-xs text-gray-500 mb-1">Location: {product.location}</p>}
      <div className="mt-2 text-xs">
        {Object.entries(product.attributes).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> 
            <span className="text-gray-600">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}