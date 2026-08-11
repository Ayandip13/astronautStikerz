'use client';

import Link from 'next/link';
import { useProducts } from '@/lib/api/hooks/useProducts';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { ProductGrid, ProductGridSkeleton } from '@/components/product/ProductGrid';
import { ProductCard } from '@/components/product/ProductCard';
import { CategoryCard } from '@/components/category/CategoryCard';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 8, featured: true });

  const categories = categoriesData || [];
  const featuredProducts = productsData?.products || [];
  
  // Extract up to 3 products for the hero collage
  const heroProducts = featuredProducts.slice(0, 3);
  const heroProduct = heroProducts[0];
  
  // Safe image getter
  const getImageUrl = (img) => {
    if (!img) return null;
    return typeof img === 'string' ? img : img.url;
  };

  return (
    <div className="flex flex-col w-full bg-background selection:bg-brand-peach/30">
      
      {/* 1. Editorial Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between min-h-[85vh] px-6 py-12 md:py-20 lg:px-16 mx-auto w-full max-w-[100rem] overflow-hidden gap-12">
        {/* Soft decorative blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-bg-cream rounded-full blur-3xl opacity-80 -z-10"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[50%] bg-brand-peach/20 rounded-full blur-3xl -z-10"></div>
        
        {/* Left: Typography */}
        <div className="flex-1 w-full max-w-2xl z-10 pt-10 md:pt-0">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-brand-coral uppercase mb-6 bg-brand-coral/10 px-4 py-1.5 rounded-full">
            ASTRONAUT STIKERZ ✦
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-[5rem] font-extrabold tracking-tight text-foreground leading-[1.05] mb-6">
            Little things that <br className="hidden md:block" />
            make your everyday <br className="hidden md:block" />
            <span className="text-brand-purple relative inline-block">
              more fun.
              <span className="absolute -bottom-2 left-0 w-full h-3 bg-brand-yellow/30 -z-10 rounded-sm"></span>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 font-medium max-w-lg leading-relaxed mb-10">
            Beautiful stickers, aesthetic notebooks, and premium desk goodies designed to add personality to your workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/products" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-brand-purple text-white hover:bg-[#5a2a37] font-bold rounded-2xl px-10 py-7 text-base shadow-lg shadow-brand-purple/20 transition-all hover:-translate-y-1">
                Shop the collection &rarr;
              </Button>
            </Link>
            <Link href="/customize" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full bg-bg-cream border-2 border-foreground/10 text-foreground hover:border-brand-purple hover:bg-white font-bold rounded-2xl px-10 py-7 text-base transition-all hover:-translate-y-1">
                Customize yours ✨
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: Hero Imagery */}
        <div className="flex-1 w-full h-[50vh] md:h-[75vh] min-h-[400px] relative flex items-center justify-center z-10 mt-10 md:mt-0">
          <div className="relative w-full h-full max-w-[600px] mx-auto flex items-center justify-center">
            <img 
              src="/astronautHeroSection.webp" 
              alt="Astronaut Stickerz Hero" 
              className="relative z-10 w-full h-auto object-contain max-h-[90%] hover:scale-105 transition-transform duration-700 ease-out drop-shadow-2xl" 
            />
            <div className="absolute top-[10%] right-[10%] z-50 text-4xl animate-pulse">✨</div>
            <div className="absolute bottom-[20%] left-[5%] z-50 text-3xl">✦</div>
          </div>
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section className="relative py-20 bg-white">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-foreground/5 pb-6">
            <div>
              <h2 className="font-display text-4xl font-extrabold text-foreground tracking-tight">Fresh from the desk ✨</h2>
              <p className="mt-2 text-lg text-foreground/70 font-medium">Things you'll want on your desk right now.</p>
            </div>
            <Link href="/products" className="hidden md:inline-flex items-center justify-center font-bold text-brand-purple hover:text-brand-coral transition-colors underline underline-offset-4 decoration-2">
              Explore all &rarr;
            </Link>
          </div>

          {productsLoading ? (
            <ProductGridSkeleton count={4} />
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {featuredProducts.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-bg-cream rounded-3xl">
              <p className="text-foreground/50 font-bold">No products found.</p>
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/products" className="inline-flex items-center justify-center text-base font-bold text-brand-purple hover:text-brand-coral transition-colors underline underline-offset-4 decoration-2">
              Explore the full collection &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Collection / Categories Section */}
      <section className="bg-white py-24 border-y border-foreground/5 relative overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mb-12">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#713747] tracking-tight">Browse by categories</h2>
          </div>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map(i => (
                <div key={i} className="aspect-[16/9] sm:aspect-[2/1] rounded-2xl bg-foreground/5 animate-pulse" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-12">
              {categories.slice(0, 2).map(category => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          ) : (
            <p className="text-foreground/50 font-medium text-center">No categories found.</p>
          )}
        </div>
      </section>

      {/* 4. Customization ✨ Section */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24">
        <div className="rounded-[3rem] bg-brand-purple text-white p-10 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center gap-16 shadow-2xl relative overflow-hidden">
          
          {/* Decorative background circle */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#8A4050] rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="lg:w-1/2 space-y-6 relative z-10">
            <p className="text-brand-peach font-bold tracking-widest uppercase text-sm">Design Studio ✦</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
              Made by you. <br/>
              <span className="text-[#E4B84A]">For you. ✨</span>
            </h2>
            <p className="text-lg md:text-xl font-medium text-white/80 leading-relaxed max-w-md pt-2">
              Got a design in your head? Put it on something you'll actually use. Upload your artwork and preview it on our premium products instantly.
            </p>
            <div className="pt-8">
              <Link href="/customize">
                <Button className="bg-white text-brand-purple hover:bg-brand-peach hover:text-brand-purple font-bold rounded-2xl px-10 py-7 text-base shadow-lg transition-all hover:scale-105">
                  Create your own &rarr;
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full relative z-10">
            <div className="relative aspect-square sm:aspect-[4/3] bg-bg-cream rounded-[2.5rem] border-4 border-white/20 shadow-2xl overflow-hidden flex flex-col rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Studio UI mockup */}
              <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
                 <div className="absolute inset-0 bg-[radial-gradient(#C96B4B22_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                 <div className="absolute top-4 left-4 flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-brand-coral"></div>
                   <div className="w-3 h-3 rounded-full bg-brand-yellow"></div>
                   <div className="w-3 h-3 rounded-full bg-brand-mint"></div>
                 </div>
                 
                 {/* Fake Product Preview */}
                 <div className="relative w-2/3 h-2/3 bg-white rounded-2xl shadow-sm border border-foreground/5 flex flex-col items-center justify-center p-4">
                    <div className="w-full h-full bg-bg-sand rounded-xl border-2 border-dashed border-brand-purple/20 flex flex-col items-center justify-center text-brand-purple/40">
                      <span className="text-4xl mb-2">📸</span>
                      <span className="font-bold text-sm">Drop artwork here</span>
                    </div>
                 </div>
              </div>
              <div className="h-20 bg-white border-t border-foreground/10 flex items-center px-6 justify-between">
                 <div className="flex gap-4">
                   <div className="w-12 h-12 bg-bg-sand rounded-lg border-2 border-brand-purple"></div>
                   <div className="w-12 h-12 bg-bg-sand rounded-lg border border-foreground/10"></div>
                 </div>
                 <div className="h-10 w-28 bg-brand-purple rounded-xl flex items-center justify-center text-white text-sm font-bold">Apply</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 5. Editorial Storytelling Section */}
      <section className="bg-bg-warm py-24 lg:py-32 border-t border-foreground/5 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
             <div className="aspect-[4/3] w-full rounded-[3rem] bg-white shadow-xl overflow-hidden relative rotate-[-2deg]">
                {/* Use a real product image if available as a lifestyle placeholder */}
                {heroProducts.length > 1 && heroProducts[1].images?.[0] ? (
                  <img src={getImageUrl(heroProducts[1].images[0])} alt="Lifestyle" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-brand-peach/40 flex items-center justify-center">
                    <span className="text-6xl">🎨</span>
                  </div>
                )}
             </div>
          </div>
          <div className="lg:w-1/2 max-w-xl">
             <h2 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-6">Your desk deserves better. ✦</h2>
             <p className="text-lg text-foreground/70 font-medium leading-relaxed mb-8">
               We believe that the things you use every day shouldn't be boring. Whether you're taking notes, scrolling through the web, or just decorating your laptop, our premium goods are designed to bring a little smile to your face.
             </p>
             <Link href="/about" className="inline-block text-brand-coral font-bold text-lg hover:text-brand-purple transition-colors underline underline-offset-4 decoration-2">
               Read our story &rarr;
             </Link>
          </div>
        </div>
      </section>

      {/* 6. Newsletter / Join the club */}
      <section className="py-24 px-6 relative bg-white border-t border-foreground/5">
        <div className="mx-auto max-w-3xl text-center bg-bg-cream rounded-[3rem] p-12 md:p-20 shadow-sm border border-foreground/5">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-4">Come hang out with us ✦</h2>
          <p className="text-foreground/70 font-medium text-lg mb-8 max-w-lg mx-auto">
            New drops, cool designs, and occasional desk inspiration. No spam, we promise.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-6 py-4 rounded-2xl border-2 border-foreground/10 bg-white focus:outline-none focus:border-brand-purple font-medium"
              required
            />
            <Button className="bg-foreground text-background hover:bg-brand-coral hover:text-white font-bold rounded-2xl px-8 py-4 whitespace-nowrap transition-colors">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

    </div>
  );
}
