import React, { useState } from 'react';
import { Search, Filter, LayoutGrid, List, Plus, SlidersHorizontal, ArrowUpDown, X, Coffee, RefreshCw } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductTable from './ProductTable';

const InventoryDashboard = ({
  products,
  categories,
  isLoading,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  onOpenCreate,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  onStockAdjust,
  onResetFilters
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedStatus !== 'all';

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Inventory Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage recipes, ingredients, and store stock levels in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white text-sb-green shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-white text-sb-green shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Data Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Product Button */}
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sb-green hover:bg-sb-hover text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Beverage</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by beverage name, ingredient, SKU..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sb-green focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sb-green bg-white font-medium"
            >
              <option value="All">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sb-green bg-white font-medium"
            >
              <option value="all">All Stock Levels</option>
              <option value="in_stock">In Stock (15+)</option>
              <option value="low_stock">Low Stock (&lt; 15)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sb-green bg-white font-medium"
            >
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="stock_asc">Stock (Lowest First)</option>
              <option value="stock_desc">Stock (Highest First)</option>
              <option value="createdAt_desc">Newest Added</option>
            </select>
          </div>
        </div>

        {/* Status Filter Chips & Active Filter Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-gray-400 font-medium mr-1">Quick Filters:</span>
            <button
              onClick={() => onStatusChange('all')}
              className={`px-2.5 py-1 rounded-full font-semibold transition ${
                selectedStatus === 'all'
                  ? 'bg-sb-dark text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => onStatusChange('in_stock')}
              className={`px-2.5 py-1 rounded-full font-semibold transition ${
                selectedStatus === 'in_stock'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              In Stock
            </button>
            <button
              onClick={() => onStatusChange('low_stock')}
              className={`px-2.5 py-1 rounded-full font-semibold transition ${
                selectedStatus === 'low_stock'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Low Stock (&lt;15)
            </button>
            <button
              onClick={() => onStatusChange('out_of_stock')}
              className={`px-2.5 py-1 rounded-full font-semibold transition ${
                selectedStatus === 'out_of_stock'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-800 hover:bg-red-100'
              }`}
            >
              Out of Stock (0)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">
              Showing <strong className="text-gray-900">{products.length}</strong> items
            </span>

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="text-sb-green hover:underline font-semibold flex items-center gap-1 ml-2"
              >
                <span>Reset filters</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main View: Loading / Empty / Grid or Table */}
      {isLoading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-sb-green border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-600">Loading Starbucks inventory...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-sb-soft flex items-center justify-center mx-auto text-sb-green">
            <Coffee className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">No Starbucks Products Found</h3>
            <p className="text-xs text-gray-500 mt-1">
              {hasActiveFilters
                ? 'Try broadening your search criteria or resetting filters.'
                : 'Your database is currently empty. Seed the dataset or create your first product.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {hasActiveFilters ? (
              <button
                onClick={onResetFilters}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Reset Filters
              </button>
            ) : null}
            <button
              onClick={onOpenCreate}
              className="px-4 py-2 rounded-xl bg-sb-green text-white text-xs font-semibold hover:bg-sb-hover shadow-sm"
            >
              Add Product
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onView={onViewProduct}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
              onStockAdjust={onStockAdjust}
            />
          ))}
        </div>
      ) : (
        <ProductTable
          products={products}
          onView={onViewProduct}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
          onStockAdjust={onStockAdjust}
        />
      )}
    </div>
  );
};

export default InventoryDashboard;
