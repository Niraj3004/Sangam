"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, Users, CheckCircle2, XCircle, GraduationCap, Video } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

export default function MentorshipPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"sessions" | "requests">("sessions");
  const [sessions, setSessions] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "sessions") {
        const { data } = await api.get('/mentorship');
        setSessions((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
      } else {
        const { data } = await api.get('/mentorship/requests');
        setRequests((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'accept' | 'decline') => {
    try {
      await api.patch(`/mentorship/${id}/${action}`);
      setRequests(prev => prev.filter(req => req._id !== id));
      alert(`Request ${action}ed successfully.`);
    } catch (err: any) {
      console.error(err);
      alert("Failed to perform action");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 shadow-sm border border-indigo-100">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Mentorship Hub</h1>
        <p className="text-muted mt-2 max-w-lg">
          Connect with industry alumni for guidance, or mentor junior students to give back to the community.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-2 border border-border shadow-sm flex items-center mb-8 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab("sessions")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === "sessions" ? "bg-primary text-white shadow-md" : "text-muted hover:bg-slate-50"
          }`}
        >
          <Users className="w-4 h-4" /> Active Sessions
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === "requests" ? "bg-primary text-white shadow-md" : "text-muted hover:bg-slate-50"
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Pending Requests
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : activeTab === "sessions" ? (
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No active mentorships</h3>
              <p className="text-muted mt-2">Find potential mentors in the Discover tab.</p>
            </div>
          ) : (
            sessions.map(session => {
              const peer = session.mentor._id === user?._id ? session.mentee : session.mentor;
              const isMentor = session.mentor._id === user?._id;

              return (
                <div key={session._id} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-primary shrink-0 overflow-hidden">
                    {peer.profilePic ? (
                      <img src={peer.profilePic} alt={peer.handle} className="w-full h-full object-cover" />
                    ) : (
                      peer.handle.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        {isMentor ? 'Your Mentee' : 'Your Mentor'}
                      </span>
                    </div>
                    <Link href={`/u/${peer.handle}`} className="hover:text-primary transition-colors">
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        {peer.handle}
                        <VerifiedBadge tier={peer.verifyTier} />
                      </h3>
                    </Link>
                    <p className="text-sm text-muted mt-1 font-medium">{session.goals}</p>
                  </div>
                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                    <Link 
                      href="/messages"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
                    >
                      <Video className="w-4 h-4" /> Message
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No pending requests</h3>
              <p className="text-muted mt-2">You don't have any incoming mentorship requests right now.</p>
            </div>
          ) : (
            requests.map(req => {
              const sender = req.mentee; // Requests in this tab are incoming, so the sender is the mentee
              
              return (
                <div key={req._id} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-primary shrink-0 overflow-hidden">
                    {sender.profilePic ? (
                      <img src={sender.profilePic} alt={sender.handle} className="w-full h-full object-cover" />
                    ) : (
                      sender.handle.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <Link href={`/u/${sender.handle}`} className="hover:text-primary transition-colors">
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        {sender.handle}
                        <VerifiedBadge tier={sender.verifyTier} />
                      </h3>
                    </Link>
                    <p className="text-sm font-medium text-foreground mt-2">Goals:</p>
                    <p className="text-sm text-foreground/80 bg-slate-50 p-3 rounded-xl border border-border mt-1">
                      "{req.goals}"
                    </p>
                  </div>
                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => handleAction(req._id, 'accept')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept
                    </button>
                    <button 
                      onClick={() => handleAction(req._id, 'decline')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 text-foreground rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Decline
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
