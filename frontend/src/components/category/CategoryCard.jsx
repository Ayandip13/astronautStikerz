import Link from 'next/link';

export function CategoryCard({ category }) {
  const { name, slug, image } = category;
  
  return (
    <Link href={`/category/${slug}`} className="group flex flex-col w-full h-full border border-foreground/10 bg-white hover:border-foreground/30 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F8F0E6] flex items-center justify-center p-4">
        {image && image.url ? (
          <img
            src={image.url}
            alt={name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-peach/10">
            <span className="text-sm font-bold text-foreground/30 uppercase tracking-widest">{name}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between p-4 border-t border-foreground/10 bg-white">
        <h3 className="font-bold text-foreground tracking-tight group-hover:text-brand-purple transition-colors">
          {name}
        </h3>
        <span className="text-foreground/40 group-hover:text-brand-purple transition-colors">&rarr;</span>
      </div>
    </Link>
  );
}
