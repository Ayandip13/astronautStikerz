import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Doodle } from '@/components/ui/Doodle';

export function EditorialHero({ heroProducts }) {
  // Safe image getter
  const getImageUrl = (img) => {
    if (!img) return '/hero_notebook.png';
    const url = typeof img === 'string' ? img : img.url;
    if (url && url.startsWith('/uploads')) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
        return `${baseUrl}${url}`;
    }
    return url || '/hero_notebook.png';
  };

  const productImg1 = heroProducts?.[0]?.images?.[0] ? getImageUrl(heroProducts[0].images[0]) : '/hero_notebook.png';
  const productImg2 = heroProducts?.[1]?.images?.[0] ? getImageUrl(heroProducts[1].images[0]) : null;

  return (
    <section className="relative w-full min-h-[85vh] bg-bg-cream overflow-hidden border-b border-foreground/10 flex items-center justify-center py-20 lg:py-0">
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply z-0"
        style={{ backgroundImage: 'url(/paper_texture.png)', backgroundSize: 'cover' }}
      ></div>

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 relative z-10 h-full flex flex-col justify-center">

        {/* Editorial Desk Collage Composition */}
        <div className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center">
          
          {/* Background Desk Element - Coffee Cup / Messy Notes */}
          <div className="absolute top-[10%] right-[10%] md:right-[20%] w-[200px] md:w-[350px] opacity-70 rotate-[15deg] mix-blend-multiply pointer-events-none hidden sm:block">
            <img src="/vintage_desk.png" alt="Desk Sketch" className="w-full h-full object-contain" />
          </div>

          {/* Doodles scattered */}
          <Doodle name="star" className="absolute top-[20%] left-[15%] w-8 h-8 text-brand-coral opacity-80" />
          <Doodle name="rocket" className="absolute bottom-[25%] right-[15%] w-12 h-12 text-brand-purple opacity-60 rotate-45" />
          <Doodle name="burst" className="absolute top-[40%] left-[45%] w-20 h-20 text-brand-yellow opacity-40 -rotate-12" />
          
          {/* Main Product Element - Floating/Cropped Notebook */}
          <div className="absolute top-[50%] left-[50%] -translate-x-[60%] sm:-translate-x-[70%] -translate-y-[45%] w-[220px] sm:w-[280px] md:w-[350px] aspect-[4/5] bg-white border border-foreground/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 z-20 p-2">
            <img src={productImg1} alt="Product" className="w-full h-full object-contain" />
            <div className="absolute -bottom-4 -right-4 bg-brand-yellow border border-foreground text-xs uppercase tracking-widest font-bold px-3 py-1 -rotate-6">
              Bestseller
            </div>
          </div>

          {/* Secondary Product Element - Smaller item overlapping */}
          {productImg2 && (
            <div className="absolute top-[60%] left-[50%] translate-x-[10%] sm:translate-x-[20%] -translate-y-[20%] w-[160px] sm:w-[180px] md:w-[220px] aspect-square bg-white border border-foreground/20 shadow-xl -rotate-6 hover:-rotate-2 transition-transform duration-500 z-30 p-2">
              <img src={productImg2} alt="Product" className="w-full h-full object-contain" />
            </div>
          )}

          {/* Typography - Integrated into the collage */}
          <div className="absolute top-[5%] sm:top-[10%] left-[5%] md:left-[10%] z-40 w-full sm:w-auto pr-4 sm:pr-0">
            <p className="text-[10px] font-bold tracking-widest text-foreground uppercase mb-4 border border-foreground/20 bg-background/50 px-2 py-1 inline-block backdrop-blur-sm">
              Astronaut Stickerz / Desk Goods No. 01
            </p>
            <h1 className="font-display text-[12vw] sm:text-7xl lg:text-[100px] font-black uppercase tracking-tighter text-foreground leading-[0.85] mix-blend-color-burn">
              Your Desk.<br />
              Your<br />
              <span className="text-brand-coral relative inline-block">
                Stories.
                <Doodle name="underline" className="absolute -bottom-2 sm:-bottom-4 left-0 w-full text-brand-yellow z-[-1]" />
              </span>
            </h1>
          </div>

          {/* Hand-drawn caption */}
          <div className="absolute bottom-[20%] md:bottom-[25%] left-[5%] md:left-[15%] z-40 hidden lg:block">
            <div className="flex gap-2 items-start">
              <Doodle name="arrow" className="w-8 h-8 text-brand-purple mt-2" />
              <p className="font-serif italic text-lg text-foreground/80 transform rotate-2 max-w-[200px]">
                A little universe of things you want on your desk.
              </p>
            </div>
          </div>

          {/* CTA Group */}
          <div className="absolute bottom-0 sm:bottom-[5%] right-[5%] md:right-[15%] z-40 flex flex-col sm:flex-row gap-6 sm:gap-8 items-end sm:items-center">
            <Link href="/products" className="text-sm uppercase tracking-widest font-bold text-foreground border-b-2 border-foreground hover:text-brand-purple hover:border-brand-purple transition-colors pb-1">
              Shop The Desk &rarr;
            </Link>
            <Link href="/customize">
              <Button className="bg-background text-foreground hover:bg-brand-purple hover:text-white font-bold rounded-none border border-foreground px-8 py-4 uppercase tracking-widest text-xs transition-colors shadow-[-6px_6px_0px_0px_rgba(43,23,32,1)] hover:shadow-none hover:translate-y-[6px] hover:-translate-x-[6px]">
                Customize Yours ✦
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
