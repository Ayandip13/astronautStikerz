import Link from 'next/link';
import Image from 'next/image';

export function ProductCard({ product }) {
  const { name, slug, price, compareAtPrice, images, customizable, stock } = product;
  
  const mainImage = images && images.length > 0 ? images[0].url : '/placeholder.jpg';
  
  const isSale = compareAtPrice > price;
  const isOutOfStock = stock <= 0;

  return (
    <Link href={`/products/${slug}`} className="group flex flex-col h-full">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={mainImage}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {isSale && (
            <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white shadow-sm">
              SALE
            </span>
          )}
          {customizable && (
            <span className="rounded bg-black px-2 py-1 text-xs font-bold text-white shadow-sm dark:bg-white dark:text-black">
              CUSTOMIZABLE
            </span>
          )}
          {isOutOfStock && (
            <span className="rounded bg-zinc-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
              SOLD OUT
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-3 flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2">
          {name}
        </h3>
        <div className="mt-1 flex items-center gap-2 mt-auto pt-1">
          <span className="text-sm font-bold text-zinc-900 dark:text-white">
            ₹{price.toFixed(2)}
          </span>
          {isSale && (
            <span className="text-xs text-zinc-500 line-through dark:text-zinc-400">
              ₹{compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
