import React from 'react';
import Link from 'next/link';
import { Doodle } from '@/components/ui/Doodle';

export function CulturalStory() {
  return (
    <section className="relative w-full bg-[#1A1A1A] text-bg-cream py-24 lg:py-32 overflow-hidden">
      {/* Halftone texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 z-0 mix-blend-overlay" 
        style={{ backgroundImage: 'url(/paper_texture.png)', backgroundSize: 'cover' }}
      ></div>

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Artwork Side */}
        <div className="lg:w-1/2 relative w-full flex justify-center">
          <div className="relative w-[90%] max-w-[500px] aspect-[3/4] bg-bg-cream p-4 transform -rotate-2 border border-foreground/10 shadow-2xl">
            <div className="w-full h-full border border-foreground/10 overflow-hidden relative bg-black">
               {/* Halftone Illustration */}
               <img src="/bengali_culture.png" alt="Cultural Illustration" className="w-full h-full object-cover grayscale contrast-125 mix-blend-screen opacity-90" />
               <div className="absolute inset-0 bg-brand-coral/20 mix-blend-color pointer-events-none"></div>
            </div>
            
            {/* Caption tape */}
            <div className="absolute -bottom-4 right-10 bg-bg-sand text-foreground text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-foreground transform rotate-3 shadow-sm">
              Vol. 01 / Stories
            </div>
          </div>

          <Doodle name="star" className="absolute top-10 right-0 w-12 h-12 text-brand-yellow opacity-80" />
        </div>

        {/* Text Side */}
        <div className="lg:w-1/2 max-w-xl">
          <p className="text-xs font-bold tracking-widest text-brand-coral uppercase mb-6 inline-flex items-center gap-2">
            <Doodle name="dot" className="w-2 h-2" />
            Our Roots
          </p>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
            Made for<br />
            People who<br />
            Collect<br />
            <span className="text-brand-yellow relative inline-block">
              Stories.
              <Doodle name="underline" className="absolute -bottom-2 left-0 w-full text-brand-coral z-[-1]" />
            </span>
          </h2>
          <div className="space-y-6 text-bg-cream/80 font-medium text-lg border-l-2 border-brand-coral/50 pl-6">
            <p>
              Astronaut Stickerz is born from the love of old comic books, crowded street corners, and the beautiful chaos of Indian print culture. 
            </p>
            <p>
              We believe everyday objects should have character. They shouldn't just sit on your desk; they should spark an idea.
            </p>
          </div>
          <div className="mt-12">
             <Link href="/about" className="inline-flex items-center gap-2 font-bold text-xs tracking-widest uppercase text-bg-cream hover:text-brand-yellow transition-colors group border-b border-bg-cream pb-1 hover:border-brand-yellow">
               Read The Manifesto
               <Doodle name="arrow" className="w-5 h-5 text-brand-coral group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
