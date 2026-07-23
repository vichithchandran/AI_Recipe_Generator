import PantryItem from '../models/PantryItem.js';
import ApiError from '../utils/apiError.js';

// @desc    Get all pantry items for logged in user
// @route   GET /api/pantry
// @access  Private
export const getPantryItems = async (req, res, next) => {
  try {
    const { search, category } = req.query;

    const query = { user: req.user._id };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const items = await PantryItem.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new pantry item or bulk add multiple items
// @route   POST /api/pantry
// @access  Private
export const addPantryItem = async (req, res, next) => {
  try {
    // Support bulk insertion if an array of items is provided
    if (Array.isArray(req.body.items) && req.body.items.length > 0) {
      const formattedItems = req.body.items.map((item) => ({
        user: req.user._id,
        name: item.name,
        quantity: item.quantity !== undefined ? item.quantity : 1,
        unit: item.unit || 'pieces',
        category: item.category || 'Other',
        expiry_date: item.expiry_date || null,
        is_running_low: item.is_running_low || false,
      }));

      const createdItems = await PantryItem.insertMany(formattedItems);

      return res.status(201).json({
        success: true,
        count: createdItems.length,
        data: createdItems,
      });
    }

    const { name, quantity, unit, category, expiry_date, is_running_low } = req.body;

    const item = await PantryItem.create({
      user: req.user._id,
      name,
      quantity,
      unit,
      category,
      expiry_date: expiry_date || null,
      is_running_low: is_running_low || false,
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expiring pantry items (within 7 days)
// @route   GET /api/pantry/expiring
// @access  Private
export const getExpiringItems = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);
    sevenDaysLater.setHours(23, 59, 59, 999);

    const items = await PantryItem.find({
      user: req.user._id,
      expiry_date: { $gte: today, $lte: sevenDaysLater },
    }).sort({ expiry_date: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a pantry item
// @route   PUT /api/pantry/:id
// @access  Private
export const updatePantryItem = async (req, res, next) => {
  try {
    let item = await PantryItem.findOne({ _id: req.params.id, user: req.user._id });

    if (!item) {
      return next(new ApiError('Pantry item not found', 404));
    }

    item = await PantryItem.findByIdAndUpdate(req.params.id, req.body, {
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

// @desc    Delete a pantry item
// @route   DELETE /api/pantry/:id
// @access  Private
export const deletePantryItem = async (req, res, next) => {
  try {
    const item = await PantryItem.findOne({ _id: req.params.id, user: req.user._id });

    if (!item) {
      return next(new ApiError('Pantry item not found', 404));
    }

    await PantryItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Pantry item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
