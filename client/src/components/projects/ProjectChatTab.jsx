import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { chatService } from '../../services/dashboardService';
import { Send, Lock, MessageSquare } from 'lucide-react';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';

export const ProjectChatTab = ({ project, isMember }) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isMember) return;

    // Fetch initial chat history from REST API
    const fetchHistory = async () => {
      try {
        const res = await chatService.getMessages(project._id);
        if (res.success) {
          setMessages(res.data);
        }
      } catch (err) {
        toast.error('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [project._id, isMember]);

  useEffect(() => {
    if (!socket || !isMember || !user) return;

    // Join room
    socket.emit('join_project_room', { projectId: project._id, userId: user._id });

    // Real-time listener
    const handleReceiveMessage = (msg) => {
      if (msg.project === project._id || msg.project?._id === project._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.emit('leave_project_room', { projectId: project._id });
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, project._id, user, isMember]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!content.trim() || !socket || !user) return;

    socket.emit('send_message', {
      projectId: project._id,
      senderId: user._id,
      content: content.trim(),
    });

    setContent('');
  };

  if (!isMember) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Team Room Chat Restricted</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Real-time team chat is exclusive to official team members of "{project.title}". Request to join the project team to gain access!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[600px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-bold text-white text-sm">Real-Time Team Room Chat</h3>
        </div>
        <span className="text-xs text-slate-400">{project.title}</span>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading chat history...</div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 text-xs space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-600" />
            <p>This room is quiet. Send a message to start chatting with teammates!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = (msg.sender?._id || msg.sender) === user._id;

            return (
              <div
                key={msg._id}
                className={`flex items-start gap-3 max-w-[85%] ${
                  isMe ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <img
                  src={
                    msg.sender?.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender?.name || 'User'}`
                  }
                  alt={msg.sender?.name}
                  className="w-8 h-8 rounded-lg object-cover bg-slate-800 shrink-0 mt-0.5"
                />

                <div>
                  <div
                    className={`flex items-center gap-2 mb-1 ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-slate-300">
                      {msg.sender?.name || 'Teammate'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Send Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Type a message to your team..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
        <Button variant="primary" size="sm" type="submit" icon={Send}>
          Send
        </Button>
      </form>
    </div>
  );
};
