import API from './api';

export const projectService = {
  getProjects: async (params = {}) => {
    return await API.get('/projects', { params });
  },

  createProject: async (projectData) => {
    return await API.post('/projects', projectData);
  },

  getProjectById: async (id) => {
    return await API.get(`/projects/${id}`);
  },

  updateProject: async (id, projectData) => {
    return await API.put(`/projects/${id}`, projectData);
  },

  deleteProject: async (id) => {
    return await API.delete(`/projects/${id}`);
  },

  joinProject: async (id, message) => {
    return await API.post(`/projects/${id}/join`, { message });
  },

  getMembers: async (id) => {
    return await API.get(`/projects/${id}/members`);
  },

  updateMemberRole: async (projectId, memberId, role) => {
    return await API.put(`/projects/${projectId}/members/${memberId}/role`, { role });
  },

  removeMember: async (projectId, memberId) => {
    return await API.delete(`/projects/${projectId}/members/${memberId}`);
  },

  getActivities: async (projectId) => {
    return await API.get(`/projects/${projectId}/activities`);
  },
};
