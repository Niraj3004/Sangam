"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { Loader2, Camera, Save, Plus, Trash2 } from "lucide-react";
import { CompletenessMeter } from "@/components/ui/CompletenessMeter";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [score, setScore] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      bio: "",
      location: "",
      availability: "full-time",
      skills: [{ name: "", level: "intermediate" }],
      education: [{ institution: "", degree: "", fieldOfStudy: "", year: "" }],
      lookingFor: [] as string[],
      githubUsername: "",
      linkedinUrl: ""
    }
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: "skills"
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: "education"
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data } = await api.get('/profile/me');
        if (data.success && data.data) {
          const profile = data.data;
          setScore(profile.completenessScore || 0);
          reset({
            bio: profile.bio || "",
            location: profile.location || "",
            availability: profile.availability || "full-time",
            skills: profile.skills?.length ? profile.skills : [{ name: "", level: "intermediate" }],
            education: profile.education?.length ? profile.education : [{ institution: "", degree: "", fieldOfStudy: "", year: "" }],
            lookingFor: profile.lookingFor || [],
            githubUsername: profile.links?.github || "",
            linkedinUrl: profile.links?.linkedin || ""
          });
        }
      } catch (err: any) {
        // If 404, it just means no profile yet, which is fine, we use default empty values
        if (err.response?.status !== 404) {
          console.error("Failed to load profile", err);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [reset]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      // Cloudinary standard procedure as per API_REFERENCE.md
      const { data } = await api.post('/profile/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        updateUser({ profilePic: data.data.avatarUrl });
        alert("Avatar updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload avatar");
    }
  };

  const onSubmit = async (formData: any) => {
    setIsSaving(true);
    try {
      // Transform form data to match backend expectations
      const payload = {
        ...formData,
        skills: formData.skills.filter((s: any) => s.name.trim() !== ""),
        education: formData.education.filter((e: any) => e.institution.trim() !== ""),
        links: {
          github: formData.githubUsername,
          linkedin: formData.linkedinUrl
        }
      };

      const { data } = await api.patch('/profile/me', payload);
      if (data.success) {
        setScore(data.data.completenessScore);
        alert("Profile saved successfully!");
        router.push(`/u/${user?.handle}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
          <p className="text-muted mt-1">Manage your public presence</p>
        </div>
        <div className="flex items-center gap-3">
          <VerifiedBadge tier={user?.verifyTier || 'unverified'} showText />
        </div>
      </div>

      <div className="mb-10 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <CompletenessMeter score={score} />
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Avatar Section */}
        <div className="p-8 border-b border-border flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-3xl font-bold text-primary">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.handle?.charAt(0).toUpperCase()
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-hover shadow-md transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Profile Picture</h3>
            <p className="text-sm text-muted">Upload a professional photo. Max size 5MB.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-10">
          
          {/* Basic Info */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-sm font-medium text-foreground block mb-2">Short Bio</label>
                <textarea
                  {...register("bio")}
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Location</label>
                <input
                  {...register("location")}
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="e.g. Kathmandu, Nepal"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Availability</label>
                <select
                  {...register("availability")}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="open">Open to Opportunities</option>
                  <option value="looking">Actively Looking</option>
                  <option value="employed">Employed</option>
                </select>
              </div>
            </div>
          </section>

          {/* Links */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">External Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">GitHub Username</label>
                <input
                  {...register("githubUsername")}
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">LinkedIn URL</label>
                <input
                  {...register("linkedinUrl")}
                  type="url"
                  className="w-full px-4 py-2 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Skills */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Skills</h3>
              <button 
                type="button" 
                onClick={() => appendSkill({ name: "", level: "intermediate" })}
                className="text-sm text-primary flex items-center gap-1 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Skill
              </button>
            </div>
            <div className="space-y-3">
              {skillFields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-start">
                  <input
                    {...register(`skills.${index}.name`)}
                    placeholder="e.g. React.js"
                    className="flex-1 px-4 py-2 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <select
                    {...register(`skills.${index}.level`)}
                    className="w-40 px-4 py-2 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <button 
                    type="button" 
                    onClick={() => removeSkill(index)}
                    className="p-2.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Education</h3>
              <button 
                type="button" 
                onClick={() => appendEdu({ institution: "", degree: "", fieldOfStudy: "", year: "" })}
                className="text-sm text-primary flex items-center gap-1 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Education
              </button>
            </div>
            <div className="space-y-4">
              {eduFields.map((field, index) => (
                <div key={field.id} className="p-4 border border-border rounded-xl bg-slate-50/50 relative group">
                  <button 
                    type="button" 
                    onClick={() => removeEdu(index)}
                    className="absolute top-4 right-4 p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-muted block mb-1">Institution</label>
                      <input
                        {...register(`education.${index}.institution`)}
                        placeholder="e.g. Kathmandu University"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted block mb-1">Degree</label>
                      <input
                        {...register(`education.${index}.degree`)}
                        placeholder="e.g. BSc"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted block mb-1">Field of Study</label>
                      <input
                        {...register(`education.${index}.fieldOfStudy`)}
                        placeholder="e.g. Computer Science"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-6 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-primary text-white px-8 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Profile
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
