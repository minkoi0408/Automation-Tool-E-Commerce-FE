import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const Sidebar: React.FC = () => {
  const { t } = useLanguage();

  const navigation = [
    { name: t('dashboard'), href: '/', icon: 'dashboard' },
    { name: t('scrape'), href: '/scrape', icon: 'search' },
    { name: t('products'), href: '/products', icon: 'shopping_bag' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col border-r border-outline-variant/20 shadow-xl">
      {/* Brand */}
      <div className="h-20 flex items-center px-lg border-b border-outline-variant/10">
        <span className="text-xl font-semibold flex items-center gap-sm text-primary">
          <span className="material-symbols-outlined text-primary">shopping_cart</span>
          E-Commerce Tool
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-lg px-md space-y-xs">
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              `group flex items-center px-md py-sm rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_0_15px_rgba(77,142,255,0.3)]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`
            }
          >
            <span className="material-symbols-outlined mr-md">{item.icon}</span>
            <span className="text-label-md">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-lg border-t border-outline-variant/10">
        <div className="flex items-center gap-md">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-on-surface">{t('leadArchitect')}</span>
            <span className="text-xs text-on-surface-variant">{t('adminMode')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
