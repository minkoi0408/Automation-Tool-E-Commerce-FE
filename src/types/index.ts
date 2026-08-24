// ─── Enums ──────────────────────────────────────────────────────────────────
export type InputType = 'KEYWORD' | 'URL';

// Matches ScrapeRequest.Platform enum in BE
export type Platform = 'SHOPEE' | 'LAZADA' | 'ALL';

// Matches ScrapeJob.JobStatus enum in BE
export type JobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

// Matches Product.ProductSource enum in BE
export type ProductSource = 'SHOPEE' | 'LAZADA' | 'TAOBAO';

// Matches Product.ProductStatus enum in BE
export type ProductStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

// ─── Generic API Wrapper ─────────────────────────────────────────────────────
// Matches ApiResponse<T> in BE
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ─── Spring Data Page ────────────────────────────────────────────────────────
// Matches Spring's Page<T> JSON output
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;         // current page (0-indexed)
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ─── Product ─────────────────────────────────────────────────────────────────
// Matches ProductResponse.java exactly (field names camelCase from Jackson)
export interface Product {
  id: string;                          // UUID → string
  name: string;
  price: number;                       // BigDecimal → number
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
  aiSuggestedPrice?: number;           // BigDecimal → number
  aiSummary?: string;
  source: ProductSource;
  status: ProductStatus;
  createdAt: string;                   // LocalDateTime → ISO string
}

// ─── ScrapeJob ───────────────────────────────────────────────────────────────
// Matches ScrapeJobResponse.java exactly
export interface ScrapeJob {
  id: string;                          // UUID → string
  inputType: InputType;
  inputValue: string;
  status: JobStatus;
  totalProducts?: number;
  processedProducts?: number;
  failedProducts?: number;
  errorMessage?: string;
  createdAt: string;                   // LocalDateTime → ISO string
  completedAt?: string;
  progressPercent?: number;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
// Matches DashboardStatsResponse.java exactly
export interface DashboardStats {
  totalProducts: number;
  completedProducts: number;
  failedProducts: number;
  totalJobs: number;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────
// Matches ScrapeRequest.java
export interface ScrapeRequest {
  inputType?: InputType;
  inputValue: string;
  maxProducts: number;
  platform: Platform;
}

// Matches ProductController @RequestParam params
export interface ProductFilterParams {
  keyword?: string;
  category?: string;
  source?: ProductSource;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  page?: number;
  size?: number;
}
