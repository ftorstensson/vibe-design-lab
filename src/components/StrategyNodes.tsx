"use client";

// --- SECTION A: IMPORTS ---
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Search, AlertTriangle, Zap, TrendingUp, ShieldAlert, 
  HelpCircle, ExternalLink, BookOpen, Fingerprint, Quote
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clsx } from 'clsx';

// --- SECTION B: THE COMPONENT ---
export const ExecutivePaperNode = ({ data }: NodeProps) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'appendix'>('summary');

  const content = (data as any);
  const appendix = content.appendix || {};

  return (
    <div className="w-[595px] min-h-[842px] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] flex flex-col font-sans relative group">
      
      {/* --- SECTION C: EXTERNAL TABS (TOP-LEFT) --- */}
      <div className="absolute -top-11 left-0 flex gap-1 z-50">
        <TabButton label="Summary" isActive={activeTab === 'summary'} onClick={() => setActiveTab('summary')} icon={BookOpen} />
        <TabButton label="Appendix" isActive={activeTab === 'appendix'} onClick={() => setActiveTab('appendix')} icon={Fingerprint} />
      </div>

      {/* --- SECTION D: EDITORIAL CONTENT --- */}
      <div className="flex-1 overflow-y-auto scrollbar-hide bg-white border border-slate-200 ring-1 ring-black/5">
        
        {activeTab === 'summary' ? (
          <div className="p-20 animate-in fade-in duration-500">
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-12">
                {content.masthead || "STRATEGY UNIT"}
            </div>

            <h1 className="font-playfair text-[44px] font-black text-slate-900 leading-[1.1] mb-10 tracking-tighter italic">
                {content.headline || "Position Paper"}
            </h1>

            <div className="mb-12 relative border-l-2 border-slate-900 pl-8 py-2">
                <p className="text-[18px] font-medium leading-relaxed text-slate-600 italic font-serif">
                    {content.context}
                </p>
            </div>

            <div className="text-[14px] text-slate-800 leading-[1.8] text-justify space-y-8 mb-20 font-medium prose prose-slate max-w-none">
                <ReactMarkdown>{content.summary_content || "Authoring executive summary..."}</ReactMarkdown>
            </div>

            <div className="pt-12 border-t border-slate-100 space-y-12">
                <div>
                    <div className="flex items-center gap-2 mb-6 opacity-30 uppercase tracking-[0.3em] text-[10px] font-black">
                        <Quote className="w-3 h-3" /> <span>Uncomfortable Truths</span>
                    </div>
                    <div className="space-y-6">
                        {content.uncomfortable_truths?.map((t: string, i: number) => (
                            <div key={i} className="text-[15px] font-bold text-slate-900 leading-snug flex gap-4">
                                <span className="text-slate-200 font-mono">0{i+1}</span> {t}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="p-20 bg-slate-50/30 min-h-full animate-in fade-in duration-500">
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-16">
                Technical Intelligence // Multi-Agent Loop
            </div>

            <div className="space-y-20">
              <AppendixSection title="Domain Research" icon={Search} content={appendix.domain_research} />
              <AppendixSection title="The Critical Teardown" icon={AlertTriangle} content={appendix.critical_teardown} highlight />
              <AppendixSection title="Lateral Reframing" icon={Zap} content={appendix.lateral_reframing} />
              <AppendixSection title="Value Leverage" icon={TrendingUp} content={appendix.opportunity_scout} />
              <AppendixSection title="Build Constraints" icon={ShieldAlert} content={appendix.build_constraints} />
              <AppendixSection title="Synthesis Logic" icon={HelpCircle} content={appendix.synthesis_logic} />
              
              {appendix.link_bank && (
                <div className="pt-8 border-t border-slate-200">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Source Index</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {appendix.link_bank.map((link: string, i: number) => (
                      <a key={i} href={link} target="_blank" rel="noreferrer" className="text-[12px] font-bold text-slate-900 underline flex items-center gap-2 hover:text-blue-600 truncate italic">
                        <ExternalLink className="w-3 h-3" /> {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-black w-2.5 h-2.5 border-none" />
      <Handle type="target" position={Position.Top} className="!bg-black w-2.5 h-2.5 border-none" />
    </div>
  );
};

// --- SUB-COMPONENTS ---
const TabButton = ({ label, isActive, onClick, icon: Icon }: any) => (
  <button 
    onClick={onClick} 
    className={clsx(
        "flex items-center gap-2 px-6 py-3 rounded-t-lg text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-b-0 shadow-sm",
        isActive ? "bg-white text-slate-900 border-slate-200 z-10" : "bg-slate-50/80 text-slate-400 border-transparent hover:text-slate-600"
    )}
  >
    <Icon className="w-3 h-3" />
    {label}
  </button>
);

const AppendixSection = ({ title, icon: Icon, content, highlight = false }: any) => (
  <div>
    <div className="flex items-center gap-3 mb-6">
        <Icon className={clsx("w-4 h-4", highlight ? "text-red-500" : "text-slate-400")} />
        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">{title}</h4>
    </div>
    <div className={clsx(
        "text-[13.5px] leading-relaxed text-slate-700 font-medium prose prose-slate max-w-none prose-p:mb-4",
        highlight && "bg-red-50/50 p-8 rounded-2xl border border-red-100/50 italic shadow-inner"
    )}>
      <ReactMarkdown>{content || "Awaiting specialist turn..."}</ReactMarkdown>
    </div>
  </div>
);

export const StrategyNode = ExecutivePaperNode;