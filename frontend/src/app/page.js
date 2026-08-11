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
  
  const heroProduct = featuredProducts[0];

  return (
    <div className="flex flex-col w-full bg-background">
      {/* Editorial Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between min-h-[75vh] px-4 py-16 sm:px-6 lg:px-12 mx-auto max-w-[96rem] gap-12">
        
        {/* Left: Typography */}
        <div className="flex-1 w-full max-w-2xl space-y-8 z-10 pt-10 lg:pt-0">
          <p className="text-sm font-bold tracking-widest text-brand-coral uppercase">
            Astronaut Stickerz ✨
          </p>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.1]">
            Little things that <br className="hidden sm:block" />
            make your everyday <br className="hidden sm:block" />
            <span className="text-brand-purple">more fun.</span>
          </h1>
          <p className="text-lg text-foreground/80 sm:text-xl font-medium max-w-lg leading-relaxed">
            Beautiful stationery, aesthetic notebooks, and premium desk goodies designed for your creativity.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
            <Link href="/products">
              <Button size="lg" className="bg-brand-purple text-white hover:bg-brand-purple/90 font-bold rounded-xl px-8 shadow-sm">
                Shop the collection
              </Button>
            </Link>
            <Link href="/customize">
              <Button size="lg" variant="outline" className="border-2 border-foreground/10 bg-transparent text-foreground hover:border-brand-coral hover:text-brand-coral font-bold rounded-xl px-8 shadow-sm transition-colors">
                Customize yours ✨
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: Hero Imagery */}
        <div className="flex-1 w-full lg:h-[75vh] min-h-[400px] relative rounded-3xl overflow-hidden bg-brand-yellow/10 border border-foreground/5 shadow-xl flex items-center justify-center p-8">
           {/* Soft background shape */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-brand-coral/10 rounded-full blur-3xl"></div>
           
           {heroProduct && heroProduct.images?.[0] ? (
             <img 
               src={heroProduct.images[0]} 
               alt="Featured Product" 
               className="relative z-10 w-full h-full object-contain max-h-[80%] hover:scale-105 transition-transform duration-700 ease-out drop-shadow-2xl"
             />
           ) : (
             <div className="relative z-10 w-64 h-64 bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg flex items-center justify-center text-brand-purple font-bold rotate-3">
               Featured Item
             </div>
           )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col mb-12 sm:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Fresh from the desk ✨</h2>
            <p className="mt-4 text-lg text-foreground/70 font-medium">Things you'll want on your desk right now.</p>
          </div>

          {productsLoading ? (
            <ProductGridSkeleton count={4} />
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {featuredProducts.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 font-medium">No products found.</p>
          )}
          
          <div className="mt-12 text-center">
            <Link href="/products" className="inline-flex items-center justify-center text-base font-bold text-brand-purple hover:text-brand-coral transition-colors underline underline-offset-4 decoration-2">
              Explore the full collection &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section - Visual Blocks */}
      <section className="bg-white/50 py-24 sm:py-32 border-y border-foreground/5">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">What are you shopping for?</h2>
          </div>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-[4/5] rounded-3xl bg-foreground/5 animate-pulse" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {categories.slice(0, 3).map(category => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 font-medium">No categories found.</p>
          )}
        </div>
      </section>

      {/* Customization ✨ Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 sm:py-32">
        <div className="rounded-[2rem] sm:rounded-[3rem] bg-[#F4EBE1] p-8 sm:p-16 lg:p-24 flex flex-col lg:flex-row items-center gap-16 border border-foreground/5 shadow-sm">
          
          <div className="lg:w-1/2 space-y-6">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-[1.1]">
              Your design. <br/>
              <span className="text-brand-coral">Our products. ✨</span>
            </h2>
            <p className="text-lg font-medium text-foreground/80 leading-relaxed max-w-md">
              Upload your artwork, play with it, and see how it looks on your favorite products before you buy. A premium design studio right in your browser.
            </p>
            <div className="pt-6">
              <Link href="/customize">
                <Button className="bg-foreground text-background hover:bg-brand-coral hover:text-white font-bold rounded-xl px-8 shadow-sm transition-all">
                  Create your own ✨
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full">
            {/* Editorial composition block */}
            <div className="relative aspect-square sm:aspect-[4/3] bg-white rounded-3xl border-2 border-foreground/10 shadow-xl overflow-hidden flex flex-col">
              <div className="flex-1 bg-zinc-50 p-6 flex flex-col gap-4 relative">
                 <div className="absolute top-4 right-4 text-xs font-bold text-brand-purple bg-brand-purple/10 px-3 py-1 rounded-full">Preview Mode</div>
                 <div className="w-1/2 h-1/2 bg-white rounded-xl shadow-sm border border-foreground/5 mx-auto mt-8 flex items-center justify-center">
                    <span className="text-4xl">🎨</span>
                 </div>
                 <div className="h-4 w-1/3 bg-foreground/10 rounded-full mx-auto mt-4"></div>
                 <div className="h-3 w-1/4 bg-foreground/10 rounded-full mx-auto mt-2"></div>
              </div>
              <div className="h-16 bg-white border-t border-foreground/10 flex items-center px-6 gap-2">
                 <div className="h-8 w-8 rounded-full bg-brand-yellow/30 flex items-center justify-center text-xs">✨</div>
                 <div className="h-4 w-24 bg-foreground/10 rounded-full"></div>
                 <div className="ml-auto h-8 w-20 bg-brand-purple/20 rounded-lg"></div>
              </div>
            </div>
          </div>

        </div>
      </section>
      
      {/* Brand Footer Section */}
      <section className="py-24 text-center px-4">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground max-w-2xl mx-auto leading-relaxed">
          "From your laptop to your notebook, <br className="hidden sm:block" /> add a little personality everywhere."
        </h2>
      </section>
    </div>
  );
}
