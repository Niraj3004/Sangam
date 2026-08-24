"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Briefcase, Users, Plus, Loader2, ArrowRight, FolderKanban } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProjectsHubPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data?.projects || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Hub</h1>
          <p className="text-muted mt-2">Discover open source projects, team collaborations, and join their mission.</p>
        </div>
        <Link 
          href="/projects/create"
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Start a Project
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-32 bg-white border border-border rounded-2xl border-dashed">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderKanban className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">No active projects</h3>
          <p className="text-muted mt-2">Be the first to start a project and recruit a team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Cover Image */}
              <div className="h-32 bg-slate-100 w-full relative">
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-100" />
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full shadow-sm text-foreground">
                  {project.status === 'open' ? (
                    <span className="text-emerald-600">Recruiting</span>
                  ) : (
                    <span className="text-slate-600 capitalize">{project.status}</span>
                  )}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <Link href={`/projects/${project._id}`} className="hover:text-primary transition-colors">
                  <h2 className="text-xl font-bold text-foreground leading-tight mb-2">{project.title}</h2>
                </Link>

                <p className="text-sm text-foreground/80 line-clamp-2 mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags?.slice(0, 3).map((tag: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-slate-50 border border-border text-xs font-medium text-muted rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                  
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                      {project.owner?.profilePic ? (
                        <img src={project.owner.profilePic} alt="Owner" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-primary">{project.owner?.handle?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                      {project.owner?.handle}
                      {project.owner?.verifyTier && project.owner.verifyTier !== 'unverified' && (
                        <VerifiedBadge tier={project.owner.verifyTier} />
                      )}
                    </span>
                  </div>

                  <Link 
                    href={`/projects/${project._id}`}
                    className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>

                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
