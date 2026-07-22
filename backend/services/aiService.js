import genAI from '../config/ai.js';
import { env } from '../config/env.js';
import ApiError from '../utils/apiError.js';

/**
 * Post-processor validating and sanitizing ALL 7 dietary tags:
 * 1. Non-Vegetarian
 * 2. Vegetarian
 * 3. Vegan
 * 4. Gluten-Free
 * 5. Dairy-Free
 * 6. Keto
 * 7. Paleo
 * Also generates a high-quality food image URL.
 */
const postProcessRecipe = (recipe, dietaryRestrictions = []) => {
  if (!recipe) return recipe;

  // Term dictionaries for validation
  // NOTE: Egg is strictly Non-Vegetarian (FSSAI Red Symbol)
  const nonVegTerms = [
    'meat', 'chicken', 'beef', 'pork', 'mutton', 'lamb', 'fish', 'seafood',
    'shrimp', 'prawn', 'prawns', 'egg', 'eggs', 'egg-white', 'egg-yolk', 'boiled egg', 'omelette', 'bacon', 'turkey', 'ham', 'sausage', 'salmon', 'tuna',
    'karimeen', 'pomfret', 'sardine', 'mackerel', 'mathi', 'ayala', 'netholi', 'kingfish', 'crab', 'lobster'
  ];

  const dairyTerms = [
    'milk', 'cheese', 'cream', 'butter', 'yogurt', 'curd', 'ghee', 'whey',
    'paneer', 'heavy cream', 'milk powder'
  ];

  const glutenTerms = [
    'wheat', 'flour', 'maida', 'barley', 'rye', 'bread', 'pasta', 'noodle',
    'noodles', 'soy sauce', 'seitan', 'couscous', 'semolina', 'suji'
  ];

  const highCarbKetoTerms = [
    'sugar', 'rice', 'bread', 'pasta', 'noodle', 'noodles', 'potato', 'potatoes',
    'corn', 'flour', 'maida', 'sweet potato', 'oats', 'wheat', 'honey', 'maple syrup'
  ];

  const nonPaleoTerms = [
    'wheat', 'rice', 'corn', 'oats', 'barley', 'bread', 'pasta', 'bean', 'beans',
    'lentil', 'lentils', 'chickpea', 'chickpeas', 'soy', 'tofu', 'peanut', 'peanuts',
    'milk', 'cheese', 'butter', 'sugar'
  ];

  const ingNames = (recipe.ingredients || []).map((i) => (typeof i === 'string' ? i : i.name || '').toLowerCase());
  const recipeNameLower = (recipe.name || '').toLowerCase();
  const allIngredientsStr = ingNames.join(' ');

  // Detection flags
  const containsNonVeg = nonVegTerms.some((term) =>
    recipeNameLower.includes(term) || ingNames.some((ing) => ing.includes(term))
  );

  const containsDairy = dairyTerms.some((term) =>
    recipeNameLower.includes(term) || ingNames.some((ing) => ing.includes(term))
  );

  const containsGluten = glutenTerms.some((term) =>
    recipeNameLower.includes(term) || ingNames.some((ing) => ing.includes(term))
  );

  const containsHighCarb = highCarbKetoTerms.some((term) =>
    recipeNameLower.includes(term) || ingNames.some((ing) => ing.includes(term))
  );

  const containsNonPaleo = nonPaleoTerms.some((term) =>
    recipeNameLower.includes(term) || ingNames.some((ing) => ing.includes(term))
  );

  let tags = recipe.dietaryTags || recipe.dietary_tags || [];
  if (!Array.isArray(tags)) tags = [];

  // 1. Non-Vegetarian vs Vegetarian vs Vegan (EGG / MEAT / FISH -> NON-VEG)
  if (containsNonVeg) {
    tags = tags.filter((t) => t !== 'Vegetarian' && t !== 'Vegan');
    if (!tags.includes('Non-Vegetarian') && !tags.includes('Non-Veg')) {
      tags.push('Non-Vegetarian');
    }
  } else {
    tags = tags.filter((t) => t !== 'Non-Vegetarian' && t !== 'Non-Veg');
    if (!tags.includes('Vegetarian')) {
      tags.push('Vegetarian');
    }
  }

  // 2. Vegan (No meat & No dairy & No eggs & No honey)
  if (containsDairy || containsNonVeg || allIngredientsStr.includes('honey')) {
    tags = tags.filter((t) => t !== 'Vegan');
  }

  // 3. Gluten-Free
  if (containsGluten) {
    tags = tags.filter((t) => t !== 'Gluten-Free');
  }

  // 4. Dairy-Free
  if (containsDairy) {
    tags = tags.filter((t) => t !== 'Dairy-Free');
  }

  // 5. Keto
  if (containsHighCarb) {
    tags = tags.filter((t) => t !== 'Keto');
  }

  // 6. Paleo
  if (containsNonPaleo) {
    tags = tags.filter((t) => t !== 'Paleo');
  }

  // Re-append user requested tags if ingredients strictly satisfy them
  dietaryRestrictions.forEach((requestedTag) => {
    if (requestedTag === 'Gluten-Free' && !containsGluten && !tags.includes('Gluten-Free')) tags.push('Gluten-Free');
    if (requestedTag === 'Dairy-Free' && !containsDairy && !tags.includes('Dairy-Free')) tags.push('Dairy-Free');
    if (requestedTag === 'Keto' && !containsHighCarb && !tags.includes('Keto')) tags.push('Keto');
    if (requestedTag === 'Paleo' && !containsNonPaleo && !tags.includes('Paleo')) tags.push('Paleo');
    if (requestedTag === 'Vegan' && !containsDairy && !containsNonVeg && !tags.includes('Vegan')) tags.push('Vegan');
    if (requestedTag === 'Non-Vegetarian' && containsNonVeg && !tags.includes('Non-Vegetarian')) tags.push('Non-Vegetarian');
  });

  recipe.dietaryTags = Array.from(new Set(tags));
  recipe.dietary_tags = recipe.dietaryTags;

  // Generate high-resolution, gourmet food photography image URL
  if (!recipe.imageUrl && !recipe.image_url) {
    const dishPrompt = `${recipe.name} ${recipe.cuisineType || recipe.cuisine_type || ''} gourmet food dish photography plated restaurant style HD 8k`;
    const promptText = encodeURIComponent(dishPrompt);
    const seed = Math.floor(Math.random() * 100000);
    recipe.imageUrl = `https://image.pollinations.ai/prompt/${promptText}?width=800&height=520&nologo=true&seed=${seed}`;
  } else {
    recipe.imageUrl = recipe.imageUrl || recipe.image_url;
  }
  recipe.image_url = recipe.imageUrl;

  return recipe;
};

/**
 * Auto-fetches required ingredients for a specific dish name from AI,
 * incorporating Cuisine Style & Active Dietary Restrictions.
 */
export const fetchIngredientsFromAI = async (dishName, cuisineType = 'Any', dietaryRestrictions = []) => {
  if (!dishName || !dishName.trim()) return [];

  const promptText = `
You are an executive chef. List the key, authentic ingredients required to prepare "${dishName.trim()}".
- Target Cuisine Style: ${cuisineType}
- Active Dietary Restrictions: ${dietaryRestrictions.join(', ') || 'None'}

CRITICAL RULES:
1. EGG IS STRICTLY NON-VEGETARIAN. If dietary restrictions include 'Vegetarian' or 'Vegan', do NOT include egg or eggs.
2. Strictly respect all active dietary restrictions.
3. Return ONLY a valid single JSON object with a single key "ingredients" containing an array of ingredient strings, e.g. {"ingredients": ["Ingredient 1", "Ingredient 2"]}
`;

  // 1. Try Groq API
  const groqKey = (env.LLM_API_KEY && env.LLM_API_KEY.startsWith('gsk_')) ? env.LLM_API_KEY : process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are an executive chef. Output ONLY valid single JSON object.' },
            { role: 'user', content: promptText }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);
        if (parsed.ingredients && Array.isArray(parsed.ingredients)) {
          return parsed.ingredients;
        }
      }
    } catch (e) {
      console.warn('Groq fetch ingredients failed:', e.message);
    }
  }

  // 2. Try Free Open AI Engine
  try {
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are an executive chef. Output ONLY valid JSON object with key "ingredients".' },
          { role: 'user', content: promptText }
        ],
        jsonMode: true
      })
    });
    if (response.ok) {
      const rawText = await response.text();
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed && Array.isArray(parsed.ingredients)) {
        return parsed.ingredients;
      }
    }
  } catch (e) {
    console.warn('Free Open AI fetch ingredients failed:', e.message);
  }

  return [];
};

/**
 * Calls Free Open AI Text Generation Service (100% AI generated)
 */
const fetchFreeAITextRecipe = async (prompt) => {
  try {
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are an executive chef. Output STRICTLY valid single JSON object.' },
          { role: 'user', content: prompt }
        ],
        jsonMode: true
      })
    });

    if (response.ok) {
      const rawText = await response.text();
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed && parsed.name && parsed.ingredients) {
        console.log('✨ AI Recipe generated via Free Open AI Engine!');
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Free Open AI Engine call failed:', e.message);
  }
  return null;
};

/**
 * Pure AI Recipe Generator - No hardcoded recipes.
 * Calls Gemini AI, Groq AI, or Free Open AI Engine.
 */
export const generateRecipeFromAI = async ({
  ingredients = [],
  cuisineType = 'Any',
  dietaryRestrictions = [],
  servings = 4,
  cookingTime = 'medium',
  targetDish = '',
}) => {
  const prompt = `
You are an executive chef. Create a complete, delicious, safe, and healthy recipe based on these preferences:

${targetDish ? `- SPECIFIC TARGET DISH / CRAVING: "${targetDish}" (You MUST create this exact dish and select the authentic ingredients needed for it!)` : ''}
- Available Pantry/Selected Ingredients: ${ingredients.length > 0 ? ingredients.join(', ') : 'Auto-select best ingredients for target dish'}
- Preferred Cuisine Style: ${cuisineType}
- Active Dietary Restrictions: ${dietaryRestrictions.join(', ') || 'None'}
- Servings: ${servings}
- Cooking Time Frame: ${cookingTime} (quick=<30min, medium=30-60min, long=>60min)

CRITICAL DIETARY RULES (MUST BE FOLLOWED STRICTLY):
1. EGG IS STRICTLY NON-VEGETARIAN. If dietary restrictions include 'Vegetarian' or 'Vegan', do NOT include egg or eggs under any circumstances.
2. SELECTIVE PANTRY USE: Select ONLY the complementary, matching items required for a cohesive, delicious recipe.
3. STRICT COMPLIANCE FOR ALL 7 DIETARY TYPES:
   - Non-Vegetarian: Must include meat, poultry, fish, seafood, or eggs. Categorize strictly as 'Non-Vegetarian'. NEVER tag as 'Vegetarian' or 'Vegan'.
   - Vegetarian: Exclude ALL meat, poultry, fish, seafood, and eggs.
   - Vegan: Exclude ALL animal products (meat, poultry, fish, seafood, eggs, milk, cheese, butter, cream, yogurt, honey).
   - Gluten-Free: Exclude ALL wheat, flour, maida, barley, rye, gluten, bread, pasta, and soy sauce.
   - Dairy-Free: Exclude ALL milk, cheese, butter, cream, yogurt, curd, ghee, and whey.
   - Keto: Extremely low-carb (<10g carbs per serving), high-fat/protein. Exclude sugar, rice, potatoes, bread, pasta, flour, and corn.
   - Paleo: Whole foods only (meat, fish, eggs, vegetables, fruits, nuts, seeds). Exclude grains, legumes (beans, lentils), dairy, and refined sugar.

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
  "dietaryTags": ["Non-Vegetarian" | "Vegetarian" | "Vegan" | "Gluten-Free" | "Dairy-Free" | "Keto" | "Paleo"],
  "imageUrl": "https://image.pollinations.ai/prompt/...",
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

  // 1. Try Groq API if key starts with 'gsk_' or GROQ_API_KEY is configured
  const groqKey = (env.LLM_API_KEY && env.LLM_API_KEY.startsWith('gsk_')) ? env.LLM_API_KEY : process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are an executive chef. Output ONLY valid single JSON object.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsedRecipe = JSON.parse(content);
        console.log('⚡ AI Recipe successfully generated using Groq (Llama 3.3 70B)!');
        return postProcessRecipe(parsedRecipe, dietaryRestrictions);
      }
    } catch (e) {
      console.warn('Groq API call failed:', e.message);
    }
  }

  // 2. Try Gemini AI if configured with valid key (starts with AIzaSy)
  if (genAI && env.LLM_API_KEY && env.LLM_API_KEY.startsWith('AIzaSy')) {
    const modelNames = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.5-pro'];

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: 'application/json' },
        });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const parsedRecipe = JSON.parse(responseText);
        console.log(`✨ AI Recipe successfully generated using Gemini model: ${modelName}`);
        return postProcessRecipe(parsedRecipe, dietaryRestrictions);
      } catch (err) {
        console.warn(`⚠️ Gemini API call with model '${modelName}' failed: ${err.message}`);
      }
    }
  }

  // 3. Try Free Open AI Engine
  const freeAIRecipe = await fetchFreeAITextRecipe(prompt);
  if (freeAIRecipe) {
    return postProcessRecipe(freeAIRecipe, dietaryRestrictions);
  }

  // Throw error if all AI generation options fail
  throw new ApiError('AI Recipe Generation failed. Please check your internet connection or AI service availability.', 500);
};
