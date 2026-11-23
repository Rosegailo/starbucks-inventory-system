import React from 'react';
import { Eye, Edit2, Trash2, Plus, Minus, Layers, AlertTriangle } from 'lucide-react';

const ProductCard = ({ product, onView, onEdit, onDelete, onStockAdjust }) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 15;

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between overflow-hidden ${
        isOutOfStock
          ? 'border-red-200 bg-red-50/10'
          : isLowStock
          ? 'border-amber-200 bg-amber-50/10'
          : 'border-gray-200 hover:border-sb-green/40'
      }`}
    >
      {/* Top Banner with Category & Status */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sb-soft text-sb-dark border border-sb-light/40 truncate max-w-[170px]">
            {product.category}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
            {product.size || 'Grande'}
          </span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onView(product)}
          className="text-base font-bold text-gray-900 line-clamp-2 hover:text-sb-green cursor-pointer transition min-h-[48px]"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* SKU & Price */}
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-xl font-extrabold text-sb-dark">
            ${product.price ? product.price.toFixed(2) : '0.00'}
          </span>
          <span className="text-[11px] font-mono text-gray-400">
            {product.sku || 'SBX-ITEM'}
          </span>
        </div>

        {/* Dynamic Ingredients Preview Chips */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-1.5 font-medium">
            <Layers className="w-3 h-3 text-sb-green" />
            <span>Ingredients ({product.ingredients?.length || 0}):</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {product.ingredients && product.ingredients.length > 0 ? (
              product.ingredients.slice(0, 3).map((ing, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium"
                >
                  {ing.name} ({ing.amount}{ing.unit ? ` ${ing.unit}` : ''})
                </span>
              ))
            ) : (
              <span className="text-[10px] text-gray-400 italic">No ingredients specified</span>
            )}
            {product.ingredients && product.ingredients.length > 3 && (
              <span className="text-[10px] text-sb-green font-semibold px-1 self-center">
                +{product.ingredients.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stock Management Bar & Actions */}
      <div className="p-4 bg-gray-50/70 border-t border-gray-100 space-y-3">
        {/* Stock Status Badge & Quick +/- adjust */}
        <div className="flex items-center justify-between">
          <div>
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
                <AlertTriangle className="w-3 h-3" /> Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                <AlertTriangle className="w-3 h-3" /> Low: {product.stock} left
              </span>
            ) : (
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                In Stock: {product.stock}
              </span>
            )}
          </div>

          {/* Quick Stock Buttons */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
            <button
              onClick={() => onStockAdjust(product._id, -1)}
              disabled={isOutOfStock}
              className="p-1 rounded text-gray-600 hover:text-black hover:bg-gray-100 disabled:opacity-30 transition"
              title="Quick decrease stock"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold px-1.5 min-w-[20px] text-center text-gray-800">
              {product.stock}
            </span>
            <button
              onClick={() => onStockAdjust(product._id, 1)}
              className="p-1 rounded text-gray-600 hover:text-black hover:bg-gray-100 transition"
              title="Quick increase stock"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Buttons: View, Edit, Delete */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <button
            onClick={() => onView(product)}
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 hover:text-sb-green transition shadow-2xs"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>
          <button
            onClick={() => onEdit(product)}
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-sb-dark bg-white border border-gray-200 hover:border-sb-green hover:bg-sb-soft transition shadow-2xs"
            title="Edit Product"
          >
            <Edit2 className="w-3.5 h-3.5 text-sb-green" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-red-600 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 transition shadow-2xs"
            title="Delete Product"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
