import API from './api';

export const dashboardService = {
  getDashboardData: async () => {
    return await API.get('/dashboard');
  },
};

export const chatService = {
  getMessages: async (projectId) => {
    return await API.get(`/projects/${projectId}/messages`);
  },
};
