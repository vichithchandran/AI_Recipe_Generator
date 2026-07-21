import api from './api';

export const shoppingListService = {
  getShoppingList: async () => {
    const response = await api.get('/shopping-list');
    return response.data;
  },

  addShoppingItem: async (itemData) => {
    const response = await api.post('/shopping-list', itemData);
    return response.data;
  },

  toggleCheckItem: async (id) => {
    const response = await api.patch(`/shopping-list/${id}/toggle`);
    return response.data;
  },

  deleteShoppingItem: async (id) => {
    const response = await api.delete(`/shopping-list/${id}`);
    return response.data;
  },

  clearCheckedItems: async () => {
    const response = await api.delete('/shopping-list/clear-checked');
    return response.data;
  },

  transferToPantry: async () => {
    const response = await api.post('/shopping-list/transfer-to-pantry');
    return response.data;
  },
};
