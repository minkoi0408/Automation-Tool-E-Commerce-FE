import React from 'react';
import { Package, CheckCircle2, XCircle, Layers } from 'lucide-react';
import StatCard from '../components/common/StatCard';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Tổng sản phẩm" value="0" icon={Package} color="blue" />
        <StatCard title="Đã xử lý xong" value="0" icon={CheckCircle2} color="emerald" />
        <StatCard title="Thất bại" value="0" icon={XCircle} color="rose" />
        <StatCard title="Tổng tác vụ" value="0" icon={Layers} color="purple" />
      </div>

      {/* Placeholder Recent Jobs */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4">Tác vụ gần đây</h3>
        <p className="text-sm text-slate-400">Chưa có tác vụ nào.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
