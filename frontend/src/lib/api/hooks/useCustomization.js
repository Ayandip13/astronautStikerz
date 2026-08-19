import { useMutation } from '@tanstack/react-query';
import apiClient from '../client';

export const useUploadDesign = () => {
    return useMutation({
        mutationFn: async (formData) => {
            const data = await apiClient.post('/designs', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        },
    });
};

export const useSubmitDesignRequest = () => {
    return useMutation({
        mutationFn: async (requestData) => {
            const data = await apiClient.post('/design-requests', requestData);
            return data;
        },
    });
};
