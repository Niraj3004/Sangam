"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { 
  Compass, 
  Briefcase, 
  Users, 
  MessageSquare, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Lightbulb,
  Search,
  Bell,
  Sparkles,
  FileText,
  Rocket,
  Building,
  GraduationCap,
  Globe,
  FolderKanban,
  UserSearch,
  Network
} from "lucide-react";

import { Suspense } from "react";
import SearchBar from "./SearchBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Basic unread check
    api.get("/notifications").then(res => {
      const unread = res.data.data.some((n: any) => !n.isRead);
      setHasUnread(unread);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !user) return null;
  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navGroups = [
    {
      title: "Discover",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: "Discover People", href: "/discover", icon: <UserSearch className="w-5 h-5" /> },
        { name: "Opportunity Feed", href: "/feed", icon: <Compass className="w-5 h-5" /> },
        { name: "Ideas Board", href: "/ideas", icon: <Lightbulb className="w-5 h-5" /> },
        { name: "Organizations", href: "/organizations", icon: <Building className="w-5 h-5" /> },
      ]
    },
    {
      title: "Career",
      items: [
        { name: "AI Copilot", href: "/copilot", icon: <Sparkles className="w-5 h-5" /> },
        { name: "Resume Builder", href: "/resume", icon: <FileText className="w-5 h-5" /> },
        { name: "Jobs & Internships", href: "/jobs", icon: <Briefcase className="w-5 h-5" /> },
        { name: "Mentorship Hub", href: "/mentorship", icon: <GraduationCap className="w-5 h-5" /> },
        { name: "My Portfolio", href: `/portfolio/${user?.handle}`, icon: <Globe className="w-5 h-5" /> },
      ]
    },
    {
      title: "Network",
      items: [
        { name: "Peer Matching", href: "/matches", icon: <Rocket className="w-5 h-5" /> },
        { name: "My Network", href: "/network", icon: <Network className="w-5 h-5" /> },
        { name: "Project Workspace", href: "/projects", icon: <FolderKanban className="w-5 h-5" /> },
        { name: "Communities", href: "/communities", icon: <Users className="w-5 h-5" /> },
        { name: "Messages", href: "/messages", icon: <MessageSquare className="w-5 h-5" /> },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col fixed h-full z-20">
        <div className="h-16 flex items-center px-6 border-b border-border gap-2">
          <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold">S</div>
          <span className="text-xl font-bold text-foreground">Sangam</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 mb-2 text-[10px] font-bold text-muted uppercase tracking-wider">{group.title}</div>
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-primary text-white shadow-md shadow-primary/20" 
                        : "text-secondary-foreground hover:bg-slate-50 hover:text-foreground"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )
              })}
            </div>
          ))}
          
          <div className="space-y-1 pt-4 border-t border-slate-100">
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              Sponsored Partners <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[8px]">AD</span>
            </div>
            <Link 
              href="#sponsored"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all group"
            >
              <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
              Apply to F1Soft
            </Link>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-border sticky top-0 z-10 flex items-center justify-between px-8">
          <Suspense fallback={<div className="w-96 bg-slate-50 h-10 rounded-full border border-border animate-pulse" />}>
            <SearchBar />
          </Suspense>
          
          <div className="flex items-center gap-6">
            <Link href="/notifications" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/5 transition-colors relative shadow-sm">
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border border-white" />
              )}
            </Link>

            <div className="h-8 w-[1px] bg-border"></div>

            <div className="flex items-center gap-4">
              <Link href={`/u/${user.handle || 'me'}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm border border-primary/10">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user.email.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-foreground leading-tight">{user.handle || "Student"}</p>
                  <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">{user.verifyTier === 'unverified' ? 'Unverified' : 'Verified Student'}</p>
                </div>
              </Link>
              
              <div className="flex items-center gap-1">
                <Link href="/settings" className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                  <Settings className="w-4 h-4" />
                </Link>
                <button onClick={handleLogout} className="w-9 h-9 rounded-full flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
