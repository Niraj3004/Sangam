"use client";

import { useAuthStore } from "@/store/auth.store";
import { ShieldAlert, Users, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  const stats = [
    { label: "Pending Verifications", value: "3", icon: <CheckCircle className="w-6 h-6 text-blue-600" />, href: "/admin/review", color: "bg-blue-50" },
    { label: "Reported Content", value: "0", icon: <ShieldAlert className="w-6 h-6 text-rose-600" />, href: "/admin/moderation", color: "bg-rose-50" },
    { label: "Active Users", value: "124", icon: <Users className="w-6 h-6 text-green-600" />, href: "/admin/users", color: "bg-green-50" },
    { label: "Platform Growth", value: "+12%", icon: <TrendingUp className="w-6 h-6 text-purple-600" />, href: "/admin", color: "bg-purple-50" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, {user?.name || user?.handle}</h1>
        <p className="text-gray-500 mt-2">Here is what is happening on Sangam today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
