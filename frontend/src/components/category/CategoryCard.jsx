import Link from 'next/link';
import Image from 'next/image';

export function CategoryCard({ category }) {
  const { name, slug, image } = category;
  
  return (
    <Link href={`/category/${slug}`} className="group relative flex h-48 sm:h-64 flex-col overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
      {image && image.url ? (
        <Image
          src={image.url}
          alt={name}
          fill
          sizes="(min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700" />
      )}
      
      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity group-hover:from-black/70" />
      
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {name}
        </h3>
        <p className="mt-1 flex items-center text-sm font-medium text-white/80 transition-transform group-hover:translate-x-1">
          Shop Now <span aria-hidden="true" className="ml-1">&rarr;</span>
        </p>
      </div>
    </Link>
  );
}
