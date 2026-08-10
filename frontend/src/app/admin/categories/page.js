'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAdminCategories, useUpdateCategory, useDeleteCategory, useCreateCategory } from '@/lib/api/hooks/useAdmin';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminCategories() {
    const { data: categories, isLoading } = useAdminCategories();
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const deleteCategory = useDeleteCategory();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [formError, setFormError] = useState('');

    const handleOpenForm = (category = null) => {
        setFormError('');
        if (category) {
            setEditingId(category._id);
            setFormData({ name: category.name, description: category.description || '' });
        } else {
            setEditingId(null);
            setFormData({ name: '', description: '' });
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ name: '', description: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        
        try {
            const data = {
                ...formData,
                slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            };

            if (editingId) {
                await updateCategory.mutateAsync({ id: editingId, data });
            } else {
                await createCategory.mutateAsync(data);
            }
            handleCloseForm();
        } catch (err) {
            setFormError(err.response?.data?.message || err.message || 'Failed to save category');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category? Products in this category might be affected.')) {
            try {
                await deleteCategory.mutateAsync(id);
            } catch (err) {
                alert(err.response?.data?.message || err.message || 'Failed to delete category');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-zinc-900">Categories</h1>
                <Button onClick={() => handleOpenForm()} className="w-full sm:w-auto flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Category
                </Button>
            </div>

            {/* Category Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
                            <h2 className="text-lg font-bold text-zinc-900">{editingId ? 'Edit Category' : 'Add Category'}</h2>
                            <button onClick={handleCloseForm} className="text-zinc-400 hover:text-zinc-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            {formError && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                                    {formError}
                                </div>
                            )}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700">Category Name *</label>
                                <input 
                                    required 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand-purple" 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700">Description</label>
                                <textarea 
                                    value={formData.description} 
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-brand-purple" 
                                />
                            </div>
                            <div className="pt-2 flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={handleCloseForm}>Cancel</Button>
                                <Button type="submit" disabled={createCategory.isPending || updateCategory.isPending} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    Save
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-4 font-medium">Category Name</th>
                                <th className="px-6 py-4 font-medium">Slug</th>
                                <th className="px-6 py-4 font-medium">Description</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-zinc-900">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-zinc-500">
                                        Loading categories...
                                    </td>
                                </tr>
                            ) : categories?.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-zinc-500">
                                        No categories found.
                                    </td>
                                </tr>
                            ) : (
                                categories?.map((category) => (
                                    <tr key={category._id} className="hover:bg-zinc-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-zinc-900">{category.name}</td>
                                        <td className="px-6 py-4 text-zinc-500">{category.slug}</td>
                                        <td className="px-6 py-4 text-zinc-500 truncate max-w-[300px]">
                                            {category.description || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenForm(category)} className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(category._id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
            </div>
        </div>
    );
}
