"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Users, UserCheck, UserX, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export default function NetworkPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"pending" | "connections">("pending");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNetwork();
  }, [activeTab]);

  const fetchNetwork = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "pending") {
        const { data } = await api.get('/connections/pending');
        setPendingRequests((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
      } else {
        const { data } = await api.get('/connections');
        setConnections((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'accept' | 'reject') => {
    try {
      await api.patch(`/connections/${id}`, { status: action === 'accept' ? 'accepted' : 'rejected' });
      setPendingRequests(prev => prev.filter(req => req._id !== id));
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manage Network</h1>
        <p className="text-muted mt-2">Manage your connections and incoming requests.</p>
      </div>

      <div className="bg-white rounded-2xl p-2 border border-border shadow-sm flex items-center mb-8">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === "pending" ? "bg-primary text-white shadow-md" : "text-muted hover:bg-slate-50"
          }`}
        >
          <Users className="w-4 h-4" />
          Pending Requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}
        </button>
        <button
          onClick={() => setActiveTab("connections")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === "connections" ? "bg-primary text-white shadow-md" : "text-muted hover:bg-slate-50"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          My Connections
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : activeTab === "pending" ? (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No pending requests</h3>
              <p className="text-muted mt-2">You don't have any incoming connection requests right now.</p>
              <Link href="/discover" className="inline-flex items-center gap-2 mt-4 text-primary hover:underline">
                Discover people <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            pendingRequests.map(req => {
              const sender = req.sender;
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
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md uppercase tracking-wider">
                        Purpose: {req.purpose}
                      </span>
                    </div>
                    {req.message && (
                      <p className="text-sm text-foreground/80 mt-3 p-3 bg-slate-50 rounded-xl border border-border">
                        "{req.message}"
                      </p>
                    )}
                  </div>
                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => handleAction(req._id, 'accept')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
                    >
                      <UserCheck className="w-4 h-4" /> Accept
                    </button>
                    <button 
                      onClick={() => handleAction(req._id, 'reject')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 text-foreground rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                    >
                      <UserX className="w-4 h-4" /> Decline
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connections.length === 0 ? (
            <div className="col-span-2 text-center py-20 bg-white border border-border rounded-2xl border-dashed">
              <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No connections yet</h3>
              <p className="text-muted mt-2">Start networking by discovering other students.</p>
              <Link href="/discover" className="inline-flex items-center gap-2 mt-4 text-primary hover:underline">
                Discover people <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            connections.map(conn => {
              // the other user is the one that is NOT the current logged in user
              const peer = conn.sender._id === user?._id ? conn.receiver : conn.sender;
              return (
                <div key={conn._id} className="bg-white p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-primary shrink-0 overflow-hidden">
                    {peer.profilePic ? (
                      <img src={peer.profilePic} alt={peer.handle} className="w-full h-full object-cover" />
                    ) : (
                      peer.handle.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <Link href={`/u/${peer.handle}`} className="hover:text-primary transition-colors">
                      <h3 className="font-bold text-foreground flex items-center gap-2">
                        {peer.handle}
                        <VerifiedBadge tier={peer.verifyTier} />
                      </h3>
                    </Link>
                    <p className="text-xs text-muted mt-0.5 capitalize">Met for: {conn.purpose.replace('_', ' ')}</p>
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
