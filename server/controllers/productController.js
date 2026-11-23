const Product = require('../models/Product');

// @desc    Get all products with filtering, search, and sorting
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { search, category, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    let query = {};

    // Search by product name, description, or ingredients
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { 'ingredients.name': searchRegex }
      ];
    }

    // Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by Stock Status
    if (status) {
      if (status === 'out_of_stock') {
        query.stock = { $lte: 0 };
      } else if (status === 'low_stock') {
        query.stock = { $gt: 0, $lt: 15 };
      } else if (status === 'in_stock') {
        query.stock = { $gte: 15 };
      }
    }

    // Sorting
    const sortField = sortBy;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const products = await Product.find(query).sort({ [sortField]: sortDirection });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// @desc    Get inventory stats overview
// @route   GET /api/products/stats
// @access  Public
exports.getStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const outOfStock = await Product.countDocuments({ stock: { $lte: 0 } });
    const lowStock = await Product.countDocuments({ stock: { $gt: 0, $lt: 15 } });
    const inStock = await Product.countDocuments({ stock: { $gte: 15 } });

    const categories = await Product.distinct('category');

    // Aggregate total stock quantity and total retail value
    const aggregateData = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalUnits: { $sum: '$stock' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      }
    ]);

    const totalUnits = aggregateData.length > 0 ? aggregateData[0].totalUnits : 0;
    const totalValue = aggregateData.length > 0 ? Number(aggregateData[0].totalValue.toFixed(2)) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        outOfStock,
        lowStock,
        inStock,
        totalCategories: categories.length,
        categories,
        totalUnits,
        totalValue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to calculate stats',
      error: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message
    });
  }
};

// @desc    Create a new product with ingredients
// @route   POST /api/products
// @access  Public
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      size,
      price,
      stock,
      sku,
      description,
      ingredients,
      nutrition,
      imageUrl
    } = req.body;

    // Validation
    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, Category, Price, and Stock are required fields.'
      });
    }

    // Clean ingredients array
    const formattedIngredients = Array.isArray(ingredients)
      ? ingredients
          .filter((item) => item.name && item.name.trim() !== '')
          .map((item) => ({
            name: item.name.trim(),
            amount: item.amount ? String(item.amount).trim() : '1',
            unit: item.unit ? String(item.unit).trim() : ''
          }))
      : [];

    const product = new Product({
      name: name.trim(),
      category: category.trim(),
      size: size || 'Grande',
      price: Number(price),
      stock: Number(stock),
      sku: sku ? sku.trim() : undefined,
      description: description ? description.trim() : '',
      ingredients: formattedIngredients,
      nutrition: nutrition || { calories: 0, caffeine: 'N/A', sugars: 0, fat: 0 },
      imageUrl: imageUrl || ''
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Public
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      size,
      price,
      stock,
      sku,
      description,
      ingredients,
      nutrition,
      imageUrl
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (size !== undefined) product.size = size;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Math.max(0, Number(stock));
    if (sku !== undefined) product.sku = sku.trim();
    if (description !== undefined) product.description = description.trim();
    if (imageUrl !== undefined) product.imageUrl = imageUrl;

    if (ingredients !== undefined && Array.isArray(ingredients)) {
      product.ingredients = ingredients
        .filter((item) => item.name && item.name.trim() !== '')
        .map((item) => ({
          name: item.name.trim(),
          amount: item.amount ? String(item.amount).trim() : '1',
          unit: item.unit ? String(item.unit).trim() : ''
        }));
    }

    if (nutrition !== undefined) {
      product.nutrition = { ...product.nutrition, ...nutrition };
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// @desc    Quick adjust product stock quantity
// @route   PATCH /api/products/:id/stock
// @access  Public
exports.updateStock = async (req, res) => {
  try {
    const { delta, newStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (typeof newStock === 'number') {
      product.stock = Math.max(0, newStock);
    } else if (typeof delta === 'number') {
      product.stock = Math.max(0, product.stock + delta);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either delta (+/-) or newStock value'
      });
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: `Stock updated to ${product.stock}`,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to adjust stock',
      error: error.message
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Product "${product.name}" deleted successfully`,
      data: { id: req.params.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};
