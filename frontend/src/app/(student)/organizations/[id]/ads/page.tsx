"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { BarChart, Plus, Loader2, ArrowUpRight, Megaphone, Target, DollarSign, Activity, Eye, MousePointerClick } from "lucide-react";
import { motion } from "framer-motion";

export default function OrganizationAdsDashboard() {
  const params = useParams();
  const orgId = params?.id as string;
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orgId) return;

    const fetchCampaigns = async () => {
      try {
        const { data } = await api.get(`/organizations/${orgId}/ads`);
        setCampaigns(data.data || []);
      } catch (error) {
        console.error("Failed to fetch campaigns", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [orgId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalSpent = campaigns.reduce((acc, curr) => acc + curr.budgetSpent, 0);
  const totalImpressions = campaigns.reduce((acc, curr) => acc + curr.impressions, 0);
  const totalClicks = campaigns.reduce((acc, curr) => acc + curr.clicks, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ad Campaigns</h1>
          <p className="text-muted mt-1">Manage and track your sponsored campaigns</p>
        </div>
        <Link 
          href={`/organizations/${orgId}/ads/create`}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-md shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Create Campaign
        </Link>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted">Total Spent</p>
            <p className="text-2xl font-bold text-foreground">${totalSpent.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted">Total Impressions</p>
            <p className="text-2xl font-bold text-foreground">{totalImpressions.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted">Total Clicks</p>
            <p className="text-2xl font-bold text-foreground">{totalClicks.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Active Campaigns
          </h2>
        </div>
        
        {campaigns.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Megaphone className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No campaigns yet</h3>
            <p className="text-muted mt-2 max-w-sm mb-6">Create your first ad campaign to reach highly targeted students and professionals.</p>
            <Link 
              href={`/organizations/${orgId}/ads/create`}
              className="text-primary font-semibold flex items-center gap-1 hover:underline"
            >
              Get Started <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  <th className="px-6 py-4 text-sm font-semibold text-muted">Campaign Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted">Budget Spend</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted">Impressions</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted">Clicks</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted">CTR</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => {
                  const ctr = campaign.impressions > 0 
                    ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) 
                    : "0.00";
                    
                  return (
                    <tr key={campaign._id} className="border-b border-border last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={campaign.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                          <div>
                            <p className="font-semibold text-foreground line-clamp-1">{campaign.title}</p>
                            <p className="text-xs text-muted">Max CPC: ${campaign.costPerClick}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          campaign.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                          campaign.status === 'exhausted' ? 'bg-rose-100 text-rose-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-slate-100 rounded-full h-2 mt-2 max-w-[120px]">
                          <div 
                            className={`h-2 rounded-full ${campaign.status === 'exhausted' ? 'bg-rose-500' : 'bg-primary'}`}
                            style={{ width: `${Math.min((campaign.budgetSpent / campaign.totalBudget) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted mt-1 font-medium">
                          ${campaign.budgetSpent.toFixed(2)} / ${campaign.totalBudget}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{campaign.impressions.toLocaleString()}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{campaign.clicks.toLocaleString()}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{ctr}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
