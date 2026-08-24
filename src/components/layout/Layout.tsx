import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface font-sans">
      <Sidebar />
      <div className="pl-72">
        <Navbar />
        <main className="relative pt-20 min-h-screen bg-background p-lg">
          <Outlet />
        </main>
      </div>
      {/* Toast Container */}
      <div className="fixed bottom-xl right-xl z-[100] flex flex-col gap-md" id="toast-container" />
    </div>
  );
};

export default Layout;
