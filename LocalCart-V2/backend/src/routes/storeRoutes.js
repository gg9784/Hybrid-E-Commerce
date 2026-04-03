import express from 'express';
const router = express.Router();

import { 
  getStores, 
  getStoreById, 
  getStoreInventory, 
  getProductInventory,
  createStore  
} from '../controllers/storeController.js';


router.route('/')
  .get(getStores)
  .post(createStore);  


router.route('/:id').get(getStoreById);

router.route('/:id/inventory').get(getStoreInventory);

router.route('/:id/inventory/:productId').get(getProductInventory);

export default router;
