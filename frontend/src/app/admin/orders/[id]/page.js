'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminOrderDetails, useUpdateOrderStatus, useAdminDesignDetails } from '@/lib/api/hooks/useAdmin';
import { ArrowLeft, Save, Truck, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function DesignViewer({ designId, previewImage }) {
    const { data: design, isLoading, isError } = useAdminDesignDetails(designId);

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

    if (isLoading) return <div className="p-4 text-sm text-zinc-500 bg-zinc-50 rounded-lg">Loading design...</div>;
    if (isError || !design) return <div className="p-4 text-sm text-red-500 bg-red-50 rounded-lg">Failed to load custom design.</div>;

    return (
        <div className="mt-4 border border-brand-purple/20 bg-brand-purple/5 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="font-bold text-brand-purple">Custom Design Details</h4>
                {design.imageUrl && (
                    <a 
                        href={getImageUrl(design.imageUrl)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm font-bold bg-white text-brand-purple border border-brand-purple px-3 py-1.5 rounded-lg hover:bg-brand-purple hover:text-white transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Download Artwork
                    </a>
                )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {previewImage && (
                    <div>
                        <p className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">Final Preview</p>
                        <div className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 bg-white">
                            <Image src={getImageUrl(previewImage)} alt="Design Preview" fill className="object-contain" />
                        </div>
                    </div>
                )}
                {design.imageUrl && (
                    <div>
                        <p className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">Uploaded Asset</p>
                        <div className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 bg-white">
                            <Image src={getImageUrl(design.imageUrl)} alt="Uploaded Artwork" fill className="object-contain" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminOrderDetails() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

    const { data: order, isLoading } = useAdminOrderDetails(id);
    const updateStatus = useUpdateOrderStatus();

    const [statusData, setStatusData] = useState({
        orderStatus: '',
        paymentStatus: '',
        courier: '',
        trackingNumber: '',
        trackingUrl: ''
    });

    useEffect(() => {
        if (order) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStatusData({
                orderStatus: order.orderStatus || '',
                paymentStatus: order.paymentStatus || '',
                courier: order.shippingDetails?.courier || '',
                trackingNumber: order.shippingDetails?.trackingNumber || '',
                trackingUrl: order.shippingDetails?.trackingUrl || ''
            });
        }
    }, [order]);

    const handleStatusChange = (e) => {
        const { name, value } = e.target;
        setStatusData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateOrder = async (e) => {
        e.preventDefault();
        try {
            await updateStatus.mutateAsync({ id, updates: statusData });
            alert('Order updated successfully!');
        } catch (error) {
            alert('Failed to update order');
        }
    };

    if (isLoading) return <div className="text-zinc-500">Loading order...</div>;
    if (!order) return <div className="text-red-500">Order not found.</div>;

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/orders" className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Order #{order.orderNumber}</h1>
                    <p className="text-sm text-zinc-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Items and Customer */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Items */}
                    <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 space-y-4">
                        <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-2">Order Items</h2>
                        <ul className="divide-y divide-zinc-100">
                            {order.orderItems.map((item, index) => (
                                <li key={index} className="py-4 flex flex-col space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 border border-zinc-200">
                                            <Image 
                                                src={item.image} 
                                                alt={item.name} 
                                                fill 
                                                className="object-contain" 
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-bold text-zinc-900">{item.name}</h3>
                                                    <p className="text-sm text-zinc-500">Qty: {item.quantity}</p>
                                                    {item.isCustomized && (
                                                        <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-brand-purple/10 px-2 py-0.5 text-xs font-bold text-brand-purple">
                                                            ✨ CUSTOMIZED
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="font-bold text-zinc-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Design Viewer for Customized Items */}
                                    {item.isCustomized && item.designId && (
                                        <DesignViewer designId={item.designId} previewImage={item.previewImage} />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Totals */}
                    <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 space-y-4">
                        <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-2">Summary</h2>
                        <div className="space-y-2 text-sm text-zinc-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{order.itemsPrice?.toFixed(2) || (order.totalAmount - (order.shippingPrice || 0)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹{order.shippingPrice?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between border-t border-zinc-100 pt-2 text-lg font-bold text-zinc-900">
                                <span>Total</span>
                                <span>₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Status and Info */}
                <div className="space-y-6">
                    
                    {/* Management Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 space-y-4">
                        <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-2">Manage Order</h2>
                        <form onSubmit={handleUpdateOrder} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700">Order Status</label>
                                <select name="orderStatus" value={statusData.orderStatus} onChange={handleStatusChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand-purple text-sm">
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="packed">Packed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="out_for_delivery">Out for Delivery</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700">Payment Status</label>
                                <select name="paymentStatus" value={statusData.paymentStatus} onChange={handleStatusChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand-purple text-sm">
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-zinc-100">
                                <h3 className="text-sm font-bold flex items-center gap-2"><Truck className="h-4 w-4"/> Shipping/Tracking</h3>
                                <div className="space-y-1">
                                    <label className="text-xs text-zinc-500">Courier</label>
                                    <input type="text" name="courier" value={statusData.courier} onChange={handleStatusChange} placeholder="e.g. BlueDart" className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm focus:ring-brand-purple" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-zinc-500">Tracking Number</label>
                                    <input type="text" name="trackingNumber" value={statusData.trackingNumber} onChange={handleStatusChange} placeholder="AWB Number" className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm focus:ring-brand-purple" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-zinc-500">Tracking URL</label>
                                    <input type="url" name="trackingUrl" value={statusData.trackingUrl} onChange={handleStatusChange} placeholder="https://..." className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm focus:ring-brand-purple" />
                                </div>
                            </div>

                            <Button type="submit" disabled={updateStatus.isPending} className="w-full gap-2">
                                <Save className="h-4 w-4" />
                                {updateStatus.isPending ? 'Saving...' : 'Save Updates'}
                            </Button>
                        </form>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 space-y-4 text-sm">
                        <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-2">Customer Info</h2>
                        <div className="space-y-1">
                            <p className="font-bold text-zinc-900">{order.user?.name || order.guestContact?.name || order.shippingAddress?.name || 'Guest'}</p>
                            <p className="text-zinc-600">{order.user?.email || order.guestContact?.email}</p>
                            <p className="text-zinc-600">{order.user?.phone || order.guestContact?.phone || order.shippingAddress?.phone}</p>
                            {!order.user && <div className="mt-2 inline-flex rounded-full bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-600">GUEST ORDER</div>}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 space-y-4 text-sm">
                        <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-2">Shipping Address</h2>
                        <div className="space-y-1 text-zinc-600">
                            <p className="font-bold text-zinc-900">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </div>

                    {/* Razorpay Details */}
                    {order.paymentResult && (
                        <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 space-y-4 text-sm">
                            <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-2">Payment Details</h2>
                            <div className="space-y-1 text-zinc-600">
                                <p><span className="font-medium text-zinc-900">Provider:</span> Razorpay</p>
                                {order.paymentResult.razorpay_order_id && (
                                    <p><span className="font-medium text-zinc-900">Order ID:</span> {order.paymentResult.razorpay_order_id}</p>
                                )}
                                {order.paymentResult.razorpay_payment_id && (
                                    <p><span className="font-medium text-zinc-900">Payment ID:</span> {order.paymentResult.razorpay_payment_id}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
