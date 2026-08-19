import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import useAuthStore from '@/store/authStore';

export const useUser = () => {
    return useQuery({
        queryKey: ['user', 'me'],
        queryFn: async () => {
            if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
                return null;
            }
            try {
                const data = await apiClient.get('/auth/me');
                // Sync with zustand store for legacy compatibility
                useAuthStore.getState().setUser(data);
                return data;
            } catch (error) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                }
                useAuthStore.getState().logout();
                return null;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (credentials) => {
            const data = await apiClient.post('/auth/login', credentials);
            return data;
        },
        onSuccess: (data) => {
            if (data.token && typeof window !== 'undefined') {
                localStorage.setItem('token', data.token);
            }
            useAuthStore.getState().setUser(data.user);
            queryClient.setQueryData(['user', 'me'], data.user);
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userData) => {
            const data = await apiClient.post('/auth/register', userData);
            return data;
        },
        onSuccess: (data) => {
            if (data.token && typeof window !== 'undefined') {
                localStorage.setItem('token', data.token);
            }
            useAuthStore.getState().setUser(data.user);
            queryClient.setQueryData(['user', 'me'], data.user);
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            return apiClient.post('/auth/logout');
        },
        onSuccess: () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
            useAuthStore.getState().logout();
            queryClient.setQueryData(['user', 'me'], null);
            queryClient.clear();
        },
    });
};
