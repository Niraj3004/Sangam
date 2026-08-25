"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, CheckCircle2, XCircle, FileSearch, BadgeCheck, FileText, Flag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function AdminReviewPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"content" | "verification" | "communities" | "reports">("content");
  const [contentQueue, setContentQueue] = useState<any[]>([]);
  const [verifyQueue, setVerifyQueue] = useState<any[]>([]);
  const [communityQueue, setCommunityQueue] = useState<any[]>([]);
  const [reportsQueue, setReportsQueue] = useState<any[]>([]);
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
      } else if (activeTab === "reports") {
        const { data } = await api.get('/moderation/reports');
        setReportsQueue((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
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

  const handleReportResolve = async (id: string, action: 'ban' | 'dismiss') => {
    try {
      await api.post(`/moderation/reports/${id}/resolve`, { action });
      setReportsQueue(prev => prev.filter(r => r._id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Failed to resolve report");
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
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "reports" ? "bg-primary text-white shadow-sm" : "bg-white border border-border text-foreground hover:bg-slate-50"
          }`}
        >
          <Flag className="w-4 h-4" /> Trust & Safety Reports
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
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-border text-muted">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Type</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Submitter</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Content Snippet</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {contentQueue.map(item => (
                      <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-indigo-100">
                            {item.itemType}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                          {item.author?.handle || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 min-w-[300px]">
                          <div className="text-sm font-medium text-foreground mb-1">{item.contentSnippet?.title || 'N/A'}</div>
                          <div className="text-xs text-muted line-clamp-2">{item.contentSnippet?.body || 'No content body provided'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleContentReview(item._id, 'approve')} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-semibold hover:bg-emerald-100 border border-emerald-200 transition-colors">
                              Approve
                            </button>
                            <button onClick={() => handleContentReview(item._id, 'reject')} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-100 border border-rose-200 transition-colors">
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === "verification" ? (
        <div className="space-y-4">
          {verifyQueue.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
              <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No Verification Requests</h3>
              <p className="text-muted mt-1 text-sm">All users have been processed.</p>
            </div>
          ) : (
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-border text-muted">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">User Email</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Current Tier</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Requested Tier</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Evidence</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {verifyQueue.map(req => (
                      <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                          {req.userId?.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-200">
                            {req.userId?.verifyTier}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-amber-100">
                            {req.tierRequested}
                          </span>
                        </td>
                        <td className="px-6 py-4 min-w-[250px]">
                          <div className="text-xs text-muted whitespace-pre-wrap">{req.evidence}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleVerification(req._id, 'approve')} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-semibold hover:bg-emerald-100 border border-emerald-200 transition-colors">
                              Approve
                            </button>
                            <button onClick={() => handleVerification(req._id, 'reject')} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-100 border border-rose-200 transition-colors">
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === "communities" ? (
        <div className="space-y-4">
          {communityQueue.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
              <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No Community Proposals</h3>
              <p className="text-muted mt-1 text-sm">All community proposals have been processed.</p>
            </div>
          ) : (
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-border text-muted">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Name</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Type</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Mission Statement</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {communityQueue.map(community => (
                      <tr key={community._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                          {community.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-blue-100">
                            {community.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 min-w-[300px]">
                          <div className="text-xs text-muted whitespace-pre-wrap">{community.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleCommunityReview(community._id, 'approve')} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-semibold hover:bg-emerald-100 border border-emerald-200 transition-colors">
                              Approve
                            </button>
                            <button onClick={() => handleCommunityReview(community._id, 'reject')} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-100 border border-rose-200 transition-colors">
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === "reports" ? (
        <div className="space-y-4">
          {reportsQueue.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
              <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No Active Reports</h3>
              <p className="text-muted mt-1 text-sm">The platform is currently clear of reports.</p>
            </div>
          ) : (
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-border text-muted">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Reporter</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Reason</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Description</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {reportsQueue.map(report => (
                      <tr key={report._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                          {report.reporter?.handle || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-rose-100">
                            {report.reason}
                          </span>
                        </td>
                        <td className="px-6 py-4 min-w-[300px]">
                          <div className="text-xs text-muted whitespace-pre-wrap">{report.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleReportResolve(report._id, 'dismiss')} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200 border border-slate-200 transition-colors">
                              Dismiss
                            </button>
                            <button onClick={() => handleReportResolve(report._id, 'ban')} className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 shadow-sm transition-colors">
                              Ban User / Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
