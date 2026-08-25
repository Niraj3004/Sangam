"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Megaphone, Image as ImageIcon, Target, DollarSign, Sparkles } from "lucide-react";

export default function CreateAdCampaignPage() {
  const params = useParams();
  const orgId = params?.id as string;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000",
    callToActionUrl: "",
    type: "Sponsored", // Default type
    targetSkills: "",
    totalBudget: 1000,
    costPerClick: 10,
    paymentReceiptUrl: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        targetSkills: formData.targetSkills.split(',').map(s => s.trim()).filter(Boolean)
      };

      await api.post(`/organizations/${orgId}/ads`, payload);
      router.push(`/organizations/${orgId}/ads`);
    } catch (error) {
      console.error("Failed to create campaign", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8">
        <Link 
          href={`/organizations/${orgId}/ads`}
          className="text-muted hover:text-foreground flex items-center gap-2 w-fit mb-4 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Create New Campaign</h1>
        <p className="text-muted mt-1">Design your ad and set your targeting budget.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Column */}
        <div className="flex-1 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Creative Section */}
            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-500" />
                Ad Creative
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Headline</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Master's in Computer Science 2026"
                    className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Tell students about this program, bootcamp, or opportunity..."
                    className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Badge Label</label>
                    <input 
                      type="text" 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      placeholder="e.g. Bootcamp, Admissions, Course"
                      className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Destination URL</label>
                    <input 
                      type="url" 
                      required
                      value={formData.callToActionUrl}
                      onChange={e => setFormData({...formData, callToActionUrl: e.target.value})}
                      placeholder="https://yourcollege.edu/apply"
                      className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Image URL</label>
                  <input 
                    type="url" 
                    required
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="Provide a high-res banner image URL"
                    className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Targeting Section */}
            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                Targeting
              </h2>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Target Skills (Comma separated)</label>
                <input 
                  type="text" 
                  value={formData.targetSkills}
                  onChange={e => setFormData({...formData, targetSkills: e.target.value})}
                  placeholder="e.g. React, Python, Data Science"
                  className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <p className="text-xs text-muted mt-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Sangam AI will match this ad to students with these skills.
                </p>
              </div>
            </div>

            {/* Budget Section */}
            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-500" />
                Budget & Bidding
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Total Campaign Budget (NPR)</label>
                  <input 
                    type="number" 
                    min="500"
                    required
                    value={formData.totalBudget}
                    onChange={e => setFormData({...formData, totalBudget: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Max CPC Bid (NPR)</label>
                  <input 
                    type="number" 
                    min="10"
                    step="5"
                    required
                    value={formData.costPerClick}
                    onChange={e => setFormData({...formData, costPerClick: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Checkout & Payment Section */}
            <div className="bg-slate-900 rounded-2xl p-6 shadow-sm text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Checkout & Payment
              </h2>
              
              <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/20">
                <p className="text-sm text-slate-300 mb-2">Total Amount Due:</p>
                <p className="text-3xl font-black">Rs. {formData.totalBudget.toLocaleString()}</p>
                
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm font-semibold mb-2">Payment Instructions:</p>
                  <p className="text-sm text-slate-300">
                    Please transfer the total amount via UPI or Bank Transfer to complete your campaign setup.
                  </p>
                  <div className="mt-3 p-3 bg-black/30 rounded-lg text-sm font-mono text-emerald-400">
                    UPI: sangam-ads@okaxis<br />
                    Bank: 0000-1111-2222-3333
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Payment Receipt URL (Google Drive / Cloud Link)</label>
                <input 
                  type="url" 
                  required
                  value={formData.paymentReceiptUrl}
                  onChange={e => setFormData({...formData, paymentReceiptUrl: e.target.value})}
                  placeholder="Paste the link to your payment screenshot"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Once submitted, an Admin will review your receipt and approve your campaign within 24 hours.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              Launch Campaign
            </button>
          </form>
        </div>

        {/* Live Preview Column */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-4">Live Preview</h3>
            
            {/* Ad Banner Preview */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-slate-900 text-white text-[10px] font-black rounded-md uppercase tracking-widest border border-slate-700 shadow-sm">
                      Sponsored
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">Your Organization</span>
                  </div>
                </div>
                
                <div className="w-full h-64 rounded-xl overflow-hidden mb-4 relative">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-6">
                    <div className="flex gap-2 mb-3">
                      <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-md uppercase tracking-wider border border-white/10">
                        {formData.type || "Sponsored"}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white leading-tight mb-2">
                      {formData.title || "Your Engaging Headline Here"}
                    </h2>
                    <p className="text-white/80 text-xs line-clamp-2">
                      {formData.description || "Write a compelling description to attract students to your program or opportunity."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted font-medium flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Promoted for you
                  </p>
                  <div className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-bold opacity-90">
                    Apply Now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
