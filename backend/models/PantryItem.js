import mongoose from 'mongoose';

const pantryItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['pieces', 'kg', 'g', 'l', 'ml', 'cups', 'tbsp', 'tsp'],
      default: 'pieces',
    },
    category: {
      type: String,
      required: true,
      enum: ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Grains', 'Spices', 'Beverages', 'Produce', 'Other'],
      default: 'Other',
    },
    expiry_date: {
      type: Date,
      default: null,
    },
    is_running_low: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('PantryItem', pantryItemSchema);
