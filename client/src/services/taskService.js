import API from './api';

export const taskService = {
  getTasks: async (projectId, params = {}) => {
    return await API.get(`/projects/${projectId}/tasks`, { params });
  },

  createTask: async (projectId, taskData) => {
    return await API.post(`/projects/${projectId}/tasks`, taskData);
  },

  updateTask: async (taskId, taskData) => {
    return await API.put(`/tasks/${taskId}`, taskData);
  },

  deleteTask: async (taskId) => {
    return await API.delete(`/tasks/${taskId}`);
  },
};
