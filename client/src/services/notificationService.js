import API from './api';

export const notificationService = {
  getNotifications: async () => {
    return await API.get('/notifications');
  },

  markRead: async (id) => {
    return await API.put(`/notifications/${id}/read`);
  },

  markAllRead: async () => {
    return await API.put('/notifications/read-all');
  },
};
