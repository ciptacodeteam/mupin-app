export type SearchParamsData = {
  id?: number | string;
  page?: string | number | null;
  limit?: string | number | null;
  slug?: string;
  search?: string;
  sort?: string;
  order?: string;
  fromDate?: string | null;
  toDate?: string | null;
  staffId?: number | null;
  status?: string | number | null;
  [key: string]: TQueryParams;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  address: string;
  status: boolean;
  photo: null;
  total_projects: number;
  total_products: number;
  permissions: string[];
  permission_ids: number[];
  roles: string[];
  role_ids: number[];
  joined_at: string;
  tiktok_username: string;
  instagram_username: string;
  facebook_username: string;
  created_at: string;
  updated_at: string;
};
