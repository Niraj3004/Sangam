"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, ArrowLeft, Building2, MapPin, DollarSign, Briefcase, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [params.id]);

  const fetchJob = async () => {
    try {
      const { data } = await api.get(`/jobs/${params.id}`);
      setJob(data.data);
      
      // Check if current user is in applicants array
      if (data.data.applicants?.some((app: any) => app.applicant === user?._id || app.applicant?._id === user?._id)) {
        setHasApplied(true);
      }
    } catch (err: any) {
      console.error(err);
      router.push('/jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await api.post(`/jobs/${params.id}/apply`);
      setHasApplied(true);
      alert("Successfully applied for the job!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error?.message || "Failed to apply.");
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
        
        {/* Header */}
        <div className="p-8 md:p-12 border-b border-border bg-slate-50/50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white border border-border shadow-sm flex items-center justify-center text-3xl font-bold text-primary shrink-0">
                {job.company?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-md">
                    {job.type}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-md">
                    {job.status}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2 leading-tight">
                  {job.title}
                </h1>
                <p className="text-lg font-medium text-muted flex items-center gap-2">
                  <Building2 className="w-5 h-5" /> {job.company}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
              {hasApplied ? (
                <button disabled className="w-full bg-emerald-50 text-emerald-700 px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5" /> Applied
                </button>
              ) : (
                <button 
                  onClick={handleApply}
                  disabled={isApplying || job.status !== 'open'}
                  className="w-full bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Briefcase className="w-5 h-5" />}
                  Apply Now
                </button>
              )}
              <p className="text-xs text-center text-muted">
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-8 p-4 bg-white rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-muted font-medium">Location</p>
                <p className="font-semibold text-foreground">{job.location || 'Remote'}</p>
              </div>
            </div>
            
            <div className="w-px h-10 bg-border hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-muted font-medium">Salary Range</p>
                <p className="font-semibold text-foreground">{job.salaryRange || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
          
          <div className="lg:col-span-2 p-8 md:p-12 space-y-10">
            <section>
              <h3 className="text-xl font-bold text-foreground mb-4">Job Description</h3>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </section>
          </div>

          <div className="lg:col-span-1 p-8 md:p-12 bg-slate-50/50 space-y-8">
            {job.requirements && job.requirements.length > 0 && (
              <section>
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Requirements</h4>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-white border border-border rounded-lg text-sm font-medium text-foreground shadow-sm">
                      {req}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className="pt-6 border-t border-border">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Posted By</h4>
              <Link href={`/u/${job.poster?.handle}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity p-3 bg-white border border-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-primary overflow-hidden shadow-sm">
                  {job.poster?.profilePic ? (
                    <img src={job.poster.profilePic} alt="" className="w-full h-full object-cover" />
                  ) : (
                    job.poster?.handle?.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    {job.poster?.handle}
                    <VerifiedBadge tier={job.poster?.verifyTier} />
                  </span>
                </div>
              </Link>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
