"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Sparkles, Users, FolderKanban, Loader2, UserPlus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export default function MatchesPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"people" | "projects">("people");
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [activeTab]);

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const endpoint = activeTab === "people" ? '/match/people' : '/match/projects';
      const { data } = await api.get(endpoint);
      setMatches((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      await api.post(`/connections/request/${userId}`, {
        purpose: 'networking',
        message: 'Hi! Sangam AI recommended we connect based on our shared interests.'
      });
      alert("Connection request sent!");
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Failed to send request.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm border border-primary/20">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">AI Matchmaker</h1>
        <p className="text-muted mt-2 max-w-lg">
          The Sangam AI engine continuously analyzes your profile, skills, and goals to find the best people and projects for you to collaborate with.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-2 border border-border shadow-sm flex items-center mb-8 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab("people")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === "people" ? "bg-primary text-white shadow-md" : "text-muted hover:bg-slate-50"
          }`}
        >
          <Users className="w-4 h-4" /> People for you
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === "projects" ? "bg-primary text-white shadow-md" : "text-muted hover:bg-slate-50"
          }`}
        >
          <FolderKanban className="w-4 h-4" /> Projects for you
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-32 bg-white border border-border rounded-2xl border-dashed">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground">Not enough data</h3>
          <p className="text-muted mt-2 max-w-md mx-auto">
            We need more information about your skills and interests to generate accurate AI matches. Try completing your profile.
          </p>
          <Link href="/profile/edit" className="inline-flex items-center gap-2 mt-6 bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm">
            Complete Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {matches.map((match, index) => {
              
              if (activeTab === "people") {
                const person = match.user; // The matched profile
                return (
                  <motion.div
                    key={person._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col md:flex-row gap-6 relative"
                  >
                    <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl border-b border-l border-emerald-100 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      {match.score}% Match
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full border-4 border-slate-50 bg-slate-100 flex items-center justify-center text-3xl font-bold text-primary overflow-hidden shadow-sm mb-3">
                        {person.user?.profilePic ? (
                          <img src={person.user.profilePic} alt={person.user.handle} className="w-full h-full object-cover" />
                        ) : (
                          person.user?.handle?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <Link href={`/u/${person.user?.handle}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1">
                        {person.user?.handle}
                        <VerifiedBadge tier={person.user?.verifyTier} />
                      </Link>
                    </div>

                    <div className="flex-1 flex flex-col pt-2">
                      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-4 flex-1">
                        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" /> Why you match
                        </h4>
                        <p className="text-sm text-indigo-950 font-medium leading-relaxed">
                          {match.explanation}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-auto border-t border-border pt-4">
                        <div className="flex flex-wrap gap-2">
                          {person.skills?.slice(0, 3).map((s: any, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-slate-50 border border-border text-xs font-medium text-muted rounded-md">
                              {s.name}
                            </span>
                          ))}
                        </div>
                        <button 
                          onClick={() => handleConnect(person.user?._id)}
                          className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <UserPlus className="w-4 h-4" /> Connect
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              } 
              
              else {
                // Projects
                const project = match.project;
                return (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row relative"
                  >
                    <div className="absolute top-0 right-0 z-10 bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl border-b border-l border-emerald-100 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      {match.score}% Match
                    </div>

                    <div className="w-full md:w-1/3 h-48 md:h-auto bg-slate-100 relative">
                      {project.coverImage ? (
                        <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-indigo-600/10" />
                      )}
                    </div>

                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                      <Link href={`/projects/${project._id}`} className="hover:text-primary transition-colors">
                        <h3 className="text-xl font-bold text-foreground mb-3 pr-24">{project.title}</h3>
                      </Link>

                      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-6 flex-1">
                        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" /> Why this project fits you
                        </h4>
                        <p className="text-sm text-indigo-950 font-medium leading-relaxed">
                          {match.explanation}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                            Lead by {project.owner?.handle}
                            <VerifiedBadge tier={project.owner?.verifyTier} />
                          </span>
                        </div>
                        <Link 
                          href={`/projects/${project._id}`}
                          className="bg-secondary text-foreground px-5 py-2 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors border border-border flex items-center gap-1.5"
                        >
                          View Open Roles <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              }
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
