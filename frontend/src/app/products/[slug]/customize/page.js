'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useProductBySlug } from '@/lib/api/hooks/useProducts';
import { ProductCanvas } from '@/components/editor/ProductCanvas';
import { useCartStore } from '@/store/cartStore';

export default function CustomizePage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;
  const router = useRouter();

  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const { addItem, openCart } = useCartStore();

  const [saving, setSaving] = useState(false);

  // Kick out if not customizable
  useEffect(() => {
    if (product && !product.customizable) {
      router.push(`/products/${slug}`);
    }
  }, [product, slug, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-foreground">Product Not Found</h1>
        <Link href="/products" className="mt-4 text-brand-purple hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  // Prevent rendering if not customizable while redirect happens
  if (!product.customizable) return null;

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
      {/* Editor Header */}
      <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-foreground/10 bg-background px-4 sm:px-6 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link 
            href={`/products/${slug}`}
            className="flex items-center text-sm font-bold text-foreground/60 hover:text-brand-purple transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> 
            <span className="hidden sm:inline">Back to Product</span>
          </Link>
        </div>
        
        <div className="flex flex-col items-center">
          <h1 className="font-display text-lg font-bold text-foreground hidden sm:block">
            Customize {product.name} ✨
          </h1>
        </div>

        <div className="flex items-center gap-3">
           <span className="text-sm font-bold text-brand-purple hidden sm:inline-block">
             ₹{product.price.toFixed(2)}
           </span>
           {/* Add to Cart button will be triggered from the Canvas component to capture its state, or we pass a ref. 
               We will pass a callback down to ProductCanvas that it can call with the final design info. */}
        </div>
      </header>

      {/* Editor Main Area */}
      <main className="flex-1 overflow-hidden relative">
        <ProductCanvas 
          product={product} 
          onSave={async (designId, previewImage) => {
             // Add to cart logic
             addItem(product, 1, {
               isCustomized: true,
               designId,
               previewImage
             });
             openCart();
             router.push('/cart'); // Or stay on the product page
          }} 
        />
      </main>
    </div>
  );
}
