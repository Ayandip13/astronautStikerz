'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api/client';
import { Package, ArrowRight, Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get('/orders/myorders');
      setOrders(data);
    } catch (err) {
      setError('Could not fetch your orders. Please make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchOrders(), 0);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-3xl font-bold mb-4 text-brand-coral">Oops!</h1>
        <p className="text-foreground/70 font-medium mb-6">{error}</p>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={fetchOrders} className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" /> Try Again
          </Button>
          <Link href="/login">
            <Button variant="primary">Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-4xl font-bold text-foreground">My Orders</h1>
        <Link href="/products">
          <Button variant="secondary" className="hidden sm:flex">Continue Shopping</Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[2.5rem] border-2 border-dashed border-foreground/10 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-yellow/20 mb-6">
            <Package className="h-10 w-10 text-brand-purple" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">No orders yet</h2>
          <p className="text-foreground/60 mb-6">Looks like you haven&apos;t bought anything from us yet.</p>
          <Link href="/products">
            <Button variant="primary">Start Shopping ✨</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="rounded-3xl border border-foreground/10 bg-background overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-foreground/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-foreground/10">
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Order Placed</p>
                    <p className="text-sm font-bold text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Total</p>
                    <p className="text-sm font-bold text-foreground">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-bold">
                    <span className="text-foreground/50 mr-2">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs uppercase tracking-wider ${
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-brand-purple/10 text-brand-purple'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <Link href={`/account/orders/${order._id}`}>
                    <Button variant="secondary" size="sm" className="hidden sm:flex items-center gap-1 shadow-sm">
                      Details <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="px-6 py-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1 flex gap-4 overflow-x-auto pb-2">
                  {order.items.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="relative h-20 w-20 flex-shrink-0 rounded-xl bg-brand-yellow/10 border border-foreground/5 overflow-hidden">
                      <img 
                        src={item.previewImage || item.image || '/placeholder.jpg'} 
                        alt={item.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/50 font-bold">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
                <div className="sm:hidden w-full">
                  <Link href={`/account/orders/${order._id}`} className="w-full">
                    <Button variant="secondary" className="w-full justify-center">View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
