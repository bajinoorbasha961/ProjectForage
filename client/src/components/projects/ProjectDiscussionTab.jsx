import React, { useState, useEffect } from 'react';
import { discussionService } from '../../services/discussionService';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, Trash2, CornerDownRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProjectDiscussionTab = ({ project, isMember }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [replyInputs, setReplyInputs] = useState({});

  const fetchDiscussions = async () => {
    try {
      const res = await discussionService.getDiscussions(project._id);
      if (res.success) {
        setPosts(res.data);
      }
    } catch (err) {
      toast.error('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [project._id]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    try {
      const res = await discussionService.createDiscussion(project._id, {
        title: newTitle,
        content: newContent,
      });
      if (res.success) {
        toast.success('Discussion topic posted!');
        setNewTitle('');
        setNewContent('');
        fetchDiscussions();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create post');
    }
  };

  const handleCreateReply = async (postId, e) => {
    e.preventDefault();
    const content = replyInputs[postId];
    if (!content || !content.trim()) return;
    try {
      const res = await discussionService.replyDiscussion(postId, { content });
      if (res.success) {
        toast.success('Reply added!');
        setReplyInputs({ ...replyInputs, [postId]: '' });
        fetchDiscussions();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to reply');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this discussion post?')) return;
    try {
      await discussionService.deleteDiscussion(postId);
      toast.success('Post deleted');
      fetchDiscussions();
    } catch (err) {
      toast.error(err.message || 'Failed to delete post');
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    try {
      await discussionService.deleteReply(replyId);
      toast.success('Reply deleted');
      fetchDiscussions();
    } catch (err) {
      toast.error(err.message || 'Failed to delete reply');
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New Post Form */}
      {isMember && (
        <form
          onSubmit={handleCreatePost}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-400" /> Start a Technical Discussion / Topic
          </h3>
          <input
            type="text"
            placeholder="Topic Title (e.g. Database Choice & Indexing Strategy)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <textarea
            rows={3}
            required
            placeholder="Share your technical question, architectural proposal, or idea with teammates..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <div className="flex justify-end">
            <Button variant="primary" size="sm" type="submit" icon={Send}>
              Post Topic
            </Button>
          </div>
        </form>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading discussions...</div>
        ) : posts.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            No discussion topics yet. Start one above!
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.name}`}
                    alt={post.author?.name}
                    className="w-10 h-10 rounded-xl object-cover bg-slate-800"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{post.author?.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      {new Date(post.createdAt).toLocaleDateString()} at{' '}
                      {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {user && user._id === post.author?._id && (
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Title & Body */}
              {post.title && <h3 className="text-base font-bold text-slate-100">{post.title}</h3>}
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Replies */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                {post.replies?.map((reply) => (
                  <div
                    key={reply._id}
                    className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60 ml-4 sm:ml-8"
                  >
                    <CornerDownRight className="w-4 h-4 text-slate-600 mt-1 shrink-0" />
                    <img
                      src={reply.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.author?.name}`}
                      alt={reply.author?.name}
                      className="w-8 h-8 rounded-lg object-cover bg-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{reply.author?.name}</span>
                        {user && user._id === reply.author?._id && (
                          <button
                            onClick={() => handleDeleteReply(reply._id)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{reply.content}</p>
                    </div>
                  </div>
                ))}

                {/* Reply Input Form */}
                {isMember && (
                  <form
                    onSubmit={(e) => handleCreateReply(post._id, e)}
                    className="flex items-center gap-2 pt-2 ml-4 sm:ml-8"
                  >
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyInputs[post._id] || ''}
                      onChange={(e) =>
                        setReplyInputs({ ...replyInputs, [post._id]: e.target.value })
                      }
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                    <Button variant="secondary" size="sm" type="submit">
                      Reply
                    </Button>
                  </form>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
