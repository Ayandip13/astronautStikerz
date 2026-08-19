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
    <Link href={`/products/${slug}`} className="group flex flex-col h-full bg-transparent outline-none">
      <div className="relative w-full aspect-[4/3] sm:aspect-[5/4] overflow-hidden bg-white border-2 border-foreground rounded-md flex items-center justify-center mb-3 transition-colors shadow-[2px_2px_0px_rgba(50,30,37,1)] group-hover:shadow-[4px_4px_0px_rgba(50,30,37,1)] duration-300">
        <img
          src={mainImage}
          alt={name}
          className="w-full h-full object-contain p-4 drop-shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
        />
        
        {/* Badges */}
        <div className="absolute left-3 top-3 lg:left-4 lg:top-4 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="bg-foreground px-2 py-1 text-[9px] lg:text-[10px] uppercase font-bold tracking-wider text-white rounded-sm cursor-default shadow-sm border border-foreground">
              Sold Out
            </span>
          ) : stock <= 10 ? (
            <span className="bg-brand-yellow text-foreground px-2 py-1 text-[9px] lg:text-[10px] uppercase font-bold tracking-wider rounded-sm cursor-default shadow-sm border border-foreground">
              {stock === 1 ? 'Only 1 left' : `Only ${stock} left`}
            </span>
          ) : null}
        </div>

        {/* Hover Action */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 w-[85%] sm:w-[75%] hidden sm:block">
          <span className="flex w-full items-center justify-center bg-foreground text-white py-2.5 px-2 text-[10px] font-bold uppercase tracking-wider rounded shadow-sm group-hover:bg-brand-coral transition-colors">
            {customizable ? 'Select Options' : 'Add to Cart'}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow px-1 mt-2">
        <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground line-clamp-2 group-hover:text-brand-coral transition-colors">
          {name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[12px] sm:text-[13px] font-medium text-foreground/70">
            Rs. {price.toFixed(2)} INR
          </span>
          {isSale && (
            <span className="text-[12px] sm:text-[13px] font-medium text-foreground/40 line-through">
              Rs. {compareAtPrice.toFixed(2)} INR
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
