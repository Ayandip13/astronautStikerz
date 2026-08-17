'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import apiClient from '@/lib/api/client';
import { ArrowLeft, MapPin, Package, CreditCard, Loader2, CheckCircle2, Circle, Clock, ExternalLink } from 'lucide-react';
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

  const isCancelled = order.orderStatus === 'cancelled';
  
  const timelineSteps = [
    { id: 'pending', label: 'Order Placed' },
    { id: 'paid', label: 'Payment Confirmed' },
    { id: 'processing', label: "We're preparing your order" },
    { id: 'packed', label: 'Your order is packed' },
    { id: 'shipped', label: 'Your order is on the way' },
    { id: 'out_for_delivery', label: 'Out for delivery' },
    { id: 'delivered', label: 'Delivered' }
  ];

  const getStepTimestamp = (stepId) => {
    if (!order.statusHistory) return null;
    if (stepId === 'paid') {
      if (order.paymentStatus === 'paid') {
        const proc = order.statusHistory.find(s => s.status === 'processing');
        return proc ? proc.timestamp : order.createdAt;
      }
      return null;
    }
    const history = order.statusHistory.find(s => s.status === stepId);
    return history ? history.timestamp : null;
  };

  const currentStatusIndex = isCancelled ? -1 : timelineSteps.findIndex(s => s.id === order.orderStatus);

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
            {order.orderStatus.replace(/_/g, ' ')}
          </div>
        </div>
        <p className="text-foreground/60 mt-2 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3 space-y-8">
          
          {/* Tracking Timeline */}
          <div className="rounded-[2.5rem] bg-[#FFFAF0] dark:bg-zinc-900 border-2 border-brand-purple/10 shadow-sm p-8 sm:p-10 relative overflow-hidden">
            <h2 className="font-display text-2xl font-bold mb-8 text-brand-purple">Tracking Timeline</h2>
            
            {isCancelled ? (
              <div className="flex items-center gap-4 text-brand-coral font-bold p-4 bg-brand-coral/10 rounded-2xl">
                <CheckCircle2 className="h-6 w-6" /> Order Cancelled
              </div>
            ) : (
              <div className="relative border-l-2 border-brand-purple/20 ml-3 space-y-8 pb-4">
                {timelineSteps.map((step, index) => {
                  const timestamp = getStepTimestamp(step.id);
                  const isCompleted = !!timestamp;
                  // If order status is pending, current is pending.
                  // Wait, how to find current step exactly? 
                  // If step has timestamp, it's completed. The LAST step with timestamp is current?
                  // Actually, if it has a timestamp, it's done. But we want the highest completed one to be "current".
                  let isCurrent = false;
                  if (order.statusHistory) {
                    const completedSteps = timelineSteps.filter(s => getStepTimestamp(s.id));
                    const lastCompleted = completedSteps[completedSteps.length - 1];
                    if (lastCompleted && lastCompleted.id === step.id && order.orderStatus !== 'delivered') {
                        isCurrent = true;
                    }
                  }

                  return (
                    <div key={step.id} className="relative pl-8">
                      <div className={`absolute -left-[11px] top-1 h-5 w-5 rounded-full border-2 bg-background flex items-center justify-center ${
                        isCompleted ? 'border-brand-purple bg-brand-purple' : 
                        isCurrent ? 'border-brand-coral bg-brand-coral' : 'border-zinc-300 dark:border-zinc-700'
                      }`}>
                        {isCompleted && !isCurrent && <CheckCircle2 className="h-3 w-3 text-white" />}
                        {isCurrent && <span className="h-2 w-2 rounded-full bg-white"></span>}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
                        <div className={`font-bold ${isCurrent ? 'text-brand-coral text-lg' : isCompleted ? 'text-foreground' : 'text-foreground/40'}`}>
                          {step.label}
                        </div>
                        {timestamp && (
                          <div className="text-sm font-medium text-foreground/50 whitespace-nowrap flex items-center gap-1 mt-1 sm:mt-0">
                            <Clock className="h-3 w-3" />
                            {new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {order.shippingDetails?.trackingUrl && (
              <div className="mt-8 pt-8 border-t border-brand-purple/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-800 p-6 rounded-2xl">
                <div>
                  <p className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-1">Shipped via {order.shippingDetails.courier || 'Courier'}</p>
                  <p className="font-bold text-foreground">Tracking #: <span className="font-mono text-brand-purple">{order.shippingDetails.trackingNumber || 'N/A'}</span></p>
                </div>
                <a href={order.shippingDetails.trackingUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" className="flex items-center gap-2 shadow-lg">
                    Track Shipment <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-foreground/10 bg-background shadow-sm overflow-hidden">
            <div className="bg-foreground/5 px-6 py-4 border-b border-foreground/10">
              <h2 className="font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-brand-purple" /> Items Ordered
              </h2>
            </div>
            <ul className="divide-y divide-foreground/10">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex flex-col sm:flex-row items-center gap-6 p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <div className="relative h-24 w-24 flex-shrink-0 rounded-2xl bg-brand-yellow/10 border border-foreground/5 overflow-hidden">
                    <Image 
                      src={getImageUrl(item.previewImage || item.image)} 
                      alt={item.name} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between w-full">
                    <div className="mb-4 sm:mb-0">
                      <Link href={`/products/${item.product}`} className="font-bold text-foreground hover:text-brand-purple text-lg transition-colors">
                        {item.name}
                      </Link>
                      {item.isCustomized && (
                        <p className="text-xs font-bold text-brand-coral mt-1 uppercase tracking-wider flex items-center gap-1">Customized Design</p>
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
