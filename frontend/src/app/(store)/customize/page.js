'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, Sparkles, Filter } from 'lucide-react';
import { useProducts } from '@/lib/api/hooks/useProducts';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { useUploadDesign, useSubmitDesignRequest } from '@/lib/api/hooks/useCustomization';
import { Button } from '@/components/ui/Button';

export default function CustomizeLandingPage() {
    const router = useRouter();
    const [uploadedDesign, setUploadedDesign] = useState(null); // { id, imageUrl }
    const [selectedCategory, setSelectedCategory] = useState('');
    const fileInputRef = useRef(null);

    const { mutateAsync: uploadDesign, isPending: isUploading } = useUploadDesign();
    const uploading = isUploading;
    const { mutateAsync: submitDesignRequest } = useSubmitDesignRequest();

    const { data: productsData, isLoading: loadingProducts } = useProducts({
        customizable: 'true',
        active: 'true',
        category: selectedCategory || undefined,
        limit: 50
    });
    const products = productsData?.products || [];

    const { data: categories } = useCategories();

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Image is too large. Please upload an image smaller than 5MB.");
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert("Invalid file type. Please upload a JPG, PNG, or WEBP image.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await uploadDesign(formData);

            setUploadedDesign({
                id: res._id,
                imageUrl: res.imageUrl
            });
        } catch (error) {
            console.error('Upload error:', error);
            alert("Failed to upload image. Please try again.");
        } finally {
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleCustomizeProduct = (productSlug) => {
        if (!uploadedDesign) return;
        router.push(`/products/${productSlug}/customize?designId=${uploadedDesign.id}`);
    };

    const getImageUrl = (img) => {
        if (!img) return '/placeholder.jpg';
        const url = typeof img === 'string' ? img : img.url;
        if (url && url.startsWith('/uploads')) {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
            return `${baseUrl}${url}`;
        }
        return url || '/placeholder.jpg';
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <div className="bg-[#FAF6EF] border-b border-foreground/5 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center justify-center p-3 bg-brand-yellow/20 rounded-full mb-4">
                        <Sparkles className="w-8 h-8 text-brand-purple" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
                        Make Something <span className="text-brand-purple">Yours</span> ✨
                    </h1>
                    <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto font-medium">
                        Upload your design once and instantly see how it looks on all our customizable products.
                    </p>
                    
                    {!uploadedDesign && (
                        <div className="pt-8">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".jpg,.jpeg,.png,.webp"
                                className="hidden"
                            />
                            <Button 
                                onClick={handleUploadClick}
                                disabled={uploading}
                                size="xl"
                                variant="primary"
                                className="shadow-xl shadow-brand-purple/20 gap-3 rounded-full px-8 py-6 text-lg animate-in fade-in zoom-in duration-300"
                            >
                                {uploading ? (
                                    <><Loader2 className="w-6 h-6 animate-spin" /> Uploading...</>
                                ) : (
                                    <><Upload className="w-6 h-6" /> Upload Your Design</>
                                )}
                            </Button>
                            <p className="mt-4 text-sm text-foreground/50 font-medium">Supports PNG, JPG, WEBP (Max 5MB)</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Uploaded Design Display & Products */}
            {uploadedDesign && (
                <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-12 py-16 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                        
                        {/* Sidebar: Your Design */}
                        <div className="md:w-1/3 lg:w-1/4">
                            <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-sm border border-foreground/5">
                                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 font-display">
                                    Your Artwork
                                </h2>
                                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-50 border border-foreground/5 flex items-center justify-center p-4">
                                    {/* Using regular img for external Cloudinary URL to avoid next/image domain config issues if not configured */}
                                    <img 
                                        src={getImageUrl(uploadedDesign.imageUrl)} 
                                        alt="Your uploaded design" 
                                        className="max-w-full max-h-full object-contain drop-shadow-md"
                                    />
                                </div>
                                <div className="mt-6">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".jpg,.jpeg,.png,.webp"
                                        className="hidden"
                                    />
                                    <Button 
                                        onClick={handleUploadClick}
                                        disabled={uploading}
                                        variant="outline"
                                        className="w-full text-sm font-bold rounded-full"
                                    >
                                        {uploading ? 'Uploading...' : 'Change Artwork'}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-2/3 lg:w-3/4">
                            {/* Request Custom Product Section */}
                            <div className="mb-12 bg-white rounded-3xl p-8 shadow-sm border border-brand-purple/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                    <Sparkles className="w-32 h-32 text-brand-purple" />
                                </div>
                                <div className="relative z-10 max-w-xl">
                                    <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                                        Can't find what you're looking for?
                                    </h3>
                                    <p className="text-foreground/70 mb-6 font-medium">
                                        Send us your design and tell us what you want to make! Our team will review your request and get back to you with a custom quote.
                                    </p>
                                    
                                    <form 
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.target);
                                            const data = {
                                                name: formData.get('name'),
                                                email: formData.get('email'),
                                                phone: formData.get('phone'),
                                                message: formData.get('message'),
                                                designId: uploadedDesign.id
                                            };
                                            
                                            try {
                                                const btn = e.target.querySelector('button[type="submit"]');
                                                btn.disabled = true;
                                                btn.innerHTML = 'Sending...';
                                                
                                                await submitDesignRequest(data);
                                                
                                                alert('Your custom design request has been sent successfully! We will contact you soon.');
                                                e.target.reset();
                                                btn.innerHTML = 'Send Custom Request';
                                                btn.disabled = false;
                                            } catch (err) {
                                                console.error(err);
                                                alert('Failed to send request. Please try again.');
                                                const btn = e.target.querySelector('button[type="submit"]');
                                                btn.innerHTML = 'Send Custom Request';
                                                btn.disabled = false;
                                            }
                                        }}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-foreground mb-1">Name *</label>
                                                <input required type="text" name="name" className="w-full px-4 py-2 rounded-xl border border-foreground/10 focus:border-brand-purple outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-foreground mb-1">Email *</label>
                                                <input required type="email" name="email" className="w-full px-4 py-2 rounded-xl border border-foreground/10 focus:border-brand-purple outline-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-foreground mb-1">Phone (Optional)</label>
                                            <input type="tel" name="phone" className="w-full px-4 py-2 rounded-xl border border-foreground/10 focus:border-brand-purple outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-foreground mb-1">What would you like to make? *</label>
                                            <textarea required name="message" rows="3" placeholder="E.g., I would like a custom mousepad with this design..." className="w-full px-4 py-2 rounded-xl border border-foreground/10 focus:border-brand-purple outline-none resize-none"></textarea>
                                        </div>
                                        <Button type="submit" variant="primary" className="rounded-full px-8 font-bold shadow-md shadow-brand-purple/20">
                                            Send Custom Request
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-foreground/10 pb-6">
                                <h2 className="text-2xl font-display font-bold text-foreground">
                                    See your design on...
                                </h2>
                                
                                {/* Category Filter */}
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-foreground/10 shadow-sm">
                                    <Filter className="w-4 h-4 text-foreground/50" />
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="bg-transparent text-sm font-bold text-foreground focus:outline-none cursor-pointer"
                                    >
                                        <option value="">All Categories</option>
                                        {categories?.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {loadingProducts ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
                                </div>
                            ) : products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product) => {
                                        // Calculate CSS position percentages for the printable area relative to the canvas
                                        const config = product.customizationConfig;
                                        const cWidth = config?.canvasWidth || 800;
                                        const cHeight = config?.canvasHeight || 800;
                                        const pArea = config?.printableArea || { x: cWidth/4, y: cHeight/4, width: cWidth/2, height: cHeight/2 };
                                        
                                        const leftPercent = (pArea.x / cWidth) * 100;
                                        const topPercent = (pArea.y / cHeight) * 100;
                                        const widthPercent = (pArea.width / cWidth) * 100;
                                        const heightPercent = (pArea.height / cHeight) * 100;

                                        return (
                                            <div key={product._id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-foreground/5 flex flex-col group hover:shadow-lg transition-shadow">
                                                {/* Live Preview Area */}
                                                <div className="relative aspect-square w-full bg-zinc-50 overflow-hidden">
                                                    {product.images?.[0] && (
                                                        <img 
                                                            src={getImageUrl(product.images[0])} 
                                                            alt={product.name} 
                                                            className="w-full h-full object-contain" 
                                                        />
                                                    )}
                                                    
                                                    {/* The Magic: CSS Placement of Artwork */}
                                                    <div 
                                                        className="absolute flex items-center justify-center overflow-hidden mix-blend-multiply"
                                                        style={{
                                                            left: `${leftPercent}%`,
                                                            top: `${topPercent}%`,
                                                            width: `${widthPercent}%`,
                                                            height: `${heightPercent}%`,
                                                        }}
                                                    >
                                                        <img 
                                                            src={getImageUrl(uploadedDesign.imageUrl)} 
                                                            alt="Artwork applied" 
                                                            className="max-w-full max-h-full object-contain"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="p-6 flex flex-col flex-1 text-center">
                                                    <h3 className="font-bold font-display text-lg text-foreground mb-1 line-clamp-1">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-brand-purple font-bold mb-6">
                                                        ₹{product.price.toFixed(2)}
                                                    </p>
                                                    <div className="mt-auto">
                                                        <Button 
                                                            onClick={() => handleCustomizeProduct(product.slug)}
                                                            className="w-full rounded-full font-bold shadow-md"
                                                        >
                                                            Customize This ✨
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-foreground/10">
                                    <p className="text-foreground/50 font-bold text-lg mb-2">No customizable products found in this category.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
