import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    dietary_restrictions: {
      type: [String],
      enum: ['Non-Vegetarian', 'Non-Veg', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'],
      default: [],
    },
    allergies: {
      type: [String],
      default: [],
    },
    preferred_cuisines: {
      type: [String],
      enum: [
        'Any',
        'Kerala',
        'South Indian',
        'Tamil Nadu',
        'Karnataka',
        'Andhra',
        'Indian',
        'North Indian',
        'Italian',
        'Mexican',
        'Chinese',
        'Japanese',
        'Thai',
        'French',
        'Mediterranean',
        'American',
      ],
      default: ['Any'],
    },
    default_servings: {
      type: Number,
      default: 4,
      min: 1,
      max: 12,
    },
    measurement_unit: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric',
    },
  },
  { timestamps: true }
);

export default mongoose.model('UserPreference', userPreferenceSchema);
