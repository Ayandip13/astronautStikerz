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
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Category Header */}
      <div className="mb-12 rounded-3xl bg-zinc-100 dark:bg-zinc-900 px-6 py-12 text-center sm:px-12 sm:py-16 overflow-hidden relative">
        {category.image?.url && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{ backgroundImage: `url(${category.image.url})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-100 via-zinc-100/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80" />
          </>
        )}
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Products */}
      {isProductsLoading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-24 text-center dark:border-zinc-800">
          <p className="text-lg font-medium text-zinc-900 dark:text-white">No products found</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
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
