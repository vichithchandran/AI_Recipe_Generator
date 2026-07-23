import api from './api';

export const recipeService = {
  getRecipes: async (search = '', cuisine = 'All', difficulty = 'All', limit = null) => {
    const params = {};
    if (search) params.search = search;
    if (cuisine && cuisine !== 'All') params.cuisine = cuisine;
    if (difficulty && difficulty !== 'All') params.difficulty = difficulty;
    if (limit) params.limit = limit;

    const response = await api.get('/recipes', { params });
    return response.data;
  },

  getRecipeById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  createRecipe: async (recipeData) => {
    const response = await api.post('/recipes', recipeData);
    return response.data;
  },

  generateRecipe: async (promptData) => {
    const response = await api.post('/recipes/generate', promptData);
    return response.data;
  },

  fetchIngredientsForDish: async (dishName, cuisineType = 'Any', dietaryRestrictions = []) => {
    const response = await api.post('/recipes/fetch-ingredients', { dishName, cuisineType, dietaryRestrictions });
    return response.data;
  },

  calculateNutrition: async (recipeName, ingredients = [], servings = 4) => {
    const response = await api.post('/recipes/calculate-nutrition', { recipeName, ingredients, servings });
    return response.data;
  },

  deleteRecipe: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },
};
