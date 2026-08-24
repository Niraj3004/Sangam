"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Loader2, ArrowLeft, Users, MessageSquare, Plus, Send, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { motion, AnimatePresence } from "framer-motion";

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [community, setCommunity] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Post Modal
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comment state
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");

  const fetchCommunity = async () => {
    try {
      const { data } = await api.get(`/communities/${params.id}`);
      setCommunity(data.data);
      // Backend returns posts inside community.posts or we fetch them separately?
      // According to standard logic, it usually populates `posts` inside the community object
      // or we just use `data.data.posts` if they are embedded. Let's assume they are embedded or passed down.
      setPosts(data.data.posts || []);
    } catch (err) {
      console.error(err);
      router.push('/communities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, [params.id]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;
    setIsSubmitting(true);
    
    try {
      const { data } = await api.post(`/communities/${params.id}/posts`, {
        title: postTitle,
        content: postContent,
        tags: []
      });
      setPosts([data.data, ...posts]);
      setIsPostModalOpen(false);
      setPostTitle("");
      setPostContent("");
    } catch (err) {
      console.error(err);
      alert("Failed to create post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    
    try {
      const { data } = await api.post(`/communities/posts/${postId}/comments`, {
        content: commentContent
      });
      
      // Update local post state
      setPosts(prev => prev.map(p => {
        if (p._id === postId) {
          return { ...p, comments: [...(p.comments || []), data.data] };
        }
        return p;
      }));
      
      setCommentContent("");
      setActiveCommentPost(null);
    } catch (err) {
      console.error(err);
      alert("Failed to post comment.");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!community) return null;

  const isMember = community.members?.some((m: any) => {
    if (typeof m === 'string') return m === user?._id;
    return m._id === user?._id || m === user?._id;
  });

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      <Link href="/communities" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Communities
      </Link>

      {/* Community Header */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm mb-8">
        <div className="h-40 w-full bg-slate-100 relative">
          {community.coverImage ? (
            <img src={community.coverImage} alt={community.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-indigo-500/80 to-primary/80" />
          )}
          <div className="absolute -bottom-10 left-8 w-24 h-24 rounded-2xl border-4 border-white bg-white shadow-sm flex items-center justify-center overflow-hidden">
            {community.logo ? (
              <img src={community.logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Users className="w-10 h-10 text-indigo-500" />
            )}
          </div>
        </div>

        <div className="pt-14 p-8 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-slate-100 text-muted text-xs font-bold uppercase tracking-wider rounded-md">
                {community.type}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{community.name}</h1>
            <p className="text-foreground/80 max-w-xl">{community.description}</p>
          </div>
          
          <div className="flex-shrink-0 flex flex-col items-end gap-3">
            <div className="text-sm font-semibold text-muted flex items-center gap-1.5">
              <Users className="w-4 h-4" /> {community.members?.length || 0} Members
            </div>
            {isMember ? (
              <button 
                onClick={() => setIsPostModalOpen(true)}
                className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Post
              </button>
            ) : (
              <button className="bg-slate-100 text-muted px-6 py-2.5 rounded-xl font-medium cursor-not-allowed text-sm">
                Join to Post
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No posts yet</h3>
            <p className="text-muted mt-1 text-sm">Be the first to share knowledge with this community.</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Link href={`/u/${post.author?.handle}`} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-primary overflow-hidden hover:opacity-80 transition-opacity">
                  {post.author?.profilePic ? (
                    <img src={post.author.profilePic} alt={post.author.handle} className="w-full h-full object-cover" />
                  ) : (
                    post.author?.handle?.charAt(0).toUpperCase()
                  )}
                </Link>
                <div>
                  <Link href={`/u/${post.author?.handle}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1">
                    {post.author?.handle}
                    <VerifiedBadge tier={post.author?.verifyTier} />
                  </Link>
                  <span className="text-[10px] text-muted">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-3">{post.title}</h2>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap mb-6">
                {post.content}
              </p>

              {/* Comments Section */}
              <div className="pt-4 border-t border-border">
                
                <div className="space-y-4 mb-4">
                  {post.comments?.map((comment: any, i: number) => (
                    <div key={i} className="flex gap-3 bg-slate-50 p-3 rounded-xl">
                      <Link href={`/u/${comment.author?.handle}`} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 overflow-hidden shadow-sm">
                        {comment.author?.profilePic ? (
                          <img src={comment.author.profilePic} alt="" className="w-full h-full object-cover" />
                        ) : (
                          comment.author?.handle?.charAt(0).toUpperCase()
                        )}
                      </Link>
                      <div className="flex-1">
                        <Link href={`/u/${comment.author?.handle}`} className="text-xs font-bold text-foreground hover:text-primary">
                          {comment.author?.handle}
                        </Link>
                        <p className="text-sm text-foreground/80 mt-0.5">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {isMember && activeCommentPost !== post._id && (
                  <button 
                    onClick={() => setActiveCommentPost(post._id)}
                    className="text-sm font-semibold text-muted hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Add a comment...
                  </button>
                )}

                {activeCommentPost === post._id && (
                  <form onSubmit={(e) => handleComment(e, post._id)} className="flex items-center gap-2 mt-2">
                    <input 
                      type="text"
                      autoFocus
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Write your comment..."
                      className="flex-1 px-4 py-2 bg-slate-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm"
                    />
                    <button 
                      type="submit"
                      disabled={!commentContent.trim()}
                      className="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveCommentPost(null)}
                      className="p-2 text-muted hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                )}

              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {isPostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h3 className="text-lg font-bold text-foreground">
                  Create a Post
                </h3>
                <button onClick={() => setIsPostModalOpen(false)} className="text-muted hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleCreatePost} className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Title *</label>
                  <input 
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="e.g. How to get started with React"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Content *</label>
                  <textarea 
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={6}
                    placeholder="Share your thoughts, articles, or questions..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsPostModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting || !postTitle.trim() || !postContent.trim()}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Post to Community
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
