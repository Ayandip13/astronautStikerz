import Link from 'next/link';

export function ProductCard({ product }) {
  const { name, slug, price, compareAtPrice, images, customizable, stock } = product;
  
  // Handle both string arrays and object arrays for backward compatibility
  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    return typeof img === 'string' ? img : img.url;
  };
  
  const mainImage = images && images.length > 0 ? getImageUrl(images[0]) : '/placeholder.jpg';
  
  const isSale = compareAtPrice > price;
  const isOutOfStock = stock <= 0;

  return (
    <Link href={`/products/${slug}`} className="group flex flex-col h-full bg-transparent">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-bg-sand">
        <img
          src={mainImage}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
          {isSale && (
            <span className="rounded-full bg-brand-coral px-3 py-1 text-xs uppercase font-bold tracking-wider text-white shadow-sm">
              Sale
            </span>
          )}
          {customizable && (
            <span className="rounded-full bg-brand-purple px-3 py-1 text-xs uppercase font-bold tracking-wider text-white shadow-sm">
              Customizable ✨
            </span>
          )}
          {isOutOfStock && (
            <span className="rounded-full bg-foreground px-3 py-1 text-xs uppercase font-bold tracking-wider text-white shadow-sm">
              Sold Out
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-5 flex flex-col flex-grow">
        <h3 className="font-display text-xl font-bold text-foreground line-clamp-2 group-hover:text-brand-coral transition-colors">
          {name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-lg font-extrabold text-brand-purple">
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
