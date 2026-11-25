import React from 'react';
import { ArrowRight, Plus, PackageCheck, AlertTriangle, Layers, Coffee, Sparkles, Database, ShieldCheck } from 'lucide-react';
import StatsOverview from './StatsOverview';
import newLogo from '../assets/new_logo.png';

const LandingPage = ({ stats, onNavigateDashboard, onOpenCreate, lowStockProducts, onSelectProduct }) => {
  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sb-dark via-[#142A24] to-[#004A31] text-white shadow-xl">
        {/* Subtle decorative background circles */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-sb-green/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-32 w-80 h-80 rounded-full bg-sb-light/10 blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-5 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sb-light text-xs font-semibold tracking-wide border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-sb-gold" />
              <span>Official Partner Inventory Portal</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Starbucks® Beverage & <span className="text-sb-light">Inventory Hub</span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Track handcrafted beverage stock, manage custom drink recipes with the dynamic ingredients builder, and monitor live inventory levels across all store categories.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-2">
              <button
                onClick={onNavigateDashboard}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-sb-dark font-bold text-sm hover:bg-sb-soft hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>Open Inventory Dashboard</span>
                <ArrowRight className="w-4 h-4 text-sb-green" />
              </button>
              <button
                onClick={onOpenCreate}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sb-green/60 hover:bg-sb-green border border-white/20 text-white font-semibold text-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Product</span>
              </button>
            </div>
          </div>

          {/* Starbucks Logo Feature Box */}
          <div className="flex-shrink-0 relative">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-white/15 to-white/5 p-4 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl relative group">
              <div className="absolute inset-2 rounded-full border border-sb-gold/30 animate-pulse pointer-events-none" />
              <img
                src={newLogo}
                alt="Starbucks Siren Logo"
                className="w-36 h-36 sm:w-44 sm:h-44 object-contain filter drop-shadow-xl transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="text-center mt-3">
              <span className="text-[11px] font-semibold text-sb-light tracking-wider uppercase">
                Crafted with Care
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Overview */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Inventory Pulse & Metrics</h2>
            <p className="text-xs text-gray-500">Live operational snapshot from MongoDB</p>
          </div>
          <button
            onClick={onNavigateDashboard}
            className="text-xs font-semibold text-sb-green hover:underline flex items-center gap-1"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <StatsOverview
          stats={stats}
          onFilterStock={() => onNavigateDashboard()}
        />
      </section>

      {/* Spotlight: Low Stock / Urgent Attention */}
      {lowStockProducts && lowStockProducts.length > 0 && (
        <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-sm font-bold">Low Stock & Out of Stock Alerts</h3>
                <p className="text-xs text-amber-700">Immediate inventory restock advised</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-200 text-amber-900">
              {lowStockProducts.length} items flagged
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.slice(0, 6).map((item) => (
              <div
                key={item._id}
                onClick={() => onSelectProduct(item)}
                className="p-3 bg-white rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-sm cursor-pointer transition flex items-center justify-between"
              >
                <div className="truncate pr-2">
                  <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                  <p className="text-[11px] text-gray-500">{item.category} • {item.size}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      item.stock === 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.stock === 0 ? '0 units' : `${item.stock} left`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Highlights / Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-sb-soft flex items-center justify-center text-sb-green">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Dynamic Ingredients Builder</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Easily formulate and adjust custom Starbucks beverage recipes with dynamic ingredients, measurements, and units (shots, oz, pumps, grams).
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <PackageCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Instant Stock Level Adjustments</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Perform 1-click stock updates directly from the dashboard card or high-density table view with automatic status labeling and alerts.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Dataset Ingestion & Seed</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Import existing nutritional and beverage datasets directly into MongoDB using the included Node.js CSV streaming seed script.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
