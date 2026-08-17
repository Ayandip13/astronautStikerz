import { CategoryCard } from '@/components/category/CategoryCard';

export function ShopByCategory({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col justify-between items-start mb-8 gap-2">
        <h2 className="font-display text-3xl font-bold text-foreground uppercase tracking-tight">Shop By Category</h2>
        <div className="h-1 w-24 bg-brand-purple"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.slice(0, 4).map((cat) => (
          <CategoryCard key={cat._id} category={cat} />
        ))}
      </div>
    </section>
  );
}
