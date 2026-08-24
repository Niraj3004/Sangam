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
  FileText
} from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  return (
    <div className="pb-12">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Career Copilot Widget */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-48 h-48" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-300" />
                <span className="text-sm font-bold tracking-widest text-indigo-300 uppercase">AI Copilot Plan</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">You are 2 steps away from being "Internship Ready"</h2>
              <p className="text-indigo-200 mb-6 max-w-md">Our AI analyzed your profile. Complete these high-impact tasks to boost your visibility to employers.</p>
              
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between hover:bg-white/20 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/50 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold">Generate AI Resume</h4>
                      <p className="text-xs text-indigo-200">Takes 2 minutes</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-indigo-300 group-hover:translate-x-1 transition-transform" />
                </div>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between hover:bg-white/20 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/50 flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold">Apply to F1Soft Internship</h4>
                      <p className="text-xs text-indigo-200">High match based on your skills</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-indigo-300 group-hover:translate-x-1 transition-transform" />
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
                <Target className="w-5 h-5 text-primary" /> Top Matches for You
              </h3>
              <Link href="/feed" className="text-sm font-medium text-primary hover:underline">View all</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fake Data Cards for UI presentation */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">F</div>
                  <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold">98% Match</span>
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Frontend Intern</h4>
                <p className="text-sm text-slate-500 mb-4">F1Soft International • Kathmandu</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 2 days left</span>
                  <div className="text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">Apply &rarr;</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">L</div>
                  <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold">92% Match</span>
                </div>
                <h4 className="font-bold text-slate-900 mb-1">KU Hackathon 2026</h4>
                <p className="text-sm text-slate-500 mb-4">Kathmandu University • Dhulikhel</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><Users className="w-3 h-3" /> 142 attending</span>
                  <div className="text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">RSVP &rarr;</div>
                </div>
              </div>
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
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary" strokeDasharray="289" strokeDashoffset="63" strokeLinecap="round" />
                </svg>
                <div className="text-center">
                  <span className="text-3xl font-black text-slate-900">78%</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-4 text-center">Top 20% of CS students in Nepal</p>
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
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-slate-700"><strong>Sita Thapa</strong> requested to connect with you.</p>
                  <span className="text-xs text-slate-400">2 hours ago</span>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-slate-700">Your idea <strong>"AI Nepali OCR"</strong> got 15 upvotes!</p>
                  <span className="text-xs text-slate-400">Yesterday</span>
                </div>
              </div>
            </div>
            
            <Link href="/network" className="mt-6 block w-full py-2.5 text-primary text-center text-sm font-bold hover:underline">
              View all activity
            </Link>
          </motion.section>

        </div>

      </div>
    </div>
  );
}
