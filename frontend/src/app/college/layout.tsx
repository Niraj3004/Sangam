"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Building2, 
  Users, 
  CalendarDays, 
  MessageSquare, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Search,
  Bell,
  GraduationCap,
  Globe
} from "lucide-react";

export default function CollegeLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
    // Note: In production, add middleware/checks to ensure user is an Admin of a College Organization.
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !user) return null;
  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navGroups = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", href: "/college/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: "Analytics", href: "/college/analytics", icon: <Building2 className="w-5 h-5" /> },
      ]
    },
    {
      title: "Engagement",
      items: [
        { name: "Events & Hackathons", href: "/college/events", icon: <CalendarDays className="w-5 h-5" /> },
        { name: "Official Communities", href: "/college/communities", icon: <MessageSquare className="w-5 h-5" /> },
      ]
    },
    {
      title: "Network",
      items: [
        { name: "Student Directory", href: "/college/students", icon: <Users className="w-5 h-5" /> },
        { name: "Alumni Success", href: "/college/alumni", icon: <GraduationCap className="w-5 h-5" /> },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Institutional Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-20 text-slate-300">
        <div className="h-20 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-white block leading-tight">College Portal</span>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Sangam B2B</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{group.title}</div>
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <Link href="/college/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors mb-2 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white overflow-hidden">
               <Globe className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Kathmandu Univ.</p>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Verified
              </p>
            </div>
          </Link>
          
          <div className="flex gap-2 mt-2">
            <Link href="/college/settings" className="flex-1 flex justify-center items-center p-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors bg-slate-900">
              <Settings className="w-4 h-4" />
            </Link>
            <button onClick={handleLogout} className="flex-1 flex justify-center items-center p-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors bg-slate-900">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 flex flex-col min-h-screen">
        {/* Institutional Topbar */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-10 shadow-sm">
          <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2.5 w-96 border border-transparent focus-within:border-blue-500/30 focus-within:bg-white focus-within:shadow-sm transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search students, alumni, or events..." 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-900 placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-slate-100" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-10 mx-auto w-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
