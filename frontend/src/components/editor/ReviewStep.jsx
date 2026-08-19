import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { MockupPreview } from './MockupPreview';
import { CheckCircle2, AlertTriangle, ArrowLeft, ShoppingBag } from 'lucide-react';

export function ReviewStep({ product, config, sidesData, onBack }) {
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const [approved, setApproved] = useState(false);

  const handleAddToCart = () => {
    if (!approved) return;

    // We build the full customization payload
    // sidesData looks like { front: { previewImage, customization }, back: ... }
    
    // Map sides to array for the backend
    const mappedSides = [];
    for (const [side, data] of Object.entries(sidesData)) {
      mappedSides.push({
        side,
        designId: data.customization.designId || 'custom',
        previewUrl: data.previewImage,
        canvasWidth: data.customization.canvasWidth,
        canvasHeight: data.customization.canvasHeight,
        designPosition: data.customization.designPosition,
        designScale: data.customization.designScale,
        designRotation: data.customization.designRotation,
      });
    }

    const customization = {
      options: config,
      sides: mappedSides
    };

    // Main preview image for cart thumbnail (use front)
    const mainPreview = sidesData.front?.previewImage || null;

    addItem(product, config.quantity, {
      isCustomized: true,
      previewImage: mainPreview,
      customization
    });
    
    openCart();
    router.push('/cart');
  };

  const isMultiSide = config.printSides === 'both';

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-50 dark:bg-zinc-50 overflow-y-auto">
      <header className="flex h-16 shrink-0 items-center border-b border-foreground/10 bg-white dark:bg-zinc-300 px-6 sticky top-0 z-10">
        <Button variant="outline" size="sm" onClick={onBack} className="rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Editor
        </Button>
        <h1 className="ml-6 font-display text-xl font-bold">Review Your Design</h1>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl p-6 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Mockups Column */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Front Design</h2>
              {sidesData.front ? (
                <MockupPreview product={product} side="front" designUrl={sidesData.front.previewImage} />
              ) : (
                <div className="p-8 border-2 border-dashed border-red-500 rounded-2xl text-red-500 bg-red-50">
                  Missing Front Design! Please go back and preview it.
                </div>
              )}
            </div>

            {isMultiSide && (
              <div>
                <h2 className="text-xl font-bold mb-4">Back Design</h2>
                {sidesData.back ? (
                  <MockupPreview product={product} side="back" designUrl={sidesData.back.previewImage} />
                ) : (
                  <div className="p-8 border-2 border-dashed border-red-500 rounded-2xl text-red-500 bg-red-50">
                    Missing Back Design! Please go back and preview it.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Checkout Column */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-zinc-300 rounded-[2rem] p-8 shadow-xl shadow-black/5 border border-foreground/5 sticky top-24">
              <h2 className="font-display text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-foreground/70">Product</span>
                  <span className="font-bold">{product.name}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-foreground/70">Size</span>
                  <span className="font-bold">{config.size}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-foreground/70">Printing</span>
                  <span className="font-bold">{config.printSides === 'both' ? 'Front & Back' : 'Front Only'}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-foreground/70">Quantity</span>
                  <span className="font-bold">{config.quantity}</span>
                </div>
                
                <div className="border-t border-foreground/10 pt-4 mt-4 flex justify-between items-end">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-3xl font-bold text-brand-purple">₹{config.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Approval Checklist */}
              <div className="bg-brand-purple/5 border border-brand-purple/20 rounded-xl p-4 mb-8">
                <h3 className="font-bold text-brand-purple flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5" /> Please review carefully
                </h3>
                <ul className="space-y-2 text-sm text-foreground/80 mb-4">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> Text is legible and spelled correctly</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> Images are clear and not blurry</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> Nothing important is outside the safe margin</li>
                </ul>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-brand-purple/50 bg-white group-hover:border-brand-purple transition-colors">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={approved}
                      onChange={(e) => setApproved(e.target.checked)}
                    />
                    <div className="hidden h-3 w-3 rounded-sm bg-brand-purple peer-checked:block" />
                  </div>
                  <span className="text-sm font-medium leading-tight">
                    I have reviewed and approve my design. I understand that custom products cannot be returned.
                  </span>
                </label>
              </div>

              <Button 
                size="lg" 
                className="w-full h-14 text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2"
                disabled={!approved}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-5 w-5" /> Add to Cart
              </Button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
