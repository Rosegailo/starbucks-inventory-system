import React, { useState, useEffect } from 'react';
import { X, Coffee, Layers, DollarSign, Package, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import IngredientsBuilder from './IngredientsBuilder';

const DEFAULT_CATEGORIES = [
  'Coffee',
  'Classic Espresso Drinks',
  'Signature Espresso Drinks',
  'Frappuccino® Blended Coffee',
  'Frappuccino® Light Blended Coffee',
  'Frappuccino® Blended Crème',
  'Shaken Iced Beverages',
  'Tazo® Tea Drinks',
  'Bakery & Food'
];

const SIZES = ['Short (8 oz)', 'Tall (12 oz)', 'Grande (16 oz)', 'Venti (20/24 oz)'];

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Classic Espresso Drinks',
    customCategory: '',
    size: 'Grande',
    price: 4.95,
    stock: 25,
    sku: '',
    description: '',
    ingredients: [
      { name: 'Espresso Roast', amount: '2', unit: 'shots' },
      { name: 'Steamed 2% Milk', amount: '12', unit: 'oz' }
    ],
    nutrition: {
      calories: 150,
      caffeine: '75',
      sugars: 14,
      fat: 6
    }
  });

  const [showNutrition, setShowNutrition] = useState(false);
  const isEditing = Boolean(initialData && initialData._id);

  useEffect(() => {
    if (initialData) {
      const isCustomCat = !DEFAULT_CATEGORIES.includes(initialData.category);
      setFormData({
        name: initialData.name || '',
        category: isCustomCat ? 'Custom' : (initialData.category || 'Classic Espresso Drinks'),
        customCategory: isCustomCat ? initialData.category : '',
        size: initialData.size || 'Grande',
        price: initialData.price ?? 4.95,
        stock: initialData.stock ?? 0,
        sku: initialData.sku || '',
        description: initialData.description || '',
        ingredients: initialData.ingredients ? [...initialData.ingredients] : [],
        nutrition: {
          calories: initialData.nutrition?.calories ?? 0,
          caffeine: initialData.nutrition?.caffeine ?? 'N/A',
          sugars: initialData.nutrition?.sugars ?? 0,
          fat: initialData.nutrition?.fat ?? 0
        }
      });
    } else {
      setFormData({
        name: '',
        category: 'Classic Espresso Drinks',
        customCategory: '',
        size: 'Grande',
        price: 4.95,
        stock: 25,
        sku: '',
        description: '',
        ingredients: [
          { name: 'Espresso Roast', amount: '2', unit: 'shots' },
          { name: 'Steamed 2% Milk', amount: '12', unit: 'oz' }
        ],
        nutrition: {
          calories: 150,
          caffeine: '75',
          sugars: 14,
          fat: 6
        }
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNutritionChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCategory = formData.category === 'Custom' ? formData.customCategory : formData.category;

    const payload = {
      ...formData,
      category: finalCategory || 'Beverages',
      price: Number(formData.price),
      stock: Number(formData.stock),
      nutrition: {
        calories: Number(formData.nutrition.calories) || 0,
        caffeine: String(formData.nutrition.caffeine || '0'),
        sugars: Number(formData.nutrition.sugars) || 0,
        fat: Number(formData.nutrition.fat) || 0
      }
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8 animate-fade-in">
        {/* Header */}
        <div className="bg-sb-dark text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sb-green flex items-center justify-center">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {isEditing ? 'Edit Starbucks Product' : 'Add New Starbucks Beverage'}
              </h3>
              <p className="text-xs text-sb-light">
                {isEditing ? 'Update beverage specifications and inventory stock' : 'Create a new beverage recipe and inventory record'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Caffè Mocha (2% Milk)"
              value={formData.name}
              onChange={handleChange}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sb-green focus:border-transparent font-medium"
            />
          </div>

          {/* Category & Size Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sb-green bg-white"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Custom">+ Custom Category...</option>
              </select>

              {formData.category === 'Custom' && (
                <input
                  type="text"
                  placeholder="Enter custom category name"
                  value={formData.customCategory}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                  className="mt-2 w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-sb-green"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Cup Size
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sb-green bg-white"
              >
                {SIZES.map((s) => (
                  <option key={s} value={s.split(' ')[0]}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price, Stock Quantity & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Price ($ USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-semibold">$</span>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full text-sm pl-7 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sb-green font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Stock Quantity *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  name="stock"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sb-green font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                SKU (Auto or Custom)
              </label>
              <input
                type="text"
                name="sku"
                placeholder="e.g. ESP-8421"
                value={formData.sku}
                onChange={handleChange}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sb-green uppercase text-xs tracking-wider"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Product Description
            </label>
            <textarea
              name="description"
              rows={2}
              placeholder="A brief tasting note, preparation instructions or product summary..."
              value={formData.description}
              onChange={handleChange}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sb-green"
            />
          </div>

          {/* Dynamic Ingredients Builder */}
          <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200">
            <IngredientsBuilder
              ingredients={formData.ingredients}
              onChange={(updated) => setFormData({ ...formData, ingredients: updated })}
            />
          </div>

          {/* Optional Nutrition Facts Accordion */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowNutrition(!showNutrition)}
              className="w-full px-4 py-2.5 bg-gray-50 text-left text-xs font-semibold text-gray-700 flex items-center justify-between hover:bg-gray-100 transition"
            >
              <span>Optional Nutrition Specs (Calories, Caffeine, Sugar, Fat)</span>
              {showNutrition ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>

            {showNutrition && (
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Calories</label>
                  <input
                    type="number"
                    value={formData.nutrition.calories}
                    onChange={(e) => handleNutritionChange('calories', e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Caffeine (mg)</label>
                  <input
                    type="text"
                    value={formData.nutrition.caffeine}
                    onChange={(e) => handleNutritionChange('caffeine', e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Sugars (g)</label>
                  <input
                    type="number"
                    value={formData.nutrition.sugars}
                    onChange={(e) => handleNutritionChange('sugars', e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.nutrition.fat}
                    onChange={(e) => handleNutritionChange('fat', e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-sb-green hover:bg-sb-hover text-white text-sm font-semibold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Product'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
