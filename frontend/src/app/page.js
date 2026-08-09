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
      <section className="relative flex min-h-[70vh] items-center justify-center bg-brand-yellow/20 px-4 py-32 text-center overflow-hidden border-b border-brand-yellow/30">
        {/* Playful decorative background circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-brand-coral/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-brand-purple/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 max-w-3xl space-y-8 mt-10">
          <div className="inline-flex items-center justify-center rounded-full bg-white px-4 py-1.5 text-sm font-bold text-brand-purple shadow-sm ring-1 ring-black/5 mb-4 dark:bg-zinc-800 dark:text-brand-yellow dark:ring-white/10">
            ✨ New collection just dropped!
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Stuff That Makes Your <br className="hidden sm:block" /> Desk Happier ✨
          </h1>
          <p className="mx-auto max-w-xl text-lg text-foreground/70 sm:text-xl font-medium">
            Fun stickers, aesthetic notebooks, and cool desk goodies for your everyday creativity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/products">
              <Button size="lg" variant="primary">
                Shop Everything
              </Button>
            </Link>
            <Link href="/category/notebooks">
              <Button size="lg" variant="outline" className="bg-white/50 backdrop-blur-sm dark:bg-black/50">
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
      <section className="bg-background relative">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <SectionHeading 
              title="Fresh Off the Desk ✨" 
              subtitle="Our newest and most popular items you'll love."
              className="mb-0 sm:mb-0 items-start text-left"
            />
            <Link href="/products" className="hidden sm:inline-flex text-base font-bold text-brand-purple hover:text-purple-600 transition-colors">
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
        <div className="rounded-[2.5rem] bg-brand-coral px-6 py-16 sm:p-16 lg:p-20 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left overflow-hidden relative shadow-xl">
          {/* Subtle background circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
          
          <div className="lg:w-1/2 relative z-10">
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Make it uniquely yours 🎨
            </h2>
            <p className="mt-4 text-lg font-medium text-white/90">
              Many of our products support full customization. Add your vibe, change colors, or start from scratch with our built-in product designer.
            </p>
            <div className="mt-8">
              <Link href="/products?customizable=true">
                <Button variant="secondary" className="bg-white text-brand-coral hover:bg-brand-yellow hover:text-foreground">
                  Shop Customizable
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative z-10 flex justify-center">
            {/* A placeholder for a cool graphic or product shot */}
            <div className="w-full max-w-md aspect-video bg-white/20 backdrop-blur-sm rounded-[2rem] border border-white/30 shadow-lg flex items-center justify-center text-white/90 font-bold text-xl rotate-2 hover:rotate-0 transition-transform duration-300">
              [ Fun Customization Graphic ✨ ]
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
