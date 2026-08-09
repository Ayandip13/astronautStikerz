import Link from 'next/link';
import Image from 'next/image';

export function ProductCard({ product }) {
  const { name, slug, price, compareAtPrice, images, customizable, stock } = product;
  
  const mainImage = images && images.length > 0 ? images[0].url : '/placeholder.jpg';
  
  const isSale = compareAtPrice > price;
  const isOutOfStock = stock <= 0;

  return (
    <Link href={`/products/${slug}`} className="group flex flex-col h-full">
      <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-brand-yellow/10">
        <Image
          src={mainImage}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {isSale && (
            <span className="rounded-full bg-brand-coral px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              SALE
            </span>
          )}
          {customizable && (
            <span className="rounded-full bg-brand-purple px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              CUSTOMIZABLE ✨
            </span>
          )}
          {isOutOfStock && (
            <span className="rounded-full bg-foreground/60 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              SOLD OUT
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex flex-col flex-grow px-2">
        <h3 className="font-display text-lg font-bold text-foreground line-clamp-2 group-hover:text-brand-purple transition-colors">
          {name}
        </h3>
        <div className="mt-1 flex items-center gap-2 mt-auto pt-2">
          <span className="text-base font-bold text-foreground">
            ₹{price.toFixed(2)}
          </span>
          {isSale && (
            <span className="text-sm font-medium text-foreground/50 line-through">
              ₹{compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
