'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useCartStore } from '@/store/cartStore';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { RocketDoodle } from '@/components/ui/Doodles';
import { useCreateOrder, useVerifyPayment } from '@/lib/api/hooks/useCheckout';
import { ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, getSubtotal, clearCart } = useCartStore();
  const queryClient = useQueryClient();

  const [error, setError] = useState(null);

  const { mutateAsync: createOrder, isPending: isCreating } = useCreateOrder();
  const { mutateAsync: verifyPayment, isPending: isVerifying } = useVerifyPayment();

  const isLoading = isCreating || isVerifying;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/products">
          <Button variant="primary">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shipping = subtotal > 499 ? 0 : 50;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Create order on backend
      const orderPayload = {
        items: items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          isCustomized: item.isCustomized,
          designId: item.designId,
          previewImage: item.previewImage,
        })),
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
        guestContact: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }
      };

      const checkoutRes = await createOrder(orderPayload);

      const { orderId, razorpayOrderId, amount, currency, trackingToken } = checkoutRes;

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Usually public key goes here
        amount: amount,
        currency: currency,
        name: 'Astronaut Stickerz',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment on Backend
            const verifyRes = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId
            });

            if (verifyRes.message === 'Payment verified successfully' || verifyRes.message === 'Payment already verified') {
              clearCart();
              router.push(`/order-success/${orderId}?token=${trackingToken}`);
            }
          } catch (err) {
            console.error('Payment verification failed', err);
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#8B5CF6' // brand-purple
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        setError(`Payment Failed: ${response.error.description}`);
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'An error occurred during checkout');
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Load Razorpay script dynamically */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="relative inline-flex items-center mb-8">
        <h1 className="font-display text-4xl font-bold text-foreground">Checkout</h1>
        <RocketDoodle className="w-10 h-10 ml-4 text-brand-purple -rotate-45" />
      </div>

      <div className="mb-8 rounded-2xl bg-brand-purple/5 p-4 text-center border border-brand-purple/10">
        <p className="text-foreground/80 font-medium">
          Have an account? <Link href="/login" className="text-brand-purple font-bold hover:underline">Log in</Link> to track your order easily.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
            <div className="rounded-[2rem] bg-background border-2 border-foreground/5 p-6 sm:p-8 shadow-sm">
              <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-purple text-sm text-white">1</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-bold text-foreground">Full Name</label>
                  <input type="text" id="name" name="name" required value={formData.name} onChange={handleInputChange}
                    className="mt-1 block w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-transparent py-3 px-4 shadow-sm focus:border-brand-purple focus:ring-brand-purple outline-none transition-colors sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-foreground">Email</label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange}
                    className="mt-1 block w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-transparent py-3 px-4 shadow-sm focus:border-brand-purple focus:ring-brand-purple outline-none transition-colors sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-foreground">Phone</label>
                  <input type="tel" id="phone" name="phone" minLength={10} maxLength={10} required value={formData.phone} onChange={handleInputChange}
                    className="mt-1 block w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-transparent py-3 px-4 shadow-sm focus:border-brand-purple focus:ring-brand-purple outline-none transition-colors sm:text-sm" />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-background border-2 border-foreground/5 p-6 sm:p-8 shadow-sm">
              <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-purple text-sm text-white">2</span>
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="street" className="block text-sm font-bold text-foreground">Street Address</label>
                  <input type="text" id="street" name="street" required value={formData.street} onChange={handleInputChange}
                    className="mt-1 block w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-transparent py-3 px-4 shadow-sm focus:border-brand-purple focus:ring-brand-purple outline-none transition-colors sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-bold text-foreground">City</label>
                  <input type="text" id="city" name="city" required value={formData.city} onChange={handleInputChange}
                    className="mt-1 block w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-transparent py-3 px-4 shadow-sm focus:border-brand-purple focus:ring-brand-purple outline-none transition-colors sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-bold text-foreground">State</label>
                  <input type="text" id="state" name="state" required value={formData.state} onChange={handleInputChange}
                    className="mt-1 block w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-transparent py-3 px-4 shadow-sm focus:border-brand-purple focus:ring-brand-purple outline-none transition-colors sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-bold text-foreground">PIN / ZIP Code</label>
                  <input type="text" id="zip" name="zip" required value={formData.zip} onChange={handleInputChange}
                    className="mt-1 block w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-transparent py-3 px-4 shadow-sm focus:border-brand-purple focus:ring-brand-purple outline-none transition-colors sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-bold text-foreground">Country</label>
                  <input type="text" id="country" name="country" required value={formData.country} readOnly
                    className="mt-1 block w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/50 py-3 px-4 shadow-sm text-foreground/50 outline-none sm:text-sm" />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 rounded-[2rem] bg-brand-yellow/10 p-8 shadow-sm border border-brand-yellow/20">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" /> Summary
            </h2>

            <ul className="mb-6 space-y-4 max-h-64 overflow-y-auto pr-2">
              {items.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground/60">{item.quantity}x</span>
                    <span className="font-bold text-foreground truncate max-w-[150px]">{item.product.name}</span>
                  </div>
                  <span className="font-bold text-brand-purple">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <dl className="space-y-4 text-base font-medium text-foreground/80 border-t border-foreground/10 pt-4">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd className="font-bold text-foreground">₹{subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Shipping</dt>
                <dd className="font-bold text-foreground">
                  {shipping === 0 ? (
                    <span className="text-brand-coral">Free</span>
                  ) : (
                    `₹${shipping.toFixed(2)}`
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-foreground/10 pt-4 mt-4">
                <dt className="text-lg font-bold text-foreground">Total to Pay</dt>
                <dd className="text-3xl font-black text-brand-purple">₹{total.toFixed(2)}</dd>
              </div>
            </dl>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-100 text-red-700 text-sm font-bold">
                {error}
              </div>
            )}

            <div className="mt-8">
              <Button
                type="submit"
                form="checkout-form"
                size="lg"
                variant="primary"
                className="w-full shadow-lg flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Pay Now 💳'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
