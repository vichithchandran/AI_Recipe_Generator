import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (e) {
      // Clear client state even if network logout fails
      return { success: true };
    }
  },
};
