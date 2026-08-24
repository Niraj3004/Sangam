"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, Settings as SettingsIcon, Bell, Shield, Code, Save } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSecondaryOtp, setShowSecondaryOtp] = useState(false);
  const [secondaryOtp, setSecondaryOtp] = useState("");
  
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    marketingEmails: false,
    profileVisibility: "public",
    secondaryEmail: ""
  });

  useEffect(() => {
    fetchPrefs();
  }, []);

  const fetchPrefs = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/notifications/prefs');
      if (data.data) {
        setPrefs({ ...prefs, ...data.data });
      }
    } catch (err) {
      console.error(err);
      // Fallback to defaults if endpoint doesn't exist yet
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch('/notifications/prefs', prefs);
      alert("Settings saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSecondaryEmail = async () => {
    if (!prefs.secondaryEmail.trim()) return;
    setIsSaving(true);
    try {
      await api.post('/auth/secondary-email', { secondaryEmail: prefs.secondaryEmail });
      alert("Secondary email added successfully. Check your email for the OTP.");
      setShowSecondaryOtp(true);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error?.message || "Failed to add secondary email.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifySecondaryOtp = async () => {
    if (secondaryOtp.length !== 6) return alert('Code must be 6 digits');
    setIsSaving(true);
    try {
      await api.post('/auth/verify-secondary', { secondaryEmail: prefs.secondaryEmail, code: secondaryOtp });
      alert("Secondary email officially linked! ✅");
      setShowSecondaryOtp(false);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error?.message || "Invalid OTP.");
    } finally {
      setIsSaving(false);
    }
  };

  const connectGithub = async () => {
    // In a real app, this redirects to github OAuth flow
    alert("Redirecting to GitHub OAuth...");
  };

  if (isLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted mt-2">Manage your preferences and integrations.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-2">
            <button className="w-full text-left px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-bold flex items-center gap-3">
              <Bell className="w-4 h-4" /> Notifications
            </button>
            <button className="w-full text-left px-4 py-2.5 rounded-xl text-muted hover:bg-slate-50 hover:text-foreground font-medium flex items-center gap-3 transition-colors">
              <Shield className="w-4 h-4" /> Privacy & Security
            </button>
            <button className="w-full text-left px-4 py-2.5 rounded-xl text-muted hover:bg-slate-50 hover:text-foreground font-medium flex items-center gap-3 transition-colors">
              <SettingsIcon className="w-4 h-4" /> Account
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          
          <section className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6">Notification Preferences</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-foreground">Email Notifications</h4>
                  <p className="text-sm text-muted">Receive alerts for messages and matches via email.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={prefs.emailNotifications} onChange={(e) => setPrefs({...prefs, emailNotifications: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-foreground">Push Notifications</h4>
                  <p className="text-sm text-muted">In-app realtime alerts.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={prefs.pushNotifications} onChange={(e) => setPrefs({...prefs, pushNotifications: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6">Privacy</h2>
            
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Profile Visibility</label>
              <select 
                value={prefs.profileVisibility}
                onChange={(e) => setPrefs({...prefs, profileVisibility: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
              >
                <option value="public">Public (Visible in Discover & Search)</option>
                <option value="private">Private (Only visible to connections)</option>
              </select>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6">Integrations</h2>
            
            <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-slate-50">
              <div className="flex items-center gap-3">
                <Code className="w-6 h-6 text-slate-800" />
                <div>
                  <h4 className="font-bold text-foreground">GitHub</h4>
                  <p className="text-xs text-muted">Import repositories to your profile.</p>
                </div>
              </div>
              <button 
                onClick={connectGithub}
                className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-bold text-foreground hover:bg-slate-100 transition-colors shadow-sm"
              >
                Connect
              </button>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6">Account Security</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Secondary Recovery Email</label>
                <p className="text-xs text-muted mb-3">Add a personal email to recover your account if you lose access to your college email.</p>
                {!showSecondaryOtp ? (
                  <div className="flex gap-3">
                    <input 
                      type="email" 
                      value={prefs.secondaryEmail}
                      onChange={(e) => setPrefs({...prefs, secondaryEmail: e.target.value})}
                      placeholder="e.g., personal@gmail.com"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                    <button 
                      onClick={handleAddSecondaryEmail}
                      disabled={isSaving || !prefs.secondaryEmail}
                      className="px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Sending...' : 'Link Email'}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <input 
                      type="text"
                      maxLength={6}
                      value={secondaryOtp}
                      onChange={(e) => setSecondaryOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-center tracking-[0.5em] font-bold"
                    />
                    <button 
                      onClick={handleVerifySecondaryOtp}
                      disabled={isSaving || secondaryOtp.length !== 6}
                      className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover transition-colors disabled:opacity-50"
                    >
                      Verify
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
