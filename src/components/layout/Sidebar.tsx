import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, Package, ShoppingBag, Sparkles } from 'lucide-react';

const navigation = [
  { name: 'Tổng quan', href: '/', icon: LayoutDashboard },
  { name: 'Cào dữ liệu (Scrape)', href: '/scrape', icon: Compass },
  { name: 'Sản phẩm & AI', href: '/products', icon: Package },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
            E-Com Tool <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          </h1>
          <p className="text-[11px] text-slate-400">Scraping & AI Analysis</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 m-4 rounded-xl bg-slate-800/50 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Backend Online
        </div>
        <p className="text-[11px] text-slate-400">Spring Boot :8080</p>
      </div>
    </aside>
  );
};

export default Sidebar;
