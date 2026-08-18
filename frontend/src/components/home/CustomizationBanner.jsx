import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function CustomizationBanner() {
  return (
    <section className="w-full bg-brand-purple text-white overflow-hidden my-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        <div className="p-12 md:p-16 lg:p-24 md:w-1/2 flex flex-col items-start justify-center">
          <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6 leading-tight uppercase tracking-tight">
            Customize Something <span className="text-brand-yellow">That's Yours</span>
          </h2>
          <p className="text-lg font-medium text-white/90 mb-8 max-w-md">
            Upload your design. Place it on a notebook, mousepad, or sticker. Make it completely unique.
          </p>
          <Link href="/customize">
            <Button size="lg" className="bg-brand-yellow text-foreground hover:text-black hover:bg-white font-bold tracking-widest text-sm uppercase shadow-xl hover:shadow-2xl transition-all">
              Start Customizing
            </Button>
          </Link>
        </div>
        
        {/* Abstract pattern / graphic side */}
        <div className="md:w-1/2 h-64 md:h-full min-h-[400px] relative bg-brand-purple overflow-hidden flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10">
           <div className="absolute top-10 right-10 w-64 h-64 rounded-full border border-white/20"></div>
           <div className="absolute -bottom-10 -left-10 w-96 h-96 rounded-full border border-white/10"></div>
           
           <div className="relative z-10 w-full px-12 grid grid-cols-2 gap-4">
              <div className="aspect-square bg-white rounded-2xl rotate-3 shadow-2xl flex items-center justify-center p-4">
                 <div className="w-full h-full bg-bg-sand rounded-xl border border-dashed border-foreground/30 flex items-center justify-center">
                    <span className="text-foreground/50 font-bold uppercase text-xs tracking-wider">Your Art Here</span>
                 </div>
              </div>
              <div className="aspect-square bg-brand-peach rounded-2xl -rotate-6 shadow-xl translate-y-8 flex items-center justify-center p-4">
                 <div className="w-full h-full border-4 border-white rounded-xl"></div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
