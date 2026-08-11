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

      {/* 1. Exact Reference Hero Section */}
      <section className="relative flex flex-col pt-1 md:pt-2 pb-6 md:pb-8 px-6 lg:px-16 mx-auto w-full overflow-hidden bg-[#FAF1E7]">

        {/* Soft Background Layers (Studio Lighting / Glow) */}
        <div className="absolute top-0 right-0 w-[60%] h-[100%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/60 via-[#FFF5EC]/40 to-transparent pointer-events-none z-0"></div>
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[60%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FFF8F0] to-transparent blur-3xl opacity-90 pointer-events-none z-0"></div>

        {/* Subtle Decorative Elements (Stars & Rocket) */}
        <div className="absolute top-[10%] left-[8%] text-[#E4B84A] opacity-60 z-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
            <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
          </svg>
        </div>
        <div className="absolute top-[30%] left-[30%] text-[#C96B4B] opacity-40 z-0 scale-75">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
          </svg>
        </div>
        <div className="absolute top-[15%] left-[45%] opacity-10 z-0 scale-[2]">
          {/* Subtle Rocket SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#713747" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        </div>

        <div className="max-w-[1280px] mx-auto w-full relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">

          {/* Left Side: Typography (40-45% width) */}
          <div className="w-full md:w-[45%] flex flex-col items-start z-20">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#C96B4B] uppercase mb-4 bg-[#C96B4B]/10 px-3 py-1 rounded-full">
              ASTRONAUT STICKERZ ✦
            </div>

            {/* Headline */}
            <h1 className="font-display text-[36px] md:text-[48px] lg:text-[50px] font-extrabold tracking-tight text-[#321E25] leading-[1.1] mb-4 max-w-[500px]">
              Little things that <br />
              make your everyday <br />
              <span className="text-[#713747] relative inline-block">
                more fun.
                {/* Organic Underline */}
                <svg className="absolute -bottom-1 left-0 w-full text-[#E4B84A] z-[-1]" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                  <path d="M5 8 Q 100 0, 195 8" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-[15px] text-[#321E25]/80 font-medium leading-[1.5] max-w-[400px] mb-6">
              Beautiful stickers, aesthetic notebooks, and premium desk goodies designed to add personality to your workspace.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-[#713747] text-white hover:bg-[#5a2a37] font-bold rounded-xl px-6 py-4 text-[15px] shadow-lg shadow-[#713747]/20 transition-all hover:-translate-y-1">
                  Shop the collection &rarr;
                </Button>
              </Link>
              <Link href="/customize" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full bg-white/50 backdrop-blur-sm border-2 border-[#321E25]/10 text-[#321E25] hover:border-[#713747] hover:bg-white font-bold rounded-xl px-6 py-4 text-[15px] transition-all hover:-translate-y-1">
                  Customize yours ✨
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side: Product Collage (55% width) */}
          <div className="w-full md:w-[55%] relative flex items-center justify-center min-h-[300px] md:min-h-[400px] z-10 mt-6 md:mt-0">
            {/* Organic Soft Shape behind Image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#F2C7A9]/40 rounded-full blur-[50px] -z-10"></div>
            <div className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-[#C96B4B]/20 rounded-full blur-[40px] -z-10"></div>

            {/* Main Product Image (Collage) */}
            <img
              src="/aiHeroSection.png"
              alt="Astronaut Stickerz Products"
              className="relative z-20 w-[95%] max-w-none h-auto object-contain drop-shadow-2xl md:-mr-8 xl:-mr-12"
              style={{ filter: 'contrast(1.05) saturate(1.05)' }}
            />

            {/* Hand-drawn Arrow & Caption */}
            <div className="absolute -bottom-4 md:-bottom-6 left-0 md:left-6 z-30 flex gap-2 items-start opacity-90">
              <svg width="30" height="30" viewBox="0 0 40 40" fill="none" stroke="#C96B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 hidden sm:block">
                <path d="M35 5 Q 10 10, 5 35 M5 35 L 5 25 M5 35 L 15 35" />
              </svg>
              <div className="text-[#713747] font-serif italic text-base leading-snug transform -rotate-2">
                Made for dreamers, creators<br />
                and everyday explorers.
              </div>
            </div>

            {/* Right side sparkles */}
            <div className="absolute top-[5%] right-[5%] text-[#C96B4B] opacity-60 z-30">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
              </svg>
            </div>
            <div className="absolute top-[15%] right-[0%] text-[#713747] opacity-40 z-30 scale-50">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Benefit Strip (Integrated into Hero bottom) */}
        <div className="relative z-20 max-w-[1200px] mx-auto w-full mt-16 md:mt-24">
          <div className="bg-[#FDF7F1]/80 backdrop-blur-md rounded-2xl border border-[#321E25]/5 shadow-sm p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#321E25]/10">
              {/* Item 1 */}
              <div className="flex items-center gap-4 px-2 md:px-6 py-2 md:py-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C96B4B]/10 flex items-center justify-center text-[#C96B4B]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-[13px] text-[#321E25] uppercase tracking-wide">Free shipping</h4>
                  <p className="text-[12px] text-[#321E25]/60 mt-0.5">On orders over ₹499</p>
                </div>
              </div>
              {/* Item 2 */}
              <div className="flex items-center gap-4 px-2 md:px-6 py-2 md:py-0 pt-4 md:pt-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#E4B84A]/10 flex items-center justify-center text-[#E4B84A]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-[13px] text-[#321E25] uppercase tracking-wide">Premium quality</h4>
                  <p className="text-[12px] text-[#321E25]/60 mt-0.5">Made to last</p>
                </div>
              </div>
              {/* Item 3 */}
              <div className="flex items-center gap-4 px-2 md:px-6 py-2 md:py-0 pt-4 md:pt-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#B8B99A]/20 flex items-center justify-center text-[#7a7a63]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-[13px] text-[#321E25] uppercase tracking-wide">Eco friendly</h4>
                  <p className="text-[12px] text-[#321E25]/60 mt-0.5">Sustainable materials</p>
                </div>
              </div>
              {/* Item 4 */}
              <div className="flex items-center gap-4 px-2 md:px-6 py-2 md:py-0 pt-4 md:pt-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#713747]/10 flex items-center justify-center text-[#713747]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-[13px] text-[#321E25] uppercase tracking-wide">Made with love</h4>
                  <p className="text-[12px] text-[#321E25]/60 mt-0.5">For you ✨</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Torn Paper Divider between Hero and Fresh Section */}
      <div className="w-full relative h-4 bg-[#FAF1E7] overflow-hidden -mt-1 z-20">
        <div className="absolute bottom-0 w-full h-[10px] bg-white" style={{ maskImage: 'url("data:image/svg+xml,%3Csvg width=\'1200\' height=\'10\' viewBox=\'0 0 1200 10\' preserveAspectRatio=\'none\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10V5C20 5 30 8 50 8C70 8 80 2 100 2C120 2 130 9 150 9C170 9 180 3 200 3C220 3 230 7 250 7C270 7 280 1 300 1C320 1 330 8 350 8C370 8 380 4 400 4C420 4 430 9 450 9C470 9 480 2 500 2C520 2 530 8 550 8C570 8 580 3 600 3C620 3 630 7 650 7C670 7 680 1 700 1C720 1 730 8 750 8C770 8 780 4 800 4C820 4 830 9 850 9C870 9 880 2 900 2C920 2 930 8 950 8C970 8 980 3 1000 3C1020 3 1030 7 1050 7C1070 7 1080 1 1100 1C1120 1 1130 8 1150 8C1170 8 1180 4 1200 4V10H0Z\' fill=\'black\'/%3E%3C/svg%3E")', WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg width=\'1200\' height=\'10\' viewBox=\'0 0 1200 10\' preserveAspectRatio=\'none\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10V5C20 5 30 8 50 8C70 8 80 2 100 2C120 2 130 9 150 9C170 9 180 3 200 3C220 3 230 7 250 7C270 7 280 1 300 1C320 1 330 8 350 8C370 8 380 4 400 4C420 4 430 9 450 9C470 9 480 2 500 2C520 2 530 8 550 8C570 8 580 3 600 3C620 3 630 7 650 7C670 7 680 1 700 1C720 1 730 8 750 8C770 8 780 4 800 4C820 4 830 9 850 9C870 9 880 2 900 2C920 2 930 8 950 8C970 8 980 3 1000 3C1020 3 1030 7 1050 7C1070 7 1080 1 1100 1C1120 1 1130 8 1150 8C1170 8 1180 4 1200 4V10H0Z\' fill=\'black\'/%3E%3C/svg%3E")', maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }}></div>
      </div>

      {/* 2. Collection / Categories Section */}
      <section className="bg-white py-24 border-y border-foreground/5 relative overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mb-12 relative inline-block">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#713747] tracking-tight relative z-10">Browse by categories</h2>
            {/* Doodle Squiggle Underline */}
            <svg className="absolute -bottom-3 -right-6 w-[80%] text-[#E4B84A] z-0 opacity-80" viewBox="0 0 200 20" fill="none" preserveAspectRatio="none">
              <path d="M5 10 Q 30 -5, 60 15 T 120 5 T 195 15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Doodle Sparkle */}
            <svg className="absolute -top-6 -left-8 w-10 h-10 text-[#C96B4B] opacity-60 transform -rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
            </svg>
          </div>

          {categoriesLoading ? (
            <div className="flex gap-6 md:gap-8 overflow-hidden">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex-1 aspect-[16/9] sm:aspect-[2/1] rounded-2xl bg-foreground/5 animate-pulse" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div
              className="grid gap-6 md:gap-8"
              style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}
            >
              {categories.map(category => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          ) : (
            <p className="text-foreground/50 font-medium text-center">No categories found.</p>
          )}
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="relative py-20 bg-white">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-foreground/5 pb-6">
            <div className="relative inline-block">
              <h2 className="font-display text-4xl font-extrabold text-foreground tracking-tight relative z-10">Fresh from the desk ✨</h2>
              <p className="mt-2 text-lg text-foreground/70 font-medium">Things you'll want on your desk right now.</p>
              
              {/* Doodle Arrow pointing right */}
              <svg className="absolute top-0 -right-16 w-12 h-12 text-[#C96B4B] opacity-70 transform rotate-12 hidden md:block" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 20 Q 20 5, 35 20 M35 20 L 25 10 M35 20 L 25 30" />
              </svg>
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

      {/* 4. Customization ✨ Section */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24">
        <div className="rounded-[3rem] bg-brand-purple text-white p-10 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center gap-16 shadow-2xl relative overflow-hidden">

          {/* Decorative background circle */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#8A4050] rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="lg:w-1/2 space-y-6 relative z-10">
            <p className="text-brand-peach font-bold tracking-widest uppercase text-sm inline-flex items-center gap-2">
              Design Studio 
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
              </svg>
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] relative inline-block">
              Made by you. <br />
              <span className="text-[#E4B84A] relative z-10">
                For you. ✨
                {/* Loopy doodle circle around "For you" */}
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] text-[#C96B4B] z-[-1] opacity-70 scale-125" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
                  <path d="M5 20 C 5 5, 95 5, 95 20 C 95 35, 5 35, 5 20" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
                </svg>
              </span>
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
      <section className="bg-bg-warm py-24 lg:py-32 border-t border-foreground/5 overflow-hidden relative">
        {/* Background Funky Doodles */}
        <svg className="absolute top-10 left-10 w-24 h-24 text-[#C96B4B] opacity-20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5">
          <circle cx="50" cy="50" r="40" />
        </svg>
        <svg className="absolute bottom-20 right-10 w-32 h-32 text-[#E4B84A] opacity-20 transform rotate-45" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="20" y="20" width="60" height="60" rx="10" />
        </svg>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="lg:w-1/2 relative">
            <div className="aspect-[4/3] w-full rounded-[3rem] bg-white shadow-xl overflow-hidden relative rotate-[-2deg] z-10">
              {/* Use a real product image if available as a lifestyle placeholder */}
              {heroProducts.length > 1 && heroProducts[1].images?.[0] ? (
                <img src={getImageUrl(heroProducts[1].images[0])} alt="Lifestyle" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-brand-peach/40 flex items-center justify-center">
                  <span className="text-6xl">🎨</span>
                </div>
              )}
            </div>
            {/* Doodle arrow pointing to image */}
            <svg className="absolute -top-10 -right-10 w-20 h-20 text-[#713747] opacity-60 transform -rotate-[100deg] z-20 hidden lg:block" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 30 Q 20 -10, 35 25 M35 25 L 25 20 M35 25 L 35 15" />
            </svg>
          </div>
          <div className="lg:w-1/2 max-w-xl relative">
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-6 relative inline-block">
              Your desk deserves better. ✦
              {/* Squiggle underline */}
              <svg className="absolute -bottom-4 left-0 w-full text-[#E4B84A] z-[-1] opacity-70" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                  <path d="M5 8 Q 50 0, 100 8 T 195 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </h2>
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
      <section className="py-24 px-6 relative bg-white border-t border-foreground/5 overflow-hidden">
        
        {/* Floating background squiggles */}
        <svg className="absolute top-10 right-20 w-32 h-32 text-[#713747] opacity-10 animate-spin-slow" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M50 10 Q 70 30, 90 50 T 50 90 T 10 50 T 50 10" />
        </svg>
        <svg className="absolute bottom-10 left-20 w-24 h-24 text-[#C96B4B] opacity-10" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10 10 L 40 40 M40 10 L 10 40" />
        </svg>

        <div className="mx-auto max-w-3xl text-center bg-bg-cream rounded-[3rem] p-12 md:p-20 shadow-sm border border-foreground/5 relative z-10">
          {/* Card doodles */}
          <svg className="absolute -top-8 -left-8 w-16 h-16 text-[#E4B84A] opacity-80" viewBox="0 0 40 40" fill="currentColor">
            <path d="M20 0 L 25 15 L 40 20 L 25 25 L 20 40 L 15 25 L 0 20 L 15 15 Z" />
          </svg>
          <svg className="absolute -bottom-6 -right-6 w-12 h-12 text-[#C96B4B] opacity-80 transform rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
          </svg>

          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-4 relative inline-block">
            Come hang out with us ✦
            {/* Scribble behind heading */}
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[150%] text-[#F2C7A9] z-[-1] opacity-50" viewBox="0 0 200 40" fill="none" preserveAspectRatio="none">
              <path d="M10 20 Q 50 5, 100 20 T 190 20" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
            </svg>
          </h2>
          <p className="text-foreground/70 font-medium text-lg mb-8 max-w-lg mx-auto relative z-10">
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
