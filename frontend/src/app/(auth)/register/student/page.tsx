"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, AlertCircle, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";

const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  handle: z.string().min(3, { message: "Handle must be at least 3 characters" }).max(30),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError(null);
      const response = await api.post("/auth/register", data);
      
      if (response.data.success) {
        // Set auth tokens so they can access the authenticated /verify-email endpoint
        const { user, accessToken, refreshToken } = response.data.data || response.data;
        setAuth(user, accessToken, refreshToken);
        
        // Redirect to verify page after successful registration
        router.push("/verify");
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Registration failed. Please try again.");
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-semibold text-foreground mb-2 text-center">Create an account</h2>
      <p className="text-sm text-muted text-center mb-8">
        Join the network of verified Nepali students
      </p>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Username / Handle</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. ram_sharma"
              {...register("handle")}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
          {errors.handle && <p className="text-red-500 text-xs mt-1">{errors.handle.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              placeholder="you@university.edu.np"
              {...register("email")}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-1 text-sm">
        <span className="text-muted">Already have an account?</span>
        <Link href="/login" className="text-primary font-medium hover:text-primary-hover">
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}
