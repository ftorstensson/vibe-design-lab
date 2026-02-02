"use client";
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Target, Zap, TrendingUp, ShieldAlert, BookOpen, Fingerprint, Quote, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clsx } from 'clsx';

export const ExecutivePaperNode = ({ data }: NodeProps) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'appendix'>('summary');
  const content = (data as any);
  const appendix = content.appendix || {};

  return (
    <div className="w-[595px] min-h-[842px] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] flex flex-col font-sans relative group">
      
      {/* TABS */}
      <div className="absolute -top-11 left-0 flex gap-1 z-50">
        <TabButton label="The Brief" isActive={activeTab === 'summary'} onClick={() => setActiveTab('summary')} icon={BookOpen} />
        <TabButton label="Architect Logic" isActive={activeTab === 'appendix'} onClick={() => setActiveTab('appendix')} icon={Fingerprint} />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide bg-white border border-slate-200 ring-1 ring-black/5">
        {activeTab === 'summary' ? (
          <div className="p-20 animate-in fade-in duration-500">
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-12">
                {content.masthead || "VENTURE ARCHITECTURE"}
            </div>

            <h1 className="font-playfair text-[44px] font-black text-slate-900 leading-[1.1] mb-10 tracking-tighter italic">
                {content.headline || "The Strategy Seed"}
            </h1>

            {/* THE SOUL */}
            <div className="mb-12 relative border-l-2 border-slate-900 pl-8 py-2">
                <p className="text-[18px] font-medium leading-relaxed text-slate-600 italic font-serif">
                    {content.soul}
                </p>
            </div>

            {/* THE STRATEGIC BET */}
            <section className="mb-12 bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Target className="w-3 h-3" /> <span>The Strategic Bet</span>
                </div>
                <p className="text-[15px] font-bold text-slate-900 leading-snug">
                    {content.strategic_bet}
                </p>
            </section>

            {/* COMMERCIAL & MARKET WEDGE */}
            <div className="grid grid-cols-1 gap-12 mb-12">
                <div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 mb-4">Commercial Hypotheses</h4>
                    <div className="text-[14px] text-slate-600 leading-relaxed"><ReactMarkdown>{content.commercial_hypotheses}</ReactMarkdown></div>
                </div>
                <div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 mb-4">The Market Wedge</h4>
                    <div className="text-[14px] text-slate-600 leading-relaxed"><ReactMarkdown>{content.market_wedge}</ReactMarkdown></div>
                </div>
            </div>

            {/* NON-GOALS */}
            <div className="pt-12 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-6 opacity-30 uppercase tracking-[0.3em] text-[10px] font-black text-red-600">
                    <XCircle className="w-3 h-3" /> <span>Strategic Sacrifices (Non-Goals)</span>
                </div>
                <div className="space-y-4">
                    {content.non_goals?.map((t: string, i: number) => (
                        <div key={i} className="text-[13px] font-bold text-slate-400 flex gap-4">
                            <span className="font-mono">0{i+1}</span> {t}
                        </div>
                    ))}
                </div>
            </div>
          </div>
        ) : (
          <div className="p-20 bg-slate-50/30 min-h-full animate-in fade-in duration-500">
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-16">
                Technical Intelligence // Architect Strike Team
            </div>

            <div className="space-y-20">
              <AppendixSection title="Visionary Logic (Future Pull)" icon={Zap} content={appendix.visionary_logic} />
              <AppendixSection title="Economic Reality" icon={TrendingUp} content={appendix.commercial_logic} />
              <AppendixSection title="Build Realism" icon={ShieldAlert} content={appendix.realist_logic} />
              <AppendixSection title="Adversarial Tension" icon={Quote} content={appendix.adversarial_tension} highlight />
            </div>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-black w-2.5 h-2.5 border-none" />
      <Handle type="target" position={Position.Top} className="!bg-black w-2.5 h-2.5 border-none" />
    </div>
  );
};

const TabButton = ({ label, isActive, onClick, icon: Icon }: any) => (
  <button onClick={onClick} className={clsx("flex items-center gap-2 px-6 py-3 rounded-t-lg text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-b-0 shadow-sm", isActive ? "bg-white text-slate-900 border-slate-200 z-10" : "bg-slate-50/80 text-slate-400 border-transparent hover:text-slate-600")}>
    <Icon className="w-3 h-3" /> {label}
  </button>
);

const AppendixSection = ({ title, icon: Icon, content, highlight = false }: any) => (
  <div>
    <div className="flex items-center gap-3 mb-6">
        <Icon className={clsx("w-4 h-4", highlight ? "text-red-500" : "text-slate-400")} />
        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">{title}</h4>
    </div>
    <div className={clsx("text-[13.5px] leading-relaxed text-slate-700 font-medium prose prose-slate max-w-none prose-p:mb-4", highlight && "bg-red-50/50 p-8 rounded-2xl border border-red-100/50 italic shadow-inner")}>
      <ReactMarkdown>{content || "Awaiting specialist turn..."}</ReactMarkdown>
    </div>
  </div>
);

export const StrategyNode = ExecutivePaperNode;