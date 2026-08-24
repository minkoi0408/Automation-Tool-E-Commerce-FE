import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ScrapePage from './pages/ScrapePage';
import ProductsPage from './pages/ProductsPage';
import { LanguageProvider } from './context/LanguageContext';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="scrape" element={<ScrapePage />} />
            <Route path="products" element={<ProductsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
