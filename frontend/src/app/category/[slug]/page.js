'use client';

import { use } from 'react';
import Link from 'next/link';
import { useCategoryBySlug } from '@/lib/api/hooks/useCategories';
import { useProducts } from '@/lib/api/hooks/useProducts';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGrid, ProductGridSkeleton } from '@/components/product/ProductGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

export default function CategoryPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const { data: category, isLoading: isCategoryLoading, isError: isCategoryError } = useCategoryBySlug(slug);

  const categoryId = category?._id;

  const { data: productsData, isLoading: isProductsLoading } = useProducts({
    category: categoryId,
    limit: 50, // Get a good chunk for the category page
  });

  const products = productsData?.products || [];

  if (isCategoryLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-12 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-8" />
        <ProductGridSkeleton count={8} />
      </div>
    );
  }

  if (isCategoryError || !category) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Category Not Found</h1>
        <p className="mt-2 text-zinc-500">The category you are looking for does not exist.</p>
        <Link href="/products" className="mt-6">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[96rem] px-4 py-12 sm:px-6 lg:px-12 bg-background min-h-screen">
      {/* Category Header */}
      <div className="mb-16 rounded-[3rem] bg-[#F4EBE1] px-6 py-16 text-center sm:px-12 sm:py-24 overflow-hidden relative border border-foreground/5 shadow-sm">
        {category.image?.url && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply" 
              style={{ backgroundImage: `url(${category.image.url})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F4EBE1] via-[#F4EBE1]/80 to-transparent" />
          </>
        )}
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-sm font-bold tracking-widest text-brand-coral uppercase mb-4">
            Category
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            {category.name}
          </h1>
          {category.description && (
            <p className="mx-auto mt-6 text-lg sm:text-xl font-medium text-foreground/80 leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Products */}
      {isProductsLoading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-foreground/10 py-32 text-center bg-white/50">
          <span className="text-4xl mb-4">🔍</span>
          <p className="text-xl font-display font-bold text-foreground">No products found</p>
          <p className="mt-2 text-base text-foreground/60 max-w-md">
            There are currently no products available in this category.
          </p>
        </div>
      ) : (
        <ProductGrid>
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </ProductGrid>
      )}
    </div>
  );
}
