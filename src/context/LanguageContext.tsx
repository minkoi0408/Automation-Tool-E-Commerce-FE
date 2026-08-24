import React, { createContext, useContext, useState } from 'react';

export type Language = 'VI' | 'EN';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  VI: {
    // Nav & Sidebar
    dashboard: 'Tổng quan',
    scrape: 'Thu thập dữ liệu',
    products: 'Kho sản phẩm',
    globalSearch: 'Tìm kiếm toàn hệ thống...',
    adminMode: 'Chế độ Quản trị',
    leadArchitect: 'Trưởng nhóm Dự án',

    // Dashboard
    overviewTitle: 'Tổng quan hệ thống',
    overviewDesc: 'Chỉ số thời gian thực và lịch sử thu thập dữ liệu thông minh.',
    createNewJob: 'Tạo tác vụ mới',
    totalProducts: 'Tổng sản phẩm',
    completedScrapes: 'Đã hoàn thành',
    failedScrapes: 'Lỗi / Thất bại',
    totalJobs: 'Tổng số tác vụ',
    recentJobs: 'Tác vụ gần đây',
    targetUrl: 'Mục tiêu / Từ khóa',
    status: 'Trạng thái',
    progress: 'Tiến độ',
    created: 'Thời gian tạo',
    noRecentJobs: 'Chưa có tác vụ nào gần đây.',
    startNewJobHint: 'Bắt đầu một tác vụ cào mới để theo dõi tại đây.',

    // Scrape Page
    dataAcquisitionTitle: 'Thu thập dữ liệu',
    dataAcquisitionDesc: 'Khởi tạo các tác vụ bóc tách dữ liệu chính xác trên các sàn TMĐT.',
    newScrapeJob: 'Tác vụ cào mới',
    inputType: 'Loại đầu vào',
    keywordSearch: 'Tìm kiếm từ khóa',
    directUrl: 'Đường dẫn trực tiếp (URL)',
    searchKeywordLabel: 'Từ khóa tìm kiếm',
    productUrlLabel: 'Đường dẫn sản phẩm (URL)',
    keywordPlaceholder: "Ví dụ: 'áo thun nam', 'giày chạy bộ'...",
    urlPlaceholder: "Ví dụ: 'https://shopee.vn/product/...' hoặc 'https://www.lazada.vn/...'",
    maxProducts: 'Số lượng tối đa',
    platform: 'Nền tảng sàn',
    allPlatforms: 'Tất cả sàn',
    launchJob: 'Khởi chạy tác vụ',
    starting: 'Đang khởi chạy...',
    autoDetectBadge: 'Tự động nhận diện sàn TMĐT và cào chi tiết 1 sản phẩm',
    currentSessionTasks: 'Tác vụ phiên hiện tại',
    clearSession: 'Xóa phiên',
    liveStatusRunning: 'Đang chạy',
    liveStatusReady: 'Sẵn sàng',
    noSessionTasks: 'Chưa có tác vụ nào trong phiên',
    noSessionTasksDesc: 'Nhập từ khóa hoặc dán link sản phẩm ở cột bên trái và bấm "Launch Job" để bắt đầu cào dữ liệu.',
    jobCreatedSuccess: 'Job đã tạo thành công!',
    action: 'Thao tác',
    statusCompleted: 'HOÀN THÀNH',
    statusRunning: 'ĐANG CHẠY',
    statusFailed: 'THẤT BẠI',
    statusPending: 'CHỜ XỬ LÝ',
    errorLabel: 'Lỗi',
    connectionError: 'Không thể kết nối server!',

    // Products Page
    productsCatalog: 'Kho sản phẩm & Phân tích',
    productsCatalogDesc: 'Quản lý và phân tích sản phẩm với báo cáo định giá từ AI Gemini.',
    exportCsv: 'Xuất CSV',
    exportExcel: 'Xuất Excel',
    exportJson: 'Xuất JSON',
    searchPlaceholder: 'Tìm kiếm tên sản phẩm...',
    allCategories: 'Tất cả danh mục',
    category: 'Danh mục',
    priceRange: 'Khoảng giá (VNĐ)',
    minRating: 'Đánh giá tối thiểu',
    anyRating: 'Mọi đánh giá',
    starsAndUp: 'sao trở lên',
    noProductsFound: 'Không tìm thấy sản phẩm nào.',
    noProductsFoundDesc: 'Hãy thử điều chỉnh bộ lọc hoặc tạo một tác vụ cào dữ liệu mới.',
    viewOriginal: 'Xem gốc',
    deleteProduct: 'Xóa sản phẩm',
    confirmDelete: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
    deleteSuccess: 'Đã xóa sản phẩm thành công!',
    aiInsight: 'Đánh giá AI',
    suggestedPrice: 'Giá đề xuất:',
    sold: 'Đã bán',
    shop: 'Gian hàng',
  },
  EN: {
    // Nav & Sidebar
    dashboard: 'Dashboard',
    scrape: 'Data Acquisition',
    products: 'Products Catalog',
    globalSearch: 'Global search...',
    adminMode: 'Admin Mode',
    leadArchitect: 'Lead Architect',

    // Dashboard
    overviewTitle: 'Overview',
    overviewDesc: 'Real-time metrics and recent execution logs for your e-commerce intelligence platform.',
    createNewJob: 'Create New Job',
    totalProducts: 'Total Products',
    completedScrapes: 'Completed Scrapes',
    failedScrapes: 'Failed Scrapes',
    totalJobs: 'Total Jobs',
    recentJobs: 'Recent Jobs',
    targetUrl: 'Target / Keyword',
    status: 'Status',
    progress: 'Progress',
    created: 'Created At',
    noRecentJobs: 'No recent jobs found.',
    startNewJobHint: 'Start a new scrape job to see activity here.',

    // Scrape Page
    dataAcquisitionTitle: 'Data Acquisition',
    dataAcquisitionDesc: 'Initiate precise data extraction jobs across target platforms. Configure parameters below to launch a new scraping instance.',
    newScrapeJob: 'New Scrape Job',
    inputType: 'Input Type',
    keywordSearch: 'Keyword Search',
    directUrl: 'Direct URL',
    searchKeywordLabel: 'Search Keyword',
    productUrlLabel: 'Product URL',
    keywordPlaceholder: "e.g. 'gaming mouse', 'running shoes'...",
    urlPlaceholder: "e.g. 'https://shopee.vn/product/...' or 'https://www.lazada.vn/...'",
    maxProducts: 'Max Products',
    platform: 'Platform',
    allPlatforms: 'All Platforms',
    launchJob: 'Launch Job',
    starting: 'Starting...',
    autoDetectBadge: 'Auto-detects e-commerce platform & extracts 1 item',
    currentSessionTasks: 'Current Session Tasks',
    clearSession: 'Clear Session',
    liveStatusRunning: 'Running',
    liveStatusReady: 'Live Status',
    noSessionTasks: 'No tasks in current session',
    noSessionTasksDesc: 'Enter a keyword or paste a product link on the left and click "Launch Job" to begin.',
    jobCreatedSuccess: 'Scrape job launched successfully!',
    action: 'Action',
    statusCompleted: 'COMPLETED',
    statusRunning: 'RUNNING',
    statusFailed: 'FAILED',
    statusPending: 'PENDING',
    errorLabel: 'Error',
    connectionError: 'Failed to connect to server!',

    // Products Page
    productsCatalog: 'Products Catalog',
    productsCatalogDesc: 'Manage and analyze tracked products with AI insights.',
    exportCsv: 'Export CSV',
    exportExcel: 'Export Excel',
    exportJson: 'Export JSON',
    searchPlaceholder: 'Keywords...',
    allCategories: 'All Categories',
    category: 'Category',
    priceRange: 'Price Range (VND)',
    minRating: 'Min Rating',
    anyRating: 'Any',
    starsAndUp: 'Stars & Up',
    noProductsFound: 'No products found.',
    noProductsFoundDesc: 'Try adjusting your filters or run a scrape job first.',
    viewOriginal: 'View Original',
    deleteProduct: 'Delete Product',
    confirmDelete: 'Are you sure you want to delete this product?',
    deleteSuccess: 'Product deleted successfully!',
    aiInsight: 'AI Insight',
    suggestedPrice: 'Suggested Price:',
    sold: 'Sold',
    shop: 'Shop',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'VI',
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved === 'EN' || saved === 'VI') ? saved : 'VI';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
