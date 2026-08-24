"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Users, ShieldCheck, Calendar, BookOpen, MessageSquare, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";

interface Community {
  _id: string;
  name: string;
  description: string;
  type: string;
  memberCount: number;
  iconUrl: string;
  bannerUrl: string;
  isOfficial: boolean;
  status: string;
}

export default function CommunityWorkspace() {
  const { id } = useParams();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false); // In reality, fetch this from Membership
  const [activeTab, setActiveTab] = useState("discussions");

  useEffect(() => {
    // We don't have a GET /communities/:id yet in API_REFERENCE, 
    // but typically we'd fetch the community detail here. 
    // For MVP, we'll mock it if it doesn't exist, or just assume it exists if passed in array.
    // Let's pretend we have a fetch call here.
    const fetchCommunity = async () => {
      try {
        // Mocking response for now until GET /communities/:id is built
        setTimeout(() => {
          setCommunity({
            _id: id as string,
            name: "React Developers Nepal",
            description: "The official community for React enthusiasts in Nepal. We host weekly workshops, share resources, and build open-source projects.",
            type: "skill",
            memberCount: 142,
            iconUrl: "",
            bannerUrl: "",
            isOfficial: true,
            status: "active"
          });
          setLoading(false);
        }, 500);
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchCommunity();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 animate-pulse" />;
  }

  if (!community) return <div>Not found</div>;

  const TABS = [
    { id: "discussions", label: "Discussions", icon: MessageSquare },
    { id: "events", label: "Events", icon: Calendar },
    { id: "resources", label: "Resources", icon: BookOpen },
    { id: "members", label: "Members", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Massive Hero Banner */}
      <div className="relative h-64 md:h-80 bg-gray-900 overflow-hidden">
        {community.bannerUrl ? (
          <img src={community.bannerUrl} alt="banner" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-90" />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 sm:-mt-24 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-8 justify-between">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              {/* Profile Icon over banner */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white shadow-xl border-4 border-white flex items-center justify-center overflow-hidden shrink-0">
                {community.iconUrl ? (
                  <img src={community.iconUrl} alt="icon" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-16 h-16 text-gray-300" />
                )}
              </div>
              
              <div className="mb-2">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                    {community.name}
                  </h1>
                  {community.isOfficial && (
                    <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide border border-blue-100">
                      <ShieldCheck className="w-4 h-4" /> Official
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 font-medium">
                  <span className="capitalize">{community.type} Community</span>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{community.memberCount} Members</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 sm:mb-2">
              <button 
                onClick={() => setJoined(!joined)}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  joined 
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
                }`}
              >
                {joined ? (
                  <><Check className="w-5 h-5" /> Joined</>
                ) : (
                  <><Plus className="w-5 h-5" /> Join Community</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 p-1 flex overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      isActive 
                        ? "bg-gray-50 text-gray-900 shadow-sm border border-gray-100" 
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-3xl border border-gray-200 p-8 min-h-[400px]">
              <h2 className="text-xl font-bold text-gray-900 mb-6 capitalize">{activeTab}</h2>
              {/* Empty state for now */}
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <MessageSquare className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Nothing here yet</h3>
                <p className="text-gray-500">Be the first to start a conversation in this community.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* About Widget */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {community.description}
              </p>
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Created August 2026</span>
                </div>
              </div>
            </div>

            {/* Leaders Widget */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                Community Leaders
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-semibold">1</span>
              </h3>
              <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                  R
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Ram Karki</p>
                  <p className="text-xs text-indigo-600 font-medium">Founder / Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
