import genAI from '../config/ai.js';
import { env } from '../config/env.js';

export const generateRecipeFromAI = async ({
  ingredients = [],
  cuisineType = 'Any',
  dietaryRestrictions = [],
  servings = 4,
  cookingTime = 'medium',
}) => {
  const mockFallback = {
    name: 'Garlic Herb Roasted Vegetables',
    description: 'A colorful medley of roasted vegetables with aromatic herbs and garlic',
    cuisineType: cuisineType === 'Any' ? 'Mediterranean' : cuisineType,
    difficulty: 'easy',
    prepTime: 15,
    cookTime: 30,
    servings: Number(servings) || 4,
    ingredients: ingredients.length > 0
      ? ingredients.map((item) => ({ name: item, quantity: 100, unit: 'g' }))
      : [
          { name: 'Bell Peppers', quantity: 2, unit: 'pieces' },
          { name: 'Zucchini', quantity: 2, unit: 'pieces' },
          { name: 'Garlic', quantity: 4, unit: 'cloves' },
          { name: 'Olive Oil', quantity: 3, unit: 'tbsp' },
        ],
    instructions: [
      'Preheat oven to 425°F (220°C)',
      'Cut all vegetables into similar-sized pieces',
      'Place vegetables in a large bowl and toss with oil and garlic',
      'Roast for 25-30 minutes, stirring halfway through',
      'Serve hot as a main or side dish',
    ],
    dietaryTags: dietaryRestrictions.length > 0 ? dietaryRestrictions : ['Vegan', 'Gluten-Free'],
    nutrition: {
      calories: 180,
      protein: 4,
      carbs: 22,
      fats: 10,
      fiber: 6,
    },
    cookingTips: [
      'Cut vegetables into uniform sizes for even cooking',
      'Don\'t overcrowd the baking sheet for maximum crispiness',
    ],
  };

  // If LLM_API_KEY is not configured, return mock fallback directly
  if (!genAI || !env.LLM_API_KEY || env.LLM_API_KEY === 'your_llm_api_key_here') {
    return mockFallback;
  }

  const prompt = `
You are an executive chef. Create a complete, delicious, safe, and healthy recipe based on these preferences:

- Ingredients Available (All Fresh & Non-Expired): ${ingredients.join(', ')}
- Preferred Cuisine: ${cuisineType}
- Dietary Restrictions: ${dietaryRestrictions.join(', ') || 'None'}
- Servings: ${servings}
- Cooking Time Frame: ${cookingTime} (quick=<30min, medium=30-60min, long=>60min)

CRITICAL INSTRUCTION: Ensure all ingredients used in the recipe are fresh and safe for consumption. Do NOT recommend expired or spoiled ingredients.

Respond STRICTLY with a single valid JSON object following this exact structure:
{
  "name": "Recipe Name String",
  "description": "Appetizing description string",
  "cuisineType": "Cuisine String",
  "difficulty": "easy" | "medium" | "hard",
  "prepTime": number (minutes),
  "cookTime": number (minutes),
  "servings": number,
  "ingredients": [
    { "name": "Ingredient Name", "quantity": number, "unit": "g" | "ml" | "pieces" | "tbsp" | "tsp" | "cup" }
  ],
  "instructions": ["Step 1", "Step 2"],
  "dietaryTags": ["Vegan", "Gluten-Free"],
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fats": number,
    "fiber": number
  },
  "cookingTips": ["Tip 1", "Tip 2"]
}
`;

  // Try active Gemini models in order
  const modelNames = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: 'application/json' },
      });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return JSON.parse(responseText);
    } catch (err) {
      // Continue to next model if available
    }
  }

  console.log('Gemini API call returned exception or unavailable model. Returning fallback recipe.');
  return mockFallback;
};
