import React from 'react';
import { Eye, Edit2, Trash2, Plus, Minus, AlertTriangle, Layers } from 'lucide-react';

const ProductTable = ({ products, onView, onEdit, onDelete, onStockAdjust }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Product & Recipe</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Size</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Stock Level</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Ingredients</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500 text-sm">
                  No Starbucks beverages match your criteria.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isOutOfStock = product.stock <= 0;
                const isLowStock = product.stock > 0 && product.stock < 15;

                return (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50/80 transition group"
                  >
                    {/* Name & SKU */}
                    <td className="py-3.5 px-4">
                      <div>
                        <button
                          onClick={() => onView(product)}
                          className="font-bold text-gray-900 hover:text-sb-green transition text-left"
                        >
                          {product.name}
                        </button>
                        <div className="text-[11px] font-mono text-gray-400 mt-0.5">
                          SKU: {product.sku || 'N/A'}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sb-soft text-sb-dark border border-sb-light/30">
                        {product.category}
                      </span>
                    </td>

                    {/* Size */}
                    <td className="py-3.5 px-4 text-xs font-medium text-gray-600">
                      {product.size || 'Grande'}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      ${product.price ? product.price.toFixed(2) : '0.00'}
                    </td>

                    {/* Stock with quick buttons */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onStockAdjust(product._id, -1)}
                          disabled={isOutOfStock}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center disabled:opacity-30 transition"
                          title="Decrease stock"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-gray-900">
                          {product.stock}
                        </span>
                        <button
                          onClick={() => onStockAdjust(product._id, 1)}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center transition"
                          title="Increase stock"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          <AlertTriangle className="w-3 h-3" /> Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3" /> Low Stock ({product.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          In Stock
                        </span>
                      )}
                    </td>

                    {/* Ingredients summary */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Layers className="w-3.5 h-3.5 text-sb-green flex-shrink-0" />
                        <span className="truncate max-w-[140px]" title={product.ingredients?.map(i => `${i.name} (${i.amount} ${i.unit})`).join(', ')}>
                          {product.ingredients?.length || 0} ingredients
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onView(product)}
                          className="p-1.5 text-gray-500 hover:text-sb-green hover:bg-gray-100 rounded-lg transition"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(product)}
                          className="p-1.5 text-gray-500 hover:text-sb-dark hover:bg-sb-soft rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(product)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
