"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, Building2, Globe, Users, Plus, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export default function OrganizationsPage() {
  const { user } = useAuthStore();
  const [orgs, setOrgs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Register Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    industry: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/orgs');
      setOrgs((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) return;
    
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/orgs', formData);
      setOrgs([data.data, ...orgs]);
      setIsModalOpen(false);
      setFormData({ name: "", description: "", website: "", industry: "" });
      alert("Organization registered successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Failed to register organization.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 shadow-sm border border-indigo-100">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Organizations</h1>
          <p className="text-muted mt-2 max-w-xl">
            Discover companies, startups, and university groups actively hiring and collaborating on Sangam.
          </p>
        </div>
        
        {user?.role !== 'student' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Register Org
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : orgs.length === 0 ? (
        <div className="text-center py-32 bg-white border border-border rounded-2xl border-dashed">
          <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground">No organizations found</h3>
          <p className="text-muted mt-2">Check back later or register your own organization.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orgs.map((org, idx) => (
            <motion.div
              key={org._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col p-6 relative"
            >
              {org.isVerified && (
                <div className="absolute top-4 right-4 px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-emerald-100">
                  Verified
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-border flex items-center justify-center text-xl font-bold text-primary overflow-hidden shrink-0">
                  {org.logo ? (
                    <img src={org.logo} alt={org.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    org.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground leading-tight">{org.name}</h3>
                  <p className="text-xs text-muted font-medium mt-0.5">{org.industry || "General"}</p>
                </div>
              </div>

              <p className="text-sm text-foreground/80 line-clamp-3 mb-6 flex-1">
                {org.description}
              </p>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                  <Users className="w-4 h-4" /> {org.members?.length || 0} Members
                </div>
                <Link 
                  href={`/organizations/${org._id}`}
                  className="text-primary text-sm font-bold hover:text-primary-hover transition-colors flex items-center gap-1"
                >
                  View Profile <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Register Org Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" /> Register Organization
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleRegister} className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Organization Name *</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Industry</label>
                    <input 
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      placeholder="e.g. Tech, Finance"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Website</label>
                    <input 
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="https://"
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
                    rows={4}
                    placeholder="What does your organization do?"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Register
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
