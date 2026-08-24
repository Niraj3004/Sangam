"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, Bell, CheckCircle2, MessageSquare, Briefcase, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setNotifications((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'message': return <MessageSquare className="w-5 h-5 text-indigo-500" />;
      case 'connection': return <UserPlus className="w-5 h-5 text-emerald-500" />;
      case 'job': return <Briefcase className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted mt-2">Stay updated on your connections, applications, and messages.</p>
        </div>
        
        <button 
          onClick={markAllRead}
          className="bg-slate-100 text-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" /> Mark all read
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">You're all caught up!</h3>
          <p className="text-muted mt-1 text-sm">No new notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif, idx) => (
            <motion.div
              key={notif._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex gap-4 ${notif.isRead ? 'bg-white border-border shadow-sm' : 'bg-indigo-50/50 border-indigo-100 shadow-md'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.isRead ? 'bg-slate-50' : 'bg-white'}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 pt-1">
                <h3 className={`text-base ${notif.isRead ? 'font-medium text-foreground' : 'font-bold text-indigo-950'}`}>
                  {notif.title}
                </h3>
                <p className={`text-sm mt-1 ${notif.isRead ? 'text-muted' : 'text-indigo-900/80 font-medium'}`}>
                  {notif.message}
                </p>
                <span className="text-xs text-muted block mt-3 font-medium">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
              {!notif.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
