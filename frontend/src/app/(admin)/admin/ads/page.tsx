"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, ShieldCheck, XCircle, ExternalLink, Receipt } from "lucide-react";

export default function AdminAdsDashboard() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvedBudgets, setApprovedBudgets] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  const fetchPendingCampaigns = async () => {
    try {
      const { data } = await api.get('/admin/pending'); // Admin route we created
      setCampaigns(data.data || []);
    } catch (error) {
      console.error("Failed to fetch pending campaigns", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'active' | 'rejected') => {
    try {
      const payload: any = { status };
      if (status === 'active' && approvedBudgets[id]) {
        payload.approvedBudget = approvedBudgets[id];
      }
      
      await api.put(`/admin/${id}/status`, payload);
      // Remove from list after approval/rejection
      setCampaigns(campaigns.filter(c => c._id !== id));
      
      const newBudgets = { ...approvedBudgets };
      delete newBudgets[id];
      setApprovedBudgets(newBudgets);
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status. Check console.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Ad Approvals</h1>
        <p className="text-muted mt-1">Review manual payments and approve campaigns to go live.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {campaigns.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">All caught up!</h3>
            <p className="text-muted mt-2">There are no pending ad campaigns waiting for approval.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  <th className="px-6 py-4 text-sm font-semibold text-muted">Organization</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted">Ad Content</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted">Budget</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted">Payment Receipt</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign._id} className="border-b border-border last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {campaign.organizationId?.name || "Unknown Org"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={campaign.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                        <div>
                          <p className="font-semibold text-foreground line-clamp-1">{campaign.title}</p>
                          <p className="text-xs text-muted max-w-[200px] line-clamp-1">{campaign.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground">Requested: Rs. {campaign.totalBudget}</p>
                      <p className="text-xs text-muted">CPC: Rs. {campaign.costPerClick}</p>
                    </td>
                    <td className="px-6 py-4">
                      {campaign.paymentReceiptUrl ? (
                        <a 
                          href={campaign.paymentReceiptUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-indigo-600 font-semibold hover:underline text-sm bg-indigo-50 px-3 py-1.5 rounded-lg w-fit mb-2"
                        >
                          <Receipt className="w-4 h-4" /> View Receipt <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-muted text-sm italic mb-2 block">No receipt provided</span>
                      )}
                      
                      <div className="flex flex-col mt-2">
                        <label className="text-xs font-semibold text-muted mb-1">Confirm Final Budget (Rs.):</label>
                        <input 
                          type="number"
                          className="border border-border rounded-lg px-2 py-1 text-sm w-32 focus:outline-none focus:ring-1 focus:ring-primary"
                          value={approvedBudgets[campaign._id] ?? campaign.totalBudget}
                          onChange={(e) => setApprovedBudgets({
                            ...approvedBudgets, 
                            [campaign._id]: Number(e.target.value)
                          })}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => updateStatus(campaign._id, 'rejected')}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors tooltip"
                          title="Reject Campaign"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => updateStatus(campaign._id, 'active')}
                          className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-4 h-4" /> Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
