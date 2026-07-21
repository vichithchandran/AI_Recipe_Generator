import api from './api';

export const pantryService = {
  getPantryItems: async (search = '', category = 'All') => {
    const params = {};
    if (search) params.search = search;
    if (category && category !== 'All') params.category = category;

    const response = await api.get('/pantry', { params });
    return response.data;
  },

  addPantryItem: async (itemData) => {
    const response = await api.post('/pantry', itemData);
    return response.data;
  },

  getExpiringItems: async () => {
    const response = await api.get('/pantry/expiring');
    return response.data;
  },

  updatePantryItem: async (id, itemData) => {
    const response = await api.put(`/pantry/${id}`, itemData);
    return response.data;
  },

  deletePantryItem: async (id) => {
    const response = await api.delete(`/pantry/${id}`);
    return response.data;
  },
};
