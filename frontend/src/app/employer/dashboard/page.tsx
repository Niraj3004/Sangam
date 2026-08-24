"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { motion } from "framer-motion";
import { 
  Users, 
  Briefcase,
  Search,
  ChevronRight,
  TrendingUp,
  Plus,
  Star,
  Clock,
  CheckCircle2,
  MapPin
} from "lucide-react";
import Link from "next/link";

export default function EmployerDashboard() {
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Recruiter Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Manage your hiring pipeline for F1Soft International.</p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/employer/candidates" className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
            <Search className="w-4 h-4" />
            Search Candidates
          </Link>
          <Link href="/employer/jobs/new" className="bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-orange-700 transition-colors shadow-sm shadow-orange-500/20">
            <Plus className="w-4 h-4" />
            Post a Job
          </Link>
        </div>
      </motion.div>

      {/* Analytics Pipeline Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-1">3</h3>
          <p className="text-sm text-gray-500 font-medium">Active Job Posts</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> New
            </span>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-1">142</h3>
          <p className="text-sm text-gray-500 font-medium">Pending Applicants</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-1">12</h3>
          <p className="text-sm text-gray-500 font-medium">In Interview Stage</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-1">4</h3>
          <p className="text-sm text-gray-500 font-medium">Hired this month</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Job Listings */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Active Job Listings</h3>
              <Link href="/employer/jobs" className="text-sm font-medium text-orange-600 hover:underline">View all jobs</Link>
            </div>
            
            <div className="space-y-4">
              {/* Fake Data Cards */}
              <div className="border border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:bg-orange-50/30 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Frontend React Intern</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> Kathmandu (Hybrid)
                    </p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">Active</span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xl font-bold text-gray-900">89</p>
                      <p className="text-xs text-gray-500">Applicants</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">8</p>
                      <p className="text-xs text-gray-500">Interviewing</p>
                    </div>
                  </div>
                  <Link href="/employer/jobs/1/applicants" className="text-sm font-bold text-orange-600 flex items-center gap-1 group-hover:underline">
                    View Applicants <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="border border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:bg-orange-50/30 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Backend Node.js Developer</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> Remote
                    </p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">Active</span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xl font-bold text-gray-900">45</p>
                      <p className="text-xs text-gray-500">Applicants</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">3</p>
                      <p className="text-xs text-gray-500">Interviewing</p>
                    </div>
                  </div>
                  <Link href="/employer/jobs/2/applicants" className="text-sm font-bold text-orange-600 flex items-center gap-1 group-hover:underline">
                    View Applicants <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>

        </div>

        {/* Right Column (Narrow) */}
        <div className="space-y-8">
          
          {/* Top AI Candidate Matches */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm"
          >
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" /> AI Candidate Matches
            </h3>
            
            <p className="text-xs text-gray-500 mb-4">Students who perfectly match your active job postings based on their portfolio.</p>

            <div className="space-y-4">
              <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">R</div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">Rohan Shrestha</h4>
                      <p className="text-xs text-gray-500">Pulchowk Campus</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">98% Match</span>
                </div>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">Built an e-commerce site with React & Next.js. Has 2 open source PRs.</p>
                <button className="w-full py-2 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  Invite to Apply
                </button>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">S</div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">Sneha Gurung</h4>
                      <p className="text-xs text-gray-500">Kathmandu Univ.</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">94% Match</span>
                </div>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">Node.js backend developer with strong MongoDB experience.</p>
                <button className="w-full py-2 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  Invite to Apply
                </button>
              </div>
            </div>
            
            <Link href="/employer/candidates" className="mt-6 block w-full py-2.5 text-orange-600 text-center text-sm font-bold hover:underline">
              Search Database
            </Link>
          </motion.section>

        </div>

      </div>
    </div>
  );
}
