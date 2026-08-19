import { ProductCard } from '@/components/product/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { ProductGridSkeleton } from '@/components/product/ProductGrid';

export function NewArrivals({ products, isLoading }) {
  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl font-bold text-foreground uppercase tracking-tight">Just Dropped</h2>
          <div className="h-1 w-24 bg-brand-coral"></div>
        </div>
        <Link href="/products" className="text-sm font-bold text-foreground/70 hover:text-brand-coral uppercase tracking-widest flex items-center gap-2 transition-colors">
          See Newest <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
