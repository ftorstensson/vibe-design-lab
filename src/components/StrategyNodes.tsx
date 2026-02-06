"use client";
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import ReactMarkdown from 'react-markdown';
import { clsx } from 'clsx';

// --- THE BLUEPRINT REGISTRY ---
const BLUEPRINT: Record<string, { summary: {h: string, w: string}[], logic: string[] }> = {
  the_big_idea: {
    summary: [
      { h: "One Sentence Idea", w: "A crystal clear summary of what we are building and who it is for." },
      { h: "The Core Problem", w: "The real-world frustration or pain we are committed to fixing." },
      { h: "How it Makes Money", w: "The simple logic of how the business survives and grows." },
      { h: "What Must Be True", w: "The most important assumptions that have to be right for this to work." }
    ],
    logic: ["1.1: Ideation Process", "1.2: Problem Deep Dive", "1.3: Economic Model", "1.4: Risk Assessment"]
  },
  market_research: {
    summary: [
      { h: "Market Shape & Size", w: "The actual territory we are playing in and how big the opportunity is." },
      { h: "Our Way In", w: "The specific 'door' we will use to get to users before anyone else." },
      { h: "The Competition", w: "Who else is solving this and where they are falling short." },
      { h: "The Gaps", w: "The specific things everyone else is ignoring that we can own." }
    ],
    logic: ["2.1: Raw Market Data", "2.2: Gap Analysis", "2.3: Competitor List", "2.4: Market Timing"]
  },
  audience_mapping: {
    summary: [
      { h: "Who Comes First", w: "The specific group of people we are designing for on day one." },
      { h: "The Trigger Moment", w: "What is happening in someone's life when they realize they need this?" },
      { h: "The Power Players", w: "The people who decide to use it vs. the people who actually use it." },
      { h: "What Success Looks Like", w: "How the user knows the product actually worked for them." }
    ],
    logic: ["3.1: User Research", "3.2: Decision Chains", "3.3: Behavior Triggers", "3.4: Success Metrics"]
  },
  user_experience: {
    summary: [
      { h: "The Comfort Zone (95%)", w: "The standard ways of doing things that people already understand." },
      { h: "The Magic Moment (5%)", w: "The one special thing that will make people remember and love us." },
      { h: "The Hook", w: "Why someone will spend their first 60 seconds with us." },
      { h: "The Habit", w: "Why someone will keep coming back day after day." }
    ],
    logic: ["4.1: Convention Audit", "4.2: Innovation Lab", "4.3: Psychological Loops", "4.4: Player Types"]
  },
  the_mvp: {
    summary: [
      { h: "The Absolute Must-Haves", w: "The smallest possible version we can build that still solves the problem." },
      { h: "The Main Parts", w: "The big building blocks we need to create." },
      { h: "What We Are Not Building", w: "The things we are choosing to ignore for now to stay fast." },
      { h: "Ready to Build", w: "A final check to make sure we have enough info to start designing." }
    ],
    logic: ["5.1: Scope Reduction", "5.2: Technical Logic", "5.3: Feature List", "5.4: Build Roadmap"]
  }
};

export const ExecutivePaperNode = ({ data }: NodeProps) => {
  const content = (data as any);
  const isGhost = content.isGhost;
  const blueprint = BLUEPRINT[content.deptId] || BLUEPRINT['the_big_idea'];
  
  const [activeTab, setActiveTab] = useState<'summary' | 'logic' | 'about'>('summary');
  const appendix = content.appendix || {};

  return (
    <div className="w-[595px] min-h-[842px] bg-white shadow-2xl flex flex-col font-sans relative border-[1px] border-slate-300 border-solid transition-all duration-300">
      
      {/* TABS */}
      <div className="absolute -top-10 left-0 flex gap-1 z-50">
        <TabButton label="Summary" isActive={activeTab === 'summary'} onClick={() => setActiveTab('summary')} />
        <TabButton label="Deep Research" isActive={activeTab === 'logic'} onClick={() => setActiveTab('logic')} />
        <TabButton label="About" isActive={activeTab === 'about'} onClick={() => setActiveTab('about')} />
      </div>

      {/* STATUS INDICATOR */}
      <div className="absolute top-6 right-8 flex items-center gap-2">
        <span className={clsx(
            "w-2 h-2 rounded-full",
            content.status === 'DRAFTING' ? "bg-emerald-500 animate-pulse" : 
            isGhost ? "bg-slate-200" : "bg-black"
        )} />
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            {content.status === 'DRAFTING' ? 'Drafting...' : isGhost ? 'Awaiting Data' : 'Stable'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide bg-white">
        <div className="p-20 pt-16">
            
            {/* PAPER NAME */}
            <div className="text-4xl font-black tracking-tighter text-black mb-12 border-b border-slate-200 pb-8">
                {content.label}
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'about' ? (
                <div className="animate-in fade-in duration-300">
                    <p className="text-xl text-slate-600 leading-relaxed italic font-serif">
                        "This document serves as the ground truth for {content.label}. It locks our decisions so the design and code stay focused on the original vision."
                    </p>
                </div>
            ) : activeTab === 'summary' ? (
                <div className="animate-in fade-in duration-300">
                    {isGhost ? (
                        <div className="space-y-12">
                            {blueprint.summary.map((section, i) => (
                                <div key={i} className="flex flex-col">
                                    <h4 className="text-base font-bold text-black leading-tight">
                                        {section.h}
                                    </h4>
                                    {/* EXPLAINER: Smaller and Tighter */}
                                    <p className="text-[13px] font-normal text-slate-400 leading-tight mt-0.5">
                                        {section.w}
                                    </p>
                                    <p className="font-playfair text-base text-slate-100 italic mt-3">
                                        Awaiting input...
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-bottom-2 duration-500">
                            <h1 className="font-playfair text-[44px] font-black text-black leading-[1.1] mb-12 tracking-tighter italic">
                                {content.headline}
                            </h1>
                            <div className="prose prose-slate max-w-none space-y-12 text-justify text-slate-800 leading-relaxed">
                                <ReactMarkdown>{content.summary_content || "..."}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="animate-in fade-in duration-300">
                    {isGhost ? (
                        <div className="space-y-12">
                             {blueprint.logic.map((header, i) => (
                                <div key={i} className="flex flex-col border-t border-slate-100 pt-8 first:border-0 first:pt-0">
                                    <h4 className="text-base font-bold text-black leading-tight">
                                        {header}
                                    </h4>
                                    <p className="text-[13px] font-normal text-slate-400 mt-0.5">
                                        Specialist logic and evidence.
                                    </p>
                                    <p className="font-playfair text-base text-slate-100 italic mt-3">
                                        Analysis pending...
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="prose prose-slate max-w-none text-slate-700">
                            <ReactMarkdown>{appendix.full_logic || "..."}</ReactMarkdown>
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

const TabButton = ({ label, isActive, onClick }: any) => (
  <button onClick={onClick} className={clsx(
      "px-8 py-3 rounded-t-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-solid border-x-[1px] border-t-[1px]",
      isActive ? "bg-white text-black border-slate-300 z-10 translate-y-[1px]" : "bg-slate-100 text-slate-400 border-transparent hover:text-slate-600"
  )}>
    {label}
  </button>
);

export const StrategyNode = ExecutivePaperNode;