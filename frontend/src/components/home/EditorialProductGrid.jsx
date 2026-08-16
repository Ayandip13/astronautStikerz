import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { Doodle } from '@/components/ui/Doodle';

export function EditorialProductGrid({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="relative py-24 bg-background border-b border-foreground/10 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b-2 border-foreground/10 pb-8">
          <div className="relative inline-block max-w-xl">
            <p className="text-xs font-bold tracking-widest text-brand-purple uppercase mb-4">
              Curated Collection
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-foreground relative z-10 leading-none">
              Things worth making space for.
            </h2>
            <Doodle name="arrow" className="absolute -top-4 -right-12 w-12 h-12 text-brand-coral opacity-70 transform rotate-12 hidden md:block" />
          </div>
          <Link href="/products" className="hidden md:inline-flex items-center justify-center font-bold text-xs tracking-widest uppercase text-foreground hover:text-brand-purple transition-colors border-b-2 border-foreground hover:border-brand-purple pb-1">
            Explore All Goods &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.slice(0, 4).map((product, index) => (
            <div key={product._id} className={index % 2 === 1 ? 'lg:mt-12' : ''}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center md:hidden">
          <Link href="/products" className="inline-flex items-center justify-center text-xs tracking-widest uppercase font-bold text-foreground border-b-2 border-foreground pb-1">
            Explore All Goods &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
