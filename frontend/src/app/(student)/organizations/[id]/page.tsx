"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { Loader2, ArrowLeft, Building2, Globe, Users, Briefcase, Camera } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [org, setOrg] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchOrg();
  }, [params.id]);

  const fetchOrg = async () => {
    try {
      const { data } = await api.get(`/organizations/${params.id}`);
      setOrg(data.data);
    } catch (err: any) {
      console.error(err);
      router.push('/organizations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post(`/organizations/${params.id}/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setOrg({ ...org, logo: data.data.logo });
      alert("Logo updated successfully");
    } catch (err: any) {
      console.error(err);
      alert("Failed to upload logo.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!org) return null;

  // Ideally backend tells us if user is an admin of this org, assuming it from 'owner' or 'members' logic.
  const isOwner = org.owner === user?._id || org.owner?._id === user?._id;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      <Link href="/organizations" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Organizations
      </Link>

      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm mb-8 relative">
        <div className="h-32 bg-slate-100 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/80 to-primary/80" />
        </div>
        
        <div className="absolute top-20 left-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl border-4 border-white bg-white shadow-sm flex items-center justify-center text-3xl font-bold text-primary overflow-hidden">
              {org.logo ? (
                <img src={org.logo} alt={org.name} className="w-full h-full object-contain p-2" />
              ) : (
                org.name.charAt(0).toUpperCase()
              )}
            </div>
            
            {isOwner && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 bg-black/50 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center disabled:opacity-100"
              >
                {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </div>
        </div>

        <div className="pt-16 p-8 md:px-12 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-slate-100 text-muted text-xs font-bold uppercase tracking-wider rounded-md">
                {org.industry || "General"}
              </span>
              {org.isVerified && (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider rounded-md border border-emerald-100">
                  Verified
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">{org.name}</h1>
            <p className="text-foreground/80 max-w-xl leading-relaxed whitespace-pre-wrap">{org.description}</p>
          </div>
          
          <div className="flex-shrink-0 flex flex-col items-end gap-3">
            {org.website && (
              <a 
                href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
                target="_blank" rel="noreferrer"
                className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1.5 bg-primary/10 px-4 py-2 rounded-xl transition-colors"
              >
                <Globe className="w-4 h-4" /> Visit Website
              </a>
            )}
            <div className="text-sm font-semibold text-muted flex items-center gap-1.5 mt-2">
              <Users className="w-4 h-4" /> {org.members?.length || 0} Members
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Open Roles */}
        <section className="bg-white rounded-3xl border border-border p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" /> Open Roles
          </h2>
          
          {org.jobs && org.jobs.length > 0 ? (
            <div className="space-y-4">
              {org.jobs.map((job: any) => (
                <Link key={job._id} href={`/jobs/${job._id}`} className="block p-4 border border-border rounded-xl hover:border-primary/50 hover:shadow-sm transition-all">
                  <h3 className="font-bold text-foreground mb-1">{job.title}</h3>
                  <div className="flex gap-3 text-xs font-medium text-muted">
                    <span className="uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">{job.type}</span>
                    <span>{job.location || 'Remote'}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Briefcase className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-muted">No open roles currently posted.</p>
            </div>
          )}
        </section>

        {/* Organization Details */}
        <section className="bg-white rounded-3xl border border-border p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-500" /> About
          </h2>
          
          <ul className="space-y-4">
            <li className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted font-medium">Industry</span>
              <span className="text-foreground font-semibold">{org.industry || "Not specified"}</span>
            </li>
            <li className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted font-medium">Founded</span>
              <span className="text-foreground font-semibold">{new Date(org.createdAt).getFullYear()}</span>
            </li>
            <li className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted font-medium">Verified Status</span>
              <span className="text-foreground font-semibold">{org.isVerified ? "Verified Partner" : "Unverified"}</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}
