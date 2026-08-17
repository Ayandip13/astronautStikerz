import { CategoryCard } from '@/components/category/CategoryCard';

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

export function ShopByCategory({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-8 sm:mb-12">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground uppercase tracking-tight text-center">Shop By Category</h2>
        <div className="h-px w-full max-w-2xl bg-foreground/10 mt-4 sm:mt-6 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4">
              <div className="w-2 h-2 rounded-full bg-brand-purple"></div>
           </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {categories.map((cat) => {
          const config = CATEGORY_CONFIG[cat.slug] || {};
          return (
            <CategoryCard 
              key={cat._id} 
              category={cat} 
              customImage={config.image}
              tagline={config.tagline}
            />
          );
        })}
      </div>
    </section>
  );
}
