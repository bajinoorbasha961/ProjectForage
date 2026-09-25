import API from './api';

export const userService = {
  getUsers: async (params = {}) => {
    return await API.get('/users', { params });
  },

  getUserById: async (id) => {
    return await API.get(`/users/${id}`);
  },

  updateProfile: async (profileData) => {
    return await API.put('/users/profile', profileData);
  },

  getMatchingTeammates: async (projectId) => {
    return await API.get(`/users/match/${projectId}`);
  },
};
