export type InputType = 'KEYWORD' | 'URL';
export type Platform = 'SHOPEE' | 'LAZADA' | 'ALL';
export type JobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export type ProductSource = 'SHOPEE' | 'LAZADA' | 'TAOBAO';
export type ProductStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  soldCount?: number;
  rating?: number;
  reviewCount?: number;
  shopName?: string;
  shopLocation?: string;
  imageUrl?: string;
  productUrl?: string;
  category?: string;
  specifications?: string;
  description?: string;
  aiAnalysis?: string;
  aiSuggestedPrice?: number;
  aiSummary?: string;
  source: ProductSource;
  status: ProductStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface ScrapeJob {
  id: string;
  inputType: InputType;
  inputValue: string;
  status: JobStatus;
  totalProducts?: number;
  processedProducts?: number;
  failedProducts?: number;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
  progressPercent?: number;
}

export interface DashboardStats {
  totalProducts: number;
  completedProducts: number;
  failedProducts: number;
  totalJobs: number;
}

export interface ScrapeRequest {
  inputType?: InputType;
  inputValue: string;
  maxProducts: number;
  platform: Platform;
}

export interface ProductFilterParams {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  page?: number;
  size?: number;
}
