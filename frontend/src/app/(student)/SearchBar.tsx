"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        if (searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }}
      className="flex items-center bg-slate-50 rounded-full px-4 py-2 w-96 border border-border focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 focus-within:bg-white transition-all shadow-sm"
    >
      <Search className="w-4 h-4 text-muted mr-2" />
      <input 
        type="text" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search people, projects, opportunities..." 
        className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-900 placeholder:text-slate-400"
      />
    </form>
  );
}
