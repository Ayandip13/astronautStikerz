'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminProducts, useUpdateProduct, useDeleteProduct } from '@/lib/api/hooks/useAdmin';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminProducts() {
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const limit = 12;

    const { data, isLoading } = useAdminProducts(page, limit, { keyword });
    const updateProduct = useUpdateProduct();
    const deleteProduct = useDeleteProduct();

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

    const handleSearch = (e) => {
        e.preventDefault();
        setKeyword(searchInput);
        setPage(1);
    };

    const toggleActive = (product) => {
        updateProduct.mutate({
            id: product._id,
            data: { active: !product.active }
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            deleteProduct.mutate(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-zinc-900">Products</h1>
                <Link href="/admin/products/new">
                    <Button className="w-full sm:w-auto flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-zinc-100">
                <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent text-sm"
                    />
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-4 font-medium">Product</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Price</th>
                                <th className="px-6 py-4 font-medium">Stock</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Customizable</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-zinc-900">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-zinc-500">
                                        Loading products...
                                    </td>
                                </tr>
                            ) : data?.products?.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-zinc-500">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                data?.products?.map((product) => (
                                    <tr key={product._id} className="hover:bg-zinc-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 border border-zinc-200">
                                                    <Image
                                                        src={getImageUrl(product.images?.[0])}
                                                        alt={product.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-900 truncate max-w-[200px]">{product.name}</p>
                                                    <p className="text-xs text-zinc-500">SKU: {product.sku || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
                                                {product.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">₹{product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                                product.stock <= 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleActive(product)}
                                                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 ${
                                                    product.active ? 'bg-brand-purple' : 'bg-zinc-200'
                                                }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                        product.active ? 'translate-x-4' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.customizable ? (
                                                <span className="text-brand-purple font-bold">Yes ✨</span>
                                            ) : (
                                                <span className="text-zinc-400">No</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/products/${product.slug}`} target="_blank" className="p-2 text-zinc-400 hover:text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-colors">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link href={`/admin/products/${product._id}/edit`} className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(product._id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
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
