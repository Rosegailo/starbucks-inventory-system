import React from 'react';
import { X, Coffee, Tag, Package, Sparkles, Flame, Zap, Droplet, Edit, Trash2, Plus, Minus } from 'lucide-react';

const ProductDetailModal = ({ isOpen, onClose, product, onEdit, onDelete, onStockAdjust }) => {
  if (!isOpen || !product) return null;

  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
          Out of Stock
        </span>
      );
    }
    if (stock < 15) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          Low Stock ({stock} left)
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        In Stock ({stock} units)
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in my-8">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-sb-dark to-sb-green p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-lg bg-black/20 hover:bg-black/30 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner flex-shrink-0">
              <img src="/logo.png" alt="Starbucks" className="w-10 h-10 object-contain drop-shadow" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-sm">
                  {product.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sb-light/30 text-sb-light">
                  {product.size || 'Grande'}
                </span>
                {product.sku && (
                  <span className="text-[11px] font-mono text-white/70 tracking-wider">
                    SKU: {product.sku}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-extrabold text-white leading-tight">
                {product.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Price & Stock Overview Box */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-sb-soft/50 border border-sb-light/50">
            <div>
              <span className="text-xs text-gray-500 font-medium">Retail Price</span>
              <p className="text-2xl font-black text-sb-dark mt-0.5">
                ${product.price ? product.price.toFixed(2) : '0.00'}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium">Inventory Stock</span>
              <div className="flex items-center gap-2 mt-1">
                {getStockBadge(product.stock)}
              </div>
            </div>
          </div>

          {/* Quick Stock Adjustment */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-xs font-semibold text-gray-700">Quick Stock Adjustment:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onStockAdjust(product._id, -1)}
                disabled={product.stock <= 0}
                className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center font-bold text-gray-700 shadow-sm transition"
                title="Decrease stock by 1"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm px-2 text-gray-800">{product.stock}</span>
              <button
                type="button"
                onClick={() => onStockAdjust(product._id, 1)}
                className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 shadow-sm transition"
                title="Increase stock by 1"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Recipe Overview
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                {product.description}
              </p>
            </div>
          )}

          {/* Dynamic Ingredients List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sb-green" />
                Required Ingredients & Formulation ({product.ingredients?.length || 0})
              </h4>
            </div>

            {product.ingredients && product.ingredients.length > 0 ? (
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-white">
                {product.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-sm">
                    <span className="font-medium text-gray-800">{ing.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sb-soft text-sb-dark border border-sb-light/40">
                      {ing.amount} {ing.unit}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No specific ingredients logged for this item.</p>
            )}
          </div>

          {/* Nutrition Facts */}
          {product.nutrition && (
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Nutritional Profile
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                  <Flame className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Calories</span>
                  <p className="text-sm font-bold text-gray-800">{product.nutrition.calories || 0}</p>
                </div>
                <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100">
                  <Zap className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Caffeine</span>
                  <p className="text-sm font-bold text-gray-800">{product.nutrition.caffeine || '0'} mg</p>
                </div>
                <div className="p-2.5 bg-pink-50 rounded-xl border border-pink-100">
                  <Droplet className="w-4 h-4 text-pink-600 mx-auto mb-1" />
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Sugars</span>
                  <p className="text-sm font-bold text-gray-800">{product.nutrition.sugars || 0} g</p>
                </div>
                <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                  <Tag className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Total Fat</span>
                  <p className="text-sm font-bold text-gray-800">{product.nutrition.fat || 0} g</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(product);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete Beverage
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sb-green hover:bg-sb-hover rounded-xl shadow-sm transition"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Beverage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
