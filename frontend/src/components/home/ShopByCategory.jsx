import { CategoryCard } from '@/components/category/CategoryCard';
import { ScribbleUnderline } from '@/components/ui/Doodles';

const CATEGORY_CONFIG = {
  'stickers': {
    image: '/images/category-art/stickers.png',
    tagline: 'Small things. Big personality.',
  },
  'notebook': {
    image: '/images/category-art/notebooks.png',
    tagline: 'For ideas worth keeping.',
  },
  'mousepad': {
    image: '/images/category-art/mousepads.png',
    tagline: 'Give your desk some character.',
  }
};

export function ShopByCategory({ categories, isLoading }) {
  if (!isLoading && (!categories || categories.length === 0)) return null;

  return (
    <section className="w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-8 sm:mb-12">
        <h2 className="relative font-display text-3xl sm:text-4xl font-bold text-foreground uppercase tracking-tight text-center">
          Shop By Category
          <ScribbleUnderline className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 text-brand-purple opacity-50" />
        </h2>
        <div className="h-px w-full max-w-2xl bg-foreground/10 mt-4 sm:mt-6 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4">
              <div className="w-2 h-2 rounded-full bg-brand-purple"></div>
           </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="group relative flex h-64 sm:h-80 w-full flex-col overflow-hidden rounded-[2.5rem] bg-zinc-100 animate-pulse border border-foreground/5 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 z-20 flex w-full flex-col p-6 sm:p-8">
                    <div className="h-8 w-3/4 bg-white/40 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-white/40 rounded"></div>
                </div>
            </div>
          ))
        ) : (
          categories.map((cat) => {
            const config = CATEGORY_CONFIG[cat.slug] || {};
            return (
              <CategoryCard 
                key={cat._id} 
                category={cat} 
                customImage={config.image}
                tagline={config.tagline}
              />
            );
          })
        )}
      </div>
    </section>
  );
}
