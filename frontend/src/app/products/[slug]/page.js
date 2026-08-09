'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProductBySlug } from '@/lib/api/hooks/useProducts';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { Button } from '@/components/ui/Button';

// For Next.js 15 params unwrapping
export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;
  
  const { data: product, isLoading, isError } = useProductBySlug(slug);

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 animate-pulse">
          <div className="lg:w-1/2 bg-zinc-200 dark:bg-zinc-800 aspect-square rounded-2xl"></div>
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

  const images = product.images?.length > 0 ? product.images : [{ url: '/placeholder.jpg' }];
  const mainImage = images[mainImageIndex]?.url;
  const isSale = product.compareAtPrice > product.price;
  const isOutOfStock = product.stock <= 0;

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Breadcrumbs could go here */}
      <nav className="mb-8 text-sm font-medium text-zinc-500">
        <Link href="/" className="hover:text-black dark:hover:text-white">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-black dark:hover:text-white">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900 dark:text-zinc-300">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Image Gallery */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {isSale && (
                <span className="rounded bg-red-600 px-3 py-1 text-xs font-bold tracking-wider text-white shadow-sm">
                  SALE
                </span>
              )}
              {product.customizable && (
                <span className="rounded bg-black px-3 py-1 text-xs font-bold tracking-wider text-white shadow-sm dark:bg-white dark:text-black">
                  CUSTOMIZABLE
                </span>
              )}
            </div>
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImageIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    mainImageIndex === index 
                      ? 'border-black dark:border-white ring-2 ring-black/5 dark:ring-white/5' 
                      : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    sizes="25vw"
                    className="object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 flex flex-col pt-2 sm:pt-6">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
            {product.name}
          </h1>
          
          <div className="mt-4 flex items-end gap-3">
            <p className="text-3xl font-bold text-zinc-900 dark:text-white">
              ₹{product.price.toFixed(2)}
            </p>
            {isSale && (
              <p className="text-lg font-medium text-zinc-500 line-through dark:text-zinc-400 mb-1">
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
                 In stock and ready to ship
               </span>
             )}
          </div>

          <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <h3 className="text-sm font-semibold tracking-wider text-zinc-900 dark:text-white uppercase mb-4">
              Description
            </h3>
            <div 
              className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}
            />
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {!product.customizable && (
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-32 items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black px-4">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="text-zinc-500 hover:text-black disabled:opacity-50 dark:hover:text-white"
                  >
                    &minus;
                  </button>
                  <span className="font-medium text-zinc-900 dark:text-white">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="text-zinc-500 hover:text-black disabled:opacity-50 dark:hover:text-white"
                  >
                    &#43;
                  </button>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="mt-2 flex flex-col sm:flex-row gap-4">
              {product.customizable ? (
                <Button size="lg" className="w-full sm:w-auto" disabled={isOutOfStock}>
                  Customize This Product
                </Button>
              ) : (
                <Button size="lg" className="w-full sm:w-auto" disabled={isOutOfStock}>
                  Add to Cart
                </Button>
              )}
            </div>
            
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center sm:text-left mt-2">
              Free shipping on orders over ₹499. Secure checkout.
            </p>
          </div>
        </div>
      </div>

      <RelatedProducts categoryId={product.category?._id} currentProductId={product._id} />
    </div>
  );
}
