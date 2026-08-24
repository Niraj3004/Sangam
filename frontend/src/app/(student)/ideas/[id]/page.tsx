"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Lightbulb, Users, MessageSquare, Loader2, ArrowLeft, Target, Wrench, Navigation, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [idea, setIdea] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignaling, setIsSignaling] = useState(false);

  const fetchIdea = async () => {
    try {
      const { data } = await api.get(`/ideas/${params.id}`);
      setIdea(data.data);
    } catch (err: any) {
      console.error(err);
      router.push('/ideas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIdea();
  }, [params.id]);

  const handleAction = async (action: 'interest' | 'join') => {
    setIsSignaling(true);
    try {
      // Assuming backend supports these endpoints or we just mock it for now based on F7 specs.
      // E.g. POST /api/ideas/:id/interest or similar. 
      // If the backend doesn't have it explicitly yet, we'll alert as a placeholder.
      alert(`Signaled intent to ${action}!`);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSignaling(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!idea) return null;

  const isOwner = user?._id === idea.owner?._id;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      <Link href="/ideas" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Ideas
      </Link>

      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
        
        {/* Header */}
        <div className="p-8 md:p-12 border-b border-border bg-slate-50/50">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-md uppercase tracking-wider">
              {idea.stage}
            </span>
            <span className="px-3 py-1.5 bg-slate-100 text-muted text-xs font-bold rounded-md uppercase tracking-wider">
              {idea.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6">
            {idea.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href={`/u/${idea.owner?.handle}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-slate-100 flex items-center justify-center text-lg font-bold text-primary overflow-hidden">
                {idea.owner?.profilePic ? (
                  <img src={idea.owner.profilePic} alt={idea.owner.handle} className="w-full h-full object-cover" />
                ) : (
                  idea.owner?.handle?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  {idea.owner?.handle}
                  <VerifiedBadge tier={idea.owner?.verifyTier} />
                </span>
                <span className="text-xs text-muted block mt-0.5">Idea Creator</span>
              </div>
            </Link>

            {!isOwner && (
              <div className="flex gap-3">
                <button 
                  onClick={() => handleAction('interest')}
                  disabled={isSignaling}
                  className="px-5 py-2.5 rounded-xl border border-border bg-white text-foreground font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm"
                >
                  Show Interest
                </button>
                <button 
                  onClick={() => handleAction('join')}
                  disabled={isSignaling}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover transition-colors shadow-sm text-sm"
                >
                  Request to Join
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          
          <div className="md:col-span-2 p-8 md:p-12 space-y-10">
            <section>
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-rose-500" /> The Problem
              </h3>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {idea.problem}
              </p>
            </section>
            
            <section>
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" /> The Solution
              </h3>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {idea.solution}
              </p>
            </section>
          </div>

          <div className="md:col-span-1 p-8 md:p-12 bg-slate-50/50 space-y-8">
            
            {idea.skillsRequired && idea.skillsRequired.length > 0 && (
              <section>
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-muted" /> Skills Needed
                </h4>
                <div className="flex flex-wrap gap-2">
                  {idea.skillsRequired.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-white border border-border rounded-lg text-sm font-medium text-foreground shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {idea.lookingFor && idea.lookingFor.length > 0 && (
              <section>
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-muted" /> Looking For
                </h4>
                <div className="flex flex-col gap-2">
                  {idea.lookingFor.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-2.5 px-3 py-2 bg-white border border-border rounded-lg text-sm font-medium text-foreground shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="pt-6 border-t border-border">
              <div className="flex items-center justify-between text-sm font-medium text-muted mb-2">
                <span>Interested</span>
                <span className="text-foreground font-bold">{idea.interested?.length || 0} users</span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium text-muted">
                <span>Team Size</span>
                <span className="text-foreground font-bold">{idea.team?.length || 0} members</span>
              </div>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}
