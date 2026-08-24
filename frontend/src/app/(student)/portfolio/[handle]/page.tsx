"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, ExternalLink, Code, Briefcase, Mail, MapPin, Globe, Edit, Save, CheckCircle2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

export default function PortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit Config State
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState({
    theme: "light",
    showGithub: true,
    showExperience: true,
    showEducation: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, [params.handle]);

  const fetchPortfolio = async () => {
    try {
      const { data } = await api.get(`/portfolio/${params.handle}`);
      setPortfolio(data.data);
      if (data.data.config) {
        setConfig(data.data.config);
      }
    } catch (err: any) {
      console.error(err);
      router.push('/discover'); // Fallback if portfolio not found
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async () => {
    setIsSaving(true);
    try {
      await api.patch('/portfolio/config', config);
      setPortfolio({ ...portfolio, config });
      setIsEditing(false);
      alert("Portfolio updated!");
    } catch (err: any) {
      console.error(err);
      alert("Failed to update portfolio layout");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  if (!portfolio) return null;

  const isOwner = user?.handle === params.handle;
  const pUser = portfolio.user;

  // Render Theme based on config (simple tailwind class application for demo)
  const themeClass = config.theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900';
  const cardClass = config.theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const textMuted = config.theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`min-h-screen ${themeClass} transition-colors duration-300`}>
      
      {/* Portfolio Header */}
      <div className={`${config.theme === 'dark' ? 'bg-slate-800' : 'bg-white'} border-b ${config.theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} sticky top-0 z-10 shadow-sm`}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-lg flex items-center gap-2">
            {pUser.handle}'s Portfolio
          </div>
          
          {isOwner && (
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className={`px-4 py-2 rounded-lg text-sm font-medium ${config.theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>Cancel</button>
                  <button onClick={saveConfig} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary-hover transition-colors">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-indigo-100 transition-colors">
                  <Edit className="w-4 h-4" /> Edit Layout
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className={`rounded-3xl border ${cardClass} p-8 text-center shadow-sm relative overflow-hidden`}>
            
            <div className="w-32 h-32 mx-auto rounded-full bg-slate-200 border-4 border-white shadow-md overflow-hidden mb-6 flex items-center justify-center text-4xl font-bold text-primary">
              {pUser.profilePic ? (
                <img src={pUser.profilePic} alt={pUser.handle} className="w-full h-full object-cover" />
              ) : (
                pUser.handle.charAt(0).toUpperCase()
              )}
            </div>
            
            <h1 className="text-2xl font-bold flex items-center justify-center gap-2 mb-1">
              {pUser.name || pUser.handle}
              <VerifiedBadge tier={pUser.verifyTier} />
            </h1>
            <p className={`text-sm font-medium ${textMuted} mb-4 capitalize`}>{pUser.role}</p>

            <div className="flex flex-col gap-3 mt-6">
              {pUser.email && (
                <a href={`mailto:${pUser.email}`} className={`flex items-center justify-center gap-2 p-2 rounded-xl text-sm font-medium ${config.theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'} transition-colors`}>
                  <Mail className="w-4 h-4" /> Contact Me
                </a>
              )}
              {pUser.githubId && config.showGithub && (
                <a href={`https://github.com`} target="_blank" rel="noreferrer" className={`flex items-center justify-center gap-2 p-2 rounded-xl text-sm font-medium ${config.theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'} transition-colors`}>
                  <Code className="w-4 h-4" /> GitHub
                </a>
              )}
            </div>
          </div>

          <div className={`rounded-3xl border ${cardClass} p-6 shadow-sm`}>
            <h3 className="font-bold mb-4 flex items-center gap-2"><MapPin className="w-4 h-4" /> Details</h3>
            <ul className="space-y-3">
              <li className="flex justify-between text-sm">
                <span className={textMuted}>Location</span>
                <span className="font-medium">Planet Earth</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className={textMuted}>Joined</span>
                <span className="font-medium">{new Date(pUser.createdAt).getFullYear()}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Main Content */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Bio section */}
          <section className={`rounded-3xl border ${cardClass} p-8 shadow-sm`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-indigo-500" /> About Me</h2>
            <p className={`${textMuted} leading-relaxed whitespace-pre-wrap`}>
              {pUser.bio || "This user hasn't written a bio yet, but they are probably awesome."}
            </p>
          </section>

          {/* Education */}
          {config.showEducation && pUser.education && pUser.education.length > 0 && (
            <section className={`rounded-3xl border ${cardClass} p-8 shadow-sm`}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Education</h2>
              <div className="space-y-6">
                {pUser.education.map((edu: any, idx: number) => (
                  <div key={idx} className={`pl-4 border-l-2 ${config.theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                    <h3 className="font-bold">{edu.institution}</h3>
                    <p className={`text-sm ${textMuted} mt-1`}>{edu.degree} in {edu.fieldOfStudy}</p>
                    <p className={`text-xs ${textMuted} mt-1`}>{edu.startYear} - {edu.endYear || 'Present'}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {config.showExperience && pUser.experience && pUser.experience.length > 0 && (
            <section className={`rounded-3xl border ${cardClass} p-8 shadow-sm`}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-500" /> Experience</h2>
              <div className="space-y-6">
                {pUser.experience.map((exp: any, idx: number) => (
                  <div key={idx} className={`pl-4 border-l-2 ${config.theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                    <h3 className="font-bold">{exp.title}</h3>
                    <p className={`text-sm ${textMuted} mt-1`}>{exp.company}</p>
                    <p className={`text-xs ${textMuted} mt-1`}>{exp.startYear} - {exp.endYear || 'Present'}</p>
                    {exp.description && <p className={`text-sm ${textMuted} mt-2 leading-relaxed`}>{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects / Assets */}
          <section className={`rounded-3xl border ${cardClass} p-8 shadow-sm`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Code className="w-5 h-5 text-rose-500" /> Top Projects</h2>
            {portfolio.projects && portfolio.projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolio.projects.map((proj: any) => (
                  <div key={proj._id} className={`p-4 rounded-xl border ${config.theme === 'dark' ? 'border-slate-700 hover:border-primary' : 'border-slate-200 hover:border-primary'} transition-colors`}>
                    <h3 className="font-bold flex justify-between items-center">
                      {proj.title}
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </h3>
                    <p className={`text-xs ${textMuted} mt-2 line-clamp-2`}>{proj.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-sm ${textMuted}`}>No projects displayed.</p>
            )}
          </section>

        </div>
      </div>

      {/* Editing overlay panel */}
      {isEditing && (
        <div className={`fixed bottom-0 left-0 right-0 ${config.theme === 'dark' ? 'bg-slate-800 border-t border-slate-700' : 'bg-white border-t border-slate-200'} p-6 shadow-2xl z-20`}>
          <div className="max-w-5xl mx-auto">
            <h3 className="font-bold mb-4 text-lg">Portfolio Configuration</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              
              <div>
                <label className={`text-sm font-medium block mb-2 ${textMuted}`}>Theme</label>
                <select 
                  value={config.theme} 
                  onChange={(e) => setConfig({...config, theme: e.target.value})}
                  className={`w-full p-2 rounded-lg border ${config.theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                >
                  <option value="light">Light Minimal</option>
                  <option value="dark">Dark Developer</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" checked={config.showGithub} onChange={(e) => setConfig({...config, showGithub: e.target.checked})} className="w-5 h-5 rounded text-primary border-slate-300" />
                <label className={`text-sm font-medium ${textMuted}`}>Show GitHub</label>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" checked={config.showExperience} onChange={(e) => setConfig({...config, showExperience: e.target.checked})} className="w-5 h-5 rounded text-primary border-slate-300" />
                <label className={`text-sm font-medium ${textMuted}`}>Show Experience</label>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" checked={config.showEducation} onChange={(e) => setConfig({...config, showEducation: e.target.checked})} className="w-5 h-5 rounded text-primary border-slate-300" />
                <label className={`text-sm font-medium ${textMuted}`}>Show Education</label>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
