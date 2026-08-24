"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Briefcase, Loader2, Plus, MapPin, DollarSign, Building2, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export default function JobsHubPage() {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create Job Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "full-time",
    description: "",
    requirements: "",
    salaryRange: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/jobs');
      setJobs(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description) return;
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split(',').map(s => s.trim()).filter(Boolean)
      };
      
      const { data } = await api.post('/jobs', payload);
      setJobs([data.data, ...jobs]);
      setIsModalOpen(false);
      setFormData({
        title: "", company: "", location: "", type: "full-time", description: "", requirements: "", salaryRange: ""
      });
      alert("Job posted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to post job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 relative">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Jobs & Internships</h1>
          <p className="text-muted mt-2">Discover verified opportunities posted by organizations and alumni.</p>
        </div>
        
        {/* Only organizations or admin/alumni might typically post jobs, but we'll leave it open based on requirements */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Post a Job
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border p-4 mb-8 flex flex-col sm:flex-row gap-4 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input 
            type="text" 
            placeholder="Search roles or companies..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>
        <select className="px-4 py-2.5 rounded-xl bg-slate-50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-foreground">
          <option value="">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="internship">Internship</option>
          <option value="contract">Contract</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-32 bg-white border border-border rounded-2xl border-dashed">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">No jobs posted yet</h3>
          <p className="text-muted mt-2">Check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-lg font-bold text-primary shrink-0 border border-border/50">
                    {job.company?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground leading-tight">
                      <Link href={`/jobs/${job._id}`} className="hover:text-primary transition-colors">{job.title}</Link>
                    </h3>
                    <p className="text-sm font-medium text-muted flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-4 h-4" /> {job.company}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-md">
                  {job.type}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mb-6 text-sm text-foreground/80 font-medium bg-slate-50 p-3 rounded-xl border border-border">
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-muted" /> {job.location || 'Remote'}</div>
                {job.salaryRange && <div className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-600" /> {job.salaryRange}</div>}
              </div>

              <p className="text-sm text-foreground/80 line-clamp-2 mb-6">
                {job.description}
              </p>

              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted font-medium">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <Link 
                  href={`/jobs/${job._id}`}
                  className="bg-slate-100 text-foreground px-5 py-2 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Post Job Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" /> Post a Job
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePostJob} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Job Title *</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Frontend Developer"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Company Name *</label>
                    <input 
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      placeholder="e.g. Acme Corp"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Location</label>
                    <input 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. Remote, NYC"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Job Type *</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="internship">Internship</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Salary Range</label>
                    <input 
                      value={formData.salaryRange}
                      onChange={(e) => setFormData({...formData, salaryRange: e.target.value})}
                      placeholder="e.g. $80k - $100k"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Description *</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={5}
                    placeholder="Describe the role..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Requirements</label>
                  <input 
                    value={formData.requirements}
                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                    placeholder="e.g. React, Node.js (comma separated)"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                  />
                </div>

                <div className="pt-6 border-t border-border flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Post Job
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
