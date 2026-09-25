import API from './api';

export const discussionService = {
  getDiscussions: async (projectId) => {
    return await API.get(`/projects/${projectId}/discussions`);
  },

  createDiscussion: async (projectId, data) => {
    return await API.post(`/projects/${projectId}/discussions`, data);
  },

  replyDiscussion: async (postId, data) => {
    return await API.post(`/discussions/${postId}/replies`, data);
  },

  deleteDiscussion: async (postId) => {
    return await API.delete(`/discussions/${postId}`);
  },

  deleteReply: async (replyId) => {
    return await API.delete(`/discussions/replies/${replyId}`);
  },
};
