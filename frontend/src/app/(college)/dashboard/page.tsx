"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { motion } from "framer-motion";
import { 
  Users, 
  CalendarDays, 
  TrendingUp, 
  ChevronRight,
  GraduationCap,
  Briefcase,
  Plus,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

export default function CollegeDashboard() {
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
            Institutional Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Overview of Kathmandu University's network on Sangam.</p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/college/events/new" className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            New Event
          </Link>
          <Link href="/college/communities/new" className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20">
            <Plus className="w-4 h-4" />
            Create Community
          </Link>
        </div>
      </motion.div>

      {/* Analytics KPI Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-1">1,240</h3>
          <p className="text-sm text-slate-500 font-medium">Verified Students</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> +4%
            </span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-1">856</h3>
          <p className="text-sm text-slate-500 font-medium">Verified Alumni</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <CalendarDays className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-1">4</h3>
          <p className="text-sm text-slate-500 font-medium">Active Events</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-1">2</h3>
          <p className="text-sm text-slate-500 font-medium">Official Communities</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Events / Hackathons */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Active Institutional Events</h3>
              <Link href="/college/events" className="text-sm font-medium text-blue-600 hover:underline">View all events</Link>
            </div>
            
            <div className="space-y-4">
              {/* Fake Data Cards */}
              <div className="border border-slate-100 rounded-2xl p-5 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex flex-col items-center justify-center border border-slate-200">
                    <span className="text-xs font-bold text-rose-500 uppercase">Oct</span>
                    <span className="text-xl font-black text-slate-900">24</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">KU Hackathon 2026</h4>
                    <p className="text-sm text-slate-500">Dhulikhel Campus • 142 RSVPs</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Published</span>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              <div className="border border-slate-100 rounded-2xl p-5 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex flex-col items-center justify-center border border-slate-200">
                    <span className="text-xs font-bold text-rose-500 uppercase">Nov</span>
                    <span className="text-xl font-black text-slate-900">12</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">AI Guest Lecture</h4>
                    <p className="text-sm text-slate-500">Virtual (Zoom) • 89 RSVPs</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Published</span>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          </motion.section>

        </div>

        {/* Right Column (Narrow) */}
        <div className="space-y-8">
          
          {/* Recent Alumni Placements */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
          >
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-500" /> Recent Alumni Hires
            </h3>
            
            <div className="space-y-5">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500">R</div>
                <div>
                  <p className="text-sm text-slate-900 font-medium">Rahul Sharma (Batch '24)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Started as Software Engineer at <strong className="text-slate-700">F1Soft</strong></p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500">A</div>
                <div>
                  <p className="text-sm text-slate-900 font-medium">Anusha Thapa (Batch '23)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Promoted to UI/UX Lead at <strong className="text-slate-700">Esewa</strong></p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500">B</div>
                <div>
                  <p className="text-sm text-slate-900 font-medium">Bikash KC (Batch '25)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Started Internship at <strong className="text-slate-700">Leapfrog</strong></p>
                </div>
              </div>
            </div>
            
            <Link href="/college/alumni" className="mt-6 block w-full py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-center text-sm font-bold hover:bg-slate-100 transition-colors">
              View Alumni Directory
            </Link>
          </motion.section>

        </div>

      </div>
    </div>
  );
}
