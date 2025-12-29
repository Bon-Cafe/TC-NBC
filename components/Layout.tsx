
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon, 
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { CATEGORY_CARDS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: { username: string; avatar: string };
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (location.pathname === '/') {
      return;
    }
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            {location.pathname !== '/' && (
              <button 
                onClick={handleBack}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hidden lg:flex items-center gap-1"
              >
                <ChevronLeftIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Back</span>
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <span className="font-bold text-xl text-gray-800">
                <span className="text-orange-500">NBC</span> PORTAL
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pr-4 border-r border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{user.username}</p>
                <p className="text-xs text-gray-500">Training Coordinator</p>
              </div>
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-orange-200 object-cover"
              />
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
              title="Logout"
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
              <span className="hidden sm:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <span className="font-bold text-xl">Navigation</span>
            <button onClick={() => setIsSidebarOpen(false)}>
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-2">
            {CATEGORY_CARDS.map((cat) => (
              <Link
                key={cat.name}
                to={`/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className={`${cat.color} p-1.5 rounded text-white`}>
                   <div className="w-5 h-5">{cat.icon}</div>
                </div>
                <span>{cat.name}</span>
              </Link>
            ))}
          </nav>
          <div className="pt-6 border-t border-gray-700">
             <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-900/30 text-red-400 transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm font-medium">Training-Coordinators | <span className="text-orange-600 font-bold">BON Cafe</span></p>
          <p className="text-gray-400 text-xs mt-1">All rights reserved © 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
