import mongoose from 'mongoose';

const shoppingListItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ingredient_name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      required: true,
      enum: ['pieces', 'kg', 'g', 'l', 'ml', 'cups', 'tbsp', 'tsp'],
      default: 'pieces',
    },
    category: {
      type: String,
      required: true,
      enum: ['Produce', 'Dairy', 'Meat', 'Grains', 'Spices', 'Beverages', 'Other'],
      default: 'Other',
    },
    is_checked: {
      type: Boolean,
      default: false,
    },
    from_meal_plan: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ShoppingListItem', shoppingListItemSchema);
