"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, Save, User, Building, ExternalLink } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export default function EditProfilePage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Student Profile State
  const [studentProfile, setStudentProfile] = useState<any>(null);
  
  // Org Profile State
  const [orgProfile, setOrgProfile] = useState<any>(null);

  useEffect(() => {
    if (user?.role === 'org') {
      fetchOrgProfile();
    } else {
      fetchStudentProfile();
    }
  }, [user]);

  const fetchStudentProfile = async () => {
    try {
      const res = await api.get('/profile/me');
      setStudentProfile(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrgProfile = async () => {
    const orgId = useAuthStore.getState().orgId;
    if (!orgId) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.get(`/organizations/${orgId}`);
      setOrgProfile(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStudent = async () => {
    setIsSaving(true);
    try {
      await api.patch('/profile/me', {
        about: studentProfile.about,
        skills: studentProfile.skills,
        name: studentProfile.name
      });
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert("Failed to update profile.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveOrg = async () => {
    const orgId = useAuthStore.getState().orgId;
    if (!orgId) return;
    setIsSaving(true);
    try {
      await api.patch(`/organizations/${orgId}`, {
        name: orgProfile.name,
        description: orgProfile.description,
        website: orgProfile.website,
        industry: orgProfile.industry,
        size: orgProfile.size,
        location: orgProfile.location,
        establishedYear: orgProfile.establishedYear ? parseInt(orgProfile.establishedYear) : undefined,
        tagline: orgProfile.tagline,
        benefits: orgProfile.benefits,
        programs: orgProfile.programs,
        accreditation: orgProfile.accreditation,
        socialLinks: orgProfile.socialLinks,
        contactEmail: orgProfile.contactEmail
      });
      alert("Organization profile updated successfully!");
    } catch (err: any) {
      alert("Failed to update organization.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
          <p className="text-muted mt-2">Manage your public information and details.</p>
        </div>
        
        <button 
          onClick={user?.role === 'org' ? handleSaveOrg : handleSaveStudent}
          disabled={isSaving}
          className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        
        {user?.role === 'org' && orgProfile ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Building className="w-5 h-5 text-primary" /> Organization Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Organization Name</label>
                <input 
                  type="text" 
                  value={orgProfile.name || ''} 
                  onChange={e => setOrgProfile({...orgProfile, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <input 
                  type="url" 
                  value={orgProfile.website || ''} 
                  onChange={e => setOrgProfile({...orgProfile, website: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <input 
                  type="text" 
                  value={orgProfile.industry || ''} 
                  onChange={e => setOrgProfile({...orgProfile, industry: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <select 
                  value={orgProfile.size || ''} 
                  onChange={e => setOrgProfile({...orgProfile, size: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  <option value="">Select Size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <input 
                  type="text" 
                  value={orgProfile.location || ''} 
                  onChange={e => setOrgProfile({...orgProfile, location: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Established Year</label>
                <input 
                  type="number" 
                  value={orgProfile.establishedYear || ''} 
                  onChange={e => setOrgProfile({...orgProfile, establishedYear: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                rows={4}
                value={orgProfile.description || ''} 
                onChange={e => setOrgProfile({...orgProfile, description: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tagline / Mission Statement</label>
              <input 
                type="text" 
                value={orgProfile.tagline || ''} 
                onChange={e => setOrgProfile({...orgProfile, tagline: e.target.value})}
                placeholder="Short, catchy one-liner"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Public Contact Email</label>
                <input 
                  type="email" 
                  value={orgProfile.contactEmail || ''} 
                  onChange={e => setOrgProfile({...orgProfile, contactEmail: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Accreditation (Colleges)</label>
                <input 
                  type="text" 
                  value={orgProfile.accreditation || ''} 
                  onChange={e => setOrgProfile({...orgProfile, accreditation: e.target.value})}
                  placeholder="e.g. TU Affiliated"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Benefits (Employers, comma separated)</label>
                <input 
                  type="text" 
                  value={orgProfile.benefits?.join(', ') || ''} 
                  onChange={e => setOrgProfile({...orgProfile, benefits: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)})}
                  placeholder="Remote Work, Health Insurance..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Programs Offered (Colleges, comma separated)</label>
                <input 
                  type="text" 
                  value={orgProfile.programs?.join(', ') || ''} 
                  onChange={e => setOrgProfile({...orgProfile, programs: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)})}
                  placeholder="BSc. CSIT, BCA..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-foreground mt-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">LinkedIn</label>
                <input 
                  type="url" 
                  value={orgProfile.socialLinks?.linkedin || ''} 
                  onChange={e => setOrgProfile({...orgProfile, socialLinks: {...orgProfile.socialLinks, linkedin: e.target.value}})}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Twitter</label>
                <input 
                  type="url" 
                  value={orgProfile.socialLinks?.twitter || ''} 
                  onChange={e => setOrgProfile({...orgProfile, socialLinks: {...orgProfile.socialLinks, twitter: e.target.value}})}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Facebook</label>
                <input 
                  type="url" 
                  value={orgProfile.socialLinks?.facebook || ''} 
                  onChange={e => setOrgProfile({...orgProfile, socialLinks: {...orgProfile.socialLinks, facebook: e.target.value}})}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
            </div>
          </div>
        ) : studentProfile ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Student Details</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input 
                type="text" 
                value={studentProfile.name || ''} 
                onChange={e => setStudentProfile({...studentProfile, name: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">About / Bio</label>
              <textarea 
                rows={4}
                value={studentProfile.about || ''} 
                onChange={e => setStudentProfile({...studentProfile, about: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Skills (comma separated)</label>
              <input 
                type="text" 
                value={studentProfile.skills?.join(', ') || ''} 
                onChange={e => setStudentProfile({...studentProfile, skills: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)})}
                placeholder="React, Python, Design..."
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
            
            {/* Note: In a complete app, we'd add complex UI for editing arrays of Education/Projects here too */}
          </div>
        ) : (
          <div className="text-center text-muted py-10">No profile found.</div>
        )}
      </div>
    </div>
  );
}
