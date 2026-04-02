import express from 'express';
const router = express.Router();
import { 
  getStores, 
  getStoreById, 
  getStoreInventory, 
  getProductInventory 
} from '../controllers/storeController.js';

router.route('/').get(getStores);
router.route('/:id').get(getStoreById);
router.route('/:id/inventory').get(getStoreInventory);
router.route('/:id/inventory/:productId').get(getProductInventory);

export default router;
