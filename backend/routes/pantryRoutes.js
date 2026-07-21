import express from 'express';
import {
  getPantryItems,
  addPantryItem,
  getExpiringItems,
  updatePantryItem,
  deletePantryItem,
} from '../controllers/pantryController.js';
import { validatePantryItem } from '../validators/pantryValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getPantryItems);
router.post('/', validatePantryItem, addPantryItem);
router.get('/expiring', getExpiringItems);
router.put('/:id', updatePantryItem);
router.delete('/:id', deletePantryItem);

export default router;
