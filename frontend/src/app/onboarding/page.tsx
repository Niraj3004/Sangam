"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, UserCircle, CheckCircle2, ArrowRight, Loader2, GraduationCap, Link as LinkIcon, Briefcase } from "lucide-react";

export default function OnboardingWizard() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Academic Background
  const [education, setEducation] = useState<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear?: number;
    endYear?: number;
  }>({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: new Date().getFullYear() - 4,
    endYear: new Date().getFullYear(),
  });

  // Step 2: Professional Identity
  const [bio, setBio] = useState("");
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [skills, setSkills] = useState("");
  
  const lookingForOptions = [
    "Mentorship", "Hackathon Team", "Internship", "Cofounder", "Open Source", "Networking"
  ];

  // Step 3: Verification & Social
  const [evidence, setEvidence] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.verifyTier === "manual" || user?.verifyTier === "college") {
      router.push("/dashboard"); // already verified or higher tier
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) return null;

  const toggleLookingFor = (option: string) => {
    setLookingFor(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleStep1Submit = () => {
    if (!education.institution.trim()) {
      alert("Please enter your University/College name.");
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = () => {
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      // 1. Submit Profile Data (Education, Bio, Skills, Looking For, Links)
      const parsedSkills = skills.split(",").map(s => s.trim()).filter(Boolean).map(s => ({ name: s }));
      
      const profileData: any = {
        about: bio,
        lookingFor,
        education: [education],
      };
      
      if (parsedSkills.length > 0) profileData.skills = parsedSkills;
      
      if (linkedin || github) {
        profileData.links = {};
        if (linkedin) profileData.links.linkedin = linkedin;
        if (github) profileData.links.github = github;
      }

      await api.patch("/profile/me", profileData);

      // 2. Submit Verification Request (if evidence provided)
      if (evidence.trim()) {
        try {
          await api.post("/auth/verify-request", { 
            evidence, 
            tierRequested: "manual" 
          });
          updateUser({ verifyTier: "manual" });
        } catch (verifyError) {
          console.warn("Verification submit skipped or failed (might already be verified).");
        }
      }

      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome to Sangam!</h1>
        <p className="text-muted mt-2">Let's set up your professional profile in 3 quick steps.</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10 rounded-full" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500" 
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          />
          
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm transition-colors ${step >= 1 ? 'bg-primary text-white' : 'bg-white border-2 border-border text-muted'}`}>
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm transition-colors ${step >= 2 ? 'bg-primary text-white' : 'bg-white border-2 border-border text-muted'}`}>
            <UserCircle className="w-5 h-5" />
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm transition-colors ${step >= 3 ? 'bg-primary text-white' : 'bg-white border-2 border-border text-muted'}`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="flex justify-between mt-3 text-xs sm:text-sm font-medium text-muted">
          <span>Academics</span>
          <span className="text-center">Identity</span>
          <span className="text-right">Verification</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl bg-white border border-border rounded-2xl shadow-xl shadow-slate-200/40 overflow-hidden">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-12"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" /> Academic Background
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">University / College *</label>
                  <input
                    type="text"
                    required
                    value={education.institution}
                    onChange={(e) => setEducation({...education, institution: e.target.value})}
                    placeholder="e.g. Kathmandu University"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Degree</label>
                    <input
                      type="text"
                      value={education.degree}
                      onChange={(e) => setEducation({...education, degree: e.target.value})}
                      placeholder="e.g. Bachelor of Engineering"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Field of Study</label>
                    <input
                      type="text"
                      value={education.fieldOfStudy}
                      onChange={(e) => setEducation({...education, fieldOfStudy: e.target.value})}
                      placeholder="e.g. Computer Science"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Start Year</label>
                    <input
                      type="number"
                      value={education.startYear || ''}
                      onChange={(e) => setEducation({...education, startYear: e.target.value ? parseInt(e.target.value) : undefined})}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Expected Graduation</label>
                    <input
                      type="number"
                      value={education.endYear || ''}
                      onChange={(e) => setEducation({...education, endYear: e.target.value ? parseInt(e.target.value) : undefined})}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleStep1Submit}
                    className="w-full bg-primary text-white py-3.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-12"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <UserCircle className="w-6 h-6 text-indigo-500" /> Professional Identity
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Primary Skills (comma separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. React, Python, UI/UX Design, Figma"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Short Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="I am a CS student passionate about building scalable web apps..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-3">What are you looking for?</label>
                  <div className="flex flex-wrap gap-2">
                    {lookingForOptions.map(option => {
                      const isSelected = lookingFor.includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() => toggleLookingFor(option)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            isSelected 
                              ? 'bg-primary text-white shadow-sm border border-primary' 
                              : 'bg-white border border-border text-muted hover:border-primary/50'
                          }`}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3.5 rounded-xl font-medium border border-border text-foreground hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleStep2Submit}
                    className="flex-1 bg-primary text-white py-3.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-12"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-500" /> Verification & Social
              </h2>

              <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" /> LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" /> GitHub URL
                    </label>
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <hr className="border-border" />

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Student ID Verification (Optional)</label>
                  <p className="text-sm text-muted mb-3">
                    If you did not use a `.edu.np` email, you must provide a link to your student ID (Google Drive link) or your LinkedIn profile to get verified on Sangam.
                  </p>
                  <input
                    type="url"
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                    placeholder="https://drive.google.com/... or LinkedIn URL"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setStep(2)}
                    disabled={isLoading}
                    className="px-6 py-3.5 rounded-xl font-medium border border-border text-foreground hover:bg-slate-50 transition-colors disabled:opacity-70"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isLoading}
                    className="flex-1 bg-primary text-white py-3.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Setup"}
                    {!isLoading && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
