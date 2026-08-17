'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';

const IMAGES = [
  '/images/campaign/hero-banner.png',
  '/images/campaign/hero-banner-2.png',
  '/images/campaign/hero-banner-3.png',
];

export function HeroBanner() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % IMAGES.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-bg-cream border-b border-foreground/10 overflow-hidden relative group">
      <div className="relative w-full aspect-[4/5] sm:aspect-[21/9] lg:aspect-[24/9] bg-bg-sand overflow-hidden">
        {/* The Campaign Artwork Carousel */}
        {IMAGES.map((src, idx) => (
          <Image 
            key={src}
            src={src} 
            alt={`Astronaut Stickerz Campaign ${idx + 1}`}
            fill
            priority={idx === 0}
            className={`object-cover object-center transition-opacity duration-1000 ease-in-out ${
              idx === currentIdx ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        ))}
        
        {/* Overlay for text readability - darker for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent sm:bg-gradient-to-r sm:from-black/90 sm:via-black/60 sm:to-black/10 z-10" />
        
        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:justify-center sm:p-12 lg:p-24 w-full z-20 pb-12 sm:pb-6">
          <div className="max-w-2xl text-left">
            <h1 className="font-display text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight drop-shadow-xl uppercase" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              Stickers for<br />
              <span className="text-brand-yellow drop-shadow-2xl">Your Kind</span><br />
              of People.
            </h1>
            
            <p className="text-lg sm:text-xl text-white/95 font-medium mb-8 max-w-lg drop-shadow-lg hidden sm:block" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              Your desk called. It wants personality. Discover original artwork, retro aesthetics, and goods worth sticking around for.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-0">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full shadow-2xl font-bold tracking-wider text-sm bg-white text-foreground hover:bg-brand-yellow">
                  SHOP NEW DROPS
                </Button>
              </Link>
              <Link href="/customize" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full border-2 border-white bg-black/30 text-white hover:bg-white/40 backdrop-blur-sm font-bold tracking-wider text-sm shadow-2xl">
                  CUSTOMIZE
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
