import { api } from '@/lib/api';
import { ProductResponse, SubCategoryResponse } from '@/types/product';

export const fetchProducts = async (
  page: number = 1,
  limit: number = 10,
  subCategoryId?: number | null,
): Promise<ProductResponse> => {
  const params: any = {
    page,
    limit,
  };

  if (subCategoryId) {
    params.sub_category = subCategoryId;
  }

  const { data } = await api.get<ProductResponse>('/products', {
    params,
  });
  return data;
};

export const fetchSubCategories = async (): Promise<SubCategoryResponse> => {
  const { data } = await api.get<SubCategoryResponse>('/sub-categories');
  return data;
};
