"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Lightbulb, Users, MessageSquare, Plus, Loader2, X, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function IdeasHubPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchIdeas = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/ideas');
      setIdeas(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const onSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Split skills by comma
      const payload = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(',').map((s: string) => s.trim()).filter(Boolean),
        lookingFor: formData.lookingFor.split(',').map((s: string) => s.trim()).filter(Boolean)
      };
      await api.post('/ideas', payload);
      alert("Idea posted successfully!");
      setIsModalOpen(false);
      reset();
      fetchIdeas(); // Refresh the list
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error?.message || "Failed to post idea.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 relative">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Idea Marketplace</h1>
          <p className="text-muted mt-2">Discover startups, side-projects, and research ideas from other students.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Pitch an Idea
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : ideas.length === 0 ? (
        <div className="text-center py-32 bg-white border border-border rounded-2xl border-dashed">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">No ideas pitched yet</h3>
          <p className="text-muted mt-2">Be the first to share your vision with the community.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
          {ideas.map((idea, index) => (
            <motion.div
              key={idea._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow break-inside-avoid relative group"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-md uppercase tracking-wider">
                    {idea.stage}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 text-muted text-xs font-semibold rounded-md uppercase tracking-wider">
                    {idea.category}
                  </span>
                </div>
                
                <Link href={`/ideas/${idea._id}`} className="hover:text-primary transition-colors">
                  <h2 className="text-xl font-bold text-foreground leading-tight mb-2">{idea.title}</h2>
                </Link>

                <p className="text-sm text-foreground/80 line-clamp-4 mb-4">
                  <span className="font-semibold block mb-1">The Problem:</span>
                  {idea.problem}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {idea.skillsRequired?.slice(0, 3).map((skill: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-slate-50 border border-border text-xs font-medium text-muted rounded-md">
                      {skill}
                    </span>
                  ))}
                  {idea.skillsRequired?.length > 3 && (
                    <span className="px-2 py-1 bg-slate-50 border border-border text-xs font-medium text-muted rounded-md">
                      +{idea.skillsRequired.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Link href={`/u/${idea.owner?.handle}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                      {idea.owner?.profilePic ? (
                        <img src={idea.owner.profilePic} alt={idea.owner.handle} className="w-full h-full object-cover" />
                      ) : (
                        idea.owner?.handle?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                      {idea.owner?.handle}
                      <VerifiedBadge tier={idea.owner?.verifyTier} />
                    </span>
                  </Link>

                  <div className="flex items-center gap-3 text-muted text-sm font-medium">
                    <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {idea.interested?.length || 0}</div>
                    <div className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {idea.team?.length || 0}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Idea Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" /> Pitch an Idea
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Idea Title *</label>
                  <input 
                    {...register("title", { required: true })}
                    placeholder="e.g. AI-powered note taking app for students"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Category *</label>
                    <select 
                      {...register("category", { required: true })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    >
                      <option value="tech">Technology / Software</option>
                      <option value="business">Business / Commerce</option>
                      <option value="social">Social Impact</option>
                      <option value="research">Academic Research</option>
                      <option value="creative">Creative / Media</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Current Stage *</label>
                    <select 
                      {...register("stage", { required: true })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    >
                      <option value="concept">Concept Phase (Just an idea)</option>
                      <option value="prototyping">Prototyping (Building MVP)</option>
                      <option value="mvp">MVP Ready (Needs testing)</option>
                      <option value="growth">Growth (Looking to scale)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">What problem are you solving? *</label>
                  <textarea 
                    {...register("problem", { required: true })}
                    rows={3}
                    placeholder="Describe the pain point clearly..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">What is your proposed solution? *</label>
                  <textarea 
                    {...register("solution", { required: true })}
                    rows={3}
                    placeholder="How does your idea solve the problem?"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Skills Required</label>
                    <input 
                      {...register("skillsRequired")}
                      placeholder="e.g. React, Node.js, Design (comma separated)"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Looking For</label>
                    <input 
                      {...register("lookingFor")}
                      placeholder="e.g. Co-founder, Developer, Feedback"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Visibility</label>
                  <select 
                    {...register("visibility")}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                  >
                    <option value="public">Public (Visible to everyone)</option>
                    <option value="private">Private (Only visible via link)</option>
                  </select>
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
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                    Pitch Idea
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
