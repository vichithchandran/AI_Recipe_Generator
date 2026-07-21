import User from '../models/User.js';
import UserPreference from '../models/UserPreference.js';
import ApiError from '../utils/apiError.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user._id);

    if (name) {
      user.name = name;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        created_at: updatedUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new ApiError('Current password and new password are required', 400));
    }

    if (newPassword.length < 6) {
      return next(new ApiError('New password must be at least 6 characters', 400));
    }

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return next(new ApiError('Current password is incorrect', 400));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user preferences
// @route   GET /api/users/preferences
// @access  Private
export const getPreferences = async (req, res, next) => {
  try {
    let preferences = await UserPreference.findOne({ user: req.user._id });

    if (!preferences) {
      preferences = await UserPreference.create({ user: req.user._id });
    }

    res.status(200).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updatePreferences = async (req, res, next) => {
  try {
    const {
      dietary_restrictions,
      allergies,
      preferred_cuisines,
      default_servings,
      measurement_unit,
    } = req.body;

    let preferences = await UserPreference.findOne({ user: req.user._id });

    if (!preferences) {
      preferences = new UserPreference({ user: req.user._id });
    }

    if (dietary_restrictions !== undefined) preferences.dietary_restrictions = dietary_restrictions;
    if (allergies !== undefined) preferences.allergies = allergies;
    if (preferred_cuisines !== undefined) preferences.preferred_cuisines = preferred_cuisines;
    if (default_servings !== undefined) preferences.default_servings = default_servings;
    if (measurement_unit !== undefined) preferences.measurement_unit = measurement_unit;

    const updatedPreferences = await preferences.save();

    res.status(200).json({
      success: true,
      data: updatedPreferences,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and all associated data
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = async (req, res, next) => {
  try {
    const { confirmation } = req.body;

    if (confirmation !== 'DELETE') {
      return next(new ApiError('Account deletion requires confirmation string "DELETE"', 400));
    }

    const userId = req.user._id;

    // Delete user preferences
    await UserPreference.deleteOne({ user: userId });

    // Note: Other models (PantryItem, Recipe, MealPlan, ShoppingListItem) will be cleaned up here as models are defined
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
