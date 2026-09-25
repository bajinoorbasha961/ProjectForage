import API from './api';

export const milestoneService = {
  getMilestones: async (projectId) => {
    return await API.get(`/projects/${projectId}/milestones`);
  },

  createMilestone: async (projectId, milestoneData) => {
    return await API.post(`/projects/${projectId}/milestones`, milestoneData);
  },

  updateMilestone: async (milestoneId, milestoneData) => {
    return await API.put(`/milestones/${milestoneId}`, milestoneData);
  },

  deleteMilestone: async (milestoneId) => {
    return await API.delete(`/milestones/${milestoneId}`);
  },
};
