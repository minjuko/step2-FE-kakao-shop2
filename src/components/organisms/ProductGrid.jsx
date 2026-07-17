import React from 'react';
import ProductCard from '../molecules/ProductCard';

const ProductGrid = ({ products = [] }) => {
  return (
    <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
