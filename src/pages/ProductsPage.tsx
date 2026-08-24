import React from 'react';
import { Download } from 'lucide-react';
import apiService from '../services/api';

export const ProductsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header with Export buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Kho sản phẩm đã cào</h3>
          <p className="text-xs text-slate-400">Phân tích giá và tóm tắt thông tin bằng Gemini AI</p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={apiService.getExportUrl('csv')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất CSV</span>
          </a>
          <a
            href={apiService.getExportUrl('excel')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel</span>
          </a>
        </div>
      </div>

      {/* Placeholder list */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
        Chưa có sản phẩm nào được lưu. Hãy chạy một tác vụ Scrape đầu tiên!
      </div>
    </div>
  );
};

export default ProductsPage;
