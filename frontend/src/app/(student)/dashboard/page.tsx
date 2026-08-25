"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { 
  Sparkles, 
  Briefcase, 
  ChevronRight, 
  Trophy, 
  Target, 
  Rocket, 
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Loader2,
  Lightbulb,
  Terminal,
  Building,
  ArrowRight,
  Activity
} from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  
  // Data States
  const [profile, setProfile] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Fetch data in parallel
      const [profileRes, oppsRes, projsRes, reqsRes, commsRes, orgsRes, hacksRes] = await Promise.allSettled([
        api.get('/profile/me'),
        api.get('/opportunities?limit=2'),
        api.get('/ideas'), // Using /ideas instead of /projects
        api.get('/connections/pending'), // Fixed 404: /connections/requests -> /connections/pending
        api.get('/communities?limit=3'),
        api.get('/orgs?limit=3'),
        api.get('/opportunities?type=hackathon&limit=2')
      ]);

      const getArray = (data: any) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.opportunities)) return data.opportunities;
        if (Array.isArray(data.communities)) return data.communities;
        if (Array.isArray(data.organizations)) return data.organizations;
        const found = Object.values(data).find(Array.isArray);
        return Array.isArray(found) ? found : [];
      };

      if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data.data);
      if (oppsRes.status === 'fulfilled') setMatches(getArray(oppsRes.value.data.data).slice(0, 2));
      if (projsRes.status === 'fulfilled') setIdeas(getArray(projsRes.value.data.data).slice(0, 3));
      if (reqsRes.status === 'fulfilled') setRequests(getArray(reqsRes.value.data.data));
      if (commsRes.status === 'fulfilled') setCommunities(getArray(commsRes.value.data.data).slice(0, 3));
      if (orgsRes.status === 'fulfilled') setOrgs(getArray(orgsRes.value.data.data).slice(0, 3));
      if (hacksRes.status === 'fulfilled') setHackathons(getArray(hacksRes.value.data.data).slice(0, 2));
      
    } catch (err) {
      console.error("Dashboard fetch error", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !user) return null;

  return (
    <div className="pb-12">
      {/* Header Section */}
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user.handle || 'Student'}! 👋
          </h1>
          <p className="text-slate-500 mt-1">Here's what's happening in your career journey today.</p>
        </div>
        
        {user.verifyTier === 'unverified' && (
          <Link href="/settings" className="bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-rose-100 transition-colors">
            <AlertCircle className="w-4 h-4" />
            Action Required: Verify Account
          </Link>
        )}
      </motion.div>

      {/* Top Banner (Combined AI Copilot + Quick Launch) */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-1/4 p-8 opacity-10">
            <Sparkles className="w-64 h-64" />
          </div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-300" />
              <span className="text-sm font-bold tracking-widest text-indigo-300 uppercase">AI Copilot</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">2 steps to "Internship Ready"</h2>
            <p className="text-indigo-200 max-w-lg mb-6">Our AI analyzed your profile. Complete these high-impact tasks to boost your visibility to employers.</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 flex items-center gap-4 hover:bg-white/20 transition-colors cursor-pointer group">
                <FileText className="w-5 h-5 text-indigo-200 group-hover:text-white transition-colors" />
                <div>
                  <h4 className="font-bold text-sm">Generate AI Resume</h4>
                  <p className="text-[10px] text-indigo-200">Takes 2 minutes</p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 flex items-center gap-4 hover:bg-white/20 transition-colors cursor-pointer group">
                <Briefcase className="w-5 h-5 text-indigo-200 group-hover:text-white transition-colors" />
                <div>
                  <h4 className="font-bold text-sm">Apply to F1Soft</h4>
                  <p className="text-[10px] text-indigo-200">High match based on skills</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-auto shrink-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-indigo-100 text-sm uppercase tracking-wider">
              <Rocket className="w-4 h-4 text-indigo-300" /> Quick Launch
            </h3>
            <div className="flex flex-col gap-2">
              <Link href="/copilot" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-colors border border-white/5 group">
                <div className="bg-white/10 p-2 rounded-lg text-white group-hover:scale-110 transition-transform"><Sparkles className="w-4 h-4" /></div>
                <div className="flex-1 pr-6">
                  <p className="text-sm font-bold text-white group-hover:text-white transition-colors">AI Chat</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/matches" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-colors border border-white/5 group">
                <div className="bg-white/10 p-2 rounded-lg text-white group-hover:scale-110 transition-transform"><Users className="w-4 h-4" /></div>
                <div className="flex-1 pr-6">
                  <p className="text-sm font-bold text-white group-hover:text-white transition-colors">Peer Match</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-8">
          


          {/* Partner Spotlight / Featured */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-1 shadow-md relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <div className="bg-slate-900/50 backdrop-blur-md rounded-[26px] p-6 relative z-10 flex flex-col md:flex-row md:items-center gap-6 border border-slate-700/50">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-md p-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-emerald-500/30">Sponsored Opportunity</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Google STEP Internship 2026</h3>
                  <p className="text-sm text-slate-300 line-clamp-2">Applications are now open for 1st and 2nd year students. Get 12 weeks of hands-on technical training and mentorship.</p>
                </div>
                <div className="shrink-0 mt-2 md:mt-0">
                  <Link href="/jobs" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors shadow-sm group-hover:scale-105 transform duration-300">
                    Apply Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Curated Opportunities */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" /> Top Matches for You
              </h3>
              <Link href="/feed" className="text-sm font-bold text-primary hover:underline">View all</Link>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : matches.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
                <Target className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700">No matches found yet</h4>
                <p className="text-sm text-slate-500">Check back later for new opportunities.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map((match: any) => (
                  <Link href={`/feed/${match._id}`} key={match._id} className="bg-white border border-slate-200 rounded-3xl p-5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group block">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl uppercase shadow-sm">
                        {match.orgId?.name?.charAt(0) || match.title?.charAt(0)}
                      </div>
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border border-emerald-100">Top Match</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1 line-clamp-1">{match.title}</h4>
                    <p className="text-sm text-slate-500 mb-4 font-medium line-clamp-1">{match.orgId?.name || "Verified Organization"} • {match.location || "Remote"}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {match.deadline ? new Date(match.deadline).toLocaleDateString() : 'Active'}</span>
                      <div className="text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">Apply &rarr;</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.section>

          {/* Project Ideas Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-orange-500" /> Active Project Ideas
              </h3>
              <Link href="/ideas" className="text-sm font-bold text-primary hover:underline">View all</Link>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : ideas.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
                <Lightbulb className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700">No project ideas found</h4>
                <p className="text-sm text-slate-500 mt-1 mb-4">Be the first to share an idea and find co-founders!</p>
                <Link href="/ideas/new" className="inline-block bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-primary-hover">Share an Idea</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {ideas.map((idea: any) => (
                  <Link href={`/ideas/${idea._id}`} key={idea._id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group block">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-1 rounded-md">{idea.status || 'Seeking Team'}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-base mb-1">{idea.title}</h4>
                        <p className="text-sm text-slate-500 line-clamp-1">{idea.description}</p>
                      </div>
                      <div className="flex items-center gap-3 md:border-l md:border-slate-100 md:pl-5">
                        <div className="flex flex-col items-center justify-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                          <span className="text-lg font-black text-slate-700 group-hover:text-primary">{idea.upvotes || 0}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Upvotes</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.section>

          {/* Upcoming Hackathons */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-500" /> Upcoming Competitions
              </h3>
              <Link href="/jobs" className="text-sm font-bold text-primary hover:underline">Find more</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading ? (
                <div className="md:col-span-2 flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-muted" /></div>
              ) : hackathons.length === 0 ? (
                <div className="md:col-span-2 text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Terminal className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 font-medium">No active competitions found right now.</p>
                </div>
              ) : (
                hackathons.map((hack: any, i: number) => (
                  <div key={i} className="group p-5 bg-gradient-to-br from-emerald-50 to-teal-50/30 rounded-2xl border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                    <h4 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">{hack.title}</h4>
                    <p className="text-xs text-slate-600 mb-3 line-clamp-2">{hack.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">
                        {hack.location || 'Remote'}
                      </span>
                      <Link href={`/o/${hack._id}`} className="text-emerald-600 p-1.5 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.section>

        </div>

        {/* Right Column (Narrow) */}
        <div className="space-y-8">
          

          {/* Career Readiness Score */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
          >
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Career Readiness
            </h3>
            
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-32 h-32 rounded-full border-8 border-slate-100 relative flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary" strokeDasharray="289" strokeDashoffset={289 - (289 * (profile?.completionScore || 0)) / 100} strokeLinecap="round" />
                </svg>
                <div className="text-center">
                  <span className="text-3xl font-black text-slate-900">{profile?.completionScore || 0}%</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-4 text-center font-medium">Your profile completion score</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified Status</span>
                <span className="font-bold text-slate-900">100%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Portfolio</span>
                <span className="font-bold text-slate-900">80%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600"><div className="w-4 h-4 rounded-full border-2 border-slate-300" /> GitHub Sync</span>
                <span className="font-bold text-slate-400">0%</span>
              </div>
            </div>
            
            <Link href="/profile/edit" className="mt-6 block w-full py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-center text-sm font-bold hover:bg-slate-100 transition-colors">
              Improve Score
            </Link>
          </motion.section>

          {/* Network Activity */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
          >
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-rose-500" /> Network Activity
            </h3>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted" /></div>
              ) : requests.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-500">No new network activity.</p>
                </div>
              ) : (
                requests.slice(0, 3).map((req: any, i: number) => (
                  <div key={i} className="flex gap-3 items-start p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700"><strong>{req.senderId?.handle || 'Someone'}</strong> requested to connect with you.</p>
                      <span className="text-xs font-bold text-slate-400 mt-1 block">{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <Link href="/network" className="mt-6 block w-full py-2.5 text-primary text-center text-sm font-bold hover:underline">
              View all activity
            </Link>
          </motion.section>

          {/* Trending Communities */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
          >
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" /> Trending Communities
            </h3>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted" /></div>
              ) : communities.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-500">No active communities yet.</p>
                </div>
              ) : (
                communities.map((comm: any, i: number) => (
                  <Link href={`/communities/${comm._id}`} key={i} className="flex gap-3 items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100 group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold overflow-hidden shadow-sm">
                      {comm.iconUrl ? (
                        <img src={comm.iconUrl} alt={comm.name} className="w-full h-full object-cover" />
                      ) : (
                        comm.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{comm.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{comm.membersCount || 0} members</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
            
            <Link href="/communities" className="mt-6 block w-full py-2.5 text-primary text-center text-sm font-bold hover:underline">
              Explore communities
            </Link>
          </motion.section>

          {/* Weekly Analytics Widget */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-md text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            <h3 className="font-bold mb-6 flex items-center gap-2 text-white/90">
              <Activity className="w-5 h-5 text-emerald-400" /> Weekly Insights
            </h3>
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                <p className="text-xs text-white/60 font-medium mb-1 uppercase tracking-wider">Profile Views</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black">14</span>
                  <span className="text-xs text-emerald-400 font-bold mb-1">+3 this week</span>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                <p className="text-xs text-white/60 font-medium mb-1 uppercase tracking-wider">Search Appearances</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black">28</span>
                  <span className="text-xs text-emerald-400 font-bold mb-1">+12 this week</span>
                </div>
              </div>
            </div>
            
            <button className="mt-5 w-full py-2.5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-sm font-bold text-white">
              View Detailed Analytics
            </button>
          </motion.section>

          {/* Top Hiring Companies */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
          >
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Building className="w-5 h-5 text-sky-500" /> Featured Organizations
            </h3>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted" /></div>
              ) : orgs.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-500">No organizations found.</p>
                </div>
              ) : (
                orgs.map((org: any, i: number) => (
                  <div key={i} className="flex gap-3 items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 font-bold overflow-hidden shadow-sm border border-sky-100">
                      {org.logoUrl ? (
                        <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
                      ) : (
                        org.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{org.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{org.industry || 'Technology'} • {org.location || 'Nepal'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.section>


        </div>

      </div>
    </div>
  );
}
