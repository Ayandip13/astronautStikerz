import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';

// ---------------------------------------------------------
// Dashboard Stats
// ---------------------------------------------------------
export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: () => apiClient.get('/admin/stats'),
    });
};

// ---------------------------------------------------------
// Orders
// ---------------------------------------------------------
export const useAdminOrders = (page = 1, limit = 12, filters = {}) => {
    const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
    }).toString();

    return useQuery({
        queryKey: ['admin', 'orders', page, limit, filters],
        queryFn: () => apiClient.get(`/orders?${queryParams}`),
        keepPreviousData: true,
    });
};

export const useAdminOrderDetails = (id) => {
    return useQuery({
        queryKey: ['admin', 'orders', id],
        queryFn: () => apiClient.get(`/orders/${id}`),
        enabled: !!id,
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }) => apiClient.put(`/orders/${id}/status`, updates),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
        },
    });
};

// ---------------------------------------------------------
// Products
// ---------------------------------------------------------
export const useAdminProducts = (page = 1, limit = 12, filters = {}) => {
    const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
    }).toString();

    return useQuery({
        queryKey: ['admin', 'products', page, limit, filters],
        queryFn: () => apiClient.get(`/products?${queryParams}`),
        keepPreviousData: true,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => apiClient.post('/products', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiClient.put(`/products/${id}`, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', data.slug] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiClient.delete(`/products/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
        },
    });
};

// ---------------------------------------------------------
// Categories
// ---------------------------------------------------------
export const useAdminCategories = () => {
    return useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: () => apiClient.get('/categories'),
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => apiClient.post('/categories', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiClient.put(`/categories/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiClient.delete(`/categories/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

// ---------------------------------------------------------
// Designs (Admin)
// ---------------------------------------------------------
// Note: Backend getDesignById is protected. We will reuse it if the admin has authorization.
// In backend, getDesignById checks user ownership. Let's make sure admin can fetch it.
export const useAdminDesignDetails = (id) => {
    return useQuery({
        queryKey: ['admin', 'designs', id],
        queryFn: () => apiClient.get(`/designs/${id}`),
        enabled: !!id,
    });
};
