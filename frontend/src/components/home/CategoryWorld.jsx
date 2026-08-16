import React from 'react';
import Link from 'next/link';
import { Doodle } from '@/components/ui/Doodle';

export function CategoryWorld({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="relative py-24 bg-bg-sand border-y border-foreground/10 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16 relative">
           <Doodle name="sparkle" className="absolute -top-4 left-1/4 w-8 h-8 text-brand-purple opacity-50 hidden md:block" />
           <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-foreground">
             Pick Your Mood.
           </h2>
           <Doodle name="underline" className="w-48 h-4 mx-auto text-brand-coral mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
           {categories.slice(0,3).map((cat, i) => (
              <Link href={`/category/${cat.slug}`} key={cat._id} className="group relative block aspect-[4/5] sm:aspect-square bg-white border border-foreground/10 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                 <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-foreground/50 border border-foreground/10 px-2 py-1">Vol. 0{i+1}</div>
                 <div className="w-full h-full flex flex-col items-center justify-center">
                    <h3 className="font-display text-3xl font-black uppercase tracking-tight text-foreground group-hover:text-brand-purple transition-colors mb-2 z-10 relative">
                      {cat.name}
                    </h3>
                    <p className="font-serif italic text-foreground/70 text-sm group-hover:text-brand-coral transition-colors z-10 relative">
                      Explore Collection &rarr;
                    </p>
                 </div>
                 
                 {/* Decorative background circle on hover */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-yellow/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                 
                 <Doodle name="star" className="absolute bottom-6 right-6 w-8 h-8 text-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:rotate-45 duration-300" />
              </Link>
           ))}
        </div>

      </div>
    </section>
  );
}
