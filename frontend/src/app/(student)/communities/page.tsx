"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Users, Loader2, ArrowRight, BookOpen, Globe, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export default function CommunitiesPage() {
  const { user } = useAuthStore();
  const [communities, setCommunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState<string | null>(null);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/communities');
      setCommunities((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (communityId: string) => {
    setIsJoining(communityId);
    try {
      await api.post(`/communities/${communityId}/join`);
      // Update local state to reflect membership
      setCommunities(prev => prev.map(c => {
        if (c._id === communityId) {
          return {
            ...c,
            members: [...(c.members || []), user?._id]
          };
        }
        return c;
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to join community.");
    } finally {
      setIsJoining(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 shadow-sm border border-indigo-100">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Communities & Knowledge</h1>
        <p className="text-muted mt-2 max-w-lg">
          Join your college network or specialized interest groups. Share knowledge, articles, and learn together.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : communities.length === 0 ? (
        <div className="text-center py-32 bg-white border border-border rounded-2xl border-dashed">
          <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground">No communities found</h3>
          <p className="text-muted mt-2">Communities are currently being set up by administrators.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community, index) => {
            
            // Check if current user is already a member
            const isMember = community.members?.some((m: any) => {
              if (typeof m === 'string') return m === user?._id;
              return m._id === user?._id || m === user?._id;
            });

            return (
              <motion.div
                key={community._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Cover Image */}
                <div className="h-24 bg-slate-100 w-full relative">
                  {community.coverImage ? (
                    <img src={community.coverImage} alt={community.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-indigo-500/80 to-primary/80" />
                  )}
                  <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-xl border-4 border-white bg-white shadow-sm flex items-center justify-center overflow-hidden">
                    {community.logo ? (
                      <img src={community.logo} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <Users className="w-6 h-6 text-indigo-500" />
                    )}
                  </div>
                </div>

                <div className="pt-10 p-6 flex-1 flex flex-col">
                  
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 bg-slate-100 text-muted text-[10px] font-bold uppercase tracking-wider rounded-md">
                      {community.type}
                    </span>
                    <span className="text-xs font-semibold text-muted flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {community.members?.length || 0} members
                    </span>
                  </div>

                  <Link href={`/communities/${community._id}`} className="hover:text-primary transition-colors block mb-2">
                    <h2 className="text-xl font-bold text-foreground leading-tight">{community.name}</h2>
                  </Link>

                  <p className="text-sm text-foreground/80 line-clamp-2 mb-6">
                    {community.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border flex gap-3">
                    {isMember ? (
                      <Link 
                        href={`/communities/${community._id}`}
                        className="flex-1 bg-secondary text-foreground py-2.5 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors border border-border flex items-center justify-center gap-2"
                      >
                        Visit Community <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button 
                        onClick={() => handleJoin(community._id)}
                        disabled={isJoining === community._id}
                        className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                        {isJoining === community._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                        Join Community
                      </button>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
