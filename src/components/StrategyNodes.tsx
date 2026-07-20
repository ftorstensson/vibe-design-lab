"use client";
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Target, Zap, TrendingUp, ShieldAlert, BookOpen, MessageSquare, ExternalLink, Award, FileText, Code, Quote } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { clsx } from 'clsx';
import { useVibeStore } from '@/store/vibe-store';

const washLink = (url: string) => {
    if (!url) return "#";
    const match = url.match(/\((https?:\/\/[^\)]+)\)/);
    return match ? match[1] : url;
};

const markdownComponents: Components = {
    a: ({ node, ...props }) => (
        <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />
    ),
};

const TabButton = ({ label, isActive, onClick }: any) => (
  <button onClick={onClick} className={clsx(
      "px-8 py-3 rounded-t-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-solid border-x-[1px] border-t-[1px]",
      isActive ? "bg-white text-black border-slate-300 z-10 translate-y-[1px]" : "bg-slate-100 text-slate-400 border-transparent hover:text-slate-600"
  )}>
    {label}
  </button>
);

const SubTabButton = ({ label, isActive, onClick }: any) => (
    <button onClick={onClick} className={clsx(
        "text-[9px] font-bold uppercase tracking-widest whitespace-nowrap px-3 py-1.5 rounded transition-all border",
        isActive ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white text-slate-400 border-slate-100 hover:text-slate-900 hover:border-slate-300"
    )}>{label}</button>
);

export const ExecutivePaperNode = ({ data }: NodeProps) => {
  const content = (data as any);
  const isGhost = content.isGhost;
  const { milestoneRegistry } = useVibeStore();
  
  const mDef = milestoneRegistry.find(m => m.milestone_id === content.deptId);
  const bricks = mDef?.research_architecture?.filter(b => !b.is_archived) || [];

  const [activeTab, setActiveTab] = useState<'summary' | 'logic' | 'about'>('summary');
  const [activeSubTab, setActiveSubTab] = useState<number>(0); 
  
  // v32.0 Structured Trail Data
  const paperBrief = content.brief || {};
  const paperAppendix = content.appendix || [];
  
  // Aggregate all sources for the 'Sources' tab
  const allSources: any[] = [];
  paperAppendix.forEach((spec: any) => {
      if (spec.sources) {
          Object.values(spec.sources).forEach(s => allSources.push(s));
      }
  });

  if (milestoneRegistry.length === 0) {
      return (
          <div className="w-[595px] h-[842px] bg-white border border-slate-200 flex items-center justify-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 animate-pulse">Hydrating Architecture...</span>
          </div>
      );
  }

  return (
    <div className="w-[595px] min-h-[842px] bg-white shadow-2xl flex flex-col font-sans relative border-[1px] border-slate-300 border-solid transition-all duration-300">
      <div className="absolute -top-10 left-0 flex gap-1 z-50">
        <TabButton label="Summary" isActive={activeTab === 'summary'} onClick={() => setActiveTab('summary')} />
        <TabButton label="Deep Research" isActive={activeTab === 'logic'} onClick={() => { setActiveTab('logic'); setActiveSubTab(0); }} />
        <TabButton label="About" isActive={activeTab === 'about'} onClick={() => setActiveTab('about')} />
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-3">
        <button onClick={() => window.dispatchEvent(new CustomEvent("vibe:pushback", { detail: content.deptId }))} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-black shadow-lg">
            <MessageSquare className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-widest">Pushback</span>
        </button>
        <div className="flex items-center gap-2">
            <span className={clsx("w-2.5 h-2.5 rounded-full", content.status === 'STABLE' ? "bg-black" : "bg-emerald-500 animate-pulse")} />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{content.status || 'Skeleton'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide bg-white px-10 py-16">
        <div className="text-4xl font-black tracking-tighter text-black mb-12 border-b border-slate-200 pb-8 uppercase">{content.label}</div>

        {activeTab === 'summary' ? (
            <div className="animate-in fade-in duration-300">
                {!isGhost && <h1 className="font-playfair text-[44px] font-black text-black leading-[1.1] mb-12 tracking-tighter italic">{content.headline || "Unbaptized Vision"}</h1>}
                <div className="space-y-12">
                    {bricks.map((brick, i) => {
                        const brickVal = (content.content && content.content[brick.id]) || content[brick.id];
                        return (
                        <div key={i} className="flex flex-col">
                            <h4 className="text-base font-bold text-black leading-tight uppercase tracking-widest">{brick.headline}</h4>
                            <p className="text-[11px] font-normal text-slate-400 leading-tight mt-1">{brick.intent_blurb}</p>
                            <div className="mt-4 prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed">
                                {brickVal ? (
                                    typeof brickVal === 'object' ? (
                                        <pre className="text-[10px] font-mono leading-tight bg-slate-50 p-3 rounded border border-slate-100 overflow-auto">{JSON.stringify(brickVal, null, 2)}</pre>
                                    ) : (
                                        <ReactMarkdown components={markdownComponents}>{brickVal}</ReactMarkdown>
                                    )
                                ) : (
                                    <p className="font-serif text-slate-100 italic">Awaiting strategic input...</p>
                                )}
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        ) : activeTab === 'logic' ? (
            <div className="animate-in fade-in duration-300">
                <div className="flex gap-2 border-b border-slate-100 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    <SubTabButton label="The Brief" isActive={activeSubTab === 0} onClick={() => setActiveSubTab(0)} />
                    {paperAppendix.map((spec: any, i: number) => (
                        <SubTabButton key={i} label={spec.role.split(' ')[0]} isActive={activeSubTab === i + 1} onClick={() => setActiveSubTab(i + 1)} />
                    ))}
                    <SubTabButton label="Sources" isActive={activeSubTab === 99} onClick={() => setActiveSubTab(99)} />
                </div>
                
                {activeSubTab === 0 ? (
                    <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed space-y-8">
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">The High-Fidelity Brief</h4>
                            <ReactMarkdown components={markdownComponents}>{paperBrief.identity_narrative || "Vision pending..."}</ReactMarkdown>
                        </div>
                        {paperBrief.founding_voice?.length > 0 && (
                            <div className="pt-8 border-t border-slate-100 space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">The Founding Voice</h4>
                                {paperBrief.founding_voice.map((quote: string, i: number) => (
                                    <div key={i} className="flex gap-4 items-start italic text-slate-500 font-serif">
                                        <Quote className="w-4 h-4 text-slate-200 shrink-0 mt-1" />
                                        <span>"{quote}"</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : activeSubTab === 99 ? (
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verified Evidence Chest</h4>
                        {allSources.length > 0 ? allSources.map((s: any, idx: number) => (
                            <a key={idx} href={washLink(s.url)} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-all">
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                                <span className="text-[11px] font-bold text-slate-700">{s.title}</span>
                            </a>
                        )) : <p className="font-serif text-slate-200 italic">No sources cited in this turn.</p>}
                    </div>
                ) : (
                    <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed animate-in fade-in duration-300">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">{paperAppendix[activeSubTab - 1]?.role} // ELI Report</h4>
                        <ReactMarkdown components={markdownComponents}>{paperAppendix[activeSubTab - 1]?.content || "Analysis pending..."}</ReactMarkdown>
                    </div>
                )}
            </div>
        ) : (
            <div className="animate-in fade-in duration-300 italic font-serif text-xl text-slate-600 leading-relaxed">"{mDef?.purpose || "Ground Truth for the vision."}"</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-black w-2.5 h-2.5 border-none" />
      <Handle type="target" position={Position.Top} className="!bg-black w-2.5 h-2.5 border-none" />
    </div>
  );
};

export const StrategyNode = ExecutivePaperNode;
