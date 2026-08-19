import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';

export const useMyOrders = () => {
    return useQuery({
        queryKey: ['orders', 'myorders'],
        queryFn: () => apiClient.get('/orders/myorders'),
    });
};

export const useOrderDetails = (id, token = null) => {
    return useQuery({
        queryKey: ['orders', id, token],
        queryFn: () => {
            const url = token ? `/orders/${id}?token=${token}` : `/orders/${id}`;
            return apiClient.get(url);
        },
        enabled: !!id,
    });
};
