'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Truck, ArrowRight, CheckCircle2, Loader2, RefreshCcw } from 'lucide-react';
import apiClient from '@/lib/api/client';
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

  const getImageUrl = (image) => {
    if (!image) return '/placeholder.jpg';
    const url = typeof image === 'string' ? image : image.url;
    if (url && url.startsWith('/uploads')) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
      return `${baseUrl}${url}`;
    }
    return url || '/placeholder.jpg';
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      pending: { label: 'Pending', color: 'bg-zinc-100 text-zinc-700' },
      processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700' },
      packed: { label: 'Packed', color: 'bg-indigo-100 text-indigo-700' },
      shipped: { label: 'Shipped', color: 'bg-amber-100 text-amber-700' },
      out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700' },
      delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
    };
    return statusMap[status] || { label: status, color: 'bg-zinc-100 text-zinc-700' };
  };

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
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-bold text-foreground flex items-center gap-3">
          <Package className="h-8 w-8 text-brand-purple" />
          My Orders
        </h1>
        <Link href="/products">
          <Button variant="secondary" className="w-full sm:w-auto">Continue Shopping</Button>
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
          {orders.map((order) => {
            const statusInfo = getStatusDisplay(order.orderStatus);
            
            return (
              <div key={order._id} className="rounded-3xl bg-background border-2 border-foreground/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-brand-purple/5 p-4 sm:p-6 border-b border-foreground/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <div>
                      <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Order Number</p>
                      <p className="font-bold text-foreground">#{order.orderNumber}</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Date Placed</p>
                      <p className="font-bold text-foreground">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Total Amount</p>
                      <p className="font-bold text-brand-purple">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div>
                    <Link href={`/account/orders/${order._id}`}>
                      <Button variant="secondary" className="w-full sm:w-auto shadow-sm flex items-center justify-center gap-2">
                        Track Order <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex flex-wrap gap-4 overflow-hidden py-2">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl border border-zinc-200 bg-zinc-100 overflow-hidden shadow-sm flex-shrink-0 group">
                        <Image 
                          src={getImageUrl(item.previewImage || item.image)} 
                          alt={item.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform" 
                        />
                        {item.isCustomized && (
                          <div className="absolute top-1 left-1 bg-brand-purple text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                            ✨ Custom
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl border-2 border-dashed border-foreground/20 bg-foreground/5 flex items-center justify-center text-foreground/50 font-bold text-sm">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusInfo.color} flex items-center gap-1.5`}>
                      {order.orderStatus === 'delivered' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
                      {statusInfo.label}
                    </div>
                    <p className="text-sm font-medium text-foreground/60">
                      Payment: <span className="font-bold text-foreground capitalize">{order.paymentStatus}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
