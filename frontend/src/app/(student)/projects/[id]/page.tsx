"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Loader2, ArrowLeft, Users, Code, Globe, Briefcase, CheckCircle2, XCircle, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [project, setProject] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Apply Modal state
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${params.id}`);
      setProject(data.data);
      
      // If owner, fetch applications
      if (user?._id === data.data.owner?._id) {
        const appsRes = await api.get(`/projects/${params.id}/applications`);
        setApplications(appsRes.data.data || []);
      }
    } catch (err: any) {
      console.error(err);
      router.push('/projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProject();
    }
  }, [params.id, user]);

  const handleApply = async () => {
    if (!selectedRole) return;
    setIsApplying(true);
    try {
      await api.post(`/projects/${params.id}/apply`, {
        roleId: selectedRole._id,
        message: applyMessage
      });
      alert("Application sent successfully!");
      setSelectedRole(null);
      setApplyMessage("");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error?.message || "Failed to apply. You may have already applied.");
    } finally {
      setIsApplying(false);
    }
  };

  const resolveApplication = async (appId: string, status: 'accepted' | 'rejected') => {
    try {
      await api.post(`/projects/${params.id}/applications/${appId}/resolve`, { status });
      // Remove from list
      setApplications(prev => prev.filter(app => app._id !== appId));
      // Refresh project to update member list if accepted
      if (status === 'accepted') fetchProject();
    } catch (err: any) {
      console.error(err);
      alert("Failed to resolve application");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!project) return null;

  const isOwner = user?._id === project.owner?._id;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Hub
      </Link>

      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
        
        {/* Cover */}
        <div className="h-48 w-full bg-slate-100 relative">
          {project.coverImage ? (
            <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary to-indigo-600 opacity-90" />
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-sm font-bold px-4 py-1.5 rounded-full shadow-sm text-foreground capitalize">
            Status: <span className={project.status === 'open' ? 'text-emerald-600' : 'text-slate-600'}>{project.status}</span>
          </div>
        </div>

        <div className="p-8 md:p-12">
          
          <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                {project.title}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags?.map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-slate-50 border border-border text-sm font-medium text-muted rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {project.repositoryUrl && (
                  <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors bg-slate-50 px-4 py-2 rounded-lg border border-border">
                    <Code className="w-4 h-4" /> Repository
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors bg-slate-50 px-4 py-2 rounded-lg border border-border">
                    <Globe className="w-4 h-4" /> Live Demo
                  </a>
                )}
              </div>
            </div>

            <Link href={`/u/${project.owner?.handle}`} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-border hover:border-primary/30 transition-colors w-full md:w-auto">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-primary overflow-hidden shadow-sm">
                {project.owner?.profilePic ? (
                  <img src={project.owner.profilePic} alt={project.owner.handle} className="w-full h-full object-cover" />
                ) : (
                  project.owner?.handle?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  {project.owner?.handle}
                  <VerifiedBadge tier={project.owner?.verifyTier} />
                </span>
                <span className="text-xs text-muted block mt-0.5">Project Lead</span>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h3 className="text-xl font-bold text-foreground mb-4">About the Project</h3>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-500" /> Open Roles
                </h3>
                
                {project.roles?.length === 0 ? (
                  <p className="text-muted italic">No open roles currently.</p>
                ) : (
                  <div className="space-y-4">
                    {project.roles?.map((role: any) => {
                      const isFilled = role.status === 'filled';
                      return (
                        <div key={role._id} className={`p-6 rounded-2xl border ${isFilled ? 'bg-slate-50 border-border opacity-75' : 'bg-white border-border shadow-sm'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                              {role.title}
                              {isFilled && <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">Filled</span>}
                            </h4>
                            {!isOwner && !isFilled && project.status === 'open' && (
                              <button 
                                onClick={() => setSelectedRole(role)}
                                className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
                              >
                                <UserPlus className="w-4 h-4" /> Apply
                              </button>
                            )}
                          </div>
                          
                          <p className="text-sm text-foreground/80 mb-4">
                            {role.description}
                          </p>

                          {role.requirements && role.requirements.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {role.requirements.map((req: string, i: number) => (
                                <span key={i} className="px-2.5 py-1 bg-slate-100 text-xs font-medium text-slate-600 rounded-md">
                                  {req}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <div className="lg:col-span-1 space-y-8">
              
              <section className="bg-slate-50/50 p-6 rounded-2xl border border-border">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-500" /> Team Members
                </h3>
                {project.members?.length === 0 ? (
                  <p className="text-sm text-muted italic">Just the project lead right now.</p>
                ) : (
                  <div className="space-y-3">
                    {project.members?.map((member: any) => (
                      <Link key={member._id} href={`/u/${member.user?.handle}`} className="flex items-center gap-3 hover:bg-white p-2 rounded-xl transition-colors border border-transparent hover:border-border hover:shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                          {member.user?.profilePic ? (
                            <img src={member.user.profilePic} alt={member.user.handle} className="w-full h-full object-cover" />
                          ) : (
                            member.user?.handle?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-foreground flex items-center gap-1">
                            {member.user?.handle}
                            <VerifiedBadge tier={member.user?.verifyTier} />
                          </span>
                          <span className="text-xs text-muted block">{member.roleTitle}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Owner Applicants Panel */}
              {isOwner && applications.length > 0 && (
                <section className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                  <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5" /> Pending Applications
                  </h3>
                  <div className="space-y-4">
                    {applications.map(app => (
                      <div key={app._id} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <Link href={`/u/${app.applicant?.handle}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1">
                              {app.applicant?.handle}
                            </Link>
                            <span className="text-xs text-muted">Applied for: {app.role?.title}</span>
                          </div>
                        </div>
                        {app.message && (
                          <p className="text-xs text-foreground/80 mb-3 bg-slate-50 p-2 rounded-lg border border-border">
                            "{app.message}"
                          </p>
                        )}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => resolveApplication(app._id, 'accepted')}
                            className="flex-1 bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Accept
                          </button>
                          <button 
                            onClick={() => resolveApplication(app._id, 'rejected')}
                            className="flex-1 bg-slate-100 text-foreground text-xs font-bold py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                          >
                            <XCircle className="w-3 h-3" /> Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {selectedRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h3 className="text-lg font-bold text-foreground">
                  Apply for {selectedRole.title}
                </h3>
                <button onClick={() => setSelectedRole(null)} className="text-muted hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <label className="text-sm font-medium text-foreground block mb-2">Why are you a good fit? (Optional)</label>
                <textarea 
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  rows={4}
                  placeholder="Share a brief note with the project lead..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all resize-none"
                />
                <p className="text-xs text-muted mt-2">
                  Your full profile will be automatically attached to this application.
                </p>
              </div>

              <div className="p-6 border-t border-border bg-slate-50 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedRole(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApply}
                  disabled={isApplying}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {isApplying && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Application
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
