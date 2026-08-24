"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { api } from "@/lib/api";
import { Users, Search, PlusCircle, ShieldCheck, MapPin, GraduationCap, Code, Briefcase, Heart, Filter, ChevronRight, Loader2 } from "lucide-react";

interface Community {
  _id: string;
  name: string;
  description: string;
  type: string;
  memberCount: number;
  iconUrl: string;
  bannerUrl: string;
  isOfficial: boolean;
}

const CATEGORIES = [
  { id: "all", label: "All", icon: Users },
  { id: "university", label: "Universities", icon: GraduationCap },
  { id: "skill", label: "Skills & Tech", icon: Code },
  { id: "career", label: "Careers", icon: Briefcase },
  { id: "interest", label: "Interests", icon: Heart },
  { id: "country", label: "Regional", icon: MapPin },
];

export default function CommunitiesHub() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCommunities();
  }, [activeCategory, searchQuery]);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      let endpoint = "/communities";
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.append("type", activeCategory);
      if (searchQuery) params.append("q", searchQuery);
      
      const res = await api.get(`${endpoint}?${params.toString()}`);
      setCommunities(res.data.data.communities || []);
    } catch (err: any) {
      console.error("Failed to fetch communities", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
                Discover your next big network.
              </h1>
              <p className="text-xl text-gray-500 mb-8">
                Join official university groups, dive into tech niches, or connect with peers across the globe.
              </p>
              
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all text-gray-900"
                />
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 max-w-sm text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-indigo-100 flex items-center justify-center mx-auto mb-4 text-indigo-600">
                  <PlusCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Lead the charge</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Have an idea for a community? Propose it to the admins and become a Community Leader.
                </p>
                <Link 
                  href="/communities/new"
                  className="block w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-sm shadow-indigo-600/20"
                >
                  Propose Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8">
          <div className="flex items-center gap-2 text-gray-400 mr-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wider">Filter</span>
          </div>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  isActive 
                    ? "bg-gray-900 text-white shadow-sm" 
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Community Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No communities found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community, i) => (
              <Link href={`/communities/${community._id}`} key={community._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all group h-full flex flex-col cursor-pointer"
                >
                  <div className="h-32 bg-gray-100 relative overflow-hidden">
                    {community.bannerUrl ? (
                      <img src={community.bannerUrl} alt="banner" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 opacity-80" />
                    )}
                    
                    {community.isOfficial && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm pl-1.5 pr-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-gray-900 tracking-wide uppercase">Official</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-6 pt-0 pb-6 flex-1 flex flex-col relative">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border-4 border-white flex items-center justify-center -mt-8 relative z-10 overflow-hidden mb-3">
                      {community.iconUrl ? (
                        <img src={community.iconUrl} alt="icon" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {community.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                      {community.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold">{community.memberCount}</span> members
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
