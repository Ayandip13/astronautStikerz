import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function CategoryCard({ category, customImage, tagline }) {
  const { name, slug, image } = category;
  
  // Use custom image if provided, otherwise fallback to API image
  const displayImage = customImage || (image && image.url) || null;

  return (
    <Link href={`/category/${slug}`} className="group flex flex-col w-full h-full border border-foreground/10 bg-white hover:border-foreground/30 hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-video sm:aspect-square overflow-hidden bg-[#F8F0E6]">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-peach/10">
            <span className="text-sm font-bold text-foreground/30 uppercase tracking-widest">{name}</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col justify-center p-6 border-t border-foreground/10 bg-white min-h-[120px]">
        <div className="flex items-center justify-between w-full mb-1">
          <h3 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight group-hover:text-brand-purple transition-colors">
            {name}
          </h3>
          <ArrowRight className="text-foreground/40 w-5 h-5 group-hover:text-brand-purple group-hover:translate-x-1 transition-all" />
        </div>
        {tagline && (
          <p className="text-foreground/60 font-medium text-sm">
            {tagline}
          </p>
        )}
      </div>
    </Link>
  );
}
