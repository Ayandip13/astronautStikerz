'use client';

import { useProducts } from '@/lib/api/hooks/useProducts';
import { ProductGrid } from './ProductGrid';
import { ProductCard } from './ProductCard';
import { SectionHeading } from '../ui/SectionHeading';

export function RelatedProducts({ categoryId, currentProductId }) {
  const { data, isLoading } = useProducts({
    category: categoryId,
    limit: 5,
  });

  if (isLoading) return null; // Or a skeleton

  // Filter out the current product
  const related = data?.products?.filter(p => p._id !== currentProductId).slice(0, 4) || [];

  if (related.length === 0) return null;

  return (
    <section className="mt-24 border-t border-zinc-200 dark:border-zinc-800 pt-16">
      <SectionHeading title="You May Also Like" />
      <ProductGrid>
        {related.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </ProductGrid>
    </section>
  );
}
