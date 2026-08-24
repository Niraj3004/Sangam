"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, Search as SearchIcon, Users, FolderKanban, BookOpen, Lightbulb, Briefcase } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState<any>({
    users: [],
    projects: [],
    communities: [],
    ideas: [],
    jobs: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (q: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/search?q=${encodeURIComponent(q)}`);
      setResults(data.data || { users: [], projects: [], communities: [], ideas: [], jobs: [] });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalResults = (results.users?.length || 0) + 
                       (results.projects?.length || 0) + 
                       (results.communities?.length || 0) + 
                       (results.ideas?.length || 0) + 
                       (results.jobs?.length || 0);

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <SearchIcon className="w-16 h-16 text-slate-200 mb-6" />
        <h1 className="text-2xl font-bold text-foreground">Global Search</h1>
        <p className="text-muted mt-2">Enter a query in the navigation bar to search across all of Sangam.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      <div className="mb-8 border-b border-border pb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-muted">
          Found {isLoading ? '...' : totalResults} results across the platform.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : totalResults === 0 ? (
        <div className="text-center py-20 bg-white border border-border rounded-2xl border-dashed">
          <SearchIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No matches found</h3>
          <p className="text-muted mt-1 text-sm">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Users */}
          {results.users?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" /> People
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.users.map((user: any) => (
                  <Link key={user._id} href={`/u/${user.handle}`} className="bg-white p-4 rounded-xl border border-border hover:shadow-md transition-shadow flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary overflow-hidden shrink-0">
                      {user.profilePic ? <img src={user.profilePic} alt="" className="w-full h-full object-cover" /> : user.handle.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground flex items-center gap-1.5">{user.handle} <VerifiedBadge tier={user.verifyTier} /></h3>
                      <p className="text-xs text-muted capitalize">{user.role}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {results.projects?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-emerald-500" /> Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.projects.map((project: any) => (
                  <Link key={project._id} href={`/projects/${project._id}`} className="bg-white p-4 rounded-xl border border-border hover:shadow-md transition-shadow flex flex-col">
                    <h3 className="font-bold text-foreground mb-1">{project.title}</h3>
                    <p className="text-xs text-muted line-clamp-2">{project.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Communities */}
          {results.communities?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-rose-500" /> Communities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.communities.map((community: any) => (
                  <Link key={community._id} href={`/communities/${community._id}`} className="bg-white p-4 rounded-xl border border-border hover:shadow-md transition-shadow flex flex-col">
                    <h3 className="font-bold text-foreground mb-1">{community.name}</h3>
                    <p className="text-xs text-muted line-clamp-2">{community.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Ideas */}
          {results.ideas?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" /> Ideas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.ideas.map((idea: any) => (
                  <Link key={idea._id} href={`/ideas/${idea._id}`} className="bg-white p-4 rounded-xl border border-border hover:shadow-md transition-shadow flex flex-col">
                    <h3 className="font-bold text-foreground mb-1">{idea.title}</h3>
                    <p className="text-xs text-muted line-clamp-2">{idea.problem}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Jobs */}
          {results.jobs?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" /> Jobs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.jobs.map((job: any) => (
                  <Link key={job._id} href={`/jobs/${job._id}`} className="bg-white p-4 rounded-xl border border-border hover:shadow-md transition-shadow flex flex-col">
                    <h3 className="font-bold text-foreground mb-1">{job.title}</h3>
                    <p className="text-xs text-muted">{job.company}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
}
