"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function MeRedirectPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const handleRedirect = async () => {
      if (user?.handle) {
        router.replace(`/u/${user.handle}`);
      } else {
        try {
          const res = await api.get('/auth/me');
          const fetchedUser = res.data.data;
          
          if (fetchedUser?.handle) {
            // Also update the store if possible, but redirecting is the main goal
            useAuthStore.getState().setAuth(
              fetchedUser, 
              useAuthStore.getState().accessToken!, 
              useAuthStore.getState().refreshToken!,
              fetchedUser.role === 'org' ? (fetchedUser as any).orgType : undefined
            );
            router.replace(`/u/${fetchedUser.handle}`);
          } else {
            router.replace("/onboarding");
          }
        } catch (err) {
          router.replace("/dashboard");
        }
      }
    };

    handleRedirect();
  }, [user, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}
