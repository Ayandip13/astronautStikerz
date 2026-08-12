'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminOrders } from '@/lib/api/hooks/useAdmin';
import { Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminOrders() {
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    const limit = 12;

    const { data, isLoading } = useAdminOrders(page, limit, { keyword, paymentStatus, orderStatus });

    const handleSearch = (e) => {
        e.preventDefault();
        setKeyword(searchInput);
        setPage(1);
    };

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-zinc-900">Orders</h1>

            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-zinc-100">
                <form onSubmit={handleSearch} className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search order number..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple text-sm"
                    />
                </form>
                <div className="flex gap-4">
                    <select
                        value={paymentStatus}
                        onChange={handleFilterChange(setPaymentStatus)}
                        className="px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple text-sm"
                    >
                        <option value="">All Payments</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                    </select>
                    <select
                        value={orderStatus}
                        onChange={handleFilterChange(setOrderStatus)}
                        className="px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple text-sm"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Payment</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-zinc-900">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-zinc-500">
                                        Loading orders...
                                    </td>
                                </tr>
                            ) : data?.orders?.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-zinc-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                data?.orders?.map((order) => (
                                    <tr key={order._id} className="hover:bg-zinc-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-zinc-900">{order.orderNumber}</td>
                                        <td className="px-6 py-4 text-zinc-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium">{order.user ? order.user.name : (order.guestContact?.name || order.guestContact?.email || 'Guest')}</p>
                                            {!order.user && <p className="text-xs text-zinc-400">Guest Order</p>}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-zinc-900">₹{order.totalAmount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                                order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.paymentStatus.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                                order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                order.orderStatus === 'packed' ? 'bg-indigo-100 text-indigo-800' :
                                                order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                                order.orderStatus === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                                                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-zinc-100 text-zinc-800'
                                            }`}>
                                                {order.orderStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/orders/${order._id}`}>
                                                <button className="p-2 text-zinc-400 hover:text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-colors">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data?.pages > 1 && (
                    <div className="flex items-center justify-between border-t border-zinc-200 bg-white px-6 py-3">
                        <p className="text-sm text-zinc-700">
                            Showing page <span className="font-bold">{page}</span> of <span className="font-bold">{data.pages}</span>
                        </p>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                                disabled={page === data.pages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
