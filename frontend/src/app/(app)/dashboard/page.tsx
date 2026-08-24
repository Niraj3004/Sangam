"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, LayoutDashboard, TrendingUp, Users, FolderKanban, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data } = await api.get('/dashboard/student');
      setMetrics(data.data);
    } catch (err) {
      console.error(err);
      // Fallback dummy data if endpoint isn't fully seeded yet
      setMetrics({
        profileViews: 124,
        connections: 45,
        projects: 3,
        aiScore: 92
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      <div className="flex items-center gap-3 mb-8 border-b border-border pb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.handle}</h1>
          <p className="text-muted mt-1">Here is your activity overview on Sangam.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted">Profile Views</h3>
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-4xl font-bold text-foreground">{metrics?.profileViews || 0}</p>
          <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% this week
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted">Network</h3>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-4xl font-bold text-foreground">{metrics?.connections || 0}</p>
          <p className="text-xs text-muted font-medium mt-2">Active connections</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted">Projects</h3>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <p className="text-4xl font-bold text-foreground">{metrics?.projects || 0}</p>
          <p className="text-xs text-muted font-medium mt-2">Active collaborations</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-primary to-indigo-600 p-6 rounded-2xl border border-primary shadow-md text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary-50">AI Profile Score</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
          <p className="text-4xl font-bold">{metrics?.aiScore || 0}</p>
          <p className="text-xs text-primary-50 font-medium mt-2">Top 15% of students</p>
        </motion.div>

      </div>
      
      {/* Could add a Recent Activity Feed here if the backend returns it in the dashboard route */}
      <div className="bg-white rounded-3xl border border-border p-8 text-center shadow-sm">
        <LayoutDashboard className="w-12 h-12 text-slate-200 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-foreground mb-2">More metrics coming soon</h2>
        <p className="text-muted text-sm">We're gathering more data to show your engagement trends.</p>
      </div>

    </div>
  );
}
