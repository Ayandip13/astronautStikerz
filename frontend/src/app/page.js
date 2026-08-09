'use client';

import Link from 'next/link';
import { useProducts } from '@/lib/api/hooks/useProducts';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { ProductGrid, ProductGridSkeleton } from '@/components/product/ProductGrid';
import { ProductCard } from '@/components/product/ProductCard';
import { CategoryCard } from '@/components/category/CategoryCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 8, featured: true });

  const categories = categoriesData || [];
  const featuredProducts = productsData?.products || [];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center bg-zinc-900 px-4 py-32 text-center overflow-hidden">
        {/* Background gradient/pattern could go here */}
        <div className="absolute inset-0 bg-[url('/placeholder-hero.jpg')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-3xl space-y-8">
          <h1 className="text-4xl font-black tracking-tighter text-white sm:text-6xl lg:text-7xl">
            PREMIUM GEAR FOR <br className="hidden sm:block" /> CREATORS & DEVS
          </h1>
          <p className="mx-auto max-w-xl text-lg text-zinc-300 sm:text-xl">
            Upgrade your workspace with our custom-designed stickers, high-quality notebooks, and precision mousepads.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/products">
              <Button size="lg" variant="primary" className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200">
                Shop All Products
              </Button>
            </Link>
            <Link href="/category/notebooks">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                Explore Notebooks
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading 
          title="Shop by Category" 
          subtitle="Find exactly what you need for your setup." 
        />
        
        {categoriesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 sm:h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {categories.slice(0, 3).map(category => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        ) : (
          <p className="text-center text-zinc-500">No categories found.</p>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <SectionHeading 
              title="Latest Drops" 
              subtitle="Our newest and most popular items."
              className="mb-0 sm:mb-0 items-start text-left"
            />
            <Link href="/products" className="hidden sm:inline-flex text-sm font-semibold text-black dark:text-white hover:underline">
              View all products &rarr;
            </Link>
          </div>

          {productsLoading ? (
            <ProductGridSkeleton count={4} />
          ) : featuredProducts.length > 0 ? (
            <ProductGrid>
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </ProductGrid>
          ) : (
            <p className="text-center text-zinc-500">No products found.</p>
          )}
          
          <div className="mt-10 sm:hidden">
            <Link href="/products">
              <Button variant="outline" className="w-full">
                View all products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlight / Info Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="rounded-3xl bg-black dark:bg-zinc-900 px-6 py-16 sm:p-16 lg:p-20 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left overflow-hidden relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>
          
          <div className="lg:w-1/2 relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Make it uniquely yours.
            </h2>
            <p className="mt-4 text-lg text-zinc-300">
              Many of our products support full customization. Add your logo, change colors, or start from scratch using our built-in product designer.
            </p>
            <div className="mt-8">
              <Link href="/products?customizable=true">
                <Button variant="primary" className="bg-white text-black hover:bg-zinc-200">
                  Shop Customizable
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative z-10 flex justify-center">
            {/* A placeholder for a cool graphic or product shot */}
            <div className="w-full max-w-md aspect-video bg-zinc-800 rounded-xl border border-zinc-700 shadow-2xl flex items-center justify-center text-zinc-600">
              [ Customization Graphic ]
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
