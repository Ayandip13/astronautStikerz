import Link from 'next/link';

export function CategoryCard({ category }) {
  const { name, slug, image } = category;
  
  return (
    <Link href={`/category/${slug}`} className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-3xl bg-white border border-foreground/5 shadow-sm transition-shadow hover:shadow-lg">
      <div className="absolute inset-0 bg-zinc-50 z-0">
        {image && image.url && (
          <img
            src={image.url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
      </div>
      
      {/* Subtle overlay only at the very top or bottom if needed, but we'll use a badge approach instead */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-6">
        <div className="mt-auto bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-white/50 shadow-sm flex items-center justify-center transition-transform group-hover:-translate-y-2 group-hover:bg-brand-coral group-hover:text-white">
           <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-white transition-colors">
             {name}
           </h3>
        </div>
      </div>
    </Link>
  );
}
