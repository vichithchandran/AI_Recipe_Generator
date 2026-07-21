import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true,
    },
    meal_date: {
      type: String,
      required: [true, 'Meal date is required'],
      index: true,
    },
    meal_type: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner'],
      required: [true, 'Meal type is required'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('MealPlan', mealPlanSchema);
