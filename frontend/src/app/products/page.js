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
    <div className="mx-auto w-full max-w-[96rem] px-4 py-12 sm:px-6 lg:px-12 bg-background min-h-screen">
      <SectionHeading 
        title={keywordParam ? `Search: "${keywordParam}"` : "All Products"} 
        subtitle="Browse our complete collection of beautiful desk essentials."
        className="mb-8 items-center text-center sm:items-start sm:text-left"
      />

      <div className="flex flex-col mb-12 border-b border-foreground/10 pb-6 gap-6 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Horizontal Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <button
            onClick={() => { setCategory(''); setPage(1); }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-colors ${!category ? 'bg-foreground text-white font-bold shadow-sm' : 'bg-white border border-foreground/10 text-foreground/70 hover:border-brand-coral hover:text-brand-coral font-medium'}`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => { setCategory(cat._id); setPage(1); }}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-colors ${category === cat._id ? 'bg-foreground text-white font-bold shadow-sm' : 'bg-white border border-foreground/10 text-foreground/70 hover:border-brand-coral hover:text-brand-coral font-medium'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <span className="text-sm font-bold text-foreground/60 uppercase tracking-wider">Sort by</span>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="rounded-full border border-foreground/10 bg-white py-2 pl-4 pr-10 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple shadow-sm appearance-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid Area */}
      <div className="w-full">
        {isLoading ? (
          <ProductGridSkeleton count={12} />
        ) : isError ? (
          <div className="rounded-3xl border border-brand-coral/20 bg-brand-coral/5 p-12 text-center text-brand-coral">
            Failed to load products. Please try again later.
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-foreground/10 py-32 text-center bg-white/50">
            <span className="text-4xl mb-4">🔍</span>
            <p className="text-xl font-display font-bold text-foreground">No products found</p>
            <p className="mt-2 text-base text-foreground/60 max-w-md">
              We couldn't find any products matching your current filters or search terms.
            </p>
            {(category || keywordParam) && (
              <Button 
                className="mt-8 bg-foreground text-white rounded-full px-6" 
                onClick={() => { setCategory(''); router.push('/products'); }}
              >
                Clear all filters
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
              <div className="mt-20 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  className="rounded-full border-foreground/10 hover:border-foreground hover:bg-foreground hover:text-white transition-all"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm font-bold text-foreground/50 mx-2">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  className="rounded-full border-foreground/10 hover:border-foreground hover:bg-foreground hover:text-white transition-all"
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
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-black dark:border-zinc-700 dark:border-t-white" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
