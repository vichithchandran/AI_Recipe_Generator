import express from 'express';
import {
  getShoppingList,
  addShoppingItem,
  toggleCheckItem,
  deleteShoppingItem,
  clearCheckedItems,
  transferToPantry,
} from '../controllers/shoppingListController.js';
import { validateShoppingListItem } from '../validators/shoppingListValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getShoppingList);
router.post('/', validateShoppingListItem, addShoppingItem);
router.patch('/:id/toggle', toggleCheckItem);
router.delete('/clear-checked', clearCheckedItems);
router.post('/transfer-to-pantry', transferToPantry);
router.delete('/:id', deleteShoppingItem);

export default router;
