"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, CheckCircle2, XCircle, FileSearch, BadgeCheck, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function AdminReviewPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"content" | "verification" | "communities">("content");
  const [contentQueue, setContentQueue] = useState<any[]>([]);
  const [verifyQueue, setVerifyQueue] = useState<any[]>([]);
  const [communityQueue, setCommunityQueue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/feed');
      return;
    }
    fetchData();
  }, [activeTab, user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "content") {
        const { data } = await api.get('/review');
        setContentQueue((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
      } else if (activeTab === "verification") {
        const { data } = await api.get('/auth/verify-requests');
        setVerifyQueue((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
      } else if (activeTab === "communities") {
        const { data } = await api.get('/communities/pending');
        setCommunityQueue((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentReview = async (id: string, action: 'approve' | 'reject') => {
    try {
      await api.post(`/review/${id}/${action}`);
      setContentQueue(prev => prev.filter(item => item._id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Failed to review content");
    }
  };

  const handleVerification = async (id: string, action: 'approve' | 'reject') => {
    try {
      let notes = undefined;
      if (action === 'reject') {
        notes = prompt("Please provide a reason for rejection (sent to user):") || undefined;
      }
      await api.post(`/auth/verify-resolve/${id}`, { action, notes });
      setVerifyQueue(prev => prev.filter(req => req._id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Failed to resolve verification request");
    }
  };

  const handleCommunityReview = async (id: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await api.post(`/communities/${id}/approve`);
      } else {
        // Just deleting or archiving it for reject for now
        alert("Community rejected");
      }
      setCommunityQueue(prev => prev.filter(c => c._id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Failed to review community");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      <div className="flex items-center gap-3 mb-8 border-b border-border pb-6">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <FileSearch className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Review Queues</h1>
          <p className="text-muted mt-1">Approve or reject content and tier verification requests.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("content")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "content" ? "bg-primary text-white shadow-sm" : "bg-white border border-border text-foreground hover:bg-slate-50"
          }`}
        >
          <FileText className="w-4 h-4" /> Content Queue
        </button>
        <button
          onClick={() => setActiveTab("verification")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "verification" ? "bg-primary text-white shadow-sm" : "bg-white border border-border text-foreground hover:bg-slate-50"
          }`}
        >
          <BadgeCheck className="w-4 h-4" /> Verification Requests
        </button>
        <button
          onClick={() => setActiveTab("communities")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "communities" ? "bg-primary text-white shadow-sm" : "bg-white border border-border text-foreground hover:bg-slate-50"
          }`}
        >
          <BadgeCheck className="w-4 h-4" /> Community Proposals
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : activeTab === "content" ? (
        <div className="space-y-4">
          {contentQueue.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
              <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Queue Empty</h3>
              <p className="text-muted mt-1 text-sm">No pending content requiring manual review.</p>
            </div>
          ) : (
            contentQueue.map(item => (
              <div key={item._id} className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-indigo-100">
                      Type: {item.itemType}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">Submitted by: {item.author?.handle || 'Unknown'}</p>
                  <p className="text-sm text-foreground/80 bg-slate-50 p-3 rounded-xl border border-border mt-3">
                    Title: {item.contentSnippet?.title || 'N/A'}<br/>
                    {item.contentSnippet?.body || 'No content body provided'}
                  </p>
                </div>
                <div className="flex md:flex-col gap-2 shrink-0">
                  <button onClick={() => handleContentReview(item._id, 'approve')} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium hover:bg-emerald-100 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => handleContentReview(item._id, 'reject')} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-100 border border-rose-200 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {verifyQueue.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
              <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No Verification Requests</h3>
              <p className="text-muted mt-1 text-sm">All users have been processed.</p>
            </div>
          ) : (
            verifyQueue.map(req => (
              <div key={req._id} className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-amber-100">
                      Requested Tier: {req.tierRequested}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">User: {req.userId?.email} (Current Tier: {req.userId?.verifyTier})</h3>
                  <div className="text-sm text-foreground/80 bg-slate-50 p-4 rounded-xl border border-border mt-3">
                    <p className="font-semibold mb-2">Submitted Evidence:</p>
                    <p className="whitespace-pre-wrap">{req.evidence}</p>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 shrink-0">
                  <button onClick={() => handleVerification(req._id, 'approve')} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium hover:bg-emerald-100 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => handleVerification(req._id, 'reject')} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-100 border border-rose-200 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {communityQueue.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
              <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No Community Proposals</h3>
              <p className="text-muted mt-1 text-sm">All community proposals have been processed.</p>
            </div>
          ) : (
            communityQueue.map(community => (
              <div key={community._id} className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-blue-100">
                      Type: {community.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{community.name}</h3>
                  <div className="text-sm text-foreground/80 bg-slate-50 p-4 rounded-xl border border-border mt-3">
                    <p className="font-semibold mb-2">Mission Statement:</p>
                    <p className="whitespace-pre-wrap">{community.description}</p>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 shrink-0">
                  <button onClick={() => handleCommunityReview(community._id, 'approve')} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium hover:bg-emerald-100 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => handleCommunityReview(community._id, 'reject')} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-100 border border-rose-200 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
