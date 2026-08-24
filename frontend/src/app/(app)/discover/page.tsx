"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Search, MapPin, UserPlus, Filter, Loader2, X, Briefcase, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function DiscoverPeoplePage() {
  const [people, setPeople] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    skill: "",
    country: "",
    lookingFor: ""
  });

  // Modal State
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [connectPurpose, setConnectPurpose] = useState("collaboration");
  const [connectNote, setConnectNote] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const fetchPeople = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.skill) query.append('skill', filters.skill);
      if (filters.country) query.append('country', filters.country);
      if (filters.lookingFor) query.append('lookingFor', filters.lookingFor);
      
      const { data } = await api.get(`/discover/people?${query.toString()}`);
      setPeople(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, [filters]);

  const handleConnect = async () => {
    if (!selectedUser) return;
    setIsConnecting(true);
    try {
      await api.post(`/connections/request/${selectedUser._id}`, {
        purpose: connectPurpose,
        message: connectNote
      });
      alert("Connection request sent!");
      setSelectedUser(null);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to send request. You may be rate limited or already connected.");
    } finally {
      setIsConnecting(false);
      setConnectNote("");
    }
  };

  return (
    <div className="flex gap-8 max-w-7xl mx-auto pb-20">
      
      {/* Sidebar Filters */}
      <div className="w-72 flex-shrink-0 hidden lg:block">
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm sticky top-24">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </h3>
          
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Skill</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="text"
                  placeholder="e.g. React"
                  value={filters.skill}
                  onChange={(e) => setFilters(prev => ({...prev, skill: e.target.value}))}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Country</label>
              <select 
                value={filters.country}
                onChange={(e) => setFilters(prev => ({...prev, country: e.target.value}))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
              >
                <option value="">Anywhere</option>
                <option value="Nepal">Nepal</option>
                <option value="USA">USA</option>
                <option value="Australia">Australia</option>
                <option value="UK">UK</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Looking For</label>
              <select 
                value={filters.lookingFor}
                onChange={(e) => setFilters(prev => ({...prev, lookingFor: e.target.value}))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
              >
                <option value="">Anything</option>
                <option value="Mentorship">Mentorship</option>
                <option value="Hackathon Team">Hackathon Team</option>
                <option value="Cofounder">Cofounder</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Discover People</h1>
          <Link href="/network" className="text-sm font-medium text-primary hover:text-primary-hover bg-primary/5 px-4 py-2 rounded-lg transition-colors">
            Manage Network
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : people.length === 0 ? (
          <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">No people found</h3>
            <p className="text-muted mt-2">Try adjusting your filters to discover more students.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {people.map((person, index) => (
              <motion.div
                key={person._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Banner */}
                <div className="h-16 bg-gradient-to-r from-primary/80 to-indigo-600/80 w-full relative">
                  {person.matchScore && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-emerald-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      {person.matchScore}% Match
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col items-center text-center -mt-10 relative z-10">
                  <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-100 shadow-sm flex items-center justify-center overflow-hidden mb-3 text-2xl font-bold text-primary">
                    {person.user?.profilePic ? (
                      <img src={person.user.profilePic} alt={person.user.handle} className="w-full h-full object-cover" />
                    ) : (
                      person.user?.handle?.charAt(0).toUpperCase()
                    )}
                  </div>
                  
                  <Link href={`/u/${person.user?.handle}`} className="hover:text-primary transition-colors">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-1.5 justify-center">
                      {person.user?.handle}
                      <VerifiedBadge tier={person.user?.verifyTier} />
                    </h3>
                  </Link>

                  <p className="text-sm text-muted line-clamp-2 mt-2 mb-4">
                    {person.bio || "No bio provided."}
                  </p>

                  <div className="flex flex-wrap gap-1.5 justify-center mb-4 mt-auto">
                    {person.skills?.slice(0, 3).map((s: any, i: number) => (
                      <span key={i} className="px-2 py-1 bg-slate-50 border border-border text-xs font-medium text-foreground rounded-md">
                        {s.name}
                      </span>
                    ))}
                    {person.skills?.length > 3 && (
                      <span className="px-2 py-1 bg-slate-50 border border-border text-xs font-medium text-muted rounded-md">
                        +{person.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-border bg-slate-50 flex gap-2">
                  <button 
                    onClick={() => setSelectedUser(person.user)}
                    className="flex-1 bg-primary text-white py-2 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" /> Connect
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Connect Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  Connect with {selectedUser.handle}
                </h3>
                <button onClick={() => setSelectedUser(null)} className="text-muted hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Purpose of Connection</label>
                  <select 
                    value={connectPurpose}
                    onChange={(e) => setConnectPurpose(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                  >
                    <option value="collaboration">Project Collaboration</option>
                    <option value="idea">Discuss an Idea</option>
                    <option value="startup">Startup / Cofounder</option>
                    <option value="job">Job / Recruitment</option>
                    <option value="academic">Academic Help</option>
                    <option value="open_source">Open Source</option>
                    <option value="networking">General Networking</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Personalized Note (Optional)</label>
                  <textarea 
                    value={connectNote}
                    onChange={(e) => setConnectNote(e.target.value)}
                    rows={3}
                    placeholder="Hi, I noticed we share an interest in React and hackathons..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all resize-none"
                  />
                  <p className="text-xs text-muted mt-1.5 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    Adding a purposeful note increases acceptance rate.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-slate-50 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {isConnecting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
