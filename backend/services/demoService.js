import User from '../models/User.js';
import UserPreference from '../models/UserPreference.js';
import PantryItem from '../models/PantryItem.js';
import Recipe from '../models/Recipe.js';
import MealPlan from '../models/MealPlan.js';
import ShoppingListItem from '../models/ShoppingListItem.js';
import { env } from '../config/env.js';

export const DEMO_EMAIL = (process.env.DEMO_EMAIL || 'demo@airecipehub.com').toLowerCase();
const DEMO_NAME = process.env.DEMO_NAME || 'Demo Chef';

/**
 * Password for the shared demo account. It is never sent to the browser —
 * the client calls POST /api/auth/demo-login and the server issues the token.
 * Only used so the account is a normal, loginable user like any other.
 */
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'demo-account-not-for-real-use';

/** Minutes of use before the next demo login re-seeds the data. */
export const DEMO_RESET_MINUTES = Number(process.env.DEMO_RESET_MINUTES || 60);

const foodImage = (dish) => {
  const prompt = encodeURIComponent(`${dish}, authentic food photography, close up, plated dish, restaurant quality, professional lighting, 4k HD`);
  return `https://image.pollinations.ai/prompt/${prompt}?width=900&height=600&nologo=true&enhance=true&seed=${Math.floor(Math.random() * 999999)}`;
};

/** YYYY-MM-DD for today plus `offset` days, in local time. */
const dayKey = (offset = 0) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** A Date `days` from now, for expiry dates. */
const inDays = (days) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
};

const PANTRY = [
  { name: 'Basmati Rice',        quantity: 2,   unit: 'kg',     category: 'Grains',     expiry_date: inDays(240) },
  { name: 'Toor Dal',            quantity: 900, unit: 'g',      category: 'Grains',     expiry_date: inDays(180) },
  { name: 'Chicken Breast',      quantity: 700, unit: 'g',      category: 'Meat',       expiry_date: inDays(3) },
  { name: 'Paneer',              quantity: 400, unit: 'g',      category: 'Dairy',      expiry_date: inDays(5) },
  { name: 'Full Cream Milk',     quantity: 1,   unit: 'l',      category: 'Dairy',      expiry_date: inDays(2) },
  { name: 'Curd',                quantity: 500, unit: 'ml',     category: 'Dairy',      expiry_date: inDays(4) },
  { name: 'Tomatoes',            quantity: 8,   unit: 'pieces', category: 'Vegetables', expiry_date: inDays(6) },
  { name: 'Onions',              quantity: 3,   unit: 'kg',     category: 'Vegetables', expiry_date: inDays(45) },
  { name: 'Spinach',             quantity: 250, unit: 'g',      category: 'Vegetables', expiry_date: inDays(2), is_running_low: true },
  { name: 'Green Chillies',      quantity: 100, unit: 'g',      category: 'Vegetables', expiry_date: inDays(8) },
  { name: 'Ginger',              quantity: 200, unit: 'g',      category: 'Vegetables', expiry_date: inDays(14) },
  { name: 'Garlic',              quantity: 250, unit: 'g',      category: 'Vegetables', expiry_date: inDays(30) },
  { name: 'Grated Coconut',      quantity: 300, unit: 'g',      category: 'Produce',    expiry_date: inDays(4) },
  { name: 'Bananas',             quantity: 6,   unit: 'pieces', category: 'Fruits',     expiry_date: inDays(3) },
  { name: 'Lemons',              quantity: 5,   unit: 'pieces', category: 'Fruits',     expiry_date: inDays(11) },
  { name: 'Coconut Oil',         quantity: 500, unit: 'ml',     category: 'Other',      expiry_date: inDays(300) },
  { name: 'Ghee',                quantity: 200, unit: 'ml',     category: 'Dairy',      expiry_date: inDays(150), is_running_low: true },
  { name: 'Turmeric Powder',     quantity: 100, unit: 'g',      category: 'Spices',     expiry_date: inDays(365) },
  { name: 'Garam Masala',        quantity: 80,  unit: 'g',      category: 'Spices',     expiry_date: inDays(200) },
  { name: 'Mustard Seeds',       quantity: 120, unit: 'g',      category: 'Spices',     expiry_date: inDays(300) },
  { name: 'Curry Leaves',        quantity: 50,  unit: 'g',      category: 'Spices',     expiry_date: inDays(5) },
  { name: 'Filter Coffee Powder', quantity: 250, unit: 'g',     category: 'Beverages',  expiry_date: inDays(90) },
];

const RECIPES = [
  {
    name: 'Kerala Chicken Curry',
    description: 'Bone-in chicken slow simmered in roasted coconut and warm Malabar spices, finished with curry leaves crackled in coconut oil.',
    cuisine_type: 'Kerala',
    difficulty: 'medium',
    prep_time: 20,
    cook_time: 40,
    servings: 4,
    dietary_tags: ['Non-Vegetarian', 'Gluten-Free', 'Dairy-Free'],
    is_public: true,
    video_url: 'https://www.youtube.com/watch?v=8ZQIVL7oRxg',
    ingredients: [
      { name: 'Chicken, bone-in',   quantity: 800, unit: 'g' },
      { name: 'Onions, sliced',     quantity: 3,   unit: 'pieces' },
      { name: 'Tomatoes, chopped',  quantity: 2,   unit: 'pieces' },
      { name: 'Grated coconut',     quantity: 100, unit: 'g' },
      { name: 'Ginger garlic paste', quantity: 2,  unit: 'tbsp' },
      { name: 'Coconut oil',        quantity: 3,   unit: 'tbsp' },
      { name: 'Curry leaves',       quantity: 2,   unit: 'tbsp' },
      { name: 'Garam masala',       quantity: 1,   unit: 'tbsp' },
      { name: 'Turmeric powder',    quantity: 1,   unit: 'tsp' },
    ],
    instructions: [
      'Dry roast the grated coconut over low heat until it turns a deep golden brown, then grind to a coarse paste with a splash of water.',
      'Heat coconut oil in a heavy pan and crackle the curry leaves for a few seconds.',
      'Add the sliced onions with a pinch of salt and cook until soft and lightly caramelised, about 12 minutes.',
      'Stir in the ginger garlic paste and cook until the raw smell disappears.',
      'Add turmeric and garam masala, fry for 30 seconds, then add the tomatoes and cook until they collapse.',
      'Add the chicken and toss to coat in the masala. Cover and cook on low for 20 minutes, stirring occasionally.',
      'Stir in the roasted coconut paste with half a cup of hot water and simmer uncovered for 10 more minutes.',
      'Rest off the heat for 10 minutes before serving so the gravy thickens and the spices settle.',
    ],
    nutrition: { calories: 421, protein: 44, carbs: 6, fats: 23, fiber: 1 },
    cooking_tips: [
      'Roasting the coconut past golden is what separates a Kerala curry from a generic one — take it to the edge of dark.',
      'Bone-in pieces give the gravy body. Boneless breast will cook in half the time and taste thinner.',
    ],
  },
  {
    name: 'Palak Paneer',
    description: 'Fresh spinach blanched and blitzed into a silky green gravy, folded around cubes of pan-seared paneer.',
    cuisine_type: 'North Indian',
    difficulty: 'easy',
    prep_time: 15,
    cook_time: 25,
    servings: 4,
    dietary_tags: ['Vegetarian', 'Gluten-Free'],
    is_public: true,
    ingredients: [
      { name: 'Paneer, cubed',      quantity: 400, unit: 'g' },
      { name: 'Spinach',            quantity: 500, unit: 'g' },
      { name: 'Onion, finely diced', quantity: 1,  unit: 'pieces' },
      { name: 'Tomato, pureed',     quantity: 1,   unit: 'pieces' },
      { name: 'Ginger, julienned',  quantity: 1,   unit: 'tbsp' },
      { name: 'Green chillies',     quantity: 2,   unit: 'pieces' },
      { name: 'Ghee',               quantity: 2,   unit: 'tbsp' },
      { name: 'Cumin seeds',        quantity: 1,   unit: 'tsp' },
    ],
    instructions: [
      'Blanch the spinach for 90 seconds, then plunge into ice water to lock in the colour.',
      'Blend the drained spinach with the green chillies to a smooth puree, keeping it slightly coarse.',
      'Sear the paneer cubes in a tablespoon of ghee until golden on two sides, then set aside.',
      'Temper cumin seeds in the remaining ghee, add the onion and cook until translucent.',
      'Add the tomato puree and cook until the fat separates at the edges.',
      'Lower the heat, fold in the spinach puree and warm through — do not boil, or the colour dulls.',
      'Return the paneer to the pan, season, and finish with julienned ginger.',
    ],
    nutrition: { calories: 318, protein: 19, carbs: 12, fats: 22, fiber: 4 },
    cooking_tips: [
      'The ice bath is not optional. Skip it and the gravy turns olive instead of bright green.',
      'Soak the seared paneer in warm salted water for 5 minutes to keep it soft.',
    ],
  },
  {
    name: 'Masala Dosa with Coconut Chutney',
    description: 'A crisp fermented rice crepe wrapped around soft turmeric potato masala, served with fresh coconut chutney.',
    cuisine_type: 'South Indian',
    difficulty: 'hard',
    prep_time: 40,
    cook_time: 30,
    servings: 4,
    dietary_tags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'],
    is_combo: true,
    items: [
      {
        name: 'Dosa Batter',
        ingredients: [
          { name: 'Dosa rice',      quantity: 300, unit: 'g' },
          { name: 'Urad dal',       quantity: 100, unit: 'g' },
          { name: 'Fenugreek seeds', quantity: 1,  unit: 'tsp' },
        ],
        instructions: [
          'Soak the rice and dal separately for 5 hours with the fenugreek added to the dal.',
          'Grind to a smooth batter, combine, salt lightly and ferment overnight in a warm place.',
          'Thin with water to a pourable consistency before the first dosa.',
        ],
      },
      {
        name: 'Potato Masala',
        ingredients: [
          { name: 'Potatoes, boiled', quantity: 500, unit: 'g' },
          { name: 'Onions, sliced',   quantity: 2,   unit: 'pieces' },
          { name: 'Mustard seeds',    quantity: 1,   unit: 'tsp' },
          { name: 'Turmeric powder',  quantity: 1,   unit: 'tsp' },
          { name: 'Curry leaves',     quantity: 1,   unit: 'tbsp' },
        ],
        instructions: [
          'Crackle mustard seeds and curry leaves in oil, then soften the onions.',
          'Add turmeric and the crushed potatoes with a little water and mash to a coarse filling.',
          'Season and keep warm — it should be soft enough to spread, not stiff.',
        ],
      },
      {
        name: 'Coconut Chutney',
        ingredients: [
          { name: 'Grated coconut', quantity: 200, unit: 'g' },
          { name: 'Green chillies', quantity: 2,   unit: 'pieces' },
          { name: 'Tamarind paste', quantity: 1,   unit: 'tsp' },
        ],
        instructions: [
          'Grind the coconut, chillies and tamarind with a little cold water to a thick chutney.',
          'Finish with a tempering of mustard seeds and curry leaves.',
        ],
      },
    ],
    nutrition: { calories: 402, protein: 9, carbs: 68, fats: 11, fiber: 6 },
    cooking_tips: [
      'A properly fermented batter smells faintly sour and has risen by a third — that sourness is the flavour.',
      'Wipe the hot tawa with a halved onion before each dosa and nothing will stick.',
    ],
  },
  {
    name: 'Keto Butter Chicken',
    description: 'The familiar creamy tomato gravy rebuilt without sugar or flour, thickened with cashew and cream instead.',
    cuisine_type: 'North Indian',
    difficulty: 'medium',
    prep_time: 25,
    cook_time: 30,
    servings: 4,
    dietary_tags: ['Non-Vegetarian', 'Gluten-Free', 'Keto'],
    ingredients: [
      { name: 'Chicken thighs',   quantity: 700, unit: 'g' },
      { name: 'Butter',           quantity: 60,  unit: 'g' },
      { name: 'Heavy cream',      quantity: 150, unit: 'ml' },
      { name: 'Tomato puree',     quantity: 200, unit: 'ml' },
      { name: 'Cashews, soaked',  quantity: 40,  unit: 'g' },
      { name: 'Kasoori methi',    quantity: 1,   unit: 'tbsp' },
      { name: 'Garam masala',     quantity: 2,   unit: 'tsp' },
    ],
    instructions: [
      'Marinate the chicken in curd, garam masala and salt for at least an hour.',
      'Sear the pieces hard in butter until the edges char, then remove.',
      'Blend the soaked cashews to a paste and add with the tomato puree to the same pan.',
      'Simmer until the puree darkens and thickens, about 12 minutes.',
      'Return the chicken, add the cream and finish with kasoori methi crushed between your palms.',
    ],
    nutrition: { calories: 512, protein: 38, carbs: 8, fats: 36, fiber: 2 },
    cooking_tips: ['Charring the chicken before it meets the gravy is where the smoky depth comes from.'],
  },
  {
    name: 'Vegan Sambar',
    description: 'A tamarind and toor dal stew loaded with drumsticks and pumpkin, sharpened with fresh sambar powder.',
    cuisine_type: 'Tamil Nadu',
    difficulty: 'easy',
    prep_time: 15,
    cook_time: 35,
    servings: 6,
    dietary_tags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'],
    ingredients: [
      { name: 'Toor dal',        quantity: 200, unit: 'g' },
      { name: 'Tamarind paste',  quantity: 2,   unit: 'tbsp' },
      { name: 'Drumsticks',      quantity: 2,   unit: 'pieces' },
      { name: 'Pumpkin, cubed',  quantity: 200, unit: 'g' },
      { name: 'Shallots',        quantity: 10,  unit: 'pieces' },
      { name: 'Sambar powder',   quantity: 2,   unit: 'tbsp' },
      { name: 'Mustard seeds',   quantity: 1,   unit: 'tsp' },
    ],
    instructions: [
      'Pressure cook the toor dal with turmeric until completely soft, then whisk smooth.',
      'Simmer the vegetables in tamarind water until just tender — the drumsticks should still hold shape.',
      'Add the sambar powder and cook for 5 minutes so it loses its raw edge.',
      'Fold in the cooked dal, adjust the salt and consistency, and bring to one gentle boil.',
      'Temper mustard seeds and curry leaves in oil and pour over just before serving.',
    ],
    nutrition: { calories: 214, protein: 11, carbs: 34, fats: 4, fiber: 9 },
    cooking_tips: ['Add the sambar powder to simmering liquid, never to dry heat, or it turns bitter.'],
  },
];

const SHOPPING = [
  { ingredient_name: 'Cardamom Pods',   quantity: 50,  unit: 'g',      category: 'Spices' },
  { ingredient_name: 'Coconut Milk',    quantity: 400, unit: 'ml',     category: 'Other' },
  { ingredient_name: 'Drumsticks',      quantity: 4,   unit: 'pieces', category: 'Vegetables' },
  { ingredient_name: 'Urad Dal',        quantity: 500, unit: 'g',      category: 'Grains',    from_meal_plan: true },
  { ingredient_name: 'Kasoori Methi',   quantity: 30,  unit: 'g',      category: 'Spices',    from_meal_plan: true },
  { ingredient_name: 'Heavy Cream',     quantity: 200, unit: 'ml',     category: 'Dairy',     is_checked: true },
  { ingredient_name: 'Shallots',        quantity: 500, unit: 'g',      category: 'Vegetables', is_checked: true },
];

/** Which seeded recipe fills which slot, by index into RECIPES. */
const MEAL_PLAN = [
  { offset: 0, meal_type: 'breakfast', recipe: 2 },
  { offset: 0, meal_type: 'lunch',     recipe: 1 },
  { offset: 0, meal_type: 'dinner',    recipe: 0 },
  { offset: 1, meal_type: 'breakfast', recipe: 2 },
  { offset: 1, meal_type: 'lunch',     recipe: 4 },
  { offset: 2, meal_type: 'dinner',    recipe: 3 },
  { offset: 3, meal_type: 'lunch',     recipe: 0 },
  { offset: 4, meal_type: 'dinner',    recipe: 1 },
];

/** Removes every piece of demo content, leaving the account itself intact. */
const wipeDemoData = async (userId) => {
  await Promise.all([
    PantryItem.deleteMany({ user: userId }),
    Recipe.deleteMany({ user: userId }),
    MealPlan.deleteMany({ user: userId }),
    ShoppingListItem.deleteMany({ user: userId }),
  ]);
};

/**
 * Wipes and repopulates the demo account's data so every visitor starts
 * from the same fully-populated state. Returns a count of what was created.
 */
export const seedDemoData = async (userId) => {
  await wipeDemoData(userId);

  await UserPreference.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      dietary_restrictions: ['Vegetarian'],
      allergies: ['Peanuts'],
      preferred_cuisines: ['Kerala', 'South Indian', 'North Indian'],
      default_servings: 4,
      measurement_unit: 'metric',
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  const pantryItems = await PantryItem.insertMany(
    PANTRY.map((item) => ({ ...item, user: userId, is_running_low: item.is_running_low || false }))
  );

  const recipes = [];
  for (const recipe of RECIPES) {
    // Combo recipes mirror what the create endpoint does: flatten each item's
    // ingredients and prefix its steps, so the detail page renders either view.
    let ingredients = recipe.ingredients || [];
    let instructions = recipe.instructions || [];

    if (recipe.is_combo && Array.isArray(recipe.items)) {
      ingredients = recipe.items.flatMap((item) => item.ingredients || []);
      instructions = recipe.items.flatMap((item) =>
        (item.instructions || []).map((step) => `[${item.name}] ${step}`)
      );
    }

    recipes.push(
      await Recipe.create({
        ...recipe,
        ingredients,
        instructions,
        user: userId,
        image_url: foodImage(recipe.name),
        calories: recipe.nutrition?.calories ?? null,
        is_public: recipe.is_public === true,
      })
    );
  }

  const mealPlans = await MealPlan.insertMany(
    MEAL_PLAN.map((slot) => ({
      user: userId,
      recipe: recipes[slot.recipe]._id,
      meal_date: dayKey(slot.offset),
      meal_type: slot.meal_type,
    }))
  );

  const shoppingItems = await ShoppingListItem.insertMany(
    SHOPPING.map((item) => ({
      user: userId,
      ...item,
      is_checked: item.is_checked || false,
      from_meal_plan: item.from_meal_plan || false,
    }))
  );

  await User.findByIdAndUpdate(userId, { demo_reset_at: new Date() });

  return {
    pantryItems: pantryItems.length,
    recipes: recipes.length,
    mealPlans: mealPlans.length,
    shoppingItems: shoppingItems.length,
  };
};

/**
 * Returns the demo user, creating the account on first use. The password goes
 * through the model's pre-save hook, so it is hashed like any other account.
 */
export const ensureDemoUser = async () => {
  let user = await User.findOne({ email: DEMO_EMAIL });

  if (!user) {
    user = await User.create({
      name: DEMO_NAME,
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      is_demo: true,
    });
    await seedDemoData(user._id);
    return { user, seeded: true };
  }

  // Repair the flag if the account predates this feature.
  if (!user.is_demo) {
    user.is_demo = true;
    await user.save({ validateBeforeSave: false });
  }

  return { user, seeded: false };
};

/** True when the demo data is older than the configured reset window. */
export const isDemoDataStale = (user) => {
  if (!user.demo_reset_at) return true;
  const ageMinutes = (Date.now() - new Date(user.demo_reset_at).getTime()) / 60000;
  return ageMinutes >= DEMO_RESET_MINUTES;
};

/**
 * Called on every demo login. Re-seeds only when the data has gone stale, so
 * a visitor mid-session is not reset under their feet, but the next visitor
 * after the window always gets a clean, fully-populated account.
 */
export const refreshDemoDataIfStale = async (user) => {
  if (!isDemoDataStale(user)) return false;

  // Stamp first so two simultaneous logins do not both re-seed.
  await User.findByIdAndUpdate(user._id, { demo_reset_at: new Date() });
  await seedDemoData(user._id);
  return true;
};

export const demoConfig = {
  email: DEMO_EMAIL,
  resetMinutes: DEMO_RESET_MINUTES,
  frontendUrl: env.FRONTEND_URL,
};
