import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { InkPotDoodle, GlassesDoodle, BharDoodle } from '@/components/ui/Doodles';

import Image from 'next/image';

export function CulturalStory() {
  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-foreground text-bg-cream overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 sm:gap-16 relative z-10">
        
        {/* Visual Element */}
        <div className="w-full lg:w-1/2 relative h-[380px] sm:h-[450px] lg:h-[550px]">
          <div className="absolute inset-0 bg-brand-purple/20 rounded-3xl transform rotate-3"></div>
          <div className="absolute inset-0 bg-[#2a1b22] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            
            <div className="w-full h-[60%] sm:h-[65%] relative border-b border-white/10">
              <Image 
                src="/images/campaign/cultural-artwork.png" 
                alt="Original Bengali Art" 
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
              <h3 className="font-display text-3xl sm:text-4xl font-bold mb-1 sm:mb-2 uppercase tracking-tight text-white">Original Art,<br/>No Excuses.</h3>
              <p className="text-white/60 font-medium text-sm sm:text-base">Every piece is designed with intent.</p>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left mt-8 lg:mt-0 relative">
          <BharDoodle className="absolute -top-8 sm:-top-12 right-0 sm:-right-4 w-8 h-8 sm:w-10 sm:h-10 text-white/20 rotate-12" />
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-[1.1] uppercase tracking-tight text-white">
            Made for People<br/>
            <span className="text-brand-coral italic lowercase tracking-normal relative inline-block">
              who collect stories.
              <InkPotDoodle className="absolute -bottom-4 sm:-bottom-6 -right-8 sm:-right-12 w-8 h-8 sm:w-10 sm:h-10 text-brand-yellow/80 -rotate-12" />
            </span>
          </h2>
          
          <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-white/80 font-medium mb-8 sm:mb-10 max-w-lg relative">
            <GlassesDoodle className="absolute top-10 -left-6 sm:-left-12 w-10 h-10 sm:w-12 sm:h-12 text-white/10 -rotate-12" />
            <p className="relative z-10">
              Astronaut Stickerz isn't just about covering your laptop. It's about taking the visual culture of Kolkata, the nostalgia of retro comics, and the warmth of Bengali literature, and giving it a place on your desk.
            </p>
          </div>
          
          <Link href="/products" className="w-full sm:w-auto">
             <Button variant="primary" size="lg" className="w-full sm:w-auto bg-brand-coral text-white hover:bg-white hover:text-foreground font-bold tracking-widest text-sm uppercase transition-colors shadow-xl border-none">
               Explore the Collection
             </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
