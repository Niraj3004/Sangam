"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, ShieldAlert, Flag, CheckCircle2, AlertTriangle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function AdminModerationPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<"reports" | "flags">("reports");
  const [reports, setReports] = useState<any[]>([]);
  const [flags, setFlags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Basic protection (ideally handled in middleware)
    if (user && user.role !== 'admin') {
      router.push('/feed');
      return;
    }
    fetchData();
  }, [activeTab, user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "reports") {
        const { data } = await api.get('/moderation/reports');
        setReports((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
      } else {
        const { data } = await api.get('/moderation/flags');
        setFlags((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resolveReport = async (id: string, action: string) => {
    try {
      await api.post(`/moderation/reports/${id}/resolve`, { action, notes: "Resolved by admin" });
      setReports(prev => prev.filter(r => r._id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Failed to resolve report");
    }
  };

  const resolveFlag = async (id: string, action: string) => {
    try {
      await api.post(`/moderation/flags/${id}/act`, { action });
      setFlags(prev => prev.filter(f => f._id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Failed to act on flag");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      <div className="flex items-center gap-3 mb-8 border-b border-border pb-6">
        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trust & Safety</h1>
          <p className="text-muted mt-1">Manage user reports and AI moderation flags.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "reports" ? "bg-primary text-white shadow-sm" : "bg-white border border-border text-foreground hover:bg-slate-50"
          }`}
        >
          <Users className="w-4 h-4" /> User Reports
        </button>
        <button
          onClick={() => setActiveTab("flags")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "flags" ? "bg-primary text-white shadow-sm" : "bg-white border border-border text-foreground hover:bg-slate-50"
          }`}
        >
          <Flag className="w-4 h-4" /> AI Moderation Flags
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : activeTab === "reports" ? (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
              <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Inbox Zero</h3>
              <p className="text-muted mt-1 text-sm">No pending user reports.</p>
            </div>
          ) : (
            reports.map(report => (
              <div key={report._id} className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-rose-100">
                      Reason: {report.reason}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 text-muted text-[10px] font-bold uppercase tracking-wider rounded-md">
                      Target: {report.targetType}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">Reported by: {report.reporter?.handle}</p>
                  <p className="text-sm text-foreground/80 bg-slate-50 p-3 rounded-xl border border-border mt-3">
                    "{report.details || 'No additional details'}"
                  </p>
                </div>
                <div className="flex md:flex-col gap-2 shrink-0">
                  <button onClick={() => resolveReport(report._id, 'ignore')} className="px-4 py-2 bg-slate-100 text-foreground rounded-xl text-sm font-medium hover:bg-slate-200">
                    Ignore
                  </button>
                  <button onClick={() => resolveReport(report._id, 'warn')} className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-sm font-medium hover:bg-amber-100 border border-amber-200">
                    Issue Warning
                  </button>
                  <button onClick={() => resolveReport(report._id, 'suspend')} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-100 border border-rose-200">
                    Suspend User
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {flags.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
              <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No AI Flags</h3>
              <p className="text-muted mt-1 text-sm">The AI hasn't flagged any recent content.</p>
            </div>
          ) : (
            flags.map(flag => (
              <div key={flag._id} className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-amber-100 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Severity: {flag.severity}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Flagged Content ID: {flag.contentId}</h3>
                  <p className="text-sm font-medium text-muted mb-3">Reason: {flag.reason}</p>
                  
                  {/* Context snippet if provided by backend */}
                  <div className="text-sm text-foreground/80 bg-amber-50/30 p-3 rounded-xl border border-amber-100 font-mono text-xs">
                    {flag.metadata?.snippet || "[Content Snippet Unavailable]"}
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 shrink-0">
                  <button onClick={() => resolveFlag(flag._id, 'dismiss')} className="px-4 py-2 bg-slate-100 text-foreground rounded-xl text-sm font-medium hover:bg-slate-200">
                    Safe (Dismiss)
                  </button>
                  <button onClick={() => resolveFlag(flag._id, 'delete')} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-100 border border-rose-200">
                    Delete Content
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
