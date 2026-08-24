"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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
  Rocket
} from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
      title: "Discover",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: "Opportunity Feed", href: "/feed", icon: <Compass className="w-5 h-5" /> },
        { name: "Ideas Board", href: "/ideas", icon: <Lightbulb className="w-5 h-5" /> },
      ]
    },
    {
      title: "Career",
      items: [
        { name: "AI Copilot", href: "/copilot", icon: <Sparkles className="w-5 h-5" /> },
        { name: "Resume & Portfolio", href: "/resume", icon: <FileText className="w-5 h-5" /> },
        { name: "Jobs & Internships", href: "/jobs", icon: <Briefcase className="w-5 h-5" /> },
      ]
    },
    {
      title: "Network",
      items: [
        { name: "Peer Matching", href: "/matches", icon: <Rocket className="w-5 h-5" /> },
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
        </div>

        <div className="p-4 border-t border-border">
          <Link href={`/u/${user.handle || 'me'}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
              {user.profilePic ? (
                <img src={user.profilePic} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user.email.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.handle || "Student"}</p>
              <p className="text-xs text-muted truncate">{user.verifyTier === 'unverified' ? 'Unverified' : 'Verified'}</p>
            </div>
          </Link>
          
          <div className="flex gap-1 mt-2">
            <Link href="/settings" className="flex-1 flex justify-center items-center p-2 rounded-lg text-muted hover:bg-slate-50 hover:text-foreground transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
            <button onClick={handleLogout} className="flex-1 flex justify-center items-center p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-border sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="flex items-center bg-secondary rounded-full px-4 py-2 w-96 border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-muted mr-2" />
            <input 
              type="text" 
              placeholder="Search people, projects, opportunities..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted hover:text-foreground transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border border-white" />
            </button>
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
