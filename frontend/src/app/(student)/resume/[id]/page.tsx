"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { Loader2, Download, ChevronLeft, Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ResumeViewerPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const [resume, setResume] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [resumeRes, profileRes] = await Promise.all([
        api.get(`/resume/${params.id}`),
        api.get('/profile/me')
      ]);
      setResume(resumeRes.data.data);
      setProfile(profileRes.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load resume.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!resume || !profile) return null;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-8 font-sans print:bg-white print:py-0 print:px-0">
      
      {/* Non-Printable Header */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link href="/resume" className="text-sm font-bold text-gray-600 hover:text-gray-900 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        <button 
          onClick={handlePrint}
          className="bg-primary text-white px-5 py-2 rounded-xl font-bold hover:bg-primary-hover shadow-md shadow-primary/20 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      {/* A4 Resume Paper */}
      <div id="resume-print-container" className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none min-h-[297mm] p-[20mm] text-gray-900 border border-gray-200 print:border-none">
        
        {/* Header Name & Contacts */}
        <div className="text-center mb-4">
          <h1 className="text-[28px] font-sans text-[#4472C4] mb-1 uppercase tracking-wide">{profile.name || user?.name || user?.handle}</h1>
          <div className="text-[13px] text-black leading-snug">
            {profile.location && <span>{profile.location}</span>}
            <br />
            {profile.phone && <span>{profile.phone} | </span>}
            {user?.email && <span>{user.email}</span>}
            {profile.links?.github && <span> | GitHub: {profile.links.github.replace('https://github.com/', '')}</span>}
            {profile.links?.linkedin && <span> | LinkedIn: {profile.links.linkedin.replace('https://www.linkedin.com/in/', '').replace(/\/$/, '')}</span>}
          </div>
        </div>
          


        {/* Summary */}
        {resume.summary && (
          <div className="mb-4">
            <h2 className="text-[15px] font-sans text-[#4472C4] border-b border-black pb-0.5 mb-1.5">Career Objective</h2>
            <p className="text-[13px] text-black leading-snug text-justify">
              {resume.summary}
            </p>
          </div>
        )}

        {/* AI Generated Sections */}
        {resume.sections?.sort((a: any, b: any) => a.order - b.order).map((section: any, i: number) => (
          <div key={i} className="mb-4 resume-section">
            <h2 className="text-[15px] font-sans text-[#4472C4] border-b border-black pb-0.5 mb-1.5">
              {section.title}
            </h2>
            <div 
              className="text-[13px] text-black leading-snug markdown-resume space-y-1"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(section.content) }}
            />
          </div>
        ))}
        
      </div>
      
      {/* Print Styles for Markdown Output */}
      <style dangerouslySetInnerHTML={{__html: `
        .markdown-resume ul { list-style-type: none; padding-left: 0; margin-top: 0.15rem; margin-bottom: 0.15rem; }
        .markdown-resume li { margin-bottom: 0.15rem; position: relative; padding-left: 1rem; text-align: justify; }
        .markdown-resume li::before { content: "•"; position: absolute; left: 0; }
        .markdown-resume p { margin-bottom: 0.25rem; text-align: justify; }
        .markdown-resume strong { color: #000; font-weight: bold; }
        
        /* Flex trick to push dates to right if AI formats it like "**Title** | Date" */
        .resume-flex-row { display: flex; justify-content: space-between; align-items: baseline; width: 100%; margin-bottom: 0.1rem; }
        .resume-flex-row strong { flex-shrink: 1; }
        .resume-flex-row span.font-bold { flex-shrink: 0; font-weight: bold; margin-left: 1rem; }
        
        @media print {
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact; background: white; font-family: Arial, sans-serif; margin: 0; padding: 0; }
          
          /* Hide everything outside the resume container */
          body * { visibility: hidden; }
          
          /* Make only the resume container and its children visible */
          #resume-print-container, #resume-print-container * {
            visibility: visible;
          }
          
          /* Position it absolutely at the top left so the sidebar space is ignored */
          #resume-print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            min-height: 297mm;
            margin: 0 !important;
            padding: 20mm !important;
          }

          /* Prevent awkward page breaks */
          .resume-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          h2, h3 {
            page-break-after: avoid;
            break-after: avoid;
          }
          .markdown-resume li {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .markdown-resume { color: black; }
        }
      `}} />
    </div>
  );
}

// Very basic markdown to HTML for resume bullet points
function formatMarkdown(text: string) {
  if (!text) return "";
  
  // Try to find patterns like "**Degree** | 2024-Present" or "**Degree** - 2024-Present" and turn them into flex rows
  // Matches bold text, optional separator, and a date-like string (like 2024-Present, Jan 2025, etc.) at the end of the line
  let html = text.replace(/^\s*\*\*(.*?)\*\*\s*(?:[-|\|])?\s*([\w\s\d\-\–]+(?:\d{4}|Present))$/gm, '<div class="resume-flex-row"><strong>$1</strong><span class="font-bold">$2</span></div>');
  
  // Convert bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert bullet points (lines starting with - or *)
  html = html.replace(/^(?:-|\*)\s+(.+)$/gm, '<li>$1</li>');
  
  // Wrap contiguous <li> in <ul>
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Fix double breaks
  html = html.replace(/\n\n/g, '<br/>');
  
  // Clean up any stray single newlines where not wrapped in tags
  html = html.replace(/([^\>])\n([^\<])/g, '$1<br/>$2');

  return html;
}
