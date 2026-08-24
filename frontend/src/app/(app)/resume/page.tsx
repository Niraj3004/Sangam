"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, FileText, Sparkles, Download, FileUp, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ResumeBuilderPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetRole, setTargetRole] = useState("");

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/resume');
      setResumes((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole.trim()) return;
    
    setIsGenerating(true);
    try {
      const { data } = await api.post('/resume/generate', { targetRole });
      setResumes([data.data, ...resumes]);
      setTargetRole("");
      alert("Resume generated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to generate resume.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (resumeId: string) => {
    try {
      // Assuming backend sends back a PDF buffer or a Cloudinary URL
      const { data } = await api.post(`/resume/${resumeId}/export`);
      
      if (data.data?.url) {
        window.open(data.data.url, '_blank');
      } else {
        alert("Exported successfully, but no URL returned.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to export resume.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm border border-primary/20">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">AI Resume Builder</h1>
        <p className="text-muted mt-2 max-w-lg">
          Generate ATS-friendly resumes tailored perfectly to your target role based on your Sangam profile and GitHub projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Generator Form */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" /> New Resume
            </h2>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Target Role</label>
                <input 
                  type="text" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={isGenerating || !targetRole.trim()}
                className="w-full bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileUp className="w-5 h-5" />}
                Generate with AI
              </button>

              <p className="text-xs text-muted text-center mt-4">
                The AI will extract your best experiences and tailor the bullet points automatically.
              </p>
            </form>
          </div>
        </div>

        {/* History / List */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted" /> Generated History
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No resumes generated yet</h3>
              <p className="text-muted mt-1 text-sm">Enter a target role on the left to create your first tailored resume.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume, idx) => (
                <motion.div
                  key={resume._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-border flex items-center justify-center text-primary flex-shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{resume.targetRole || "General Resume"}</h3>
                      <p className="text-sm text-muted">
                        Generated on {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleExport(resume._id)}
                    className="flex-shrink-0 bg-slate-100 text-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Export PDF
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
