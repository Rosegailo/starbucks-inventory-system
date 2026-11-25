import React from 'react';
import { Plus, LayoutGrid, Home, RefreshCw } from 'lucide-react';
import newLogo from './assets/new_logo.png';

const Navbar = ({ activeView, onViewChange, onOpenCreate, onRefresh, isLoading }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => onViewChange('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-sb-soft flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-200">
              <img
                src=src={newLogo}
                alt="Starbucks Logo"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-gray-900 tracking-tight text-base sm:text-lg">
                  STARBUCKS
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-sb-green text-white">
                  Inventory
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
                Beverage Inventory & Recipe Management System
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold text-gray-600">
              <button
                onClick={() => onViewChange('landing')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeView === 'landing'
                    ? 'bg-white text-sb-green shadow-xs font-bold'
                    : 'hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </button>
              <button
                onClick={() => onViewChange('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeView === 'dashboard'
                    ? 'bg-white text-sb-green shadow-xs font-bold'
                    : 'hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            </nav>

            {/* Refresh Button */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-sb-green hover:bg-gray-100 rounded-xl transition disabled:opacity-50"
                title="Refresh inventory"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sb-green' : ''}`} />
              </button>
            )}

            {/* Add Product Button */}
            <button
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-sb-green hover:bg-sb-hover text-white shadow-sm hover:shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
