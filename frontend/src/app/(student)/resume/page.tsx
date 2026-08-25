"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, FileText, Sparkles, Download, FileUp, Clock, Trash2, Edit2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeBuilderPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [tone, setTone] = useState("Professional");
  const [focusEducation, setFocusEducation] = useState("");
  const [focusExperience, setFocusExperience] = useState("");
  const [focusProjects, setFocusProjects] = useState("");
  const [focusAchievements, setFocusAchievements] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/resume');
      setResumes((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
    } catch (err: any) {
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
      let mergedContext = additionalContext;
      if (targetCompany) mergedContext += `\n- Target Company: ${targetCompany}`;
      if (tone) mergedContext += `\n- Writing Tone: ${tone}`;
      if (focusEducation) mergedContext += `\n- Education Focus: ${focusEducation}`;
      if (focusExperience) mergedContext += `\n- Experience Focus: ${focusExperience}`;
      if (focusProjects) mergedContext += `\n- Projects Focus: ${focusProjects}`;
      if (focusAchievements) mergedContext += `\n- Achievements Focus: ${focusAchievements}`;

      const { data } = await api.post('/resume/generate', { 
        targetRole, 
        additionalContext: mergedContext.trim() 
      });
      setResumes([data.data, ...resumes]);
      setTargetRole("");
      setTargetCompany("");
      setFocusEducation("");
      setFocusExperience("");
      setFocusProjects("");
      setFocusAchievements("");
      setAdditionalContext("");
      alert("Resume generated successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error?.message || err.message || "Failed to generate resume.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = (resumeId: string) => {
    // Navigate to the Viewer page which supports PDF downloading via window.print()
    window.location.href = `/resume/${resumeId}`;
  };

  const handleDelete = async (resumeId: string) => {
    if (!window.confirm("Are you sure you want to delete this resume? This cannot be undone.")) return;
    
    setIsDeleting(resumeId);
    try {
      await api.delete(`/resume/${resumeId}`);
      setResumes(resumes.filter((r) => r._id !== resumeId));
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error?.message || "Failed to delete resume.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleRename = async (resumeId: string) => {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    
    try {
      await api.patch(`/resume/${resumeId}`, { title: editTitle });
      setResumes(resumes.map(r => r._id === resumeId ? { ...r, title: editTitle } : r));
      setEditingId(null);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error?.message || "Failed to rename resume.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 sm:px-6">
      
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mb-14 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-6 border border-indigo-100 shadow-sm"
        >
          <Sparkles className="w-4 h-4" /> AI-Powered Resume Generation
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4"
        >
          Sangam <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Resume Maker</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-lg max-w-2xl leading-relaxed"
        >
          Instantly generate ATS-optimized, beautifully formatted resumes perfectly tailored to your target role using your profile and GitHub projects.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Generator Form (Left, Big) */}
        <div className="lg:col-span-7 order-1">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-2xl shadow-slate-200/50 lg:sticky lg:top-24">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <FileUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Create New Resume</h2>
                <p className="text-sm text-slate-500">Fill in the targets and let AI do the heavy lifting.</p>
              </div>
            </div>
            
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Target Role <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Target Company</label>
                  <input 
                    type="text" 
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="e.g. Google, Stripe"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Writing Tone</label>
                  <select 
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm font-medium text-slate-900 appearance-none"
                  >
                    <option value="Professional">Professional & Corporate</option>
                    <option value="Creative">Creative & Modern</option>
                    <option value="Technical">Highly Technical</option>
                    <option value="Academic">Academic / Research</option>
                    <option value="Startup">Startup / Entrepreneurial</option>
                  </select>
                </div>
              </div>

              <div className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Target Specifics</h3>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">Optional</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1.5">Which Experience to Highlight?</label>
                    <input 
                      type="text" 
                      value={focusExperience}
                      onChange={(e) => setFocusExperience(e.target.value)}
                      placeholder="e.g. Highlight my leadership role"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1.5">Which Projects to Highlight?</label>
                    <input 
                      type="text" 
                      value={focusProjects}
                      onChange={(e) => setFocusProjects(e.target.value)}
                      placeholder="e.g. Focus only on React projects"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1.5">Which Education to Highlight?</label>
                    <input 
                      type="text" 
                      value={focusEducation}
                      onChange={(e) => setFocusEducation(e.target.value)}
                      placeholder="e.g. Master's Degree"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1.5">Which Achievements to Highlight?</label>
                    <input 
                      type="text" 
                      value={focusAchievements}
                      onChange={(e) => setFocusAchievements(e.target.value)}
                      placeholder="e.g. 1st Place Hackathon"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-muted block mb-1.5">General Instructions</label>
                    <textarea 
                      value={additionalContext}
                      onChange={(e) => setAdditionalContext(e.target.value)}
                      placeholder="Any other instructions for the AI (e.g. Make bullet points extremely concise)"
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isGenerating || !targetRole.trim()}
                  className={`w-full text-white px-6 py-4 rounded-xl font-bold shadow-xl transition-all flex items-center justify-center gap-3 ${
                    isGenerating 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 hover:-translate-y-1 shadow-indigo-500/25 disabled:opacity-50 disabled:hover:translate-y-0'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Crafting your perfect resume...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Generate Professional Resume
                    </>
                  )}
                </button>
                <p className="text-xs text-slate-500 text-center mt-4 font-medium">
                  The AI analyzes your profile, targets the role, and structures a perfect ATS-friendly PDF.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* History / List (Right, Small) */}
        <div className="lg:col-span-5 order-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" /> Document History
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{resumes.length} Resumes</span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-12 bg-white/50 border border-slate-200 rounded-3xl border-dashed">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700">No documents yet</h3>
              <p className="text-slate-500 mt-1 text-sm px-4">Your generated resumes will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {resumes.map((resume, idx) => (
                  <motion.div
                    key={resume._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 relative overflow-hidden group border-l-4 border-l-primary"
                  >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingId === resume._id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleRename(resume._id); if (e.key === 'Escape') setEditingId(null); }}
                            className="px-2 py-1 border border-primary/40 rounded focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm font-bold text-slate-900 w-full"
                            autoFocus
                          />
                          <button onClick={() => handleRename(resume._id)} className="text-emerald-500 hover:text-emerald-600"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-[15px] truncate">
                            {resume.title || resume.targetRole || "General Resume"}
                          </h3>
                          <button 
                            onClick={() => { setEditingId(resume._id); setEditTitle(resume.title || resume.targetRole || "General Resume"); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-primary"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Generated • {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <button 
                      onClick={() => handleExport(resume._id)}
                      className="flex-1 bg-slate-50 text-slate-700 border border-slate-200 py-2 rounded-xl text-sm font-bold hover:bg-primary hover:text-white hover:border-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" /> View PDF
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      disabled={isDeleting === resume._id}
                      className="bg-white border border-slate-200 text-rose-500 p-2 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-colors disabled:opacity-50"
                      title="Delete Resume"
                    >
                      {isDeleting === resume._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
