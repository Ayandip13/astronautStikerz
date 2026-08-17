import Link from 'next/link';

export function ProductCard({ product }) {
  const { name, slug, price, compareAtPrice, images, customizable, stock } = product;
  
  // Handle both string arrays and object arrays for backward compatibility
  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    const url = typeof img === 'string' ? img : img.url;
    if (url && url.startsWith('/uploads')) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
        return `${baseUrl}${url}`;
    }
    return url || '/placeholder.jpg';
  };
  
  const mainImage = images && images.length > 0 ? getImageUrl(images[0]) : '/placeholder.jpg';
  
  const isSale = compareAtPrice > price;
  const isOutOfStock = stock <= 0;

  return (
    <Link href={`/products/${slug}`} className="group flex flex-col h-full bg-white border border-transparent hover:border-foreground/10 hover:shadow-sm transition-all duration-300">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F8F0E6] flex items-center justify-center p-4">
        <img
          src={mainImage}
          alt={name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
          {isSale && (
            <span className="bg-brand-coral px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-white">
              Sale
            </span>
          )}
          {customizable && (
            <span className="bg-brand-purple px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-white">
              Customizable
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-foreground px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-white">
              Sold Out
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-brand-coral transition-colors">
          {name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-foreground">
              ₹{price.toFixed(2)}
            </span>
            {isSale && (
              <span className="text-xs font-medium text-foreground/50 line-through">
                ₹{compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
