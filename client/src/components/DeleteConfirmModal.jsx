import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, product, isDeleting }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-2.5 text-red-600">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Delete Product</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-3 space-y-3">
          <p className="text-sm text-gray-600">
            Are you sure you want to permanently delete this item from the Starbucks inventory database?
          </p>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <p className="font-bold text-gray-900 text-sm">{product.name}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <span className="font-medium text-sb-green">{product.category}</span>
              <span>•</span>
              <span>SKU: {product.sku || 'N/A'}</span>
              <span>•</span>
              <span>Stock: {product.stock} units</span>
            </div>
          </div>

          <p className="text-xs text-red-600 font-medium">
            ⚠️ This action cannot be undone and will erase its recipe specifications and sales history.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-md transition flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Product</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
