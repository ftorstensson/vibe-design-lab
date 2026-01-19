"use client";

// --- SECTION A: IMPORTS ---
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Shield, Zap, Cpu } from 'lucide-react';
import { useVibeStore } from '@/store/vibe-store';
import { clsx } from 'clsx';

export default function AgencyLab() {
  const router = useRouter();
  const { agencyRoster, fetchRoster, updateAgentInDB } = useVibeStore();
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [promptDraft, setPromptDraft] = useState("");

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  const handleSelect = (agent: any) => {
    setSelectedAgent(agent);
    setPromptDraft(agent.system_prompt);
  };

  const handleSave = async () => {
    if (!selectedAgent) return;
    await updateAgentInDB(selectedAgent.id, { 
        ...selectedAgent, 
        system_prompt: promptDraft 
    });
    alert("Agent Instructions Updated.");
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* --- SECTION B: ROSTER RAIL --- */}
      <div className="w-80 h-full bg-white border-r border-slate-200 flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <button 
              onClick={() => router.push('/')} 
              aria-label="Back to Lobby"
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Liquid</span>
              <span className="text-xs font-bold text-slate-900 uppercase">Agency Roster</span>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {agencyRoster.map((agent: any) => (
                <div key={agent.id} onClick={() => handleSelect(agent)} className={clsx("p-4 rounded-2xl cursor-pointer transition-all border", selectedAgent?.id === agent.id ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-white border-transparent hover:border-slate-200 text-slate-600")}>
                    <div className="flex items-center gap-3">
                        <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center", agent.model_tier === 'PRO' ? "bg-blue-500" : "bg-purple-500")}>
                            {agent.model_tier === 'PRO' ? <Shield className="w-4 h-4 text-white" /> : <Zap className="w-4 h-4 text-white" />}
                        </div>
                        <div><span className="text-sm font-bold block leading-tight">{agent.display_name}</span><span className="text-[9px] uppercase font-bold opacity-50 tracking-widest">{agent.department}</span></div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* --- SECTION C: THE EDITOR --- */}
      <div className="flex-1 h-full flex flex-col relative bg-slate-50">
        {selectedAgent ? (
            <div className="flex-1 flex flex-col p-12 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="font-playfair text-5xl font-black text-slate-900 italic mb-2">{selectedAgent.display_name}</h1>
                        <p className="text-slate-400 font-medium uppercase tracking-[0.3em] text-xs">{selectedAgent.role}</p>
                    </div>
                    <button 
                      onClick={handleSave} 
                      aria-label="Save specialist instructions"
                      className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl hover:bg-black transition-all active:scale-95"
                    >
                      <Save className="w-5 h-5" />
                      <span className="font-bold text-sm">Save Instructions</span>
                    </button>
                </header>

                <div className="grid grid-cols-3 gap-8 flex-1">
                    <div className="col-span-2 flex flex-col bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden ring-1 ring-black/5">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-slate-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Instruction (System Prompt)</span>
                        </div>
                        <textarea 
                          className="flex-1 p-8 text-sm font-medium text-slate-700 leading-relaxed outline-none resize-none bg-transparent" 
                          aria-label="Edit system prompt"
                          placeholder="Enter agent instructions here..."
                          value={promptDraft} 
                          onChange={(e) => setPromptDraft(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Model Configuration</h3>
                            <div className="space-y-4">
                                <ConfigRow label="Intelligence Tier" value={selectedAgent.model_tier} />
                                <ConfigRow label="Search Access" value={selectedAgent.tools?.includes('google_search_retrieval') ? "ENABLED" : "DISABLED"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex-1 flex items-center justify-center text-slate-300 flex-col gap-4">
              <Shield className="w-12 h-12 opacity-10" />
              <p className="text-xs font-bold uppercase tracking-[0.3em]">Select an agent to engineer</p>
            </div>
        )}
      </div>
    </div>
  );
}

const ConfigRow = ({ label, value }: any) => (
    <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span>
        <span className="text-[10px] font-black text-slate-900 uppercase border-b-2 border-slate-900 pb-0.5">{value}</span>
    </div>
);