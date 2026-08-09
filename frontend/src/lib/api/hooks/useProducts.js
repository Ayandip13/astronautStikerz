import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await apiClient.get('/products', { params });
      return response; // Assumes response interceptor already extracts data
    },
  });
};

export const useProductBySlug = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      if (!slug) return null;
      const response = await apiClient.get(`/products/slug/${slug}`);
      return response;
    },
    enabled: !!slug,
  });
};
