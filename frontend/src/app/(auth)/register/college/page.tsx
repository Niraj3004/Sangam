"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { Loader2, GraduationCap, ChevronLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function CollegeRegister() {
  const router = useRouter();
  const { setTokens, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    orgName: "",
    orgWebsite: "",
    handle: "",
    email: "",
    password: "",
    orgDescription: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create Organization + User in one shot
      const res = await api.post("/auth/register/org", {
        ...formData,
        orgType: "college"
      });

      // Save tokens and navigate to verification screen
      setTokens(res.accessToken, res.refreshToken);
      setUser(res.user);
      router.push("/verify");
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <div className="mb-8">
        <Link href="/register" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-4 w-fit">
          <ChevronLeft className="w-4 h-4" /> Back to options
        </Link>
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 mb-4">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sangam for Institutions</h1>
        <p className="text-gray-500 mt-2">Create your College Workspace to track alumni and host official events.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Institution Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Institution Name</label>
              <input
                type="text"
                required
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="Kathmandu University"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Official Website</label>
              <input
                type="url"
                required
                value={formData.orgWebsite}
                onChange={(e) => setFormData({ ...formData, orgWebsite: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="https://ku.edu.np"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Institution Overview</label>
            <textarea
              required
              minLength={10}
              value={formData.orgDescription}
              onChange={(e) => setFormData({ ...formData, orgDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Tell students about your institution..."
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 pt-4">Admin Details (Your Account)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Admin Email (.edu.np preferred)</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="admin@ku.edu.np"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Your Full Name / Title</label>
              <input
                type="text"
                required
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="Dr. Ram Karki (IT Head)"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center transition-colors disabled:opacity-70 shadow-lg shadow-blue-600/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create College Workspace'}
        </button>
      </form>
    </div>
  );
}
