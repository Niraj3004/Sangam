"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users, ArrowRight, Loader2, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ProposeCommunity() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "skill",
    description: "",
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = user?.role === 'org' ? '/communities/create' : '/communities/propose';
      await api.post(endpoint, formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Failed to propose community");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {user?.role === 'org' ? 'Community Created!' : 'Proposal Submitted!'}
          </h2>
          <p className="text-gray-500 mb-8">
            {user?.role === 'org' 
              ? "Your official community has been created and is now live on Sangam."
              : "Your community proposal has been sent to the Sangam moderation team. We'll review it shortly. Once approved, you will officially become the Community Leader!"}
          </p>
          <Link 
            href="/communities"
            className="block w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
          >
            Back to Communities
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/communities" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-8 w-fit">
          <ChevronLeft className="w-4 h-4" /> Back to Directory
        </Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-10 border-b border-gray-100 bg-gray-50/50">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 border border-indigo-100">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user?.role === 'org' ? 'Create Official Community' : 'Lead a Community'}
            </h1>
            <p className="text-gray-500">
              {user?.role === 'org' 
                ? "Create a dedicated space for your organization, host events, and build your community network."
                : "Propose a new group to the platform. Build a space for your peers, host events, and grow your network."}
            </p>
          </div>

          <div className="p-8 md:p-10">
            {error && (
              <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="flex gap-2 mb-8">
              {[1, 2].map((i) => (
                <div 
                  key={i} 
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    step >= i ? "bg-indigo-600" : "bg-gray-100"
                  }`} 
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Community Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., React Developers Nepal"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Category</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all outline-none appearance-none"
                    >
                      <option value="skill">Tech & Skills</option>
                      <option value="university">University Chapter</option>
                      <option value="career">Career & Networking</option>
                      <option value="interest">Hobbies & Interests</option>
                      <option value="country">Regional / Location</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!formData.name}
                    className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-gray-800 transition-colors mt-8"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Mission Statement</label>
                    <p className="text-xs text-gray-500 mb-2">Why does this community need to exist? Who is it for?</p>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="This community is dedicated to bringing together..."
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all outline-none resize-none"
                    />
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3.5 bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading || formData.description.length < 10}
                      className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (user?.role === 'org' ? "Create Community" : "Submit for Review")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
