import React, { useEffect, useState, useCallback } from 'react';
import apiService from '../services/api';
import type { Product, ProductFilterParams } from '../types';
import { formatVND, formatNumber } from '../utils/format';
import { useLanguage } from '../context/LanguageContext';

const getSourceBadge = (source?: string) => {
  switch (source) {
    case 'SHOPEE':
      return <span className="bg-[#ee4d2d] text-white text-[10px] font-bold px-sm py-[2px] rounded-full">SHOPEE</span>;
    case 'LAZADA':
      return <span className="bg-[#0f146d] text-white text-[10px] font-bold px-sm py-[2px] rounded-full">LAZADA</span>;
    default:
      return <span className="bg-surface-container-highest text-on-surface text-[10px] font-bold px-sm py-[2px] rounded-full">{source}</span>;
  }
};

export const ProductsPage: React.FC = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<ProductFilterParams>({
    keyword: '',
    category: '',
    source: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    page: 0,
    size: 9,
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: ProductFilterParams = { ...filters, page: currentPage };
      const res = await apiService.getProducts(params);
      if (res.success && res.data) {
        setProducts(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch {
      console.warn('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await apiService.getAllCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch {
      console.warn('Failed to fetch categories');
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleFilterChange = (key: keyof ProductFilterParams, value: string | number | undefined) => {
    setCurrentPage(0);
    setFilters(prev => ({ ...prev, [key]: value === '' ? undefined : value }));
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`${t('confirmDelete')}\n"${name}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await apiService.deleteProduct(id);
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch {
      alert('Không thể xóa sản phẩm. Vui lòng thử lại!');
    } finally {
      setDeletingId(null);
    }
  };

  const getPriceDirection = (product: Product) => {
    if (!product.aiSuggestedPrice || !product.price) return null;
    if (product.aiSuggestedPrice < product.price) return { label: 'Lower', color: 'text-[#4ade80]' };
    if (product.aiSuggestedPrice > product.price) return { label: 'Higher', color: 'text-error' };
    return { label: 'Fair', color: 'text-secondary' };
  };

  return (
    <div className="flex flex-col w-full h-full gap-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div className="flex flex-col">
          <h1 className="text-display text-primary">{t('productsCatalog')}</h1>
          <p className="text-body-lg text-on-surface-variant">{t('productsCatalogDesc')}</p>
        </div>
        <div className="flex items-center gap-sm flex-wrap">
          <a
            href={apiService.getExportUrl('csv')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-xs px-md py-sm bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-full transition-colors text-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            {t('exportCsv')}
          </a>
          <a
            href={apiService.getExportUrl('excel')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-xs px-md py-sm bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-full transition-colors text-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">table</span>
            {t('exportExcel')}
          </a>
          <a
            href={apiService.getExportUrl('json')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-xs px-md py-sm bg-primary hover:bg-primary-container hover:text-on-primary-container text-on-primary rounded-full transition-colors text-label-md font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">data_object</span>
            {t('exportJson')}
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-container rounded-xl p-md flex flex-wrap gap-md items-end shadow-md">
        <div className="flex flex-col gap-xs flex-1 min-w-[200px]">
          <label className="text-label-md text-on-surface-variant">{t('searchPlaceholder')}</label>
          <div className="flex items-center bg-surface-container-highest px-md py-sm rounded-lg">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-sm">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-body-md text-on-surface w-full placeholder-on-surface-variant/50"
              placeholder={t('searchPlaceholder')}
              type="text"
              value={filters.keyword || ''}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-xs flex-1 min-w-[150px]">
          <label className="text-label-md text-on-surface-variant">{t('category')}</label>
          <select
            className="bg-surface-container-highest text-on-surface px-md py-sm rounded-lg appearance-none text-body-md focus:ring-0 focus:outline-none cursor-pointer"
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">{t('allCategories')}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-xs flex-1 min-w-[150px]">
          <label className="text-label-md text-on-surface-variant">{t('priceRange')}</label>
          <div className="flex items-center gap-sm">
            <input
              className="bg-surface-container-highest text-on-surface px-sm py-sm rounded-lg w-full text-body-md focus:ring-0 focus:outline-none placeholder-on-surface-variant/50"
              placeholder="Min"
              type="number"
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
            <span className="text-on-surface-variant">-</span>
            <input
              className="bg-surface-container-highest text-on-surface px-sm py-sm rounded-lg w-full text-body-md focus:ring-0 focus:outline-none placeholder-on-surface-variant/50"
              placeholder="Max"
              type="number"
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-xs flex-1 min-w-[110px]">
          <label className="text-label-md text-on-surface-variant">{t('minRating')}</label>
          <select
            className="bg-surface-container-highest text-on-surface px-md py-sm rounded-lg appearance-none text-body-md focus:ring-0 focus:outline-none cursor-pointer"
            onChange={(e) => handleFilterChange('minRating', e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">{t('anyRating')}</option>
            <option value="4">4 {t('starsAndUp')}</option>
            <option value="3">3 {t('starsAndUp')}</option>
          </select>
        </div>

        {/* Lọc theo Nền tảng (Platform / Brand) */}
        <div className="flex flex-col gap-xs flex-1 min-w-[130px]">
          <label className="text-label-md text-on-surface-variant">{t('platform')}</label>
          <select
            className="bg-surface-container-highest text-on-surface px-md py-sm rounded-lg appearance-none text-body-md focus:ring-0 focus:outline-none cursor-pointer"
            value={filters.source || ''}
            onChange={(e) => handleFilterChange('source', e.target.value || undefined)}
          >
            <option value="">{t('allPlatforms')}</option>
            <option value="SHOPEE">Shopee</option>
            <option value="LAZADA">Lazada</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container rounded-xl overflow-hidden flex flex-col shadow-lg animate-pulse">
              <div className="h-48 bg-surface-container-high w-full" />
              <div className="p-md flex flex-col flex-1 gap-sm">
                <div className="h-6 bg-surface-container-highest rounded w-3/4" />
                <div className="h-6 bg-surface-container-highest rounded w-1/2" />
                <div className="h-4 bg-surface-container-highest rounded w-full mt-sm" />
                <div className="h-24 bg-surface-container-highest rounded-lg w-full mt-auto" />
                <div className="h-10 bg-surface-container-highest rounded-lg w-full mt-md" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-surface-container rounded-xl p-xl flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-md opacity-50">inventory_2</span>
          <p className="text-body-lg text-on-surface">{t('noProductsFound')}</p>
          <p className="text-body-md text-on-surface-variant mt-xs">{t('noProductsFoundDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {products.map((product) => {
            const direction = getPriceDirection(product);
            return (
              <div
                key={product.id}
                className="bg-surface-container rounded-xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-shadow group relative"
              >
                {/* Source Badge */}
                <div className="absolute top-md right-md z-10 flex gap-xs">
                  {getSourceBadge(product.source)}
                </div>

                {/* Image */}
                <div className="h-48 relative w-full overflow-hidden bg-surface-container-high">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const parent = (e.target as HTMLElement).parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'absolute inset-0 bg-surface-container-high flex items-center justify-center';
                          fallback.innerHTML = '<span class="material-symbols-outlined text-[48px] text-on-surface-variant opacity-30">image</span>';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-[48px] text-on-surface-variant opacity-30">image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-80 pointer-events-none" />
                </div>

                {/* Content */}
                <div className="p-md flex flex-col flex-1 relative z-10 -mt-md bg-surface-container rounded-t-xl">
                  <h3 className="text-headline-md text-on-surface line-clamp-2 mb-xs">{product.name}</h3>

                  <div className="flex items-center justify-between mb-sm">
                    <span className="text-headline-lg text-tertiary">{formatVND(product.price)}</span>
                    {product.discount && product.discount > 0 && (
                      <span className="text-label-md text-error bg-error/10 px-xs py-[2px] rounded">-{product.discount}%</span>
                    )}
                  </div>

                  <div className="flex items-center gap-md text-label-md text-on-surface-variant mb-md">
                    {product.rating != null && (
                      <>
                        <div className="flex items-center text-[#ffc107]">
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="ml-[2px] text-on-surface">{product.rating}</span>
                        </div>
                        <span>•</span>
                      </>
                    )}
                    {product.soldCount != null && <span>{formatNumber(product.soldCount)} {t('sold')}</span>}
                    {product.shopName && (
                      <>
                        <span>•</span>
                        <span className="truncate">{product.shopName}</span>
                      </>
                    )}
                  </div>

                  {/* AI Insight */}
                  {(product.aiSummary || product.aiSuggestedPrice) && (
                    <div className="mt-auto bg-primary/10 rounded-lg p-sm border border-primary/20 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/20 rounded-full blur-xl" />
                      <div className="flex items-center gap-xs text-primary mb-xs">
                        <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                        <span className="text-label-md font-bold">{t('aiInsight')}</span>
                      </div>
                      {product.aiSummary && (
                        <p className="text-body-md text-on-surface-variant line-clamp-2 mb-xs">{product.aiSummary}</p>
                      )}
                      {product.aiSuggestedPrice != null && direction && (
                        <div className="flex items-center justify-between">
                          <span className="text-label-md text-on-surface-variant">{t('suggestedPrice')}</span>
                          <span className={`text-label-md font-bold ${direction.color}`}>
                            {formatVND(product.aiSuggestedPrice)} ({direction.label})
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions (View Original & Delete) */}
                  <div className="flex items-center gap-xs mt-md">
                    {product.productUrl && (
                      <a
                        href={product.productUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-sm bg-surface-container-highest hover:bg-secondary-container text-on-surface rounded-lg transition-colors text-label-md font-bold flex justify-center items-center gap-xs"
                      >
                        {t('viewOriginal')} <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      disabled={deletingId === product.id}
                      className="px-3 py-sm bg-surface-container-highest hover:bg-error-container/30 text-on-surface-variant hover:text-error rounded-lg transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                      title={t('deleteProduct')}
                    >
                      {deletingId === product.id ? (
                        <span className="material-symbols-outlined text-[18px] animate-spin">autorenew</span>
                      ) : (
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-sm mt-lg">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors disabled:opacity-50 cursor-pointer"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i;
            } else if (currentPage < 3) {
              pageNum = i;
            } else if (currentPage > totalPages - 4) {
              pageNum = totalPages - 5 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-label-md transition-colors cursor-pointer ${
                  pageNum === currentPage
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {pageNum + 1}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors disabled:opacity-50 cursor-pointer"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
