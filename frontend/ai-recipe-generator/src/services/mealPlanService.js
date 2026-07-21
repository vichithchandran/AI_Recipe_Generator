import api from './api';

export const mealPlanService = {
  getMealPlans: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get('/meal-plans', { params });
    return response.data;
  },

  addMealPlan: async (recipe_id, meal_date, meal_type) => {
    const response = await api.post('/meal-plans', {
      recipe_id,
      meal_date,
      meal_type,
    });
    return response.data;
  },

  deleteMealPlan: async (id) => {
    const response = await api.delete(`/meal-plans/${id}`);
    return response.data;
  },
};
