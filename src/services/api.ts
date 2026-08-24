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

// Base URL - sử dụng Vite proxy /api → http://localhost:8080/api
// Hoặc trực tiếp nếu không qua proxy
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60_000,  // 60s vì scrape có thể lâu
});

// ─── Request/Response interceptors (optional debug) ───────────────────────────
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API Error]', err?.response?.status, err?.response?.data ?? err.message);
    return Promise.reject(err);
  }
);

export const apiService = {

  // ── Scrape Jobs ────────────────────────────────────────────────────────────

  /** POST /api/scrape/start → ApiResponse<UUID> */
  startScrape: async (request: ScrapeRequest): Promise<ApiResponse<string>> => {
    const res = await apiClient.post<ApiResponse<string>>('/scrape/start', request);
    return res.data;
  },

  /** GET /api/scrape/jobs → ApiResponse<List<ScrapeJobResponse>> */
  getAllJobs: async (): Promise<ApiResponse<ScrapeJob[]>> => {
    const res = await apiClient.get<ApiResponse<ScrapeJob[]>>('/scrape/jobs');
    return res.data;
  },

  /** GET /api/scrape/jobs/{id} → ApiResponse<ScrapeJobResponse> */
  getJobById: async (id: string): Promise<ApiResponse<ScrapeJob>> => {
    const res = await apiClient.get<ApiResponse<ScrapeJob>>(`/scrape/jobs/${id}`);
    return res.data;
  },

  // ── Products ───────────────────────────────────────────────────────────────

  /**
   * GET /api/products?keyword=&category=&minPrice=&maxPrice=&minRating=&page=&size=
   * → ApiResponse<Page<ProductResponse>>
   */
  getProducts: async (params: ProductFilterParams = {}): Promise<ApiResponse<PageResponse<Product>>> => {
    // Xóa undefined để tránh gửi param rỗng
    const cleanParams: Record<string, string | number> = {};
    (Object.keys(params) as (keyof ProductFilterParams)[]).forEach((key) => {
      const v = params[key];
      if (v !== undefined && v !== '' && v !== null) {
        cleanParams[key] = v as string | number;
      }
    });
    const res = await apiClient.get<ApiResponse<PageResponse<Product>>>('/products', { params: cleanParams });
    return res.data;
  },

  /** GET /api/products/{id} → ApiResponse<ProductResponse> */
  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    const res = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return res.data;
  },

  /** DELETE /api/products/{id} → ApiResponse<Void> */
  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.delete<ApiResponse<void>>(`/products/${id}`);
    return res.data;
  },

  /** GET /api/products/categories → ApiResponse<List<String>> */
  getAllCategories: async (): Promise<ApiResponse<string[]>> => {
    const res = await apiClient.get<ApiResponse<string[]>>('/products/categories');
    return res.data;
  },

  /** GET /api/products/stats → ApiResponse<DashboardStatsResponse> */
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const res = await apiClient.get<ApiResponse<DashboardStats>>('/products/stats');
    return res.data;
  },

  // ── Export (trả về URL để mở tab mới) ────────────────────────────────────

  /** GET /api/products/export?format=csv|excel|json */
  getExportUrl: (format: 'csv' | 'excel' | 'json' = 'csv'): string =>
    `${BASE_URL}/products/export?format=${format}`,
};

export default apiService;
