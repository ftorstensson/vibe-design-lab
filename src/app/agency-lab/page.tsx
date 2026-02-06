"use client";

// --- SECTION A: IMPORTS ---
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Save, Shield, Zap, Cpu, ChevronDown, 
  ChevronRight, MessageSquare, Glasses, Box, Target, 
  AlertCircle, HardHat, Layers, Network, Layout, Crown, Search
} from 'lucide-react';
import { useVibeStore } from '@/store/vibe-store';
import { SpecialistAgent, VibeLayer } from '@/types/vibe-core';
import { clsx } from 'clsx';

// --- SECTION B: CONFIG & ORDERING ---
const LAYERS_CONFIG: { id: VibeLayer; label: string; icon: any }[] = [
  { id: 'STRATEGY', label: 'Layer 1: Strategy', icon: Target },
  { id: 'LANDSCAPE', label: 'Layer 2: Landscape', icon: Search },
  { id: 'JOURNEY', label: 'Layer 3: Journey', icon: Zap },
  { id: 'SITEMAP', label: 'Layer 4: Structure', icon: Network },
  { id: 'WIREFRAME', label: 'Layer 5: Wireframes', icon: Layout },
];

const STRATEGY_DEPT_ORDER = [
  "BIG_IDEA_TEAM",
  "MARKET_TEAM",
  "AUDIENCE_TEAM",
  "STRUCTURE_TEAM",
  "FEASIBILITY_TEAM"
];

export default function AgencyLab() {
  const router = useRouter();
  const { agencyRoster, departmentRegistry, fetchRoster, updateAgentInDB, updateDeptInDB } = useVibeStore();
  
  const [selectedLayer, setSelectedLayer] = useState<VibeLayer>('STRATEGY');
  const [selectedAgent, setSelectedAgent] = useState<SpecialistAgent | null>(null);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [editorContent, setEditorContent] = useState("");
  const [expandedTeams, setExpandedTeams] = useState<string[]>(STRATEGY_DEPT_ORDER);

  // DeTax Metadata Fields
  const [optTarget, setOptTarget] = useState("");
  const [lossFunc, setLossFunc] = useState("");
  const [physics, setPhysics] = useState("");

  useEffect(() => { fetchRoster(); }, [fetchRoster]);

  // --- SECTION C: HIERARCHY MAPPING ---
  const hierarchy = useMemo(() => {
    const map: Record<string, Record<string, SpecialistAgent[]>> = {};
    agencyRoster.forEach((a) => {
        const layer = a.layer_id || 'STRATEGY';
        const dept = a.dept_id || 'UNKNOWN';
        if (!map[layer]) map[layer] = {};
        if (!map[layer][dept]) map[layer][dept] = [];
        map[layer][dept].push(a);
    });
    return map;
  }, [agencyRoster]);

  const handleSelectAgent = (agent: SpecialistAgent) => {
    setSelectedDept(null);
    setSelectedAgent(agent);
    setEditorContent(agent.system_prompt);
    setOptTarget(agent.optimization_target || "");
    setLossFunc(agent.loss_function || "");
    setPhysics(agent.physics_constraints || "");
  };

  const handleSelectDept = (deptId: string) => {
    const dept = departmentRegistry.find((d: any) => d.id === deptId);
    if (dept) {
        setSelectedAgent(null);
        setSelectedDept(dept);
        setEditorContent(dept.lens_profile || "");
    }
  };

  const handleSave = async () => {
    if (selectedAgent) {
        await updateAgentInDB(selectedAgent.id, { 
            system_prompt: editorContent,
            optimization_target: optTarget,
            loss_function: lossFunc,
            physics_constraints: physics
        });
        alert("DNA Committed to Ledger.");
    } else if (selectedDept) {
        await updateDeptInDB(selectedDept.id, { lens_profile: editorContent });
        alert("Department Worldview Updated.");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#fafafa] overflow-hidden font-sans text-slate-900">
      
      {/* --- SIDEBAR (TRIPLE ACCORDION) --- */}
      <div className="w-80 h-full bg-white border-r border-slate-200 flex flex-col shadow-2xl z-20 overflow-hidden text-slate-900">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <button onClick={() => router.push('/')} aria-label="Back to Lobby" className="p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-colors"><ArrowLeft className="w-5 h-5 text-slate-400" /></button>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Agency Control</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* 1. GLOBAL COMMAND */}
            <div className="space-y-2">
                <span className="px-2 text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-2">Global Command</span>
                {hierarchy['GLOBAL']?.['HUB']?.map((pm: any) => (
                    <button key={pm.id} onClick={() => handleSelectAgent(pm)} className={clsx("w-full p-4 border flex items-center gap-3 transition-all rounded-xl", selectedAgent?.id === pm.id ? "border-slate-900 bg-slate-900 text-white shadow-lg" : "bg-white border-slate-100 hover:border-slate-300 text-slate-600")}>
                        <Crown className={clsx("w-4 h-4", selectedAgent?.id === pm.id ? "text-white" : "text-amber-500")} />
                        <span className="text-xs font-black uppercase tracking-widest">{pm.display_name}</span>
                    </button>
                ))}
            </div>

            {/* 2. THE PROCESS LAYERS */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="px-2 text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-2">The Assembly Line</span>
                {LAYERS_CONFIG.map((layer) => (
                    <div key={layer.id} className="space-y-1">
                        <button onClick={() => setSelectedLayer(layer.id)} className={clsx("w-full flex items-center justify-between p-3 rounded-xl transition-all border", selectedLayer === layer.id ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200")}>
                            <div className="flex items-center gap-3"><layer.icon className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">{layer.label}</span></div>
                            {selectedLayer === layer.id ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>

                        {selectedLayer === layer.id && (
                            <div className="pl-4 py-2 space-y-2 animate-in slide-in-from-top-2 duration-300">
                                {/* Ordered Strategy Teams or Generic Layer Teams */}
                                {(layer.id === 'STRATEGY' ? STRATEGY_DEPT_ORDER : Object.keys(hierarchy[layer.id] || {})).map(deptId => (
                                    hierarchy[layer.id]?.[deptId] && (
                                        <div key={deptId} className="space-y-1">
                                            <button 
                                                onClick={() => { setExpandedTeams(prev => prev.includes(deptId) ? prev.filter(x => x !== deptId) : [...prev, deptId]); handleSelectDept(deptId); }}
                                                className={clsx("w-full p-2 flex items-center justify-between rounded-lg transition-colors group", selectedDept?.id === deptId ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600")}
                                            >
                                                <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-widest">{deptId.replace(/_TEAM/g, '').replace(/_/g, ' ')}</span></div>
                                                {expandedTeams.includes(deptId) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                            </button>

                                            {expandedTeams.includes(deptId) && (
                                                <div className="pl-4 space-y-1">
                                                    {hierarchy[layer.id][deptId].sort((a, b) => a.role_index - b.role_index).map((agent) => (
                                                        <button key={agent.id} onClick={() => handleSelectAgent(agent)} className={clsx("w-full text-left p-2 rounded-lg text-xs font-bold transition-all border", selectedAgent?.id === agent.id ? "bg-white border-slate-900 text-slate-900 shadow-sm translate-x-1" : "bg-transparent border-transparent text-slate-400 hover:text-slate-600")}>{agent.display_name}</button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* --- EDITOR (ADVERSARIAL MODE) --- */}
      <div className="flex-1 h-full flex flex-col bg-[#fdfdfd] overflow-hidden">
        {(selectedAgent || selectedDept) ? (
            <div className="flex-1 flex flex-col p-12 max-w-7xl mx-auto w-full overflow-y-auto scrollbar-hide">
                <header className="flex justify-between items-end mb-12 shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded tracking-widest uppercase">{selectedAgent ? selectedAgent.model_tier : "DEPT LENS"}</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{selectedAgent ? selectedAgent.layer_id : selectedLayer} // {selectedAgent ? selectedAgent.dept_id : selectedDept.id}</span>
                        </div>
                        <h1 className="font-playfair text-6xl font-black text-slate-900 italic tracking-tighter leading-none">{selectedAgent ? selectedAgent.display_name : selectedDept.label}</h1>
                    </div>
                    <button onClick={handleSave} className="flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-2xl shadow-2xl hover:bg-black transition-all active:scale-95 shrink-0"><Save className="w-5 h-5" /><span className="font-bold text-sm uppercase tracking-widest">Commit Changes</span></button>
                </header>

                <div className="grid grid-cols-3 gap-8 items-start pb-20">
                    {/* PRIMARY SYSTEM PROMPT */}
                    <div className="col-span-2 flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden ring-1 ring-black/5 min-h-[600px]">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3"><Cpu className="w-4 h-4 text-slate-400" /><span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{selectedAgent ? "Cognitive Persona Prompt" : "Departmental Worldview Lens"}</span></div>
                        <textarea title="Editor" aria-label="Editor" className="flex-1 p-10 text-lg font-medium text-slate-700 leading-relaxed outline-none resize-none bg-transparent" value={editorContent} onChange={(e) => setEditorContent(e.target.value)} placeholder="Engineering the brain..." />
                    </div>

                    {/* ADVERSARIAL METADATA */}
                    <div className="space-y-6">
                        {selectedAgent && (
                            <>
                                <MetadataBlock icon={Target} label="Optimization Target" value={optTarget} onChange={setOptTarget} placeholder="Maximize venture moat..." />
                                <MetadataBlock icon={AlertCircle} label="Loss Function (Failure)" value={lossFunc} onChange={setLossFunc} color="text-red-500" placeholder="Punish for incrementalism..." />
                                <MetadataBlock icon={HardHat} label="Physics Constraints" value={physics} onChange={setPhysics} placeholder="Runway is 9 months..." />
                            </>
                        )}
                        <div className="p-8 bg-slate-100 rounded-[2.5rem] border border-slate-200"><h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 text-slate-900">Technical Specs</h3><div className="space-y-3"><SpecRow label="Type" value={selectedAgent ? "SPECIALIST" : "LENS"} /><SpecRow label="ID" value={selectedAgent ? selectedAgent.id : selectedDept.id} /></div></div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex-1 flex items-center justify-center text-slate-300 flex-col gap-4 opacity-30 animate-pulse"><HardHat className="w-12 h-12" /><p className="text-[11px] font-black uppercase tracking-[0.4em]">Select a unit to engineer</p></div>
        )}
      </div>
    </div>
  );
}

const MetadataBlock = ({ icon: Icon, label, value, onChange, placeholder, color = "text-slate-400" }: any) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-slate-300 transition-colors text-slate-900">
        <div className="flex items-center gap-2 mb-3"><Icon className={clsx("w-3 h-3", color)} /><span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</span></div>
        <textarea title={label} aria-label={label} className="w-full text-xs font-bold text-slate-800 bg-transparent border-none outline-none resize-none h-24 p-0 focus:ring-0 placeholder:text-slate-200" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
);

const SpecRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center text-[10px] text-slate-900"><span className="font-bold text-slate-400 uppercase tracking-widest">{label}</span><span className="font-black text-slate-900 truncate ml-4 uppercase">{value}</span></div>
);