'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCreateProduct, useUpdateProduct, useAdminCategories } from '@/lib/api/hooks/useAdmin';
import apiClient from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Upload, X, Save, ArrowLeft, Info, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export function ProductForm({ initialData = null }) {
    const router = useRouter();
    const isEdit = !!initialData;
    const { data: categories } = useAdminCategories();

    const createProduct = useCreateProduct();
    const updateProduct = useUpdateProduct();

    const [formData, setFormData] = useState(() => {
        if (initialData) {
            return {
                ...initialData,
                category: initialData.category?._id || initialData.category || '',
                customizationConfig: initialData.customizationConfig || {
                    canvasWidth: 800, canvasHeight: 800,
                    printableArea: { x: 100, y: 100, width: 600, height: 600 },
                    maxImageSizeMB: 5, allowedFormats: ['image/jpeg', 'image/png'],
                    allowImageUpload: true, allowText: true, allowResize: true, allowRotation: true
                }
            };
        }
        return {
            name: '',
            description: '',
            price: '',
            compareAtPrice: '',
            sku: '',
            category: '',
            stock: '',
            active: true,
            featured: false,
            customizable: false,
            customizationConfig: {
                canvasWidth: 800,
                canvasHeight: 800,
                printableArea: { x: 100, y: 100, width: 600, height: 600 },
                maxImageSizeMB: 5,
                allowedFormats: ['image/jpeg', 'image/png'],
                allowImageUpload: true,
                allowText: true,
                allowResize: true,
                allowRotation: true
            }
        };
    });

    const [images, setImages] = useState(() => {
        if (initialData?.images) {
            return initialData.images.map(img => typeof img === 'string' ? { url: img } : img);
        }
        return [];
    });

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
    const fileInputRef = useRef(null);
    const previewCanvasRef = useRef(null);

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

    // Visual Preview for Printable Area
    useEffect(() => {
        if (formData.customizable && previewCanvasRef.current && images.length > 0) {
            const canvas = previewCanvasRef.current;
            const ctx = canvas.getContext('2d');
            const cw = formData.customizationConfig.canvasWidth;
            const ch = formData.customizationConfig.canvasHeight;
            const pa = formData.customizationConfig.printableArea;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw product image
            const img = new window.Image();
            img.src = getImageUrl(images[0]);
            img.onload = () => {
                // Scale calculations
                const scaleX = canvas.width / cw;
                const scaleY = canvas.height / ch;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Draw printable area box
                ctx.strokeStyle = '#a855f7'; // brand-purple
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(pa.x * scaleX, pa.y * scaleY, pa.width * scaleX, pa.height * scaleY);

                // Add label
                ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
                ctx.fillRect(pa.x * scaleX, pa.y * scaleY, pa.width * scaleX, pa.height * scaleY);

                ctx.fillStyle = '#a855f7';
                ctx.font = '12px sans-serif';
                ctx.setLineDash([]);
                ctx.fillText('Printable Area', (pa.x * scaleX) + 5, (pa.y * scaleY) + 15);
            };
        }
    }, [formData.customizable, formData.customizationConfig, images]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleConfigChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            customizationConfig: {
                ...prev.customizationConfig,
                [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
            }
        }));
    };

    const handlePrintableAreaChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            customizationConfig: {
                ...prev.customizationConfig,
                printableArea: {
                    ...prev.customizationConfig.printableArea,
                    [name]: Number(value)
                }
            }
        }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        setError('');

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('folder', 'products');

                const res = await apiClient.post('/upload', formData);
                
                return res;
            });

            const uploadedImages = await Promise.all(uploadPromises);
            setImages(prev => [...prev, ...uploadedImages]);
        } catch (err) {
            console.error('Upload error details:', err);
            const errorMessage = err?.response?.data?.message || err?.message || JSON.stringify(err) || 'Failed to upload image';
            setError(`Upload failed: ${errorMessage}`);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        setError('');

        if (images.length === 0) {
            setError('At least one product image is required');
            return;
        }

        // If not featured and user hasn't explicitly confirmed this yet
        if (!formData.featured && e !== 'confirmed') {
            setIsFeatureModalOpen(true);
            return;
        }

        const submitData = {
            ...formData,
            images: images.map(img => img.url),
            price: Number(formData.price),
            stock: Number(formData.stock),
            compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
            // Generate a slug if new product and no slug exists (in real life, maybe editable)
            slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        };

        try {
            if (isEdit) {
                await updateProduct.mutateAsync({ id: initialData._id, data: submitData });
            } else {
                await createProduct.mutateAsync(submitData);
            }
            router.push('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to save product');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-zinc-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
                </div>
                <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending || uploading} className="gap-2">
                    <Save className="h-4 w-4" />
                    {isEdit ? 'Save Changes' : 'Create Product'}
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 space-y-4">
                        <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-2">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700">Product Name *</label>
                                <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700">Category *</label>
                                <select required name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent">
                                    <option value="">Select Category</option>
                                    {categories?.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-zinc-700">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700">Price (₹) *</label>
                                <input type="number" required min="0" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand-purple" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700">Compare-At Price (₹)</label>
                                <input type="number" min="0" step="0.01" name="compareAtPrice" value={formData.compareAtPrice} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand-purple" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700">Stock *</label>
                                <input type="number" required min="0" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand-purple" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-zinc-700">Stock Keeping Unit (SKU)</label>
                            <input name="sku" value={formData.sku} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand-purple" />
                        </div>
                    </div>

                    {/* Customization */}
                    <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                            <h2 className="text-lg font-bold text-zinc-900">Customization ✨</h2>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-sm font-medium text-zinc-700">Allow Customization</span>
                                <input type="checkbox" name="customizable" checked={formData.customizable} onChange={handleChange} className="w-4 h-4 text-brand-purple border-zinc-300 rounded focus:ring-brand-purple" />
                            </label>
                        </div>

                        {formData.customizable && (
                            <div className="space-y-6 pt-2">
                                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 text-sm">
                                    <Info className="h-5 w-5 shrink-0 mt-0.5" />
                                    <p>Configure the canvas and printable area. These values represent the virtual canvas the customer will see in the editor. Ensure the Printable Area fits within the Canvas Dimensions.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-zinc-700">Canvas Dimensions</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-zinc-500">Width (px)</label>
                                                <input type="number" name="canvasWidth" value={formData.customizationConfig.canvasWidth} onChange={handleConfigChange} className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm focus:ring-brand-purple" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-zinc-500">Height (px)</label>
                                                <input type="number" name="canvasHeight" value={formData.customizationConfig.canvasHeight} onChange={handleConfigChange} className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm focus:ring-brand-purple" />
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-zinc-700 pt-2">Printable Area</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-zinc-500">Offset X (px)</label>
                                                <input type="number" name="x" value={formData.customizationConfig.printableArea.x} onChange={handlePrintableAreaChange} className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm focus:ring-brand-purple" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-zinc-500">Offset Y (px)</label>
                                                <input type="number" name="y" value={formData.customizationConfig.printableArea.y} onChange={handlePrintableAreaChange} className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm focus:ring-brand-purple" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-zinc-500">Width (px)</label>
                                                <input type="number" name="width" value={formData.customizationConfig.printableArea.width} onChange={handlePrintableAreaChange} className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm focus:ring-brand-purple" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-zinc-500">Height (px)</label>
                                                <input type="number" name="height" value={formData.customizationConfig.printableArea.height} onChange={handlePrintableAreaChange} className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm focus:ring-brand-purple" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-zinc-700 mb-2">Visual Preview</h3>
                                        {images.length > 0 ? (
                                            <div className="border border-zinc-200 rounded-lg bg-zinc-50 flex items-center justify-center p-2">
                                                {/* Draw canvas at a fixed preview size e.g. 300x300 */}
                                                <canvas
                                                    ref={previewCanvasRef}
                                                    width={300}
                                                    height={300 * (formData.customizationConfig.canvasHeight / formData.customizationConfig.canvasWidth)}
                                                    className="max-w-full bg-white shadow-sm"
                                                />
                                            </div>
                                        ) : (
                                            <div className="border border-dashed border-zinc-300 rounded-lg h-48 flex items-center justify-center text-zinc-500 text-sm">
                                                Upload a product image to see preview
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Media & Visibility */}
                <div className="space-y-6">
                    {/* Visibility */}
                    <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 space-y-4">
                        <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-2">Visibility</h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-4 h-4 text-brand-purple border-zinc-300 rounded focus:ring-brand-purple" />
                                <span className="text-sm font-medium text-zinc-700">Active (Visible on store)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 text-brand-purple border-zinc-300 rounded focus:ring-brand-purple" />
                                <span className="text-sm font-medium text-zinc-700">Featured (Show on homepage)</span>
                            </label>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                            <h2 className="text-lg font-bold text-zinc-900">Images *</h2>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="text-sm font-bold text-brand-purple hover:text-brand-purple/80"
                            >
                                {uploading ? 'Uploading...' : 'Add Images'}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                multiple
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                            />
                        </div>

                        {images.length === 0 ? (
                            <div className="border-2 border-dashed border-zinc-200 rounded-lg p-8 flex flex-col items-center justify-center text-zinc-500">
                                <Upload className="h-8 w-8 mb-2 opacity-50" />
                                <p className="text-sm">No images uploaded</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg border border-zinc-200 overflow-hidden group">
                                        <img src={getImageUrl(img)} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                        {idx === 0 && (
                                            <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold rounded">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Feature Confirmation Modal */}
            {isFeatureModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFeatureModalOpen(false)} />
                    <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-zinc-100">
                        <div className="mb-6 flex flex-col items-center text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h3 className="font-display text-xl font-bold text-zinc-900">Not Featured on Homescreen</h3>
                            <p className="mt-2 text-sm text-zinc-500">
                                You are about to save this product without featuring it on the homescreen. 
                                It will still be available in the main shop, but won&apos;t appear in the hero or featured sections. 
                                Is this what you intended?
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                type="button"
                                onClick={() => {
                                    setIsFeatureModalOpen(false);
                                    // User wants to go back and check the box
                                }}
                                className="flex-1 rounded-xl border border-zinc-200 bg-white py-2.5 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50"
                            >
                                Let me change it
                            </button>
                            <button 
                                type="button"
                                onClick={() => {
                                    setIsFeatureModalOpen(false);
                                    handleSubmit('confirmed');
                                }}
                                className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-600 shadow-sm"
                            >
                                Yes, Save Anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
