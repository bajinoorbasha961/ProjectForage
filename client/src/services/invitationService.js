import API from './api';

export const invitationService = {
  createInvitation: async (data) => {
    return await API.post('/invitations', data);
  },

  getUserInvitations: async () => {
    return await API.get('/invitations');
  },

  respondInvitation: async (id, status) => {
    return await API.put(`/invitations/${id}`, { status });
  },

  respondJoinRequest: async (id, status) => {
    return await API.put(`/invitations/requests/${id}`, { status });
  },
};
