import Link from 'next/link';

export function CategoryCard({ category }) {
  const { name, slug, image } = category;
  
  return (
    <Link href={`/category/${slug}`} className="group flex flex-col gap-4 w-full">
      <div className="relative aspect-[16/9] sm:aspect-[2/1] overflow-hidden rounded-2xl border-2 border-[#713747] bg-bg-sand shadow-sm transition-transform duration-500 group-hover:-translate-y-1 group-hover:shadow-md">
        {image && image.url ? (
          <img
            src={image.url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-peach/20">
            <span className="text-4xl text-brand-purple opacity-50">✨</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center text-[#713747]">
        <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight group-hover:text-brand-coral transition-colors">
          {name} &rarr;
        </h3>
      </div>
    </Link>
  );
}
