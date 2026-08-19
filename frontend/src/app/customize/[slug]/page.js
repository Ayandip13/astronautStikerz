'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomProductBySlug } from '@/lib/data/customProducts';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CustomizeConfigPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;
  const router = useRouter();

  // Use static data for custom templates
  const product = getCustomProductBySlug(slug);

  const [quantity, setQuantity] = useState(1);
  const [printSides, setPrintSides] = useState('front'); // 'front' or 'both'
  const [size, setSize] = useState('Standard');

  if (!product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Template Not Found</h1>
        <Link href="/customize" className="mt-6">
          <Button>Back to Templates</Button>
        </Link>
      </div>
    );
  }

  const supportsBack = product.customizationConfig?.supportedSides?.includes('back');

  // Calculate price (basic demo calculation)
  let basePrice = product.price;
  if (printSides === 'both') basePrice += 50; // extra charge for double sided
  const totalPrice = basePrice * quantity;

  const handleNext = () => {
    // Store configuration in sessionStorage to pass it to the studio
    const config = {
      quantity,
      printSides,
      size,
      basePrice,
      totalPrice
    };
    sessionStorage.setItem(`customConfig_${product._id}`, JSON.stringify(config));
    router.push(`/customize/${slug}/studio`);
  };

  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    const url = typeof img === 'string' ? img : img.url;
    if (url && url.startsWith('/uploads')) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
      return `${baseUrl}${url}`;
    }
    return url || '/placeholder.jpg';
  };

  const mainImage = getImageUrl(product.images?.[0]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 min-h-screen">

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Configure Your {product.name}</h1>
          <p className="text-foreground/60 mt-2">Select your options before entering the design studio.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 bg-white dark:bg-zinc-300 rounded-[2rem] shadow-xl shadow-black/5 border border-foreground/5 p-6 sm:p-10">

        {/* Left: Preview */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-50 rounded-3xl p-8 border border-foreground/5">
          <div className="relative w-full aspect-square max-w-md">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
            />
          </div>
          <div className="mt-8 text-center">
            <p className="text-2xl font-bold text-brand-purple">₹{totalPrice.toFixed(2)}</p>
            <p className="text-sm text-foreground/50">₹{basePrice.toFixed(2)} / each</p>
          </div>
        </div>

        {/* Right: Options */}
        <div className="lg:w-1/2 flex flex-col justify-between">
          <div className="space-y-8">

            {/* Size Option */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-foreground/60">Size</label>
              <div className="flex gap-4">
                {['Standard', 'Large'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex-1 py-4 px-6 rounded-2xl border-2 text-center font-bold transition-all ${size === s
                      ? 'border-brand-purple bg-brand-purple/5 text-brand-purple'
                      : 'border-foreground/10 text-foreground/70 hover:border-brand-purple/50 hover:bg-foreground/5'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Print Sides Option */}
            {supportsBack && (
              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-wider text-foreground/60">Printing</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPrintSides('front')}
                    className={`flex-1 py-4 px-6 rounded-2xl border-2 text-center font-bold transition-all ${printSides === 'front'
                      ? 'border-brand-purple bg-brand-purple/5 text-brand-purple'
                      : 'border-foreground/10 text-foreground/70 hover:border-brand-purple/50 hover:bg-foreground/5'
                      }`}
                  >
                    Front Only
                  </button>
                  <button
                    onClick={() => setPrintSides('both')}
                    className={`flex-1 py-4 px-6 rounded-2xl border-2 text-center font-bold transition-all ${printSides === 'both'
                      ? 'border-brand-purple bg-brand-purple/5 text-brand-purple'
                      : 'border-foreground/10 text-foreground/70 hover:border-brand-purple/50 hover:bg-foreground/5'
                      }`}
                  >
                    Front & Back (+₹50)
                  </button>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-foreground/60">Quantity</label>
              <div className="flex h-14 w-40 items-center justify-between rounded-2xl border-2 border-foreground/10 bg-background px-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-foreground/50 hover:text-brand-purple font-bold text-xl"
                >
                  &minus;
                </button>
                <span className="font-bold text-lg text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(999, quantity + 1))}
                  className="text-foreground/50 hover:text-brand-purple font-bold text-xl"
                >
                  &#43;
                </button>
              </div>
            </div>

          </div>

          <div className="pt-10 border-t border-foreground/10 mt-10">
            <Button size="lg" onClick={handleNext} className="w-full flex items-center justify-center gap-2 shadow-xl py-6 text-lg rounded-2xl">
              Next: Open Design Studio <ArrowRight className="h-5 w-5" />
            </Button>
            <p className="text-center text-sm text-foreground/50 mt-4">
              You will be able to review your design before purchasing.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
