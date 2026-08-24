import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Calendar, MapPin, Building, Globe, ExternalLink, ShieldCheck, Bookmark, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const opp = await getOpportunity(params.id);
  if (!opp) return { title: 'Opportunity Not Found' };
  
  return {
    title: `${opp.title} | Sangam`,
    description: opp.description.substring(0, 160),
  };
}

async function getOpportunity(id: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${API_URL}/opportunities/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    return null;
  }
}

export default async function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const opp = await getOpportunity(params.id);

  if (!opp) {
    notFound();
  }

  const isExpired = opp.deadline ? new Date(opp.deadline) < new Date() : false;

  return (
    <div className="min-h-screen bg-secondary pb-20">
      
      {/* Header Area */}
      <div className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/feed" className="flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Feed
          </Link>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-slate-50 transition-colors text-sm font-medium">
              <Bookmark className="w-4 h-4" /> Save
            </button>
            {opp.url && (
              <a 
                href={opp.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors text-sm font-medium shadow-sm"
              >
                Apply Now <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          
          <div className="p-8 md:p-12 border-b border-border relative">
            {isExpired && (
              <div className="absolute top-0 left-0 w-full bg-red-50 text-red-600 text-sm font-medium text-center py-2 border-b border-red-100">
                This opportunity has passed its deadline and may no longer be active.
              </div>
            )}
            
            <div className={`flex items-center gap-2 mb-4 ${isExpired ? 'mt-8' : ''}`}>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md uppercase tracking-wider">
                {opp.type}
              </span>
              {opp.isRemote && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md uppercase tracking-wider">
                  Remote
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {opp.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted font-medium">
              <div className="flex items-center gap-2 text-foreground">
                <Building className="w-5 h-5 text-muted" />
                {opp.organizationName || opp.source}
                {opp.organization && <VerifiedBadge tier="verified_manual" />}
              </div>
              
              {opp.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {opp.location}
                </div>
              )}
              
              {opp.deadline && (
                <div className={`flex items-center gap-2 ${isExpired ? 'text-red-500' : 'text-amber-600'}`}>
                  <Calendar className="w-5 h-5" />
                  Deadline: {new Date(opp.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            
            {/* Main Content */}
            <div className="md:col-span-2 p-8 md:p-12">
              <h3 className="text-xl font-bold text-foreground mb-6">Description</h3>
              <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-foreground/80">
                {/* Normally we'd render Markdown here if the description supports it */}
                <p className="whitespace-pre-wrap">{opp.description}</p>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="md:col-span-1 p-8 md:p-12 bg-slate-50/50 space-y-8">
              
              {opp.field && (
                <div>
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Field</h4>
                  <div className="px-3 py-1.5 bg-white border border-border rounded-lg inline-block text-sm font-medium text-foreground">
                    {opp.field}
                  </div>
                </div>
              )}

              {opp.tags && opp.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {opp.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-white border border-border rounded-md text-xs font-medium text-muted">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust & Safety Box */}
              <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
                  <ShieldCheck className="w-5 h-5" />
                  Trusted Source
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  This opportunity was extracted by the Sangam AI engine and verified for relevance to Nepali students. Always verify details on the official website before sharing personal information.
                </p>
                <button className="text-xs text-muted hover:text-red-500 font-medium mt-3 transition-colors">
                  Report this listing
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
