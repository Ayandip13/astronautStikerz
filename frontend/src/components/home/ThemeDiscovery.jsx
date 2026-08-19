import Link from 'next/link';

export function ThemeDiscovery({ categories, isLoading }) {
  if (!isLoading && (!categories || categories.length === 0)) return null;

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-bg-sand">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight mb-4">Shop By Mood</h2>
        <p className="text-foreground/70 font-medium max-w-2xl mx-auto">Find the perfect aesthetic for your space, from retro comics to pure chaos.</p>
      </div>
      
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3 md:gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <span key={`skeleton-${i}`} className="inline-block px-12 py-5 bg-zinc-200 animate-pulse rounded-full" />
          ))
        ) : (
          categories.map((cat) => (
            <Link key={cat._id} href={`/category/${cat.slug}`}>
              <span className="inline-block px-6 py-3 bg-white border border-foreground/10 rounded-full font-bold text-foreground uppercase tracking-widest text-sm hover:border-brand-purple hover:text-brand-purple transition-colors shadow-sm hover:shadow-md">
                {cat.name}
              </span>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
