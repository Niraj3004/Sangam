"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, UserCircle, CheckCircle2, ArrowRight, Loader2, Upload } from "lucide-react";

export default function OnboardingWizard() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Verification Form
  const [evidence, setEvidence] = useState("");
  
  // Step 2: Profile Form
  const [bio, setBio] = useState("");
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  
  const lookingForOptions = [
    "Mentorship", "Hackathon Team", "Internship", "Cofounder", "Open Source"
  ];

  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.verifyTier === "manual" || user?.verifyTier === "college") {
      router.push("/dashboard"); // already verified or higher tier
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) return null;

  const handleVerificationSubmit = async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/verify-request", { 
        evidence, 
        tierRequested: "manual" 
      });
      // Locally update state to simulate progression
      updateUser({ verifyTier: "manual" });
      setStep(2);
    } catch (error) {
      console.error(error);
      alert("Failed to submit verification request. Or your email was automatically verified.");
      // If email was already verified backend-side, we should advance anyway
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async () => {
    setIsLoading(true);
    try {
      await api.patch("/profile/me", { 
        bio,
        lookingFor 
      });
      router.push("/dashboard"); // Done!
    } catch (error) {
      console.error(error);
      alert("Failed to save profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLookingFor = (option: string) => {
    setLookingFor(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-20 px-6">
      
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10 rounded-full" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500" 
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
          
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm transition-colors ${step >= 1 ? 'bg-primary text-white' : 'bg-white border-2 border-border text-muted'}`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm transition-colors ${step >= 2 ? 'bg-primary text-white' : 'bg-white border-2 border-border text-muted'}`}>
            <UserCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm font-medium text-muted">
          <span>Verification</span>
          <span>Basic Profile</span>
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
              <h1 className="text-3xl font-bold text-foreground mb-3">Verify your student status</h1>
              <p className="text-muted mb-8">
                To keep Sangam a trusted network, we verify all students. If you used a `.edu.np` email, you are automatically verified. Otherwise, provide a link to your student ID or LinkedIn.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Verification Evidence (URL)</label>
                  <input
                    type="url"
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile or Google Drive link to ID"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <p className="text-xs text-muted mt-2">Our team will manually review this within 24 hours.</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleVerificationSubmit}
                    disabled={isLoading || !evidence.trim()}
                    className="flex-1 bg-primary text-white py-3.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit & Continue"}
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3.5 rounded-xl font-medium border border-border text-foreground hover:bg-slate-50 transition-colors"
                  >
                    Skip for now
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
              <h1 className="text-3xl font-bold text-foreground mb-3">Complete your profile</h1>
              <p className="text-muted mb-8">
                Tell the community a bit about yourself and what you are looking for. This helps our AI match you correctly.
              </p>

              <div className="space-y-8">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Short Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="I am a CS student passionate about building scalable web apps..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
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

                <div className="pt-4">
                  <button
                    onClick={handleProfileSubmit}
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-3.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
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
