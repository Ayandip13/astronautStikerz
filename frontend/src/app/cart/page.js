'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-foreground/50 font-bold">Loading your cart...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center space-y-6">
        <div className="rounded-full bg-brand-yellow/20 p-8">
          <ShoppingBag className="h-16 w-16 text-brand-purple" />
        </div>
        <h1 className="font-display text-4xl font-bold text-foreground">Your cart is empty</h1>
        <p className="text-lg font-medium text-foreground/60 max-w-md">
          Looks like you haven&apos;t added any cool stuff to your desk yet. Let&apos;s fix that!
        </p>
        <Link href="/products">
          <Button size="lg" variant="primary" className="mt-4 shadow-lg">
            Start Shopping ✨
          </Button>
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shipping = subtotal > 499 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-foreground mb-8">Your Cart 🛒</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <ul className="space-y-6">
            {items.map((item, idx) => (
              <li key={idx} className="flex flex-col sm:flex-row gap-6 rounded-[2rem] bg-background border-2 border-foreground/5 p-6 shadow-sm hover:border-brand-yellow/30 transition-colors">
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-brand-yellow/10">
                  <Image
                    src={item.previewImage || (item.product.images?.[0]?.url) || '/placeholder.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">
                        <Link href={`/products/${item.product.slug}`} className="hover:text-brand-purple transition-colors">
                          {item.product.name}
                        </Link>
                      </h3>
                      {item.isCustomized && (
                        <p className="mt-2 inline-flex rounded-full bg-brand-purple/10 px-3 py-1 text-xs font-bold text-brand-purple">
                          Customized Design ✨
                        </p>
                      )}
                    </div>
                    <p className="font-bold text-xl text-brand-purple">₹{item.product.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6 sm:mt-auto">
                    <div className="flex items-center rounded-full border-2 border-foreground/10 bg-background px-3 py-1.5 shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.designId)}
                        disabled={item.quantity <= 1}
                        className="p-1 text-foreground/50 hover:text-brand-purple disabled:opacity-50 font-bold"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center text-base font-bold text-foreground">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.designId)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 text-foreground/50 hover:text-brand-purple disabled:opacity-50 font-bold"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.product._id, item.designId)}
                      className="flex items-center gap-2 text-sm font-bold text-foreground/40 hover:text-brand-coral transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 rounded-[2rem] bg-brand-yellow/10 p-8 shadow-sm border border-brand-yellow/20">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Order Summary</h2>
            
            <dl className="space-y-4 text-base font-medium text-foreground/80">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd className="font-bold text-foreground">₹{subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Shipping</dt>
                <dd className="font-bold text-foreground">
                  {shipping === 0 ? (
                    <span className="text-brand-coral">Free ✨</span>
                  ) : (
                    `₹${shipping.toFixed(2)}`
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-foreground/10 pt-4 mt-4">
                <dt className="text-lg font-bold text-foreground">Total</dt>
                <dd className="text-2xl font-black text-brand-purple">₹{total.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-8">
              <Link href="/checkout">
                <Button size="lg" variant="primary" className="w-full shadow-lg flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            {subtotal < 499 && (
              <p className="mt-6 text-center text-sm font-medium text-foreground/60 bg-white p-3 rounded-xl shadow-sm border border-foreground/5">
                Add <span className="font-bold text-brand-coral">₹{(499 - subtotal).toFixed(2)}</span> more to your cart for <span className="font-bold text-brand-purple">FREE shipping! 🚀</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
