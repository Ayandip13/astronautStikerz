'use client';

import { useDashboardStats } from '@/lib/api/hooks/useAdmin';
import { Package, ShoppingCart, DollarSign, Activity } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminDashboard() {
    const { data: stats, isLoading, isError } = useDashboardStats();

    if (isLoading) {
        return <div className="flex h-64 items-center justify-center text-zinc-500">Loading dashboard...</div>;
    }

    if (isError || !stats) {
        return <div className="flex h-64 items-center justify-center text-red-500">Failed to load dashboard statistics.</div>;
    }

    const getImageUrl = (image) => {
        if (!image) return '/placeholder.jpg';
        const url = typeof image === 'string' ? image : image.url;
        if (url && url.startsWith('/uploads')) {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
            return `${baseUrl}${url}`;
        }
        return url || '/placeholder.jpg';
    };

    const statCards = [
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-100',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            subtext: `${stats.pendingOrders} pending`,
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
        },
        {
            title: 'Total Products',
            value: stats.totalProducts,
            subtext: `${stats.activeProducts} active`,
            icon: Package,
            color: 'text-purple-600',
            bg: 'bg-purple-100',
        },
        {
            title: 'Paid Orders',
            value: stats.paidOrders,
            icon: Activity,
            color: 'text-orange-600',
            bg: 'bg-orange-100',
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card, index) => (
                    <div key={index} className="flex items-center rounded-xl bg-white p-6 shadow-sm border border-zinc-100">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${card.bg}`}>
                            <card.icon className={`h-6 w-6 ${card.color}`} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-zinc-500">{card.title}</p>
                            <h3 className="text-2xl font-bold text-zinc-900">{card.value}</h3>
                            {card.subtext && <p className="text-xs font-medium text-zinc-400 mt-1">{card.subtext}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Orders */}
                <div className="rounded-xl bg-white shadow-sm border border-zinc-100 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-zinc-100 p-6">
                        <h2 className="text-lg font-bold text-zinc-900">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm font-medium text-brand-purple hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="p-0">
                        {stats.recentOrders.length === 0 ? (
                            <div className="p-6 text-center text-sm text-zinc-500">No orders yet.</div>
                        ) : (
                            <ul className="divide-y divide-zinc-100">
                                {stats.recentOrders.map((order) => (
                                    <li key={order._id} className="flex items-center justify-between p-4 hover:bg-zinc-50">
                                        <div>
                                            <Link href={`/admin/orders/${order._id}`} className="font-bold text-zinc-900 hover:text-brand-purple">
                                                {order.orderNumber}
                                            </Link>
                                            <p className="text-sm text-zinc-500">{order.user ? order.user.name : order.guestContact?.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-zinc-900">₹{order.totalAmount.toFixed(2)}</p>
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${
                                                order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                                'bg-zinc-100 text-zinc-800'
                                            }`}>
                                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Low Stock */}
                <div className="rounded-xl bg-white shadow-sm border border-zinc-100 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-zinc-100 p-6">
                        <h2 className="text-lg font-bold text-zinc-900">Low Stock Alert</h2>
                        <Link href="/admin/products" className="text-sm font-medium text-brand-purple hover:underline">
                            Manage Inventory
                        </Link>
                    </div>
                    <div className="p-0">
                        {stats.lowStockProducts.length === 0 ? (
                            <div className="p-6 text-center text-sm text-zinc-500">All products are well stocked.</div>
                        ) : (
                            <ul className="divide-y divide-zinc-100">
                                {stats.lowStockProducts.map((product) => (
                                    <li key={product._id} className="flex items-center gap-4 p-4 hover:bg-zinc-50">
                                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 border border-zinc-200">
                                            <Image 
                                                src={getImageUrl(product.images?.[0])} 
                                                alt={product.name} 
                                                fill 
                                                className="object-cover" 
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate font-bold text-zinc-900">{product.name}</p>
                                            <p className="text-sm text-zinc-500">₹{product.price.toFixed(2)}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${
                                                product.stock <= 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {product.stock} left
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
