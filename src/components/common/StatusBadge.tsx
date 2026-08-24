import React from 'react';
import type { JobStatus, ProductSource, ProductStatus } from '../../types';

interface StatusBadgeProps {
  status?: JobStatus | ProductStatus | string;
  source?: ProductSource;
  type?: 'job' | 'product' | 'source';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, source, type = 'job' }) => {
  if (type === 'source' || source) {
    const src = source || status;
    switch (src) {
      case 'SHOPEE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
            Shopee
          </span>
        );
      case 'LAZADA':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Lazada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            {src}
          </span>
        );
    }
  }

  switch (status) {
    case 'RUNNING':
    case 'PROCESSING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          Đang chạy
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Hoàn thành
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Thất bại
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Đang chờ
        </span>
      );
  }
};

export default StatusBadge;
