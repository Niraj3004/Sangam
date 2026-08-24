import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Link2, MapPin, Briefcase, GraduationCap, Code, Globe, Share2, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const profile = await getProfile(handle);
  if (!profile || profile.error) return { title: 'Profile Error' };
  
  return {
    title: `${profile.handle} | Sangam`,
    description: profile.about || `View ${profile.handle}'s profile on Sangam.`,
  };
}

async function getProfile(handle: string) {
  try {
    // Use 127.0.0.1 instead of localhost for Node 18+ fetch compatibility in Server Components
    let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
    if (API_URL.includes('localhost')) {
      API_URL = API_URL.replace('localhost', '127.0.0.1');
    }
    console.log(`[getProfile] Fetching ${API_URL}/profile/${handle}`);
    const res = await fetch(`${API_URL}/profile/${handle}`, { cache: 'no-store' }); // Disable cache for debugging
    console.log(`[getProfile] Response status: ${res.status}`);
    if (!res.ok) {
      console.log(`[getProfile] Not ok, returning null`);
      return { error: `HTTP ${res.status} from API` };
    }
    const json = await res.json();
    console.log(`[getProfile] Parsed JSON:`, !!json.data);
    return json.data || { error: 'No data in JSON' };
  } catch (error: any) {
    console.error(`[getProfile] Error:`, error.message);
    return { error: `Fetch failed: ${error.message}` };
  }
}

export default async function PublicProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const profile = await getProfile(handle);

  if (profile?.error) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="p-8 bg-white rounded-xl shadow-xl text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Profile</h1>
          <p className="text-muted">{profile.error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    notFound();
  }

  const verifyTier = profile.userId?.verifyTier || 'email';
  const role = profile.userId?.role || 'student';

  return (
    <div className="min-h-screen bg-secondary">
      {/* Cover Header Area */}
      <div className="h-64 bg-gradient-to-r from-primary to-indigo-700 w-full relative">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-border">
          
          {/* Top Section */}
          <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
            
            {/* Avatar */}
            <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center text-5xl font-bold text-primary">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.handle} className="w-full h-full object-cover" />
              ) : (
                profile.handle.charAt(0).toUpperCase()
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    {profile.handle}
                    <VerifiedBadge tier={verifyTier} />
                  </h1>
                  <p className="text-muted mt-1 text-lg capitalize">{role}</p>
                </div>
                
                <button 
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-secondary text-foreground hover:bg-slate-200 transition-colors rounded-xl font-medium border border-border"
                  // Client component interaction would normally handle copy-to-clipboard here
                >
                  <Share2 className="w-4 h-4" /> Share Profile
                </button>
              </div>

              {profile.about && (
                <p className="text-foreground/80 leading-relaxed mb-6 max-w-2xl">
                  {profile.about}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted">
                {profile.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                )}
                {profile.availability && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {profile.availability.replace("-", " ")}
                  </div>
                )}
                {profile.links?.github && (
                  <a href={`https://github.com/${profile.links.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Code className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                {profile.links?.linkedin && (
                  <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Globe className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border border-t border-border">
            
            {/* Left Column (Skills) */}
            <div className="p-8 md:p-12 lg:col-span-2 space-y-10">
              
              <section>
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Link2 className="w-5 h-5" />
                  </div>
                  Technical Skills
                </h3>
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: any, i: number) => (
                      <div key={i} className="px-4 py-2 bg-slate-50 border border-border rounded-xl text-sm font-medium text-foreground">
                        {skill.name} <span className="text-muted ml-2 text-xs">{skill.level}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted italic">No skills added yet.</p>
                )}
              </section>

              <section>
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  Education
                </h3>
                {profile.education && profile.education.length > 0 ? (
                  <div className="space-y-6">
                    {profile.education.map((edu: any, i: number) => (
                      <div key={i} className="relative pl-6 border-l-2 border-slate-200">
                        <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7.5px] top-1.5 ring-4 ring-white" />
                        <h4 className="text-lg font-semibold text-foreground">{edu.institution || edu}</h4>
                        {edu.degree && (
                          <p className="text-muted mt-1 text-sm font-medium">
                            {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                          </p>
                        )}
                        {edu.startYear && (
                          <p className="text-muted mt-1 text-xs">
                            {edu.startYear} - {edu.endYear || 'Present'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted italic">No education history added yet.</p>
                )}
              </section>

            </div>

            {/* Right Column (Looking For) */}
            <div className="p-8 md:p-12 lg:col-span-1 bg-slate-50/50">
              <h3 className="text-lg font-bold text-foreground mb-6">Looking For</h3>
              {profile.lookingFor && profile.lookingFor.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {profile.lookingFor.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white border border-border rounded-xl shadow-sm text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted italic">Not actively looking for anything.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
