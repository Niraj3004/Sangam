"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { Loader2, Building2, Briefcase, ChevronLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function EmployerRegister() {
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
    industry: "",
    size: "1-10",
    location: "",
    establishedYear: "",
    tagline: "",
    contactEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create Organization + User in one shot
      const res = await api.post("/auth/register/org", {
        ...formData,
        establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : undefined,
        orgType: "employer"
      });

      // Save tokens and navigate to verification screen
      setTokens(res.accessToken, res.refreshToken);
      setUser(res.user);
      useAuthStore.getState().setAuth(res.user, res.accessToken, res.refreshToken, res.orgType, res.orgId);
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
        <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/20 mb-4">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sangam Hire</h1>
        <p className="text-gray-500 mt-2">Create your Employer Workspace to start hiring top verified talent.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Company Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                required
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                placeholder="F1Soft International"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Careers Website</label>
              <input
                type="url"
                required
                value={formData.orgWebsite}
                onChange={(e) => setFormData({ ...formData, orgWebsite: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                placeholder="https://f1soft.com/careers"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Company Description</label>
            <textarea
              required
              minLength={10}
              value={formData.orgDescription}
              onChange={(e) => setFormData({ ...formData, orgDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Tell students about your company..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Company Tagline / Slogan</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                placeholder="e.g. Empowering the future of finance"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Public Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                placeholder="hello@company.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                placeholder="e.g. Fintech"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Company Size</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Location (HQ)</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                placeholder="e.g. Kathmandu, Nepal"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Established Year</label>
              <input
                type="number"
                value={formData.establishedYear}
                onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                placeholder="e.g. 2004"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 pt-4">Admin Details (Your Account)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Work Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                placeholder="hr@f1soft.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Your Full Name / Handle</label>
              <input
                type="text"
                required
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                placeholder="Sita Thapa"
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
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold flex items-center justify-center transition-colors disabled:opacity-70 shadow-lg shadow-orange-600/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Employer Workspace'}
        </button>
      </form>
    </div>
  );
}
