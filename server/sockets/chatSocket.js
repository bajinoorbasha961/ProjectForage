const Message = require('../models/Message');
const ProjectMember = require('../models/ProjectMember');
const User = require('../models/User');

const initChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // Join a project team room
    socket.on('join_project_room', async ({ projectId, userId }) => {
      try {
        if (!projectId || !userId) return;

        // Verify project membership
        const isMember = await ProjectMember.findOne({ project: projectId, user: userId });
        if (isMember) {
          const roomName = `project_${projectId}`;
          socket.join(roomName);
          console.log(`User ${userId} joined room ${roomName}`);
        }
      } catch (error) {
        console.error('Socket join_project_room error:', error);
      }
    });

    // Leave a project room
    socket.on('leave_project_room', ({ projectId }) => {
      if (projectId) {
        socket.leave(`project_${projectId}`);
      }
    });

    // Send a message
    socket.on('send_message', async ({ projectId, senderId, content }) => {
      try {
        if (!projectId || !senderId || !content || !content.trim()) return;

        const isMember = await ProjectMember.findOne({ project: projectId, user: senderId });
        if (!isMember) return;

        const message = await Message.create({
          project: projectId,
          sender: senderId,
          content: content.trim(),
        });

        const populatedMessage = await Message.findById(message._id).populate(
          'sender',
          'name avatar email'
        );

        const roomName = `project_${projectId}`;
        io.to(roomName).emit('receive_message', populatedMessage);
      } catch (error) {
        console.error('Socket send_message error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = initChatSocket;
