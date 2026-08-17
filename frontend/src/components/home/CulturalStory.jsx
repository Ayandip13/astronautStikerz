import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function CulturalStory() {
  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-foreground text-bg-cream overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        
        {/* Visual Element */}
        <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[500px]">
          <div className="absolute inset-0 bg-brand-purple/20 rounded-3xl transform rotate-3"></div>
          <div className="absolute inset-0 bg-[#2a1b22] border border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-brand-yellow flex items-center justify-center">
              {/* Abstract icon instead of emoji */}
              <div className="w-8 h-8 border-4 border-foreground rounded-full border-t-transparent"></div>
            </div>
            
            <div>
              <h3 className="font-display text-4xl font-bold mb-4 uppercase tracking-tight text-white">Original Art,<br/>No Excuses.</h3>
              <p className="text-white/60 font-medium">Every piece is designed with intent.</p>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1] uppercase tracking-tight text-white">
            Made for People<br/>
            <span className="text-brand-coral italic lowercase tracking-normal">who collect stories.</span>
          </h2>
          
          <div className="space-y-6 text-lg text-white/80 font-medium mb-10 max-w-lg">
            <p>
              Astronaut Stickerz isn't just about covering your laptop. It's about taking the visual culture of Kolkata, the nostalgia of retro comics, and the warmth of Bengali literature, and giving it a place on your desk.
            </p>
          </div>
          
          <Link href="/products">
             <Button variant="primary" size="lg" className="bg-brand-coral text-white hover:bg-white hover:text-foreground font-bold tracking-widest text-sm uppercase transition-colors shadow-xl border-none">
               Explore the Collection
             </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
