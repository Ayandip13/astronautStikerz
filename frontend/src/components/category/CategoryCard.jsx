import Link from 'next/link';
import Image from 'next/image';

export function CategoryCard({ category }) {
  const { name, slug, image } = category;
  
  return (
    <Link href={`/category/${slug}`} className="group relative flex h-48 sm:h-64 flex-col overflow-hidden rounded-[2rem] bg-brand-yellow/10 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-brand-purple/20">
      {image && image.url ? (
        <Image
          src={image.url}
          alt={name}
          fill
          sizes="(min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
      ) : (
        <div className="absolute inset-0 bg-brand-yellow/20" />
      )}
      
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
      
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <h3 className="font-display text-2xl font-bold text-white tracking-tight group-hover:text-brand-yellow transition-colors">
          {name}
        </h3>
        <p className="mt-1 flex items-center text-sm font-bold text-white/90 transition-transform group-hover:translate-x-2">
          Shop Now <span aria-hidden="true" className="ml-1.5">✨</span>
        </p>
      </div>
    </Link>
  );
}
