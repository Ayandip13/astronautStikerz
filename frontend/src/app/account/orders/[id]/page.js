'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import apiClient from '@/lib/api/client';
import { ArrowLeft, MapPin, Package, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OrderDetailsPage({ params }) {
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
        setError('Could not fetch order details. Ensure you are authorized to view this order.');
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-foreground/70 mb-6">{error}</p>
        <Link href="/account/orders">
          <Button variant="primary">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/account/orders" className="inline-flex items-center text-sm font-bold text-foreground/50 hover:text-brand-purple transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Order #{order.orderNumber}
          </h1>
          <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider self-start sm:self-auto ${
            order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            'bg-brand-purple/10 text-brand-purple'
          }`}>
            {order.orderStatus}
          </div>
        </div>
        <p className="text-foreground/60 mt-2 font-medium">Placed on {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3 space-y-8">
          <div className="rounded-3xl border border-foreground/10 bg-background shadow-sm overflow-hidden">
            <div className="bg-foreground/5 px-6 py-4 border-b border-foreground/10">
              <h2 className="font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-brand-purple" /> Items Ordered
              </h2>
            </div>
            <ul className="divide-y divide-foreground/10">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex flex-col sm:flex-row items-center gap-6 p-6">
                  <div className="relative h-24 w-24 flex-shrink-0 rounded-2xl bg-brand-yellow/10 border border-foreground/5 overflow-hidden">
                    <Image 
                      src={item.previewImage || item.image || '/placeholder.jpg'} 
                      alt={item.name} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between w-full">
                    <div className="mb-4 sm:mb-0">
                      <Link href={`/products/${item.product}`} className="font-bold text-foreground hover:text-brand-purple text-lg">
                        {item.name}
                      </Link>
                      {item.isCustomized && (
                        <p className="text-xs font-bold text-brand-coral mt-1">Customized Design ✨</p>
                      )}
                      <p className="text-sm font-medium text-foreground/60 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-lg text-brand-purple whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3 space-y-8">
          <div className="rounded-3xl border border-foreground/10 bg-background shadow-sm overflow-hidden">
            <div className="bg-foreground/5 px-6 py-4 border-b border-foreground/10">
              <h2 className="font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-brand-purple" /> Order Summary
              </h2>
            </div>
            <div className="p-6">
              <dl className="space-y-3 text-sm font-medium text-foreground/80">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="font-bold text-foreground">₹{order.subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd className="font-bold text-foreground">
                    {order.shippingAmount === 0 ? 'Free' : `₹${order.shippingAmount.toFixed(2)}`}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-foreground/10 pt-3 mt-3">
                  <dt className="text-base font-bold text-foreground">Total Paid</dt>
                  <dd className="text-xl font-black text-brand-purple">₹{order.totalAmount.toFixed(2)}</dd>
                </div>
              </dl>
              
              <div className="mt-6 pt-6 border-t border-foreground/10">
                <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">Payment Info</p>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-foreground/80">Status:</span>
                  <span className={`font-bold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-brand-coral'}`}>
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </div>
                {order.razorpayPaymentId && (
                  <div className="flex justify-between text-xs font-medium mt-2">
                    <span className="text-foreground/50">Transaction ID:</span>
                    <span className="text-foreground/80 font-mono">{order.razorpayPaymentId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-foreground/10 bg-background shadow-sm overflow-hidden">
            <div className="bg-foreground/5 px-6 py-4 border-b border-foreground/10">
              <h2 className="font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-purple" /> Shipping Details
              </h2>
            </div>
            <div className="p-6">
              <div className="text-sm font-medium text-foreground/80 leading-relaxed">
                {order.guestContact?.name ? (
                  <p className="font-bold text-foreground mb-2">{order.guestContact.name}</p>
                ) : order.user?.name ? (
                  <p className="font-bold text-foreground mb-2">{order.user.name}</p>
                ) : null}
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                <p>{order.shippingAddress.country}</p>
                
                {(order.guestContact?.phone || order.user?.phone) && (
                  <p className="mt-4 pt-4 border-t border-foreground/10">
                    <span className="text-foreground/50 mr-2">Phone:</span>
                    {order.guestContact?.phone || order.user?.phone}
                  </p>
                )}
                {(order.guestContact?.email || order.user?.email) && (
                  <p className="mt-1">
                    <span className="text-foreground/50 mr-2">Email:</span>
                    {order.guestContact?.email || order.user?.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
