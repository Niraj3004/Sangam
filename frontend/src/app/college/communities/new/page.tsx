"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CollegeCreateCommunity() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "university",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      // Calls the /create endpoint which is for Orgs only and bypasses approval
      const res = await api.post("/communities/create", formData);
      // Immediately redirect to the new community workspace
      router.push(`/communities/${res.data.data.community._id}`);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Failed to create community");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-8 w-fit">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-10 border-b border-gray-100 bg-blue-50/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide">
                Instant Access
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Official Community</h1>
            <p className="text-gray-500">
              As a verified institution, your communities bypass the review queue and are instantly badged as "Official" on the Sangam network.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Official Group Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Kathmandu University Alumni Network"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Community Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none appearance-none"
              >
                <option value="university">University / Department</option>
                <option value="college">College Chapter</option>
                <option value="career">Career Readiness</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Description / Guidelines</label>
              <textarea
                required
                minLength={10}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the purpose of this official community..."
                rows={5}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || formData.name.length < 3 || formData.description.length < 10}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 mt-8"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Launch Official Community"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
