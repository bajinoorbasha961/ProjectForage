import API from './api';

export const authService = {
  login: async (credentials) => {
    const res = await API.post('/auth/login', credentials);
    if (res.token) {
      localStorage.setItem('token', res.token);
    }
    return res;
  },

  register: async (userData) => {
    const res = await API.post('/auth/register', userData);
    if (res.token) {
      localStorage.setItem('token', res.token);
    }
    return res;
  },

  getMe: async () => {
    return await API.get('/auth/me');
  },

  logout: async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      // ignore server logout error
    } finally {
      localStorage.removeItem('token');
    }
  },
};
