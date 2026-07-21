import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (name) => {
    const response = await api.put('/users/profile', { name });
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/users/change-password', { currentPassword, newPassword });
    return response.data;
  },

  getPreferences: async () => {
    const response = await api.get('/users/preferences');
    return response.data;
  },

  updatePreferences: async (preferencesData) => {
    const response = await api.put('/users/preferences', preferencesData);
    return response.data;
  },

  deleteAccount: async (confirmation) => {
    const response = await api.delete('/users/account', { data: { confirmation } });
    return response.data;
  },
};
