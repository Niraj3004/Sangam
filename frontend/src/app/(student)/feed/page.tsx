"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Calendar, MapPin, Building, Bookmark, BookmarkCheck, Loader2, Sparkles, Filter, ArrowRight, Clock, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeedPage() { // File verified and updated by agent
  const [activeTab, setActiveTab] = useState<"latest" | "foryou">("foryou");
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    remote: false
  });

  const loadFeed = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "foryou") {
        const { data } = await api.get('/feed/personalized');
        setOpportunities(data.data?.opportunities || []);
      } else {
        const queryParams = new URLSearchParams();
        if (filters.type) queryParams.append("type", filters.type);
        if (filters.remote) queryParams.append("remote", "true");
        
        const { data } = await api.get(`/opportunities?${queryParams.toString()}`);
        setOpportunities(data.data?.opportunities || []);
      }
    } catch (error: any) {
      console.error("Failed to load feed", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [activeTab, filters.type, filters.remote]);

  const toggleSave = async (id: string, isSaved: boolean) => {
    try {
      // Optimistic update
      setOpportunities(prev => prev.map(opp => 
        opp._id === id || opp.item?._id === id
          ? { ...opp, isSaved: !isSaved } // Assuming backend handles isSaved check, or we just mock it locally for now
          : opp
      ));
      
      if (isSaved) {
        await api.post(`/opportunities/${id}/unsave`);
      } else {
        await api.post(`/opportunities/${id}/save`);
        handleInteraction(id, 'save');
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleInteraction = async (opportunityId: string, actionType: 'view' | 'click' | 'save', isSponsored?: boolean) => {
    try {
      if (isSponsored && (actionType === 'view' || actionType === 'click')) {
        await api.post(`/ads/${opportunityId}/track`, { actionType: actionType === 'view' ? 'impression' : 'click' });
      } else {
        await api.post('/feed/interactions', {
          itemId: opportunityId,
          itemType: 'Opportunity',
          actionType
        });
      }
    } catch (error) {
      // Background request, fail silently
    }
  };

  return (
    <div className="flex gap-8 max-w-6xl mx-auto pb-20">
      
      {/* Main Feed Column */}
      <div className="flex-1 min-w-0">
        
        {/* Header & Tabs */}
        <div className="bg-white rounded-2xl p-2 border border-border shadow-sm flex items-center mb-8">
          <button
            onClick={() => setActiveTab("foryou")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === "foryou" ? "bg-primary text-white shadow-md" : "text-muted hover:bg-slate-50"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            For You (AI Ranked)
          </button>
          <button
            onClick={() => setActiveTab("latest")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === "latest" ? "bg-primary text-white shadow-md" : "text-muted hover:bg-slate-50"
            }`}
          >
            Latest Opportunities
          </button>
        </div>

        {/* Feed Content */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-muted" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">No opportunities found</h3>
              <p className="text-muted mt-2">Try adjusting your filters or completing your profile.</p>
            </div>
          ) : (
            <AnimatePresence>
              {(() => {
                return opportunities.map((item, index) => {
                // Handle both raw opportunity objects (latest) and wrapped scored objects (foryou)
                const opp = item.item || item;
                const score = item.score;
                const matchReason = item.explanation;
                const isSaved = false; // TODO: Check if it's saved in state

                return (
                  <motion.div
                    key={opp._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true, amount: 0.5 }}
                    onViewportEnter={() => {
                      if (opp.isSponsored) {
                        handleInteraction(opp._id, 'view', true);
                      }
                    }}
                    className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group"
                  >
                    {activeTab === "foryou" && score && (
                      <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1 z-10">
                        <Sparkles className="w-3 h-3" />
                        {score}% Match
                      </div>
                    )}

                    {opp.isSponsored ? (
                      // Sponsored Ad Banner Layout (Image-Centric)
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-slate-900 text-white text-[10px] font-black rounded-md uppercase tracking-widest border border-slate-700 shadow-sm">
                              Sponsored
                            </span>
                            <span className="text-sm font-semibold text-muted-foreground">{opp.organizationName}</span>
                          </div>
                          <button className="text-muted hover:text-foreground">
                            <Bookmark className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden mb-4 relative group-hover:shadow-md transition-all">
                          <img 
                            src={opp.imageUrl} 
                            alt={opp.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-6">
                            <div className="flex gap-2 mb-3">
                              <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-md uppercase tracking-wider border border-white/10">
                                {opp.type}
                              </span>
                              {opp.isRemote && (
                                <span className="px-2.5 py-1 bg-emerald-500/80 backdrop-blur-md text-white text-xs font-bold rounded-md border border-emerald-400/50">
                                  Remote
                                </span>
                              )}
                            </div>
                            <h2 className="text-2xl font-bold text-white leading-tight mb-2">{opp.title}</h2>
                            <p className="text-white/80 text-sm line-clamp-2 max-w-lg">{opp.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-muted font-medium flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            Promoted for you
                          </p>
                          <Link 
                            href={opp.link || '#'}
                            onClick={() => handleInteraction(opp._id, 'click', true)}
                            className="bg-primary text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-hover transition-colors shadow-md flex items-center gap-2"
                          >
                            Apply Now <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      // Regular Opportunity Layout
                      <>
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md uppercase tracking-wider">
                                {opp.type}
                              </span>
                              {opp.isRemote && (
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md">
                                  Remote
                                </span>
                              )}
                            </div>
                            <Link 
                              href={`/o/${opp._id}`} 
                              onClick={() => handleInteraction(opp._id, 'click')}
                              className="hover:text-primary transition-colors"
                            >
                              <h2 className="text-xl font-bold text-foreground leading-tight">{opp.title}</h2>
                            </Link>
                            <p className="text-muted flex items-center gap-1.5 mt-2 text-sm">
                              <Building className="w-4 h-4" />
                              {opp.organizationName || opp.source}
                            </p>
                          </div>
                          <button 
                            onClick={() => toggleSave(opp._id, isSaved)}
                            className="p-2 rounded-xl border border-border text-muted hover:text-primary hover:bg-primary/5 transition-colors"
                          >
                            {isSaved ? <BookmarkCheck className="w-5 h-5 text-primary" /> : <Bookmark className="w-5 h-5" />}
                          </button>
                        </div>

                        <p className="text-foreground/80 text-sm line-clamp-2 mb-6">
                          {opp.description}
                        </p>

                        {activeTab === "foryou" && matchReason && (
                          <div className="mb-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Sparkles className="w-3 h-3 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">
                                Why this fits you
                              </h4>
                              <p className="text-sm text-indigo-950 font-medium">
                                {matchReason}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between border-t border-border pt-4">
                          <div className="flex items-center gap-4 text-sm text-muted font-medium">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {new Date(opp.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                            {opp.stipend && opp.stipend.amount > 0 && (
                              <div className="flex items-center gap-1.5 text-emerald-600">
                                <DollarSign className="w-4 h-4" />
                                {opp.stipend.amount} {opp.stipend.currency}/{opp.stipend.period}
                              </div>
                            )}
                          </div>
                          
                          <Link 
                            href={`/o/${opp._id}`}
                            className="bg-secondary text-foreground px-5 py-2 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors border border-border flex items-center gap-1.5"
                          >
                            View Details <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              });
              })()}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Sidebar Filters */}
      <div className="w-80 flex-shrink-0 hidden lg:block">
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm sticky top-24">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground block mb-3">Opportunity Type</label>
              <div className="space-y-2">
                {["job", "internship", "hackathon", "scholarship", "event"].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="type" 
                        value={type}
                        checked={filters.type === type}
                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                        className="peer appearance-none w-5 h-5 border border-border rounded-full checked:border-primary transition-colors cursor-pointer"
                      />
                      <div className="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                    </div>
                    <span className="text-sm text-muted group-hover:text-foreground capitalize">{type}</span>
                  </label>
                ))}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="type" 
                      value=""
                      checked={filters.type === ""}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: "" }))}
                      className="peer appearance-none w-5 h-5 border border-border rounded-full checked:border-primary transition-colors cursor-pointer"
                    />
                    <div className="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                  </div>
                  <span className="text-sm text-muted group-hover:text-foreground">All Types</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox"
                    checked={filters.remote}
                    onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.checked }))}
                    className="peer appearance-none w-5 h-5 border border-border rounded-md checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                  />
                  <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground">Remote Only</span>
              </label>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
