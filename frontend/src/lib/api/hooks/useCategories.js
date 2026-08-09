import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get('/categories');
      return response; 
    },
  });
};

export const useCategoryBySlug = (slug) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      if (!slug) return null;
      const response = await apiClient.get(`/categories/slug/${slug}`);
      return response;
    },
    enabled: !!slug,
  });
};
