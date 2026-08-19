'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProductBySlug } from '@/lib/api/hooks/useProducts';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';

// For Next.js 15 params unwrapping
export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;
  
  const { data: product, isLoading, isError } = useProductBySlug(slug);

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 animate-pulse">
          <div className="lg:w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-2xl w-full" style={{ paddingBottom: '100%' }}></div>
          <div className="lg:w-1/2 space-y-6 pt-6">
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
            <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
            <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded w-full mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Product Not Found</h1>
        <p className="mt-2 text-zinc-500">This product might have been removed or is temporarily unavailable.</p>
        <Link href="/products" className="mt-6">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    const url = typeof img === 'string' ? img : img.url;
    if (url && url.startsWith('/uploads')) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
        return `${baseUrl}${url}`;
    }
    return url || '/placeholder.jpg';
  };

  const images = product.images?.length > 0 ? product.images.map(getImageUrl) : ['/placeholder.jpg'];
  const mainImage = images[mainImageIndex];
  const isSale = product.compareAtPrice > product.price;
  const isOutOfStock = product.stock <= 0;

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    openCart();
  };

  return (
    <div className="mx-auto w-full max-w-[96rem] px-4 py-8 sm:px-6 lg:px-12 bg-background min-h-screen">
      
      {/* Breadcrumbs */}
      <nav className="mb-10 text-sm font-bold text-foreground/50 tracking-wide uppercase">
        <Link href="/" className="hover:text-brand-coral transition-colors">Home</Link>
        <span className="mx-3">/</span>
        <Link href="/products" className="hover:text-brand-coral transition-colors">Products</Link>
        <span className="mx-3">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Image Gallery */}
        <div className="lg:w-1/2 flex flex-col gap-6 w-full">
          <div className="relative w-full overflow-hidden rounded-[3rem] bg-zinc-50 border border-foreground/5 shadow-sm">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-auto object-contain object-center"
            />
            {/* Badges */}
            <div className="absolute left-6 top-6 flex flex-col gap-3">
              {isSale && (
                <span className="rounded-full bg-brand-coral px-4 py-2 text-xs uppercase tracking-widest font-bold text-white shadow-md">
                  Sale
                </span>
              )}
              {product.customizable && (
                <span className="rounded-full bg-brand-purple px-4 py-2 text-xs uppercase tracking-widest font-bold text-white shadow-md">
                  Customizable ✨
                </span>
              )}
            </div>
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImageIndex(index)}
                  className={`relative shrink-0 w-24 aspect-square overflow-hidden rounded-2xl border-2 transition-all ${
                    mainImageIndex === index 
                      ? 'border-brand-purple ring-2 ring-brand-purple/20' 
                      : 'border-transparent hover:border-foreground/20'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-contain object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 flex flex-col pt-2 sm:pt-6">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            {product.name}
          </h1>
          
          <div className="mt-4 flex items-end gap-3">
            <p className="text-3xl font-bold text-brand-purple">
              ₹{product.price.toFixed(2)}
            </p>
            {isSale && (
              <p className="text-lg font-bold text-foreground/40 line-through mb-1">
                ₹{product.compareAtPrice.toFixed(2)}
              </p>
            )}
          </div>
          
          {/* Status */}
          <div className="mt-4 flex items-center">
             {isOutOfStock ? (
               <span className="flex items-center text-sm font-medium text-red-600 dark:text-red-400">
                 <span className="mr-2 h-2 w-2 rounded-full bg-red-600 dark:bg-red-400"></span>
                 Out of stock
               </span>
             ) : (
               <span className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                 <span className="mr-2 h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></span>
                 {product.stock > 10 ? 'In stock' : product.stock === 1 ? 'Only 1 left in stock' : `Only ${product.stock} left in stock`}
               </span>
             )}
          </div>

          <div className="mt-8 border-t border-foreground/10 pt-8">
            <h3 className="font-display text-lg font-bold tracking-wide text-foreground mb-4">
              Description
            </h3>
            <div 
              className="prose prose-zinc dark:prose-invert max-w-none text-foreground/80 font-medium text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}
            />
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {!product.customizable && (
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-32 items-center justify-between rounded-full border-2 border-foreground/10 bg-background px-4">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="text-foreground/50 hover:text-brand-purple disabled:opacity-50 font-bold text-xl"
                  >
                    &minus;
                  </button>
                  <span className="font-bold text-foreground">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="text-foreground/50 hover:text-brand-purple disabled:opacity-50 font-bold text-xl"
                  >
                    &#43;
                  </button>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="mt-2 flex flex-col sm:flex-row gap-4">
              {product.customizable ? (
                <Link href={`/products/${slug}/customize`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full shadow-lg" disabled={isOutOfStock}>
                    Customize Yours ✨
                  </Button>
                </Link>
              ) : (
                <Button size="lg" onClick={handleAddToCart} className="w-full sm:w-auto shadow-lg" disabled={isOutOfStock}>
                  Add to Cart 🛒
                </Button>
              )}
            </div>
            
            <p className="text-sm font-medium text-foreground/60 text-center sm:text-left mt-2">
              Free shipping on orders over ₹499. Secure checkout.
            </p>
          </div>
        </div>
      </div>

      <RelatedProducts categoryId={product.category?._id} currentProductId={product._id} />
    </div>
  );
}
