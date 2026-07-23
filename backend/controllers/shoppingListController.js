import ShoppingListItem from '../models/ShoppingListItem.js';
import PantryItem from '../models/PantryItem.js';
import ApiError from '../utils/apiError.js';

// Category mapping helper from ShoppingList to Pantry
const mapCategoryToPantry = (category) => {
  if (category === 'Produce') return 'Vegetables';
  const validPantryCategories = ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Grains', 'Spices', 'Beverages', 'Other'];
  return validPantryCategories.includes(category) ? category : 'Other';
};

// @desc    Get shopping list items for user
// @route   GET /api/shopping-list
// @access  Private
export const getShoppingList = async (req, res, next) => {
  try {
    const items = await ShoppingListItem.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to shopping list
// @route   POST /api/shopping-list
// @access  Private
export const addShoppingItem = async (req, res, next) => {
  try {
    const { ingredient_name, quantity, unit, category, from_meal_plan } = req.body;

    const item = await ShoppingListItem.create({
      user: req.user._id,
      ingredient_name,
      quantity,
      unit: unit || 'pieces',
      category: category || 'Other',
      from_meal_plan: from_meal_plan || false,
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item in shopping list
// @route   PUT /api/shopping-list/:id
// @access  Private
export const updateShoppingItem = async (req, res, next) => {
  try {
    let item = await ShoppingListItem.findOne({ _id: req.params.id, user: req.user._id });

    if (!item) {
      return next(new ApiError('Shopping list item not found', 404));
    }

    item = await ShoppingListItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle check status of item
// @route   PATCH /api/shopping-list/:id/toggle
// @access  Private
export const toggleCheckItem = async (req, res, next) => {
  try {
    const item = await ShoppingListItem.findOne({ _id: req.params.id, user: req.user._id });

    if (!item) {
      return next(new ApiError('Shopping list item not found', 404));
    }

    item.is_checked = !item.is_checked;
    await item.save();

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete single item from shopping list
// @route   DELETE /api/shopping-list/:id
// @access  Private
export const deleteShoppingItem = async (req, res, next) => {
  try {
    const item = await ShoppingListItem.findOne({ _id: req.params.id, user: req.user._id });

    if (!item) {
      return next(new ApiError('Shopping list item not found', 404));
    }

    await ShoppingListItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item removed from shopping list',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all checked items
// @route   DELETE /api/shopping-list/clear-checked
// @access  Private
export const clearCheckedItems = async (req, res, next) => {
  try {
    const result = await ShoppingListItem.deleteMany({
      user: req.user._id,
      is_checked: true,
    });

    res.status(200).json({
      success: true,
      message: 'Checked items cleared successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Transfer checked shopping items to pantry
// @route   POST /api/shopping-list/transfer-to-pantry
// @access  Private
export const transferToPantry = async (req, res, next) => {
  try {
    const checkedItems = await ShoppingListItem.find({
      user: req.user._id,
      is_checked: true,
    });

    if (checkedItems.length === 0) {
      return next(new ApiError('No checked items to transfer', 400));
    }

    const createdPantryItems = [];

    for (const item of checkedItems) {
      const pantryCategory = mapCategoryToPantry(item.category);

      // Check if item already exists in pantry
      let existingPantryItem = await PantryItem.findOne({
        user: req.user._id,
        name: { $regex: `^${item.ingredient_name}$`, $options: 'i' },
      });

      if (existingPantryItem) {
        existingPantryItem.quantity += item.quantity;
        // Reset running low status when stock is replenished
        existingPantryItem.is_running_low = false;
        await existingPantryItem.save();
        createdPantryItems.push(existingPantryItem);
      } else {
        const newPantryItem = await PantryItem.create({
          user: req.user._id,
          name: item.ingredient_name,
          quantity: item.quantity,
          unit: item.unit,
          category: pantryCategory,
          is_running_low: false,
        });
        createdPantryItems.push(newPantryItem);
      }
    }

    // Delete transferred items from shopping list
    await ShoppingListItem.deleteMany({
      user: req.user._id,
      is_checked: true,
    });

    res.status(200).json({
      success: true,
      transferredCount: checkedItems.length,
      pantryItems: createdPantryItems,
    });
  } catch (error) {
    next(error);
  }
};
