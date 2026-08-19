'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CUSTOM_PRODUCTS } from '@/lib/data/customProducts';

function CustomizeContent() {
  const router = useRouter();
  
  // Use built-in fixed products for the customization flow, bypassing the database
  const templates = CUSTOM_PRODUCTS;

  return (
    <div className="mx-auto w-full max-w-[96rem] px-4 py-12 sm:px-6 lg:px-12 bg-background min-h-screen">
      <SectionHeading 
        title="Customization Studio" 
        subtitle="Design your own custom products. Select a template to get started."
        className="mb-12 items-center text-center"
      />

      {/* Product Grid Area */}
      <div className="w-full">
        <ProductGrid>
          {templates.map(product => (
            <div key={product._id} className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-zinc-50 border border-foreground/5 transition-all duration-300 hover:shadow-xl hover:shadow-brand-purple/5 hover:-translate-y-1">
              {/* Image Container */}
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
                <img
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              {/* Content */}
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold text-zinc-900 line-clamp-1 group-hover:text-brand-purple transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                
                <div className="mt-6">
                  <Link href={`/customize/${product.slug}`} className="w-full">
                    <Button className="w-full shadow-lg">Start Designing</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </ProductGrid>
      </div>
    </div>
  );
}

export default function CustomizePage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-black dark:border-zinc-700 dark:border-t-white" /></div>}>
      <CustomizeContent />
    </Suspense>
  );
}
