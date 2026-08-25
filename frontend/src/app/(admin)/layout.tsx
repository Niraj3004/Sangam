"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, ShieldAlert, LayoutDashboard, CheckCircle, Users } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isInitialized) return;
    
    // Check if user is admin, moderator, or curator
    if (!user || !['admin', 'moderator', 'curator'].includes(user.role)) {
      router.push("/dashboard");
    } else {
      setAuthorized(true);
    }
  }, [user, isInitialized, router]);

  if (!isInitialized || !authorized) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Review Verification", href: "/admin/review", icon: <CheckCircle className="w-5 h-5" /> },
    { label: "Moderation Queue", href: "/admin/moderation", icon: <ShieldAlert className="w-5 h-5" /> },
    { label: "User Management", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex-shrink-0 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-foreground leading-tight">Admin Center</h2>
            <p className="text-xs text-muted font-medium uppercase tracking-wider">{user?.role}</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <div className="text-xs font-bold text-muted uppercase tracking-wider mb-4 px-3">Management</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-muted hover:bg-slate-50 hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
