"use client";

import React, { useState } from "react";
import { Menu, MapPin, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { MenuDrawer } from "@/components/dashboard/MenuDrawer";
import { useUser } from "@/context/UserContext";

const TABS = ["Recents", "Applied", "Current", "Completed"];

export default function OpportunitiesPage() {
  const router = useRouter();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("Recents");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          skills: user?.skills?.join(',') || 'photography,design',
          location: user?.location || 'Lagos',
          languages: user?.languages?.join(',') || 'English'
        });
        const res = await fetch(`https://oloja-production.up.railway.app/api/opportunities/match?${queryParams}`);
        if (!res.ok) throw new Error('Failed to fetch opportunities');
        const data = await res.json();
        setOpportunities(data.matches || []);
      } catch (err: any) {
        console.error(err);
        try {
          const { DUMMY_OPPORTUNITIES } = await import("@/data/dummyOpportunities");
          setOpportunities(DUMMY_OPPORTUNITIES);
        } catch (e) {
          setError(err.message || 'Failed to load opportunities');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-[#8b5cf6]/30 relative pb-10">
      <div className="flex-1 w-full h-full relative overflow-x-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center p-6 pb-2 w-full">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors shrink-0">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold flex-1 text-center pr-8">Opportunities</h1>
        </header>
        <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto">

          {/* Tabs */}
          <div className="flex px-6 mb-6 border-b border-zinc-800/50 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-4 font-medium text-sm whitespace-nowrap transition-colors relative ${
                  activeTab === tab ? "text-[#8b5cf6]" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8b5cf6]" />
                )}
              </button>
            ))}
          </div>

          <div className="px-6">
            <h2 className="text-base font-semibold mb-4 text-zinc-100">Based on Your Profile</h2>
            
            <div className="space-y-4">
              {isLoading && (
                <div className="text-center text-zinc-500 py-8">Loading opportunities...</div>
              )}
              
              {error && (
                <div className="text-center text-red-500 py-8 bg-red-500/10 rounded-xl">
                  {error}
                </div>
              )}
              
              {!isLoading && !error && opportunities.length === 0 && (
                <div className="text-center text-zinc-500 py-8 bg-zinc-800/30 rounded-xl">
                  No matches found right now.
                </div>
              )}

              {!isLoading && !error && opportunities.map((job) => (
                <div key={job.id} className="bg-[#18181b] rounded-2xl p-5 border border-zinc-800/50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-zinc-100 text-[15px]">{job.title}</h3>
                      <p className="text-zinc-500 text-sm mt-0.5">{job.postedBy}</p>
                    </div>
                    {job.matchPercentage && (
                      <div className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
                        job.matchPercentage >= 90 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-[#8b5cf6]/10 text-[#8b5cf6]'
                      }`}>
                        {job.matchPercentage}% Match
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mb-5">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{job.location || job.distance || "Remote"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{job.duration || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#8b5cf6]">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>₦{job.pay?.toLocaleString()}/{job.payFrequency?.replace('_', ' ') || 'job'}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => router.push(`/opportunities/${job.id}`)}
                    className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
