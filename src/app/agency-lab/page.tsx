"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Save, Zap, ChevronDown, ChevronRight, Target, 
  AlertCircle, HardHat, Crown, Search, PenTool, BookOpen, Plus, Trash2, Database,
  Layout, Network, Archive, ArrowUp, ArrowDown
} from 'lucide-react';
import { useVibeStore } from '@/store/vibe-store';
import { SpecialistAgent, VibeLayer, MilestoneDefinition, MilestoneRequirement } from '@/types/vibe-core';
import { clsx } from 'clsx';

const LAYERS_CONFIG: { id: VibeLayer; label: string; icon: any }[] = [
  { id: 'STRATEGY', label: 'Layer 1: Strategy', icon: Target },
  { id: 'LANDSCAPE', label: 'Layer 2: Landscape', icon: Search },
];

const STRATEGY_ORDER = ['the_big_idea', 'the_opportunity', 'the_people', 'the_experience', 'the_mvp'];

export default function AgencyLab() {
  const router = useRouter();
  const { agencyRoster, milestoneRegistry, fetchRoster, updateAgentInDB, updateMilestoneInDB } = useVibeStore();
  
  const [expandedLayers, setExpandedLayers] = useState<string[]>(['STRATEGY', 'GLOBAL']);
  const [expandedMilestones, setExpandedMilestones] = useState<string[]>([]);
  const [openBrickIndex, setOpenBrickIndex] = useState<number | null>(null);

  const [selectedAgent, setSelectedAgent] = useState<SpecialistAgent | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneDefinition | null>(null);
  const [activeTab, setActiveTab] = useState<"persona" | "exo">("persona");

  const [purpose, setPurpose] = useState("");
  const [checklist, setChecklist] = useState("");
  const [bricks, setBricks] = useState<MilestoneRequirement[]>([]);

  const [editorContent, setEditorContent] = useState("");
  const [exoBrainContent, setExoBrainContent] = useState("");
  const [optTarget, setOptTarget] = useState("");
  const [lossFunc, setLossFunc] = useState("");
  const [physics, setPhysics] = useState("");

  useEffect(() => { fetchRoster(); }, [fetchRoster]);

  const hierarchy = useMemo(() => {
    const map: Record<string, Record<string, SpecialistAgent[]>> = {};
    agencyRoster.forEach((a) => {
        // Only show Specialists in the Pods
        const layer = a.layer_id || 'STRATEGY';
        const dept = a.dept_id || 'STRATEGY_POD';
        if (a.id === 'master_pm' || a.id === 'editor_in_chief') return;
        if (!map[layer]) map[layer] = {};
        if (!map[layer][dept]) map[layer][dept] = [];
        map[layer][dept].push(a);
    });
    return map;
  }, [agencyRoster]);

  const globalAgents = useMemo(() => {
    return agencyRoster.filter(a => a.id === 'master_pm' || a.id === 'editor_in_chief');
  }, [agencyRoster]);

  const handleSelectMilestone = (mId: string) => {
    const m = milestoneRegistry.find(x => x.milestone_id === mId);
    setSelectedAgent(null);
    setSelectedMilestone(m || null);
    if (m) {
        setPurpose(m.purpose || "");
        setChecklist(m.checklist_prompt || "");
        setBricks(m.research_architecture || []);
        setOpenBrickIndex(null);
    }
  };

  const handleSelectAgent = (agent: SpecialistAgent) => {
    setSelectedMilestone(null);
    setSelectedAgent(agent);
    setEditorContent(agent.system_prompt || "");
    setExoBrainContent(agent.exo_brain || "");
    setOptTarget(agent.optimization_target || "");
    setLossFunc(agent.loss_function || "");
    setPhysics(agent.physics_constraints || "");
    setActiveTab("persona");
  };

  const moveBrick = (index: number, direction: 'up' | 'down') => {
    const newBricks = [...bricks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBricks.length) return;
    [newBricks[index], newBricks[targetIndex]] = [newBricks[targetIndex], newBricks[index]];
    setBricks(newBricks);
  };

  const handleSave = async () => {
    if (selectedAgent) {
        await updateAgentInDB(selectedAgent.id, { 
            system_prompt: editorContent, exo_brain: exoBrainContent,
            optimization_target: optTarget, loss_function: lossFunc, physics_constraints: physics
        });
        alert("Agent DNA Saved.");
    } else if (selectedMilestone) {
        await updateMilestoneInDB(selectedMilestone.milestone_id, {
            purpose, checklist_prompt: checklist, research_architecture: bricks
        });
        alert("Milestone Architecture Saved.");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#fafafa] overflow-hidden font-sans text-slate-900">
      <div className="w-80 h-full bg-white border-r border-slate-200 flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
            <button onClick={() => router.push('/')} className="p-2 hover:bg-slate-50 rounded-lg"><ArrowLeft className="w-5 h-5 text-slate-400" /></button>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Agency Control</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="mb-4">
                <button onClick={() => setExpandedLayers(p => p.includes('GLOBAL') ? p.filter(x => x !== 'GLOBAL') : [...p, 'GLOBAL'])} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50">
                    <div className="flex items-center gap-3"><Crown className="w-4 h-4 text-amber-500" /><span className="text-[10px] font-black uppercase tracking-widest">Global Command</span></div>
                    {expandedLayers.includes('GLOBAL') ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
                {expandedLayers.includes('GLOBAL') && (
                    <div className="pl-6 pt-1 space-y-1">
                        {globalAgents.map(agent => (
                            <button key={agent.id} onClick={() => handleSelectAgent(agent)} className={clsx("w-full text-left p-2 rounded-lg text-[10px] font-bold uppercase", selectedAgent?.id === agent.id ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600")}>{agent.display_name}</button>
                        ))}
                    </div>
                )}
            </div>

            {LAYERS_CONFIG.map(layer => (
                <div key={layer.id} className="mb-2">
                    <button onClick={() => setExpandedLayers(p => p.includes(layer.id) ? p.filter(x => x !== layer.id) : [...p, layer.id])} className={clsx("w-full flex items-center justify-between p-3 rounded-xl transition-all border", expandedLayers.includes(layer.id) ? "bg-slate-50 border-slate-100 shadow-sm" : "border-transparent hover:bg-slate-50")}>
                        <div className="flex items-center gap-3"><layer.icon className="w-4 h-4 text-slate-400" /><span className="text-[10px] font-black uppercase tracking-widest">{layer.label}</span></div>
                        {expandedLayers.includes(layer.id) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>
                    {expandedLayers.includes(layer.id) && (
                        <div className="pl-4 pt-2 space-y-1">
                            {STRATEGY_ORDER.map(mId => (
                                <div key={mId} className="mb-1">
                                    <button onClick={() => { setExpandedMilestones(p => p.includes(mId) ? p.filter(x => x !== mId) : [...p, mId]); handleSelectMilestone(mId); }} className={clsx("w-full p-2.5 flex items-center justify-between rounded-lg", selectedMilestone?.milestone_id === mId ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900")}>
                                        <div className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /><span className="text-[10px] font-black uppercase tracking-widest">{mId.replace(/_/g, ' ')}</span></div>
                                        {expandedMilestones.includes(mId) ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                                    </button>
                                    {expandedMilestones.includes(mId) && (
                                        <div className="pl-6 pt-1 space-y-1 border-l border-slate-200 ml-3">
                                            {Object.values(hierarchy[layer.id] || {}).flat().map(agent => (
                                                <button key={agent.id} onClick={() => handleSelectAgent(agent)} className={clsx("w-full text-left p-2 rounded text-[9px] font-black uppercase tracking-wider", selectedAgent?.id === agent.id ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}>{agent.display_name}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      <div className="flex-1 h-full flex flex-col bg-[#fdfdfd] overflow-hidden">
        {(selectedAgent || selectedMilestone) ? (
            <div className="flex-1 flex flex-col p-12 max-w-7xl mx-auto w-full overflow-y-auto scrollbar-hide">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded tracking-widest uppercase">{selectedAgent ? "Agent DNA" : "Milestone Architecture"}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 uppercase">{selectedAgent?.id || selectedMilestone?.milestone_id}</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 italic tracking-tighter capitalize leading-none">{selectedAgent?.display_name || selectedMilestone?.label?.replace(/_/g,' ')}</h1>
                    </div>
                    <button onClick={handleSave} className="flex items-center gap-4 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95"><Save className="w-5 h-5" /><span className="font-bold text-xs uppercase tracking-widest">Commit Changes</span></button>
                </header>

                <div className="grid grid-cols-3 gap-12 pb-20">
                    <div className="col-span-2 space-y-8">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[700px] flex flex-col">
                            <div className="flex border-b border-slate-100">
                                {selectedAgent ? (
                                    <>
                                        <button onClick={() => setActiveTab("persona")} className={clsx("px-8 py-4 text-[10px] font-black uppercase tracking-widest", activeTab === "persona" ? "bg-slate-50 border-b-2 border-slate-900 text-slate-900" : "text-slate-400")}>1. Persona (Skull)</button>
                                        <button onClick={() => setActiveTab("exo")} className={clsx("px-8 py-4 text-[10px] font-black uppercase tracking-widest", activeTab === "exo" ? "bg-slate-50 border-b-2 border-slate-900 text-slate-900" : "text-slate-400")}>2. Exo-Brain (Library)</button>
                                    </>
                                ) : (
                                    <div className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-900 bg-slate-50 border-b-2 border-slate-900">Research Summary Structure (The Bricks)</div>
                                )}
                            </div>
                            
                            <div className="p-10 flex-1">
                                {selectedAgent ? (
                                    activeTab === "persona" ? <textarea className="w-full h-full text-lg font-medium leading-relaxed outline-none resize-none bg-transparent" value={editorContent} onChange={(e) => setEditorContent(e.target.value)} /> : <textarea className="w-full h-full text-sm font-mono leading-relaxed outline-none resize-none text-slate-400 bg-transparent" value={exoBrainContent} onChange={(e) => setExoBrainContent(e.target.value)} />
                                ) : (
                                    <div className="space-y-4">
                                        {bricks.map((brick, idx) => (
                                            <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-xs font-black uppercase tracking-widest">{brick.headline}</span>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => moveBrick(idx, 'up')} className="p-1"><ArrowUp className="w-3 h-3" /></button>
                                                        <button onClick={() => moveBrick(idx, 'down')} className="p-1"><ArrowDown className="w-3 h-3" /></button>
                                                    </div>
                                                </div>
                                                <input className="w-full mb-2 bg-white rounded p-2 text-xs" value={brick.intent_blurb} onChange={e => { const n = [...bricks]; n[idx].intent_blurb = e.target.value; setBricks(n); }} placeholder="Strategic Intent..." />
                                                <textarea className="w-full bg-white rounded p-2 text-[10px] h-20" value={brick.directive} onChange={e => { const n = [...bricks]; n[idx].directive = e.target.value; setBricks(n); }} placeholder="Specialist Directive..." />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {selectedMilestone && (
                            <>
                                <SidecarBlock label="The Purpose" value={purpose} onChange={setPurpose} italic />
                                <SidecarBlock label="PM Checklist" value={checklist} onChange={setChecklist} bold />
                            </>
                        )}
                        {selectedAgent && (
                            <>
                                <SidecarBlock label="Optimization Target" icon={Target} value={optTarget} onChange={setOptTarget} />
                                <SidecarBlock label="Loss Function" icon={AlertCircle} value={lossFunc} onChange={setLossFunc} color="text-red-500" />
                                <SidecarBlock label="Physics Constraints" icon={HardHat} value={physics} onChange={setPhysics} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20"><Database className="w-16 h-16 mb-4" /><p className="text-[10px] font-black uppercase tracking-[0.4em]">Select DNA to Engineer</p></div>
        )}
      </div>
    </div>
  );
}

const SidecarBlock = ({ label, icon: Icon, value, onChange, italic, bold, color = "text-slate-400" }: any) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-slate-300 transition-all text-slate-800">
        <div className="flex items-center gap-2 mb-3">
            {Icon && <Icon className={clsx("w-3 h-3", color)} />}
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</span>
        </div>
        <textarea 
            className={clsx(
                "w-full bg-transparent border-none outline-none resize-none p-0 focus:ring-0 leading-relaxed text-[11px]",
                italic && "italic text-slate-500 font-medium h-24",
                bold && "font-black text-slate-800 h-32",
                !italic && !bold && "font-bold text-slate-800 h-20"
            )}
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder={`Enter ${label}...`}
        />
    </div>
);
