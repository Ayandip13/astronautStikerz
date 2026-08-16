import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Doodle } from '@/components/ui/Doodle';

export function CustomizationStory() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#E8D8C8] overflow-hidden border-y border-foreground/10">
      
      {/* Background texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50 mix-blend-multiply z-0" 
        style={{ backgroundImage: 'url(/paper_texture.png)', backgroundSize: 'cover' }}
      ></div>

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Text Side */}
        <div className="lg:w-1/3 max-w-xl">
          <p className="text-xs font-bold tracking-widest text-brand-purple uppercase mb-6 inline-flex items-center gap-2">
            <Doodle name="dot" className="w-2 h-2 text-brand-coral" />
            The Studio
          </p>
          <h2 className="font-display text-5xl lg:text-7xl font-black uppercase tracking-tighter text-foreground leading-[0.9] mb-8">
            Make<br />
            Something<br />
            That's<br />
            <span className="text-brand-coral">Yours.</span>
          </h2>
          <p className="text-lg text-foreground/80 font-medium mb-10 leading-relaxed max-w-sm">
            Got an idea? A doodle? A photograph? Turn it into premium stationery without leaving your desk. 
          </p>
          <Link href="/customize">
            <Button className="bg-background text-foreground hover:bg-brand-purple hover:text-white font-bold rounded-none border border-foreground px-8 py-5 uppercase tracking-widest text-xs transition-all shadow-[4px_4px_0px_0px_rgba(43,23,32,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1">
              Create Yours ✦
            </Button>
          </Link>
        </div>

        {/* Workbench Side */}
        <div className="lg:w-2/3 w-full relative flex items-center justify-center min-h-[400px]">
          
          <Doodle name="loop" className="absolute top-0 right-10 w-48 h-48 text-brand-coral opacity-20 hidden md:block" />

          {/* Workbench Grid Composition */}
          <div className="relative w-full max-w-[800px] flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
            
            {/* Step 1: Blank Canvas */}
            <div className="relative w-48 h-64 bg-white border border-foreground/20 shadow-lg transform md:-rotate-3 z-10 p-4 flex flex-col">
              <div className="w-full h-full border-2 border-dashed border-foreground/20 flex items-center justify-center">
                 <span className="text-foreground/30 font-bold uppercase text-xs tracking-widest text-center px-4">Blank<br/>Canvas</span>
              </div>
              <div className="absolute -top-3 -left-3 bg-brand-yellow text-foreground border border-foreground/10 text-[10px] font-bold px-2 py-1 shadow-sm">Step 01</div>
            </div>

            <Doodle name="arrow" className="w-8 h-8 text-foreground opacity-50 hidden md:block rotate-12" />

            {/* Step 2: Artwork */}
            <div className="relative w-48 h-64 bg-white border border-foreground/20 shadow-xl transform md:rotate-2 z-20 p-2">
               <div className="w-full h-full bg-brand-peach/40 flex items-center justify-center overflow-hidden border border-foreground/10 relative">
                 <Doodle name="burst" className="w-32 h-32 text-brand-purple opacity-40 absolute" />
                 <span className="text-4xl relative z-10">🎨</span>
               </div>
               <div className="absolute -bottom-4 right-10 bg-brand-coral text-white border border-foreground/10 text-[10px] font-bold px-2 py-1 md:rotate-6 shadow-sm">Step 02</div>
            </div>

            <Doodle name="arrow" className="w-8 h-8 text-foreground opacity-50 hidden md:block rotate-12" />

            {/* Step 3: Product */}
            <div className="relative w-56 h-72 bg-white border border-foreground/20 shadow-2xl transform md:-rotate-1 z-30 p-2 bg-gradient-to-br from-white to-bg-sand">
               {/* Faked final product looking like a notebook */}
               <div className="w-full h-full bg-brand-purple flex items-center justify-center relative overflow-hidden border border-foreground/20 shadow-inner">
                  <div className="absolute left-0 top-0 w-4 h-full bg-black/20 border-r border-black/30"></div>
                  <Doodle name="burst" className="w-48 h-48 text-brand-yellow absolute -right-10 -bottom-10 opacity-80" />
                  <span className="text-white font-black uppercase tracking-widest -rotate-90 text-2xl absolute">Yours.</span>
               </div>
               <div className="absolute -top-4 -right-4 bg-brand-yellow text-foreground border border-foreground/10 text-[10px] font-bold px-2 py-1 shadow-sm">Done ✦</div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
