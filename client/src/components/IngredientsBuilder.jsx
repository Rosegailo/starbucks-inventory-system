import React from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';

const COMMON_PRESETS = [
  { name: 'Espresso Roast', amount: '2', unit: 'shots' },
  { name: 'Steamed 2% Milk', amount: '12', unit: 'oz' },
  { name: 'Vanilla Syrup', amount: '4', unit: 'pumps' },
  { name: 'Mocha Sauce', amount: '4', unit: 'pumps' },
  { name: 'Caramel Drizzle', amount: '1', unit: 'serving' },
  { name: 'Whipped Cream', amount: '1', unit: 'topping' },
  { name: 'Ice', amount: '1', unit: 'scoop' },
  { name: 'Oat Milk', amount: '12', unit: 'oz' }
];

const UNIT_OPTIONS = ['shots', 'oz', 'fl oz', 'pumps', 'g', 'ml', 'scoop', 'sachet', 'serving', 'topping'];

const IngredientsBuilder = ({ ingredients, onChange }) => {
  const handleAddRow = () => {
    onChange([...ingredients, { name: '', amount: '1', unit: 'oz' }]);
  };

  const handleRemoveRow = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleChangeRow = (index, field, value) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddPreset = (preset) => {
    // Avoid exact duplicate
    const exists = ingredients.some(
      (item) => item.name.toLowerCase() === preset.name.toLowerCase()
    );
    if (!exists) {
      onChange([...ingredients, { ...preset }]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-semibold text-gray-800">
            Dynamic Ingredients & Recipe Formula
          </label>
          <p className="text-xs text-gray-500">
            Specify the ingredients, measurements, and units required for this item.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddRow}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sb-green bg-sb-soft hover:bg-sb-light rounded-lg transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Ingredient
        </button>
      </div>

      {/* Quick Preset Chips */}
      <div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
          <Sparkles className="w-3 h-3 text-sb-gold" />
          <span>Quick Add Starbucks Essentials:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleAddPreset(preset)}
              className="text-xs px-2.5 py-1 rounded-full border border-gray-200 bg-white hover:border-sb-green hover:text-sb-green transition text-gray-600"
            >
              + {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Ingredients List */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {ingredients.length === 0 ? (
          <div className="p-4 text-center border border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-500 text-xs">
            No ingredients configured yet. Click "+ Add Ingredient" or choose from the essentials above.
          </div>
        ) : (
          ingredients.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg group hover:border-gray-300 transition"
            >
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="e.g. Espresso Roast, 2% Milk"
                  value={item.name}
                  onChange={(e) => handleChangeRow(index, 'name', e.target.value)}
                  className="w-full text-xs font-medium px-2.5 py-1.5 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-sb-green"
                  required
                />
              </div>

              <div className="w-20">
                <input
                  type="text"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => handleChangeRow(index, 'amount', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-sb-green"
                  required
                />
              </div>

              <div className="w-28">
                <input
                  type="text"
                  list={`units-list-${index}`}
                  placeholder="Unit"
                  value={item.unit}
                  onChange={(e) => handleChangeRow(index, 'unit', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-sb-green"
                />
                <datalist id={`units-list-${index}`}>
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u} />
                  ))}
                </datalist>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveRow(index)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition"
                title="Remove ingredient"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IngredientsBuilder;
