'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import apiClient from '@/lib/api/client';

export default function EditProductPage() {
    const params = useParams();
    const id = params?.id;
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        
        const fetchProduct = async () => {
            try {
                // Find product by id (admin has access via products list)
                // The existing API has getProductBySlug, but we need it by ID or fetch all and find
                // Or we can just use the slug route if we modify it to accept ID, or since we have ID, we might have to use a specific admin endpoint.
                // Wait, there is no getProductById endpoint in productController.js!
                // We'll fetch all products and find it, or we can quickly add getProductById to backend.
                // For now, let's fetch all (limit 1000) and find it. 
                const res = await apiClient.get(`/products?limit=1000`);
                const found = res.products.find(p => p._id === id);
                if (found) {
                    setProduct(found);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                setError('Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-zinc-500">Loading product data...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!product) return null;

    return (
        <div className="pb-12">
            <ProductForm initialData={product} />
        </div>
    );
}
