'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProducts } from '@/lib/api/hooks/useProducts';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGrid, ProductGridSkeleton } from '@/components/product/ProductGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const sortParam = searchParams.get('sort') || 'newest';
  const categoryParam = searchParams.get('category') || '';
  const keywordParam = searchParams.get('keyword') || '';

  const [page, setPage] = useState(pageParam);
  const [sort, setSort] = useState(sortParam);
  const [category, setCategory] = useState(categoryParam);

  // Sync state with URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page);
    if (sort !== 'newest') params.set('sort', sort);
    if (category) params.set('category', category);
    if (keywordParam) params.set('keyword', keywordParam);
    
    const newUrl = `/products${params.toString() ? `?${params.toString()}` : ''}`;
    // Only push if the URL actually changed to prevent infinite loops
    if (window.location.search !== `?${params.toString()}` && window.location.pathname === '/products') {
        router.push(newUrl, { scroll: false });
    }
  }, [page, sort, category, keywordParam, router]);

  // Sync URL changes back to state (e.g. back button)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setPage(parseInt(searchParams.get('page') || '1', 10));
    setSort(searchParams.get('sort') || 'newest');
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const { data: categoriesData } = useCategories();
  const categories = categoriesData || [];

  const { data: productsData, isLoading, isError } = useProducts({
    page,
    limit: 12,
    sort,
    category,
    keyword: keywordParam,
  });

  const products = productsData?.products || [];
  const totalPages = productsData?.pages || 1;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeading 
        title={keywordParam ? `Search: "${keywordParam}"` : "All Products"} 
        subtitle="Browse our complete collection."
        className="mb-8 items-start text-left"
      />

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-zinc-900 dark:text-white uppercase mb-4">
              Categories
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setCategory(''); setPage(1); }}
                className={`text-left text-sm ${!category ? 'font-bold text-black dark:text-white' : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'}`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => { setCategory(cat._id); setPage(1); }}
                  className={`text-left text-sm ${category === cat._id ? 'font-bold text-black dark:text-white' : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-zinc-900 dark:text-white uppercase mb-4">
              Sort By
            </h3>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="w-full rounded-md border-zinc-200 bg-white py-2 px-3 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <ProductGridSkeleton count={12} />
          ) : isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-600 dark:border-red-900 dark:bg-red-900/20">
              Failed to load products. Please try again later.
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-24 text-center dark:border-zinc-800">
              <p className="text-lg font-medium text-zinc-900 dark:text-white">No products found</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Try adjusting your filters or search terms.
              </p>
              {(category || keywordParam) && (
                <Button 
                  className="mt-6" 
                  variant="outline" 
                  onClick={() => { setCategory(''); router.push('/products'); }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <ProductGrid>
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </ProductGrid>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-medium text-zinc-500 mx-4">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-black dark:border-zinc-700 dark:border-t-white" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
