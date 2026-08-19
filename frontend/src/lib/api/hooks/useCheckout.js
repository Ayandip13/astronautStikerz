import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: async (orderPayload) => {
            const data = await apiClient.post('/orders/checkout', orderPayload);
            return data;
        },
    });
};

export const useVerifyPayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (paymentDetails) => {
            const data = await apiClient.post('/orders/verify', paymentDetails);
            return data;
        },
        onSuccess: () => {
            // Invalidate relevant queries after successful order
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            // Optionally invalidate user stats if any
        }
    });
};
