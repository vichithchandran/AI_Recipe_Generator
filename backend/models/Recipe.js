import mongoose from 'mongoose';

const ingredientSubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  { _id: false }
);

const nutritionSubSchema = new mongoose.Schema(
  {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
  },
  { _id: false }
);

const comboItemSubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ingredients: [ingredientSubSchema],
    instructions: [{ type: String }],
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    is_combo: {
      type: Boolean,
      default: false,
    },
    items: [comboItemSubSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    cuisine_type: {
      type: String,
      default: 'Other',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    prep_time: {
      type: Number,
      default: 0,
    },
    cook_time: {
      type: Number,
      default: 0,
    },
    servings: {
      type: Number,
      default: 4,
    },
    ingredients: [ingredientSubSchema],
    instructions: {
      type: [String],
      required: [true, 'Recipe instructions are required'],
    },
    dietary_tags: [{ type: String }],
    user_notes: {
      type: String,
      default: null,
    },
    image_url: {
      type: String,
      default: null,
    },
    video_url: {
      type: String,
      default: null,
    },
    calories: {
      type: Number,
      default: null,
    },
    nutrition: {
      type: nutritionSubSchema,
      default: () => ({}),
    },
    cooking_tips: [{ type: String }],
    is_public: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


export default mongoose.model('Recipe', recipeSchema);
