"use client";

// --- SECTION A: IMPORTS ---
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  BarChart3, Users, Zap, ShieldAlert, TrendingUp, 
  ExternalLink, AlertTriangle, Fingerprint, BookOpen, Quote, ChevronDown, ChevronUp, MessageSquare
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useVibeStore } from '@/store/vibe-store';
import { clsx } from 'clsx';

// --- SECTION B: CONFIG ---
const ICON_MAP: Record<string, any> = {
  the_big_idea: Zap,
  market_reality: BarChart3,
  audience_ecosystem: Users,
  content_structure: TrendingUp,
  ux_feasibility: ShieldAlert,
};

// --- SECTION C: THE COMPONENT ---
export const ExecutivePaperNode = ({ id, data }: NodeProps) => {
  const [activeTab, setActiveTab] = useState<'position' | 'appendix'>('position');
  const { setActiveSpecialist, setChatOpen } = useVibeStore();

  const masthead = (data.masthead as string) || "STRATEGY UNIT";
  const headline = (data.headline as string) || "Position Paper";
  const context = (data.context as string) || "";
  const narrative = (data.position_narrative as string) || "";
  const truths = Array.isArray(data.uncomfortable_truths) ? data.uncomfortable_truths : [];
  const risks = Array.isArray(data.risky_assumptions) ? data.risky_assumptions : [];
  const appendix = (data.appendix as any) || {};
  const deptIdString = (data.deptId as string) || "0";

  // --- SECTION D: INTERVIEW ACTION ---
  const handleStartInterview = () => {
    setActiveSpecialist(id); // ID matches the dept_id in the ledger
    setChatOpen(true);
  };

  return (
    <div className="w-[595px] min-h-[842px] bg-white border border-slate-200 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] flex flex-col ring-1 ring-black/5 font-sans relative">
      
      {/* TABS */}
      <div className="absolute -top-12 left-0 flex gap-1 p-1 bg-slate-100/50 backdrop-blur-md rounded-t-xl border border-slate-200 border-b-0">
        <TabButton label="The Position" isActive={activeTab === 'position'} onClick={() => setActiveTab('position')} icon={BookOpen} />
        <TabButton label="The Appendix" isActive={activeTab === 'appendix'} onClick={() => setActiveTab('appendix')} icon={Fingerprint} />
      </div>

      {activeTab === 'position' ? (
        <div className="flex-1 flex flex-col p-16 animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-12">
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">{masthead}</div>
            <div className="text-[9px] font-bold text-slate-300 font-mono tracking-tighter text-right">REF_DEPT_{deptIdString}</div>
          </div>

          <h1 className="font-playfair text-5xl font-black text-slate-900 leading-[1.1] mb-8 italic tracking-tight">{headline}</h1>

          <div className="mb-12 relative border-l-2 border-slate-900 pl-6">
            <p className="text-lg font-medium leading-relaxed text-slate-600 italic">{context}</p>
          </div>

          <div className="text-base text-slate-800 leading-relaxed text-justify space-y-6 mb-16 font-medium prose prose-slate max-w-none">
            <ReactMarkdown>{narrative}</ReactMarkdown>
          </div>

          {/* REALITY CHECK */}
          <div className="mt-auto pt-12 border-t border-slate-100 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4"><Quote className="w-4 h-4 text-slate-900 fill-slate-900" /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Uncomfortable Truths</span></div>
              <div className="space-y-4">
                {truths.map((t, i) => <p key={i} className="text-sm font-bold text-slate-900 leading-snug border-l-2 border-slate-200 pl-4 py-1">{t}</p>)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-4 h-4 text-amber-500" /><span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Risky Assumptions</span></div>
              <div className="flex flex-wrap gap-2">
                {risks.map((r, i) => <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-100">{r}</span>)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col p-16 bg-slate-50 animate-in fade-in duration-500">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-12">SPECIALIST ROUNDTABLE // RAW DATA</div>
          <div className="space-y-12 overflow-y-auto max-h-[700px] pr-4 scrollbar-hide">
            <AppendixSection title="Domain Research" content={appendix.researcher_notes} />
            <AppendixSection title="The Critical Teardown" content={appendix.devils_advocate_teardown} highlight />
            <AppendixSection title="Outside Thinking" content={appendix.outside_thinker_reframing} />
            
            {/* LINK BANK */}
            {appendix.link_bank && (
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Link Bank</h4>
                <div className="flex flex-col gap-2">
                  {appendix.link_bank.map((link: string, i: number) => <a key={i} href={link} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-900 underline flex items-center gap-2 hover:text-blue-600"><ExternalLink className="w-3 h-3" /> {link}</a>)}
                </div>
              </div>
            )}
          </div>

          {/* --- SECTION D: INTERVIEW TRIGGER --- */}
          <div className="mt-auto pt-12">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm group/btn hover:border-slate-900 transition-all cursor-pointer" onClick={handleStartInterview}>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Pillar Action</span>
                <button className="text-xs font-bold text-slate-900 flex items-center gap-2 group-hover/btn:translate-x-1 transition-all">
                    Interview the Specialist <MessageSquare className="w-3 h-3" />
                </button>
            </div>
          </div>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-black w-2.5 h-2.5 border-none" />
      <Handle type="target" position={Position.Top} className="!bg-black w-2.5 h-2.5 border-none" />
    </div>
  );
};

// --- SUB-COMPONENTS ---
const TabButton = ({ label, isActive, onClick, icon: Icon }: any) => (
  <button onClick={onClick} className={clsx("flex items-center gap-2 px-6 py-3 rounded-t-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all", isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}>
    <Icon className="w-3 h-3" /><span>{label}</span>
  </button>
);

const AppendixSection = ({ title, content, highlight = false }: any) => (
  <div className={clsx("p-6 rounded-2xl border", highlight ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-100")}>
    <h4 className={clsx("text-[10px] font-black uppercase tracking-[0.2em] mb-4", highlight ? "text-slate-400" : "text-slate-900")}>{title}</h4>
    <div className={clsx("prose prose-sm max-w-none", highlight ? "prose-invert text-slate-200" : "text-slate-700")}><ReactMarkdown>{content || "No data."}</ReactMarkdown></div>
  </div>
);

export const StrategyNode = ExecutivePaperNode;