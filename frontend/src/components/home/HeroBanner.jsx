import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export function HeroBanner() {
  return (
    <section className="w-full bg-bg-cream border-b border-foreground/10 overflow-hidden relative group">
      <div className="relative w-full aspect-[4/3] sm:aspect-[21/9] lg:aspect-[24/9] bg-bg-sand overflow-hidden">
        {/* The Campaign Artwork */}
        <Image 
          src="/images/campaign/hero-banner.png" 
          alt="Astronaut Stickerz Campaign"
          fill
          priority
          className="object-cover object-center transition-transform duration-[20s] group-hover:scale-105"
        />
        
        {/* Overlay for text readability (subtle) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent sm:bg-gradient-to-r sm:from-black/80 sm:via-black/40 sm:to-transparent" />
        
        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:justify-center sm:p-12 lg:p-24 w-full">
          <div className="max-w-2xl text-left">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight drop-shadow-md uppercase">
              Stickers for<br />
              <span className="text-brand-yellow">Your Kind</span><br />
              of People.
            </h1>
            
            <p className="text-lg sm:text-xl text-white/90 font-medium mb-8 max-w-lg drop-shadow-sm">
              Your desk called. It wants personality. Discover original artwork, retro aesthetics, and goods worth sticking around for.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-xl hover:shadow-2xl font-bold tracking-wider text-sm bg-white text-foreground hover:bg-brand-yellow">
                  SHOP NEW DROPS
                </Button>
              </Link>
              <Link href="/customize">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto border border-white bg-transparent text-white hover:bg-white/20 backdrop-blur-sm font-bold tracking-wider text-sm shadow-xl">
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
