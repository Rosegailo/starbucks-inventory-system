import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import InventoryDashboard from './components/InventoryDashboard';
import ProductFormModal from './components/ProductFormModal';
import ProductDetailModal from './components/ProductDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import {
  getProducts,
  getInventoryStats,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct
} from './services/api';

function App() {
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'dashboard'
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt_desc');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Submitting states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch Inventory Stats
  const loadStats = useCallback(async () => {
    try {
      const res = await getInventoryStats();
      if (res && res.success) {
        setStats(res.stats);
        if (res.stats.categories) {
          setCategories(res.stats.categories);
        }
      }
    } catch (err) {
      console.warn('Could not load inventory stats:', err.message);
    }
  }, []);

  // Fetch Products based on current filters
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      let sortField = 'createdAt';
      let sortDirection = 'desc';

      if (sortBy === 'name_asc') {
        sortField = 'name';
        sortDirection = 'asc';
      } else if (sortBy === 'name_desc') {
        sortField = 'name';
        sortDirection = 'desc';
      } else if (sortBy === 'price_asc') {
        sortField = 'price';
        sortDirection = 'asc';
      } else if (sortBy === 'price_desc') {
        sortField = 'price';
        sortDirection = 'desc';
      } else if (sortBy === 'stock_asc') {
        sortField = 'stock';
        sortDirection = 'asc';
      } else if (sortBy === 'stock_desc') {
        sortField = 'stock';
        sortDirection = 'desc';
      }

      const params = {
        search: searchQuery || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        sortBy: sortField,
        sortOrder: sortDirection
      };

      const res = await getProducts(params);
      if (res && res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Failed to load products from API:', err.message);
      showToast('Could not connect to backend API. Please make sure the server is running on port 5000.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedStatus, sortBy]);

  // Initial load
  useEffect(() => {
    loadProducts();
    loadStats();
  }, [loadProducts, loadStats]);

  // Debounced search could be used, or useEffect dependency
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('all');
    setSortBy('createdAt_desc');
  };

  // Handle Create or Update
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProduct && editingProduct._id) {
        // Update (PUT)
        const res = await updateProduct(editingProduct._id, formData);
        if (res && res.success) {
          showToast(`Successfully updated "${res.data.name}"!`, 'success');
          setIsFormOpen(false);
          setEditingProduct(null);
          loadProducts();
          loadStats();
        }
      } else {
        // Create (POST)
        const res = await createProduct(formData);
        if (res && res.success) {
          showToast(`Successfully created "${res.data.name}"!`, 'success');
          setIsFormOpen(false);
          loadProducts();
          loadStats();
        }
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Operation failed';
      showToast(`Error: ${errMsg}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete (DELETE)
  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      const res = await deleteProduct(deletingProduct._id);
      if (res && res.success) {
        showToast(`Deleted "${deletingProduct.name}" from inventory.`, 'success');
        setDeletingProduct(null);
        if (detailProduct && detailProduct._id === deletingProduct._id) {
          setDetailProduct(null);
        }
        loadProducts();
        loadStats();
      }
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Quick Stock Adjust (+/-)
  const handleStockAdjust = async (productId, delta) => {
    try {
      const res = await updateProductStock(productId, { delta });
      if (res && res.success) {
        // Update local state immediately for snappy UI
        setProducts((prev) =>
          prev.map((item) => (item._id === productId ? res.data : item))
        );
        if (detailProduct && detailProduct._id === productId) {
          setDetailProduct(res.data);
        }
        loadStats();
      }
    } catch (err) {
      showToast(`Failed to update stock: ${err.message}`, 'error');
    }
  };

  // Filter low stock products for the landing page alert banner
  const lowStockItems = products.filter(
    (p) => p.stock !== undefined && p.stock < 15
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F6]">
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        onViewChange={(view) => setActiveView(view)}
        onOpenCreate={() => {
          setEditingProduct(null);
          setIsFormOpen(true);
        }}
        onRefresh={() => {
          loadProducts();
          loadStats();
          showToast('Inventory refreshed', 'info');
        }}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'landing' ? (
          <LandingPage
            stats={stats}
            onNavigateDashboard={() => setActiveView('dashboard')}
            onOpenCreate={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            lowStockProducts={lowStockItems}
            onSelectProduct={(p) => setDetailProduct(p)}
          />
        ) : (
          <InventoryDashboard
            products={products}
            categories={categories}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onOpenCreate={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            onViewProduct={(p) => setDetailProduct(p)}
            onEditProduct={(p) => {
              setEditingProduct(p);
              setIsFormOpen(true);
            }}
            onDeleteProduct={(p) => setDeletingProduct(p)}
            onStockAdjust={handleStockAdjust}
            onResetFilters={handleResetFilters}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <img src="/new_logo.png" alt="Starbucks" className="w-5 h-5 object-contain" />
            <span className="font-semibold text-gray-700">Starbucks Partner Inventory System</span>
            <span>•</span>
            <span>MERN Stack (MongoDB, Express, React, Node.js)</span>
          </div>
          <p>© {new Date().getFullYear()} Starbucks Coffee Company. Internal Partner Use Only.</p>
        </div>
      </footer>

      {/* Modals */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        isSubmitting={isSubmitting}
      />

      <ProductDetailModal
        isOpen={Boolean(detailProduct)}
        onClose={() => setDetailProduct(null)}
        product={detailProduct}
        onEdit={(p) => {
          setEditingProduct(p);
          setIsFormOpen(true);
        }}
        onDelete={(p) => setDeletingProduct(p)}
        onStockAdjust={handleStockAdjust}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
        product={deletingProduct}
        isDeleting={isDeleting}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
}

export default App;
