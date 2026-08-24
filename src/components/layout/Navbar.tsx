import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar: React.FC = () => {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="fixed top-0 left-72 right-0 h-20 bg-background/80 backdrop-blur-md z-40 flex items-center justify-between px-xl shadow-[0_1px_8px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-md" />
      <div className="flex items-center gap-md">
        {/* Language Switcher (VI | EN) */}
        <div className="inline-flex items-center bg-surface-container-high/90 p-0.5 rounded-lg border border-outline-variant/30 shadow-inner">
          <button
            type="button"
            onClick={() => setLang('VI')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              lang === 'VI'
                ? 'bg-surface-container-lowest text-primary shadow-sm ring-1 ring-primary/30'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            VI
          </button>
          <button
            type="button"
            onClick={() => setLang('EN')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              lang === 'EN'
                ? 'bg-surface-container-lowest text-primary shadow-sm ring-1 ring-primary/30'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            EN
          </button>
        </div>

        {/* Global Search */}
        <div className="flex items-center bg-surface-container-low px-md py-xs rounded-full border border-outline-variant/20">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px] mr-sm">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-on-surface placeholder-outline w-40"
            placeholder={t('globalSearch')}
            type="text"
          />
        </div>

        {/* Notifications */}
        <button className="relative text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full ring-2 ring-background" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
