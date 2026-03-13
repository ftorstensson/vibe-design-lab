"use client";
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
    Target, Zap, TrendingUp, ShieldAlert, BookOpen, 
    Fingerprint, Quote, HelpCircle, MessageSquare 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { clsx } from 'clsx';
const markdownComponents: Components = {
    a: ({ node, ...props }) => (
        <a {...props} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline' />
    ),
};


const BLUEPRINT: Record<string, { summary: {h: string, w: string, field: string}[], logic: {h: string, field: string}[] }> = {
  the_big_idea: {
    summary: [
      { h: "The Insight", w: "The human truth your product is built on.", field: "insight" },
      { h: "The One Sentence", w: "This exists so that ___ can ___ without ___.", field: "one_sentence" },
      { h: "The Problem", w: "The real human or business pain. Why this matters now.", field: "problem" },
      { h: "The Money", w: "Who pays, for what, and why. The value exchange.", field: "money" },
      { h: "What Must Be True", w: "Three to five critical assumptions. Validation targets.", field: "must_be_true" },
      { h: "The Anti-Vision", w: "What this product must never become. Name the trap.", field: "anti_vision" }
    ],
    logic: [
      { h: "Section 1.1: Visionary Architect", field: "architect_logic_a" },
      { h: "Section 1.2: Commercial Lead", field: "architect_logic_b" },
      { h: "Section 1.3: Product Realist", field: "architect_logic_c" }
    ]
  },
  the_opportunity: {
    summary: [
      { h: "The Market", w: "The size and shape of the prize.", field: "market" },
      { h: "The Gap", w: "What nobody is doing well enough.", field: "gap" },
      { h: "The Players", w: "Who owns this space right now.", field: "players" },
      { h: "The Timing", w: "Why now is the right moment.", field: "timing" },
      { h: "The Opportunities", w: "Specific openings to win.", field: "opportunities" },
      { h: "Our Edge", w: "Why we can actually pull this off.", field: "edge" }
    ],
    logic: [
      { h: "Section 2.1: Market Analyst", field: "architect_logic_a" },
      { h: "Section 2.2: Competitive Intel", field: "architect_logic_b" },
      { h: "Section 2.3: Opportunity Mapper", field: "architect_logic_c" }
    ]
  },
  the_people: {
    summary: [
      { h: "Primary Audience", w: "Who we are designing for on day one.", field: "primary_audience" },
      { h: "Secondary Audience", w: "Who else is in the room.", field: "secondary_audience" },
      { h: "The Drivers", w: "What is actually pushing them toward this.", field: "drivers" },
      { h: "The Pain Points", w: "Specific moments where current solutions fail.", field: "pain_points" },
      { h: "The Markers", w: "How to recognize them in the wild.", field: "markers" },
      { h: "Tipping Point Strategy", w: "How we get from 20% to 80% adoption.", field: "tipping_point" }
    ],
    logic: [
      { h: "Section 3.1: Audience Strategist", field: "architect_logic_a" },
      { h: "Section 3.2: Psychographic Analyst", field: "architect_logic_b" },
      { h: "Section 3.3: Adoption Strategist", field: "architect_logic_c" }
    ]
  },
  the_experience: {
    summary: [
      { h: "Overall Experience", w: "The arc from first touch to habit.", field: "overall_arc" },
      { h: "The Hook", w: "Why they don't walk away in 60 seconds.", field: "hook" },
      { h: "The Moments", w: "Critical stages: Discovery, Onboarding, Sharing.", field: "moments" },
      { h: "The Mechanics", w: "Psychological engines (Progress, Mastery, etc).", field: "mechanics" },
      { h: "AI & Automation Layer", w: "Where the product thinks for you.", field: "ai_layer" },
      { h: "Social Proof Engine", w: "How we capture and display activity.", field: "social_proof" },
      { h: "The 5%", w: "The one thing worth remembering.", field: "five_percent" }
    ],
    logic: [
      { h: "Section 4.1: Convention Researcher", field: "architect_logic_a" },
      { h: "Section 4.2: Engagement Specialist", field: "architect_logic_b" },
      { h: "Section 4.3: Social Architect", field: "architect_logic_c" }
    ]
  },
  the_mvp: {
    summary: [
      { h: "The One Thing", w: "What this version does and nothing else.", field: "one_thing" },
      { h: "The Must-Haves", w: "What has to be in version one.", field: "must_haves" },
      { h: "The Cut List", w: "What we are not building yet.", field: "cut_list" },
      { h: "The Success Moment", w: "How we know it's working (observable behavior).", field: "success_moment" },
      { h: "The Build Order", w: "What gets built first.", field: "build_order" },
      { h: "Validation Targets", w: "The assumptions we need to prove.", field: "validation_targets" }
    ],
    logic: [
      { h: "Section 5.1: Scope Architect", field: "architect_logic_a" },
      { h: "Section 5.2: Cut List Enforcer", field: "architect_logic_b" },
      { h: "Section 5.3: Validation Strategist", field: "architect_logic_c" }
    ]
  }
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

const ManifestoRow = ({ label, value }: any) => (
    <div className="flex flex-col gap-1">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">{label}</span>
        <p className="text-xs font-bold text-slate-800 leading-relaxed uppercase tracking-tight">{value || "..."}</p>
    </div>
);

export const ExecutivePaperNode = ({ data }: NodeProps) => {
  const content = (data as any);
  const isGhost = content.isGhost;
  const blueprint = BLUEPRINT[content.deptId] || BLUEPRINT['the_big_idea'];
  
  const [activeTab, setActiveTab] = useState<'summary' | 'logic' | 'about'>('summary');
  const [activeSubTab, setActiveSubTab] = useState<number>(0); 
  const appendix = content.appendix || {};
  const manifesto = content.manifesto || {};

  const specialists = blueprint.logic.map(l => l.h.split(":")[1]?.trim() || l.h);

  return (
    <div className={clsx(
        "w-[595px] min-h-[842px] bg-white shadow-2xl flex flex-col font-sans relative border-[1px] border-slate-300 border-solid transition-all duration-300",
        "select-text cursor-auto"
    )}>
      
      <div className="absolute -top-10 left-0 flex gap-1 z-50">
        <TabButton label="Summary" isActive={activeTab === 'summary'} onClick={() => setActiveTab('summary')} />
        <TabButton label="Deep Research" isActive={activeTab === 'logic'} onClick={() => { setActiveTab('logic'); setActiveSubTab(0); }} />
        <TabButton label="About" isActive={activeTab === 'about'} onClick={() => setActiveTab('about')} />
      </div>

      {/* STATUS & PUSHBACK (ALWAYS VISIBLE) */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <button 
            onClick={() => {
                window.dispatchEvent(new CustomEvent("vibe:pushback", { detail: content.deptId }));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-black transition-all shadow-lg group/btn z-[100]"
            title="Direct Pushback"
        >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-widest">Pushback</span>
        </button>
        <div className="flex items-center gap-2">
            <span className={clsx("w-2 h-2 rounded-full", content.status === 'DRAFTING' ? "bg-emerald-500 animate-pulse" : isGhost ? "bg-slate-200" : "bg-black")} />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                {content.status === 'DRAFTING' ? 'Drafting' : isGhost ? 'Skeleton' : 'Stable'}
            </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide bg-white">
        <div className="px-10 py-16">
            <div className="text-4xl font-black tracking-tighter text-black mb-12 border-b border-slate-200 pb-8 uppercase">{content.label}</div>

            {activeTab === 'about' ? (
                <div className="animate-in fade-in duration-300">
                    <p className="text-xl text-slate-600 leading-relaxed italic font-serif">"This document serves as the ground truth for {content.label}. It locks our decisions so the design and code stay focused on the original vision."</p>
                </div>
            ) : activeTab === 'summary' ? (
                <div className="animate-in fade-in duration-300">
                    {!isGhost && <h1 className="font-playfair text-[44px] font-black text-black leading-[1.1] mb-12 tracking-tighter italic">{content.headline}</h1>}
                    <div className="space-y-12">
                        {blueprint.summary.map((section, i) => (
                            <div key={i} className="flex flex-col">
                                <h4 className="text-base font-bold text-black leading-tight uppercase tracking-widest">{section.h}</h4>
                                <p className="text-[11px] font-normal text-slate-400 leading-tight mt-1">{section.w}</p>
                                <div className="mt-4 prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed">
                                    {content[section.field] ? <ReactMarkdown components={markdownComponents}>{content[section.field]}</ReactMarkdown> : <p className="font-serif text-slate-100 italic">Awaiting input...</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in duration-300">
                    <div className="flex gap-2 border-b border-slate-100 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                        <SubTabButton label="The Brief" isActive={activeSubTab === 0} onClick={() => setActiveSubTab(0)} />
                        {specialists.map((name, i) => <SubTabButton key={i} label={name} isActive={activeSubTab === i + 1} onClick={() => setActiveSubTab(i + 1)} />)}
                    </div>

                    {activeSubTab === 0 ? (
                        <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">The Brief</h4>
                            <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed space-y-4">
                                <p className="font-medium text-slate-900">{manifesto.problem_statement || "Vision pending..."}</p>
                                <p className="text-slate-600">{manifesto.desired_outcome}</p>
                                <p className="text-slate-600 italic border-l-2 border-purple-200 pl-4">{manifesto.magic_differentiator}</p>
                                
                                {manifesto.verbatim_quotes?.length > 0 && (
                                    <div className="pt-6 border-t border-slate-100">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-4">Verbatim Anchors</span>
                                        <div className="space-y-3">
                                            {manifesto.verbatim_quotes.map((q: string, i: number) => <p key={i} className="text-[12px] italic text-slate-500 border-l-4 border-slate-200 pl-4 font-serif">"{q}"</p>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed animate-in fade-in duration-300">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">{specialists[activeSubTab - 1]} // Research</h4>
                            <ReactMarkdown components={markdownComponents}>{appendix[blueprint.logic[activeSubTab - 1].field] || "Analysis pending..."}</ReactMarkdown>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-black w-2.5 h-2.5 border-none" />
      <Handle type="target" position={Position.Top} className="!bg-black w-2.5 h-2.5 border-none" />
    </div>
  );
};

export const StrategyNode = ExecutivePaperNode;