const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true
    },
    amount: {
      type: String,
      required: [true, 'Ingredient amount is required'],
      trim: true
    },
    unit: {
      type: String,
      default: '',
      trim: true
    }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true
    },
    size: {
      type: String,
      default: 'Grande',
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be 0 or higher']
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    sku: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    ingredients: {
      type: [ingredientSchema],
      default: []
    },
    nutrition: {
      calories: { type: Number, default: 0 },
      caffeine: { type: String, default: 'N/A' },
      sugars: { type: Number, default: 0 },
      fat: { type: Number, default: 0 }
    },
    imageUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual property for inventory stock status
productSchema.virtual('status').get(function () {
  if (this.stock <= 0) return 'Out of Stock';
  if (this.stock < 15) return 'Low Stock';
  return 'In Stock';
});

// Auto-generate SKU if not provided before saving
productSchema.pre('save', function (next) {
  if (!this.sku) {
    const prefix = this.category
      ? this.category.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'SB')
      : 'SBX';
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.sku = `${prefix}-${rand}`;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
