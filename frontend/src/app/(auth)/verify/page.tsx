"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { updateUser } = useAuthStore();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return setError("Code must be exactly 6 digits.");
    
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post('/auth/verify-email', { code });
      const user = res.data?.data?.user;
      updateUser({ isEmailVerified: true });
      
      // New users who verify their email should complete their profile
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Invalid or expired code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
          <ShieldCheck className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Verify your email</h1>
        <p className="text-slate-500 text-center text-sm mb-8">
          We sent a 6-digit code to your email. Enter it below to verify your account.
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full px-4 py-4 text-center tracking-[1em] text-2xl font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
