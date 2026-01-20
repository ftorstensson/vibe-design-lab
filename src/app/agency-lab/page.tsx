"use client";

// --- SECTION A: IMPORTS ---
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Shield, Zap, Cpu, ChevronDown, ChevronRight, MessageSquare, Glasses, Box } from 'lucide-react';
import { useVibeStore } from '@/store/vibe-store';
import { clsx } from 'clsx';

// --- SECTION B: MASTER ORDER CONFIG ---
const DEPT_ORDER = [
  "BIG_IDEA_TEAM",
  "MARKET_TEAM",
  "AUDIENCE_TEAM",
  "STRUCTURE_TEAM",
  "FEASIBILITY_TEAM"
];

export default function AgencyLab() {
  const router = useRouter();
  const { agencyRoster, departmentRegistry, fetchRoster, updateAgentInDB, updateDeptInDB } = useVibeStore();
  
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [editorContent, setEditorContent] = useState("");
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]);

  useEffect(() => { fetchRoster(); }, [fetchRoster]);

  // --- SECTION C: HIERARCHY MAPPING ---
  const hierarchy = useMemo(() => {
    const map: any = {};
    agencyRoster.forEach((a: any) => {
        if (!map[a.level_id]) map[a.level_id] = {};
        if (!map[a.level_id][a.dept_id]) map[a.level_id][a.dept_id] = [];
        map[a.level_id][a.dept_id].push(a);
    });
    return map;
  }, [agencyRoster]);

  const toggleTeam = (id: string) => {
    // 1. Toggle expansion
    setExpandedTeams(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    // 2. Automatically select the lens for this team
    const dept = departmentRegistry.find((d: any) => d.id === id);
    if (dept) {
        setSelectedAgent(null);
        setSelectedDept(dept);
        setEditorContent(dept.lens_profile);
    }
  };

  const handleSelectAgent = (agent: any) => {
    setSelectedDept(null);
    setSelectedAgent(agent);
    setEditorContent(agent.system_prompt);
  };

  const handleSave = async () => {
    if (selectedAgent) {
        await updateAgentInDB(selectedAgent.id, { ...selectedAgent, system_prompt: editorContent });
        alert("Persona Saved.");
    } else if (selectedDept) {
        await updateDeptInDB(selectedDept.id, { ...selectedDept, lens_profile: editorContent });
        alert("Lens Saved.");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* --- SECTION D: ORDERED SIDEBAR --- */}
      <div className="w-80 h-full bg-white border-r border-slate-200 flex flex-col shadow-xl z-20 overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <button onClick={() => router.push('/')} aria-label="Back" className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5 text-slate-400" /></button>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Agency Control</span>
        </div>

        <div className="p-4 space-y-4">
            {/* 1. GLOBAL PM */}
            {hierarchy['GLOBAL']?.['HUB']?.map((pm: any) => (
                <button key={pm.id} onClick={() => handleSelectAgent(pm)} aria-label="Select PM" className={clsx("w-full p-5 border-2 flex items-center gap-3 transition-all rounded-xl", selectedAgent?.id === pm.id ? "border-slate-900 bg-slate-900 text-white shadow-lg" : "border-slate-100 hover:border-slate-300 text-slate-600")}>
                    <MessageSquare className="w-4 h-4" /><span className="text-xs font-black uppercase tracking-widest">{pm.display_name}</span>
                </button>
            ))}

            {/* 2. STRATEGY DEPARTMENT (Ordered) */}
            <div className="pt-4 border-t border-slate-50">
                <span className="px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-4">Strategy Department</span>
                <div className="space-y-2">
                    {DEPT_ORDER.map(deptId => (
                        hierarchy['STRATEGY_DPT']?.[deptId] && (
                            <div key={deptId} className="space-y-1">
                                <button 
                                    onClick={() => toggleTeam(deptId)}
                                    className={clsx(
                                        "w-full p-4 border flex items-center justify-between transition-all rounded-xl",
                                        selectedDept?.id === deptId ? "border-slate-900 bg-slate-900 text-white" : "bg-slate-50 border-slate-100 hover:border-slate-300 text-slate-900"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Glasses className={clsx("w-3 h-3", selectedDept?.id === deptId ? "text-white" : "opacity-50")} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{deptId.replace(/_TEAM/g, '')}</span>
                                    </div>
                                    {expandedTeams.includes(deptId) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3 opacity-30" />}
                                </button>
                                
                                {expandedTeams.includes(deptId) && (
                                    <div className="pl-4 py-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                        {hierarchy['STRATEGY_DPT'][deptId].sort((a:any, b:any) => a.role_index - b.role_index).map((agent: any) => (
                                            <button key={agent.id} onClick={() => handleSelectAgent(agent)} className={clsx("w-full text-left p-3 rounded-xl text-xs font-bold transition-all border", selectedAgent?.id === agent.id ? "bg-white border-slate-900 shadow-md translate-x-1 text-slate-900" : "bg-transparent border-transparent text-slate-400 hover:text-slate-600")}>
                                                {agent.display_name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* --- SECTION E: THE EDITOR --- */}
      <div className="flex-1 h-full flex flex-col bg-slate-50">
        {(selectedAgent || selectedDept) ? (
            <div className="flex-1 flex flex-col p-12 max-w-6xl mx-auto w-full animate-in fade-in duration-500">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="font-playfair text-6xl font-black text-slate-900 italic mb-4 tracking-tighter">{selectedAgent ? selectedAgent.display_name : selectedDept.label}</h1>
                        <p className="text-slate-400 font-medium uppercase tracking-[0.4em] text-[10px]">{selectedAgent ? `Cognitive Persona // ${selectedAgent.role}` : `Departmental Lens // Worldview`}</p>
                    </div>
                    <button onClick={handleSave} aria-label="Commit changes" className="flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-2xl shadow-2xl hover:bg-black transition-all active:scale-95"><Save className="w-5 h-5" /><span className="font-bold text-sm uppercase tracking-widest text-center">Commit Changes</span></button>
                </header>

                <div className="grid grid-cols-4 gap-12 flex-1">
                    <div className="col-span-3 flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden ring-1 ring-black/5">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                            <Cpu className="w-5 h-5 text-slate-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{selectedAgent ? "Agent Instructions" : "Departmental Worldview Lens"}</span>
                        </div>
                        <textarea className="flex-1 p-10 text-lg font-medium text-slate-700 leading-relaxed outline-none resize-none bg-transparent" title="Editor" placeholder="Draft..." value={editorContent} onChange={(e) => setEditorContent(e.target.value)} />
                    </div>
                    <div className="bg-white p-8 h-fit rounded-[2rem] border border-slate-200 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8 border-b pb-4 text-center">Specs</h3>
                        <div className="space-y-6">
                            <ConfigRow label="Type" value={selectedAgent ? "INDIVIDUAL" : "LENS"} />
                            {selectedAgent && <ConfigRow label="Model" value={selectedAgent.model_tier} />}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex-1 flex items-center justify-center text-slate-300 flex-col gap-4 opacity-30 animate-pulse"><Box className="w-12 h-12" /><p className="text-[11px] font-black uppercase tracking-[0.4em]">Select a unit to engineer</p></div>
        )}
      </div>
    </div>
  );
}

const ConfigRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col gap-1 items-center">
        <span className="text-[9px] font-bold text-slate-400 uppercase">{label}</span>
        <span className="text-[10px] font-black text-slate-900 uppercase">{value}</span>
    </div>
);