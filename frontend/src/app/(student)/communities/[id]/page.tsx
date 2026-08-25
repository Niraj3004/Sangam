"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Users, ShieldCheck, Calendar, BookOpen, MessageSquare, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface Community {
  _id: string;
  name: string;
  description: string;
  type: string;
  memberCount: number;
  iconUrl: string;
  bannerUrl: string;
  isOfficial: boolean;
  status: string;
}

export default function CommunityWorkspace() {
  const { id } = useParams();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false); // In reality, fetch this from Membership
  const [activeTab, setActiveTab] = useState("discussions");
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    // We don't have a GET /communities/:id yet in API_REFERENCE, 
    // but typically we'd fetch the community detail here. 
    // For MVP, we'll mock it if it doesn't exist, or just assume it exists if passed in array.
    // Let's pretend we have a fetch call here.
    const fetchCommunity = async () => {
      try {
        // Mocking response for now until GET /communities/:id is built
        setTimeout(() => {
          setCommunity({
            _id: id as string,
            name: "React Developers Nepal",
            description: "The official community for React enthusiasts in Nepal. We host weekly workshops, share resources, and build open-source projects.",
            type: "skill",
            memberCount: 142,
            iconUrl: "",
            bannerUrl: "",
            isOfficial: true,
            status: "active"
          });
          setLoading(false);
        }, 500);
      } catch (err: any) {
        console.error(err);
      }
    };

    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const { data } = await api.get(`/knowledge/${id}/posts`);
        setPosts((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchCommunity();
    fetchPosts();
  }, [id]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setIsSubmitting(true);
    try {
      const { data } = await api.post(`/knowledge/${id}/posts`, { title: "Discussion", content: newPostContent, tags: [] });
      setPosts([data.data, ...posts]);
      setNewPostContent("");
    } catch (err) {
      console.error(err);
      alert("Failed to post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 animate-pulse" />;
  }

  if (!community) return <div>Not found</div>;

  const TABS = [
    { id: "discussions", label: "Discussions", icon: MessageSquare },
    { id: "events", label: "Events", icon: Calendar },
    { id: "resources", label: "Resources", icon: BookOpen },
    { id: "members", label: "Members", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Massive Hero Banner */}
      <div className="relative h-64 md:h-80 bg-gray-900 overflow-hidden">
        {community.bannerUrl ? (
          <img src={community.bannerUrl} alt="banner" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-90" />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 sm:-mt-24 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-8 justify-between">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              {/* Profile Icon over banner */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white shadow-xl border-4 border-white flex items-center justify-center overflow-hidden shrink-0">
                {community.iconUrl ? (
                  <img src={community.iconUrl} alt="icon" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-16 h-16 text-gray-300" />
                )}
              </div>
              
              <div className="mb-2">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                    {community.name}
                  </h1>
                  {community.isOfficial && (
                    <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide border border-blue-100">
                      <ShieldCheck className="w-4 h-4" /> Official
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 font-medium">
                  <span className="capitalize">{community.type} Community</span>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{community.memberCount} Members</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 sm:mb-2">
              <button 
                onClick={() => setJoined(!joined)}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  joined 
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
                }`}
              >
                {joined ? (
                  <><Check className="w-5 h-5" /> Joined</>
                ) : (
                  <><Plus className="w-5 h-5" /> Join Community</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 p-1 flex overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      isActive 
                        ? "bg-gray-50 text-gray-900 shadow-sm border border-gray-100" 
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 min-h-[400px]">
              <h2 className="text-xl font-bold text-gray-900 mb-6 capitalize">{activeTab}</h2>
              
              {activeTab === "discussions" ? (
                <div className="space-y-8">
                  {/* Create Post Box */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
                    <textarea 
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Share a resource, ask a question, or start a discussion..."
                      className="w-full bg-transparent border-none focus:ring-0 resize-none outline-none text-gray-900 placeholder:text-gray-400 min-h-[80px]"
                    />
                    <div className="flex justify-end pt-3 border-t border-slate-200 mt-2">
                      <button 
                        onClick={handleCreatePost}
                        disabled={isSubmitting || !newPostContent.trim()}
                        className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-sm shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        {isSubmitting ? "Posting..." : "Post"}
                      </button>
                    </div>
                  </div>

                  {/* Feed */}
                  <div className="space-y-6">
                    {loadingPosts ? (
                      <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
                    ) : posts.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                          <MessageSquare className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Nothing here yet</h3>
                        <p className="text-gray-500 text-sm">Be the first to start a conversation in this community.</p>
                      </div>
                    ) : (
                      posts.map((post) => (
                        <div key={post._id} className="group">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                              {post.author?.handle?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-900 text-sm">{post.author?.handle || 'Unknown Student'}</span>
                                <span className="text-xs text-gray-500">• {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), {addSuffix: true}) : 'Just now'}</span>
                              </div>
                              <p className="text-gray-700 text-sm whitespace-pre-wrap">{post.content}</p>
                              
                              <div className="flex items-center gap-4 mt-3">
                                <button className="text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                                  <MessageSquare className="w-3.5 h-3.5" /> Reply
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="my-4 border-t border-gray-100"></div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <BookOpen className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Coming Soon</h3>
                  <p className="text-gray-500 text-sm">This module is being built.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* About Widget */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {community.description}
              </p>
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Created August 2026</span>
                </div>
              </div>
            </div>

            {/* Leaders Widget */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                Community Leaders
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-semibold">1</span>
              </h3>
              <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                  R
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Ram Karki</p>
                  <p className="text-xs text-indigo-600 font-medium">Founder / Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
