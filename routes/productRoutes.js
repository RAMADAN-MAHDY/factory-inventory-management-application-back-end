import express from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  addStockLog,
  deleteProduct
} from '../controllers/productController.js';
import { protect, isOwner, isManager } from '../middleware/authMiddleware.js';
const router = express.Router();
  
router.get('/search', protect, getProducts);

router.route('/')
  .get(protect, getProducts)
  .post(protect, isOwner, createProduct);
  
router.route('/:id')
  .put(protect, isOwner, updateProduct)
  .delete(protect, isOwner, deleteProduct);

router.post('/:id/log', protect, isManager, addStockLog);

export default router;
