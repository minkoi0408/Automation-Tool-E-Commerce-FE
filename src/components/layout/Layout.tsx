import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const titles: Record<string, string> = {
  '/': 'Tổng quan hệ thống',
  '/scrape': 'Tạo & Theo dõi tác vụ Scrape',
  '/products': 'Danh sách sản phẩm & Phân tích AI',
};

export const Layout: React.FC = () => {
  const location = useLocation();
  const currentTitle = titles[location.pathname] || 'E-Commerce Scraping Tool';

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={currentTitle} />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
