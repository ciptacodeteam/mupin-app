import { fetchProducts, fetchSubCategories } from '@/api/productApi';
import { ProductResponse, SubCategoryResponse } from '@/types/product';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const useProducts = (
  limit: number = 10,
  subCategoryId?: number | null,
) => {
  return useInfiniteQuery<ProductResponse, Error>({
    queryKey: ['products', limit, subCategoryId],
    queryFn: ({ pageParam = 1 }) =>
      fetchProducts(pageParam as number, limit, subCategoryId),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.results.current_page < lastPage.results.last_page) {
        return lastPage.results.current_page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSubCategories = () => {
  return useQuery<SubCategoryResponse, Error>({
    queryKey: ['sub-categories'],
    queryFn: fetchSubCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
