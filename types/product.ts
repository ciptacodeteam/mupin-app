export interface Product {
  id: number;
  contract_id: number | null;
  staff_id: string;
  category_id: string;
  wind_direction_id: string;
  building_condition_id: string;
  project_id: string;
  title: string;
  slug: string;
  address: string;
  description: string | null;
  is_tag: boolean;
  total_units: number;
  status: number;
  price: number;
  map_link: string;
  video_link: string | null;
  sequence: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  garages: number;
  certificate: string;
  soil_area: string;
  land_area: string;
  building_area: string;
  building_size: string;
  electricity: string | null;
  water_source: string;
  floor_plan_image: string;
  show: boolean;
  total_clicks: number;
  longitude: string | null;
  latitude: string | null;
  search_reference: string;
  contract_proof: string | null;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  staff: Staff;
  wind_direction: WindDirection;
  building_condition: BuildingCondition;
  images: ProductImage[];
  category: Category;
  sub_categories: SubCategory[];
}

export interface Staff {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  address: string;
  status: boolean;
  photo: string;
  joined_at: string;
  created_at: string;
  updated_at: string;
  tiktok_username: string | null;
  instagram_username: string | null;
  facebook_username: string | null;
}

export interface WindDirection {
  id: number;
  name: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface BuildingCondition {
  id: number;
  name: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  product_id: string;
  image: string;
  name: string;
  show: boolean;
  sequence: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  pivot: {
    product_id: string;
    sub_category_id: string;
  };
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Pagination {
  current_page: number;
  data: Product[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ProductResponse {
  code: number;
  status: boolean;
  message: string;
  results: Pagination;
}

export interface SubCategoryResponse {
  code: number;
  status: boolean;
  message: string;
  results: SubCategory[];
}
