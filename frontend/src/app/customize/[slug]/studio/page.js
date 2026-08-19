'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomProductBySlug } from '@/lib/data/customProducts';
import { ProductCanvas } from '@/components/editor/ProductCanvas';
import { ReviewStep } from '@/components/editor/ReviewStep';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function StudioPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;
  const router = useRouter();

  // Use static data for custom templates
  const product = getCustomProductBySlug(slug);

  const [step, setStep] = useState('design'); // 'design' | 'review'
  const [config, setConfig] = useState(null);
  
  // Which side is currently being edited in the studio
  const [currentSide, setCurrentSide] = useState('front');

  // Store final customizations for each side before review
  // e.g. { front: { previewImage, customization }, back: { previewImage, customization } }
  const [sidesData, setSidesData] = useState({});

  useEffect(() => {
    if (product) {
      const stored = sessionStorage.getItem(`customConfig_${product._id}`);
      if (stored) {
        setConfig(JSON.parse(stored));
      } else {
        // If they bypassed the config page, redirect back to config
        router.push(`/customize/${slug}`);
      }
    }
  }, [product, slug, router]);

  if (!config) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Product Not Found</h1>
      </div>
    );
  }

  const isMultiSide = config.printSides === 'both';

  const handleSaveAndContinue = (side, payload) => {
    const updatedData = { ...sidesData, [side]: payload };
    setSidesData(updatedData);

    // Automatically progress to the next step
    if (isMultiSide && side === 'front') {
      setCurrentSide('back');
    } else {
      setStep('review');
    }
  };

  if (step === 'review') {
    return (
      <ReviewStep 
        product={product} 
        config={config}
        sidesData={sidesData}
        onBack={() => setStep('design')}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-50">
      
      {/* Studio Header */}
      <header className="h-16 shrink-0 border-b border-foreground/10 bg-white dark:bg-zinc-300 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="font-display font-bold text-lg leading-none">Design Studio</h1>
            <p className="text-xs text-foreground/50">{product.name}</p>
          </div>
        </div>

        {isMultiSide && (
          <div className="flex bg-zinc-200/50 dark:bg-zinc-300 p-1 rounded-xl">
            <button
              onClick={() => setCurrentSide('front')}
              className={`px-6 py-1.5 rounded-lg text-sm font-bold transition-all ${
                currentSide === 'front' 
                  ? 'bg-white shadow text-brand-purple' 
                  : 'text-foreground/50 hover:text-foreground'
              }`}
            >
              Front Design
            </button>
            <button
              onClick={() => setCurrentSide('back')}
              className={`px-6 py-1.5 rounded-lg text-sm font-bold transition-all ${
                currentSide === 'back' 
                  ? 'bg-white shadow text-brand-purple' 
                  : 'text-foreground/50 hover:text-foreground'
              }`}
            >
              Back Design
            </button>
          </div>
        )}

        <div className="w-[120px]">
           {/* Placeholder to keep flex-between balanced since we removed the Review button from here */}
        </div>
      </header>

      {/* Main Studio Area */}
      <div className="flex-1 relative overflow-hidden">
        <ProductCanvas 
          product={product} 
          currentSide={currentSide}
          onPreview={(payload) => handleSaveAndContinue(currentSide, payload)}
          isLastStep={!isMultiSide || currentSide === 'back'}
        />
      </div>

    </div>
  );
}
