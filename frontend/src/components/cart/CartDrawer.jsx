'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';

export function CartDrawer({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, getTotalItems, getSubtotal } = useCartStore();

  const getImageUrl = (image) => {
    if (!image) return '/placeholder.jpg';
    let url = typeof image === 'string' ? image : image.url;
    if (!url) return '/placeholder.jpg';
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    if (url.startsWith('http://localhost:5000/uploads')) {
        url = url.replace('http://localhost:5000', baseUrl);
    } else if (url.startsWith('/uploads')) {
        url = `${baseUrl}${url}`;
    }
    return url;
  };

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[101] flex w-full max-w-md flex-col bg-background shadow-2xl transition-transform transform translate-x-0">
        <div className="flex items-center justify-between border-b border-foreground/10 px-6 py-4">
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" /> Your Cart
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-foreground/50 hover:bg-foreground/5 hover:text-foreground transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {!mounted ? (
            <div className="flex h-full items-center justify-center">
              <span className="text-foreground/50">Loading...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
              <div className="rounded-full bg-brand-yellow/20 p-6">
                <ShoppingBag className="h-12 w-12 text-brand-purple" />
              </div>
              <p className="text-lg font-bold text-foreground/70">Your cart is empty.</p>
              <Button onClick={onClose} variant="primary">Continue Shopping ✨</Button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-50 border border-foreground/5">
                    <img
                      src={getImageUrl(item.previewImage || item.product.images?.[0])}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="font-bold text-foreground">
                          <Link href={`/products/${item.product.slug}`} onClick={onClose} className="hover:text-brand-purple">
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="font-bold text-brand-purple ml-4">₹{item.product.price.toFixed(2)}</p>
                      </div>
                      {item.isCustomized && (
                        <p className="mt-1 text-xs font-bold text-brand-coral">Customized Design ✨</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-full border border-foreground/10 bg-background px-2 py-1">
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.designId)}
                          disabled={item.quantity <= 1}
                          className="p-1 text-foreground/50 hover:text-brand-purple disabled:opacity-50"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.designId)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 text-foreground/50 hover:text-brand-purple disabled:opacity-50"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.product._id, item.designId)}
                        className="text-foreground/40 hover:text-brand-coral transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {mounted && items.length > 0 && (
          <div className="border-t border-foreground/10 bg-foreground/5 px-6 py-6">
            <div className="flex justify-between text-lg font-bold text-foreground mb-6">
              <p>Subtotal</p>
              <p>₹{getSubtotal().toFixed(2)}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/cart" onClick={onClose}>
                <Button variant="secondary" className="w-full bg-white shadow-sm">View Cart</Button>
              </Link>
              <Link href="/checkout" onClick={onClose}>
                <Button variant="primary" className="w-full shadow-lg">Checkout 🚀</Button>
              </Link>
            </div>
            <p className="mt-4 text-center text-xs font-medium text-foreground/50">
              Shipping and taxes calculated at checkout.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
