import axios from 'axios';
import type {
  ApiResponse,
  DashboardStats,
  PageResponse,
  Product,
  ProductFilterParams,
  ScrapeJob,
  ScrapeRequest,
} from '../types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const apiService = {
  // Scrape Jobs
  startScrape: async (request: ScrapeRequest): Promise<ApiResponse<string>> => {
    const res = await apiClient.post<ApiResponse<string>>('/scrape/start', request);
    return res.data;
  },

  getAllJobs: async (): Promise<ApiResponse<ScrapeJob[]>> => {
    const res = await apiClient.get<ApiResponse<ScrapeJob[]>>('/scrape/jobs');
    return res.data;
  },

  getJobById: async (id: string): Promise<ApiResponse<ScrapeJob>> => {
    const res = await apiClient.get<ApiResponse<ScrapeJob>>(`/scrape/jobs/${id}`);
    return res.data;
  },

  // Products
  getProducts: async (params: ProductFilterParams = {}): Promise<ApiResponse<PageResponse<Product>>> => {
    const res = await apiClient.get<ApiResponse<PageResponse<Product>>>('/products', { params });
    return res.data;
  },

  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    const res = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return res.data;
  },

  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.delete<ApiResponse<void>>(`/products/${id}`);
    return res.data;
  },

  getAllCategories: async (): Promise<ApiResponse<string[]>> => {
    const res = await apiClient.get<ApiResponse<string[]>>('/products/categories');
    return res.data;
  },

  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const res = await apiClient.get<ApiResponse<DashboardStats>>('/products/stats');
    return res.data;
  },

  // Export URLs
  getExportUrl: (format: 'csv' | 'excel' = 'csv'): string => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    return `${baseUrl}/products/export?format=${format}`;
  },
};

export default apiService;
