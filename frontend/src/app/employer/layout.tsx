"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Building2, 
  Users, 
  Briefcase, 
  Search, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Bell,
  Star,
  FileText
} from "lucide-react";

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
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
        { name: "Dashboard", href: "/employer/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: "Analytics", href: "/employer/analytics", icon: <Building2 className="w-5 h-5" /> },
      ]
    },
    {
      title: "Recruitment",
      items: [
        { name: "Jobs & Internships", href: "/employer/jobs", icon: <Briefcase className="w-5 h-5" /> },
        { name: "Applicant Tracking", href: "/employer/applicants", icon: <Users className="w-5 h-5" /> },
      ]
    },
    {
      title: "Sourcing",
      items: [
        { name: "Search Candidates", href: "/employer/candidates", icon: <Search className="w-5 h-5" /> },
        { name: "Saved Portfolios", href: "/employer/saved", icon: <Star className="w-5 h-5" /> },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Employer Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col fixed h-full z-20">
        <div className="h-20 flex items-center px-6 border-b border-gray-100 gap-3 bg-gray-50/50">
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-600/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900 block leading-tight">Sangam Hire</span>
            <span className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">Employer Portal</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <div className="px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{group.title}</div>
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-orange-50 text-orange-600 font-bold" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
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

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <Link href="/employer/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all mb-2 border border-transparent hover:border-gray-200">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 overflow-hidden font-black text-xl">
               F
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">F1Soft Int.</p>
              <p className="text-xs text-gray-500 font-medium">Verified Employer</p>
            </div>
          </Link>
          
          <div className="flex gap-2 mt-2">
            <Link href="/employer/settings" className="flex-1 flex justify-center items-center p-2.5 rounded-lg text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-900 transition-all border border-transparent hover:border-gray-200">
              <Settings className="w-4 h-4" />
            </Link>
            <button onClick={handleLogout} className="flex-1 flex justify-center items-center p-2.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:shadow-sm transition-all border border-transparent hover:border-rose-100">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between px-10">
          <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2.5 w-96 border border-transparent focus-within:border-orange-500/30 focus-within:bg-white focus-within:shadow-sm transition-all">
            <Search className="w-4 h-4 text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search resumes, candidates..." 
              className="bg-transparent border-none outline-none text-sm w-full text-gray-900 placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-orange-500 border-2 border-gray-100" />
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
