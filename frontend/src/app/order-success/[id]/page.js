'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, ShoppingBag, ArrowRight } from 'lucide-react';
import apiClient from '@/lib/api/client';
import { Button } from '@/components/ui/Button';

export default function OrderSuccessPage({ params }) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.id;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await apiClient.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        setError('Could not fetch order details.');
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-foreground/50 font-bold">Loading order details...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Order Not Found</h1>
        <Link href="/products">
          <Button variant="primary">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2.5rem] bg-background border-2 border-brand-purple/20 p-8 sm:p-12 shadow-xl text-center relative overflow-hidden">
        {/* Playful background decorative elements */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-yellow/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-brand-coral/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-purple/10 mb-8">
            <CheckCircle2 className="h-12 w-12 text-brand-purple" />
          </div>
          
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            Order Confirmed! ✨
          </h1>
          <p className="text-lg font-medium text-foreground/70 mb-8">
            Thank you for shopping with Astronaut Stickerz. Your order <span className="font-bold text-foreground">#{order.orderNumber}</span> has been placed successfully.
          </p>

          <div className="rounded-2xl bg-foreground/5 p-6 mb-8 text-left">
            <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" /> Order Details
            </h2>
            <div className="space-y-3 text-sm font-medium">
              <div className="flex justify-between border-b border-foreground/10 pb-2">
                <span className="text-foreground/60">Order Date:</span>
                <span className="text-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b border-foreground/10 pb-2">
                <span className="text-foreground/60">Payment Status:</span>
                <span className="text-brand-purple uppercase tracking-wider">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between border-b border-foreground/10 pb-2">
                <span className="text-foreground/60">Total Paid:</span>
                <span className="text-foreground font-bold text-base">₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-foreground/60">Items:</span>
                <span className="text-foreground">{order.items.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-lg flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" /> Continue Shopping
              </Button>
            </Link>
            {/* If authenticated user, they can view details in account */}
            {order.user && (
              <Link href={`/account/orders/${order._id}`}>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-sm flex items-center gap-2">
                  View Order Details <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
