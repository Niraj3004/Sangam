"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, Save, User, Building, Camera, UploadCloud, X, ChevronDown, ChevronUp, GraduationCap, Code, Briefcase, Link } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { motion, AnimatePresence } from "framer-motion";

const TagInput = ({ value = [], onChange, placeholder, label }: any) => {
  const [input, setInput] = useState("");
  
  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = input.trim();
      if (newTag && !value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInput("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_: any, index: number) => index !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex flex-wrap gap-2 p-2 rounded-xl border border-border bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all min-h-[46px] cursor-text" onClick={(e) => {
        const inputEl = e.currentTarget.querySelector('input');
        if (inputEl) inputEl.focus();
      }}>
        <AnimatePresence>
          {value.map((tag: string, index: number) => (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              key={index} className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium"
            >
              {tag}
              <button type="button" onClick={() => removeTag(index)} className="hover:text-primary-hover focus:outline-none p-0.5 rounded-full hover:bg-primary/20 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm min-w-[120px]"
        />
      </div>
      <p className="text-[10px] text-muted">Press Enter or Comma to add.</p>
    </div>
  );
};

export default function EditProfilePage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Student Profile State
  const [studentProfile, setStudentProfile] = useState<any>(null);
  
  // Org Profile State
  const [orgProfile, setOrgProfile] = useState<any>(null);

  // Accordion State
  const [expandedExp, setExpandedExp] = useState<number | null>(0);
  const [expandedEdu, setExpandedEdu] = useState<number | null>(0);
  const [expandedCert, setExpandedCert] = useState<number | null>(0);
  const [expandedProj, setExpandedProj] = useState<number | null>(0);

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
    const orgId = (useAuthStore.getState() as any).orgId;
    if (!orgId) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.get(`/orgs/${orgId}`);
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
      const payload: any = {
        name: studentProfile.name,
        phone: studentProfile.phone,
        about: studentProfile.about,
        skills: studentProfile.skills,
        location: studentProfile.location,
        availability: studentProfile.availability,
        careerGoal: studentProfile.careerGoal,
        interests: studentProfile.interests,
        lookingFor: studentProfile.lookingFor,
        studyDestination: studentProfile.studyDestination,
        links: studentProfile.links,
        achievements: studentProfile.achievements,
        experience: studentProfile.experience,
        education: studentProfile.education,
        certifications: studentProfile.certifications,
        githubRepositories: studentProfile.githubRepositories
      };

      // Clean empty strings for optional fields
      if (!payload.phone) delete payload.phone;
      if (!payload.location) delete payload.location;
      if (!payload.availability) delete payload.availability;
      if (!payload.careerGoal) delete payload.careerGoal;
      if (!payload.studyDestination) delete payload.studyDestination;

      await api.patch('/profile/me', payload);
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Failed to update profile.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveOrg = async () => {
    const orgId = (useAuthStore.getState() as any).orgId;
    if (!orgId) return;
    setIsSaving(true);
    try {
      const payload: any = {
        name: orgProfile.name,
        description: orgProfile.description,
        website: orgProfile.website || undefined,
        industry: orgProfile.industry,
        size: orgProfile.size,
        location: orgProfile.location,
        establishedYear: orgProfile.establishedYear ? parseInt(orgProfile.establishedYear) : undefined,
        tagline: orgProfile.tagline,
        benefits: orgProfile.benefits,
        programs: orgProfile.programs,
        accreditation: orgProfile.accreditation,
        socialLinks: {
          linkedin: orgProfile.socialLinks?.linkedin || undefined,
          twitter: orgProfile.socialLinks?.twitter || undefined,
          facebook: orgProfile.socialLinks?.facebook || undefined,
        },
        contactEmail: orgProfile.contactEmail || undefined
      };

      // Remove undefined values cleanly so Zod doesn't fail on empty strings that we just converted to undefined
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
      if (payload.socialLinks) {
        Object.keys(payload.socialLinks).forEach(key => payload.socialLinks[key] === undefined && delete payload.socialLinks[key]);
      }

      await api.patch(`/orgs/${orgId}`, payload);
      alert("Organization profile updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Failed to update organization.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append(type, file);

    try {
      if (type === 'avatar') {
        const res = await api.post('/profile/me/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setStudentProfile({ ...studentProfile, avatarUrl: res.data.data.avatarUrl });
        alert("Avatar updated successfully!");
      } else {
        const orgId = (useAuthStore.getState() as any).orgId;
        const res = await api.post(`/orgs/${orgId}/logo`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setOrgProfile({ ...orgProfile, logoUrl: res.data.data.logoUrl });
        alert("Logo updated successfully!");
      }
    } catch (err: any) {
      alert("Failed to upload image.");
      console.error(err);
    } finally {
      setIsUploading(false);
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
            
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-border rounded-xl">
              <div className="relative group w-24 h-24 rounded-xl overflow-hidden bg-white shadow-sm border border-border flex items-center justify-center mb-4">
                {orgProfile.logoUrl ? (
                  <img src={orgProfile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building className="w-8 h-8 text-muted" />
                )}
                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} disabled={isUploading} />
                </label>
              </div>
              <p className="text-sm font-medium text-muted">Upload Organization Logo</p>
            </div>

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
            
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-border rounded-xl">
              <div className="relative group w-24 h-24 rounded-full overflow-hidden bg-white shadow-sm border border-border flex items-center justify-center mb-4">
                {studentProfile.avatarUrl ? (
                  <img src={studentProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-muted" />
                )}
                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'avatar')} disabled={isUploading} />
                </label>
              </div>
              <p className="text-sm font-medium text-muted">Upload Profile Picture</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label className="text-sm font-medium">Phone Number</label>
                <input 
                  type="tel" 
                  value={studentProfile.phone || ''} 
                  onChange={e => setStudentProfile({...studentProfile, phone: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  placeholder="+977-9800000000"
                />
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TagInput 
                label="Skills" 
                placeholder="React, Python, Design..." 
                value={studentProfile.skills?.map((s: any) => s.name || s) || []}
                onChange={(tags: string[]) => setStudentProfile({...studentProfile, skills: tags.map(t => ({name: t}))})}
              />
              <TagInput 
                label="Achievements" 
                placeholder="Dean's List, 1st Place Hackathon..." 
                value={studentProfile.achievements || []}
                onChange={(tags: string[]) => setStudentProfile({...studentProfile, achievements: tags})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <input 
                  type="text" 
                  value={studentProfile.location || ''} 
                  onChange={e => setStudentProfile({...studentProfile, location: e.target.value})}
                  placeholder="e.g. Kathmandu, Nepal"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Career Goal</label>
                <select 
                  value={studentProfile.careerGoal || ''} 
                  onChange={e => setStudentProfile({...studentProfile, careerGoal: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  <option value="">Select a Goal</option>
                  <option value="internship">Looking for Internship</option>
                  <option value="job">Looking for Full-time Job</option>
                  <option value="startup">Building a Startup</option>
                  <option value="scholarship">Seeking Scholarship</option>
                  <option value="higher_study">Higher Studies</option>
                  <option value="hackathon">Hackathons</option>
                  <option value="freelance">Freelancing</option>
                  <option value="networking">Just Networking</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TagInput 
                label="Interests" 
                placeholder="AI, Blockchain, UI/UX..." 
                value={studentProfile.interests || []}
                onChange={(tags: string[]) => setStudentProfile({...studentProfile, interests: tags})}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Availability</label>
                <input 
                  type="text" 
                  value={studentProfile.availability || ''} 
                  onChange={e => setStudentProfile({...studentProfile, availability: e.target.value})}
                  placeholder="e.g. 20 hrs/week, Evenings"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-foreground mt-8 mb-4 border-b border-border pb-2">Links & Socials</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">LinkedIn</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-4 w-4 text-muted" />
                  </div>
                  <input 
                    type="url" 
                    value={studentProfile.links?.linkedin || ''} 
                    onChange={e => setStudentProfile({...studentProfile, links: {...studentProfile.links, linkedin: e.target.value}})}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Code className="h-4 w-4 text-muted" />
                  </div>
                  <input 
                    type="url" 
                    value={studentProfile.links?.github || ''} 
                    onChange={e => setStudentProfile({...studentProfile, links: {...studentProfile.links, github: e.target.value}})}
                    placeholder="https://github.com/..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Portfolio Website</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="h-4 w-4 text-muted" />
                  </div>
                  <input 
                    type="url" 
                    value={studentProfile.links?.portfolio || ''} 
                    onChange={e => setStudentProfile({...studentProfile, links: {...studentProfile.links, portfolio: e.target.value}})}
                    placeholder="https://yourwebsite.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-foreground mt-8 mb-4 border-b border-border pb-2">GitHub Integration</h3>
            <div className="bg-slate-50 border border-border rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  Connect GitHub
                </h4>
                <p className="text-sm text-gray-500 max-w-lg">
                  Connect your GitHub account to automatically import your top repositories and tech stack directly to your portfolio.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await api.post("/integrations/github/connect");
                      if (res.data?.data?.authUrl) {
                        window.location.href = res.data.data.authUrl;
                      } else {
                        alert("GitHub connection simulated successfully.");
                      }
                    } catch (e) {
                      alert("Simulating GitHub connect. OAuth flow would redirect here.");
                    }
                  }}
                  className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-gray-800 transition-colors"
                >
                  Connect Account
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await api.get("/integrations/github/repos");
                      alert("Repositories fetched! Import modal would open here.");
                    } catch (e) {
                      alert("Simulating fetch of GitHub repositories...");
                    }
                  }}
                  className="bg-white border border-border text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors"
                >
                  Import Repositories
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-foreground mt-8 mb-4 border-b border-border pb-2">Career Experience</h3>
            <div className="space-y-4">
              {(studentProfile.experience || []).map((exp: any, index: number) => {
                const isExpanded = expandedExp === index;
                return (
                  <div key={index} className="bg-slate-50 border border-border rounded-xl overflow-hidden transition-all">
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => setExpandedExp(isExpanded ? null : index)}
                    >
                      <div className="font-semibold text-sm">
                        {exp.title ? `${exp.title} at ${exp.company || 'Unknown Company'}` : `Experience ${index + 1}`}
                      </div>
                      <div className="flex items-center gap-4 text-muted">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const newExp = [...studentProfile.experience];
                            newExp.splice(index, 1);
                            setStudentProfile({...studentProfile, experience: newExp});
                          }}
                          className="text-rose-500 text-xs font-bold hover:underline"
                        >
                          Remove
                        </button>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 space-y-4 border-t border-border/50 pt-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-medium">Job Title</label>
                              <input type="text" value={exp.title} onChange={e => {
                                const newExp = [...studentProfile.experience];
                                newExp[index].title = e.target.value;
                                setStudentProfile({...studentProfile, experience: newExp});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="e.g. Frontend Intern" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium">Company / Organization</label>
                              <input type="text" value={exp.company} onChange={e => {
                                const newExp = [...studentProfile.experience];
                                newExp[index].company = e.target.value;
                                setStudentProfile({...studentProfile, experience: newExp});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="e.g. Evolvix Infotech" />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-medium">Start Date</label>
                              <input type="text" value={exp.startDate || ''} onChange={e => {
                                const newExp = [...studentProfile.experience];
                                newExp[index].startDate = e.target.value;
                                setStudentProfile({...studentProfile, experience: newExp});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="e.g. Jan 2024" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium">End Date</label>
                              <input type="text" value={exp.endDate || ''} onChange={e => {
                                const newExp = [...studentProfile.experience];
                                newExp[index].endDate = e.target.value;
                                setStudentProfile({...studentProfile, experience: newExp});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="e.g. Present" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Description</label>
                            <textarea rows={2} value={exp.description || ''} onChange={e => {
                                const newExp = [...studentProfile.experience];
                                newExp[index].description = e.target.value;
                                setStudentProfile({...studentProfile, experience: newExp});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="What did you do?" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              
              <button 
                onClick={() => {
                  const newExp = [...(studentProfile.experience || []), { title: '', company: '', startDate: '', endDate: '', description: '' }];
                  setStudentProfile({...studentProfile, experience: newExp });
                  setExpandedExp(newExp.length - 1);
                }}
                className="w-full py-3 border-2 border-dashed border-primary/30 text-primary rounded-xl font-medium hover:bg-primary/5 transition-colors"
              >
                + Add Experience
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-foreground mt-8 mb-4 border-b border-border pb-2">Education</h3>
            <div className="space-y-4">
              {(studentProfile.education || []).map((edu: any, index: number) => {
                const isExpanded = expandedEdu === index;
                return (
                  <div key={index} className="bg-slate-50 border border-border rounded-xl overflow-hidden transition-all">
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => setExpandedEdu(isExpanded ? null : index)}
                    >
                      <div className="font-semibold text-sm">
                        {edu.degree ? `${edu.degree} at ${edu.institution || 'Unknown Institution'}` : `Education ${index + 1}`}
                      </div>
                      <div className="flex items-center gap-4 text-muted">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const newEdu = [...studentProfile.education];
                            newEdu.splice(index, 1);
                            setStudentProfile({...studentProfile, education: newEdu});
                          }}
                          className="text-rose-500 text-xs font-bold hover:underline"
                        >
                          Remove
                        </button>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 space-y-4 border-t border-border/50 pt-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-medium">Institution / University</label>
                              <input type="text" value={edu.institution} onChange={e => {
                                const newEdu = [...studentProfile.education];
                                newEdu[index].institution = e.target.value;
                                setStudentProfile({...studentProfile, education: newEdu});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="e.g. Islington College" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium">Degree</label>
                              <input type="text" value={edu.degree || ''} onChange={e => {
                                const newEdu = [...studentProfile.education];
                                newEdu[index].degree = e.target.value;
                                setStudentProfile({...studentProfile, education: newEdu});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="e.g. BSc (Hons) Computing" />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-medium">Start Year</label>
                              <input type="number" value={edu.startYear || ''} onChange={e => {
                                const newEdu = [...studentProfile.education];
                                newEdu[index].startYear = parseInt(e.target.value) || undefined;
                                setStudentProfile({...studentProfile, education: newEdu});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="e.g. 2020" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium">End Year</label>
                              <input type="number" value={edu.endYear || ''} onChange={e => {
                                const newEdu = [...studentProfile.education];
                                newEdu[index].endYear = parseInt(e.target.value) || undefined;
                                setStudentProfile({...studentProfile, education: newEdu});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="e.g. 2024" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              
              <button 
                onClick={() => {
                  const newEdu = [...(studentProfile.education || []), { institution: '', degree: '', fieldOfStudy: '', startYear: undefined, endYear: undefined }];
                  setStudentProfile({...studentProfile, education: newEdu });
                  setExpandedEdu(newEdu.length - 1);
                }}
                className="w-full py-3 border-2 border-dashed border-primary/30 text-primary rounded-xl font-medium hover:bg-primary/5 transition-colors"
              >
                + Add Education
              </button>
            </div>

            <h3 className="text-lg font-bold text-foreground mt-8 mb-4 border-b border-border pb-2">Certifications & Training</h3>
            <div className="space-y-4">
              {(studentProfile.certifications || []).map((cert: any, index: number) => {
                const isExpanded = expandedCert === index;
                return (
                  <div key={index} className="bg-slate-50 border border-border rounded-xl overflow-hidden transition-all">
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => setExpandedCert(isExpanded ? null : index)}
                    >
                      <div className="font-semibold text-sm">
                        {cert.name ? cert.name : `Certification ${index + 1}`}
                      </div>
                      <div className="flex items-center gap-4 text-muted">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const newCerts = [...studentProfile.certifications];
                            newCerts.splice(index, 1);
                            setStudentProfile({...studentProfile, certifications: newCerts});
                          }}
                          className="text-rose-500 text-xs font-bold hover:underline"
                        >
                          Remove
                        </button>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 space-y-4 border-t border-border/50 pt-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-medium">Certification Name</label>
                              <input type="text" value={cert.name} onChange={e => {
                                const newCerts = [...studentProfile.certifications];
                                newCerts[index].name = e.target.value;
                                setStudentProfile({...studentProfile, certifications: newCerts});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="e.g. AWS Certified Developer" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium">Issuing Organization</label>
                              <input type="text" value={cert.issuer} onChange={e => {
                                const newCerts = [...studentProfile.certifications];
                                newCerts[index].issuer = e.target.value;
                                setStudentProfile({...studentProfile, certifications: newCerts});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="e.g. Amazon Web Services" />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-medium">Issue Date</label>
                              <input type="text" value={cert.issueDate || ''} onChange={e => {
                                const newCerts = [...studentProfile.certifications];
                                newCerts[index].issueDate = e.target.value;
                                setStudentProfile({...studentProfile, certifications: newCerts});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="e.g. Jan 2025" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium">Credential ID / URL (Optional)</label>
                              <input type="text" value={cert.credentialId || ''} onChange={e => {
                                const newCerts = [...studentProfile.certifications];
                                newCerts[index].credentialId = e.target.value;
                                setStudentProfile({...studentProfile, certifications: newCerts});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="e.g. 12345-ABCDE" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              
              <button 
                onClick={() => {
                  const newCert = [...(studentProfile.certifications || []), { name: '', issuer: '', issueDate: '', credentialId: '' }];
                  setStudentProfile({...studentProfile, certifications: newCert });
                  setExpandedCert(newCert.length - 1);
                }}
                className="w-full py-3 border-2 border-dashed border-primary/30 text-primary rounded-xl font-medium hover:bg-primary/5 transition-colors"
              >
                + Add Certification
              </button>
            </div>

            <h3 className="text-lg font-bold text-foreground mt-8 mb-4 border-b border-border pb-2">Portfolio Projects</h3>
            <div className="space-y-4">
              {(studentProfile.githubRepositories || []).map((proj: any, index: number) => {
                const isExpanded = expandedProj === index;
                return (
                  <div key={index} className="bg-slate-50 border border-border rounded-xl overflow-hidden transition-all">
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => setExpandedProj(isExpanded ? null : index)}
                    >
                      <div className="font-semibold text-sm">
                        {proj.name ? proj.name : `Project ${index + 1}`}
                      </div>
                      <div className="flex items-center gap-4 text-muted">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const newProj = [...studentProfile.githubRepositories];
                            newProj.splice(index, 1);
                            setStudentProfile({...studentProfile, githubRepositories: newProj});
                          }}
                          className="text-rose-500 text-xs font-bold hover:underline"
                        >
                          Remove
                        </button>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 space-y-4 border-t border-border/50 pt-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-medium">Project Name</label>
                              <input type="text" value={proj.name} onChange={e => {
                                const newProj = [...studentProfile.githubRepositories];
                                newProj[index].name = e.target.value;
                                setStudentProfile({...studentProfile, githubRepositories: newProj});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="e.g. AI Resume Builder" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium">Project URL / Link</label>
                              <input type="text" value={proj.url || ''} onChange={e => {
                                const newProj = [...studentProfile.githubRepositories];
                                newProj[index].url = e.target.value;
                                setStudentProfile({...studentProfile, githubRepositories: newProj});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="e.g. https://github.com/..." />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Tech Stack / Language</label>
                            <input type="text" value={proj.language || ''} onChange={e => {
                              const newProj = [...studentProfile.githubRepositories];
                              newProj[index].language = e.target.value;
                              setStudentProfile({...studentProfile, githubRepositories: newProj});
                            }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="e.g. React, Node.js" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Description</label>
                            <textarea rows={2} value={proj.description || ''} onChange={e => {
                                const newProj = [...studentProfile.githubRepositories];
                                newProj[index].description = e.target.value;
                                setStudentProfile({...studentProfile, githubRepositories: newProj});
                              }} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="What does this project do?" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              
              <button 
                onClick={() => {
                  const newProj = [...(studentProfile.githubRepositories || []), { name: '', url: '', description: '', language: '' }];
                  setStudentProfile({...studentProfile, githubRepositories: newProj });
                  setExpandedProj(newProj.length - 1);
                }}
                className="w-full py-3 border-2 border-dashed border-primary/30 text-primary rounded-xl font-medium hover:bg-primary/5 transition-colors"
              >
                + Add Portfolio Project
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted py-10">No profile found.</div>
        )}
      </div>
    </div>
  );
}
