const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProducts,
  getStats,
  getProductById,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct
} = require('../controllers/productController');

// Require authenticated partner for all inventory endpoints
router.use(protect);

// Stats route (must be before :id route)
router.get('/stats', getStats);

// Main CRUD routes
router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

// Quick stock adjustment
router.patch('/:id/stock', updateStock);

module.exports = router;
