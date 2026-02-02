"use client";
import React from 'react';
import { HardHat, Rocket, Users, Info } from 'lucide-react';
import { clsx } from 'clsx';

export const ProjectAmbition = () => {
  return (
    <div className="p-6 bg-white border-b border-slate-100 space-y-6">
      <div className="flex items-center gap-2 text-slate-400">
        <Rocket className="w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">Project Ambition & DNA</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AmbitionCard 
            label="Build Speed" 
            value="Vibe Coding" 
            desc="AI-First. Logic over Labor." 
            icon={ZapIcon} 
        />
        <AmbitionCard 
            label="Goal" 
            value="Venture Grade" 
            desc="Scale and defensibility." 
            icon={TargetIcon} 
        />
      </div>

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-2 mb-2">
            <Users className="w-3 h-3 text-slate-400" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Team Composition</span>
        </div>
        <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
            Human Director (Creative/Strategy) + Vibe Coder (AI Execution).
            Focus: High-complexity, logic-driven systems.
        </p>
      </div>
    </div>
  );
};

const ZapIcon = () => <Zap className="w-4 h-4 text-amber-500" />;
const TargetIcon = () => <Rocket className="w-4 h-4 text-purple-500" />;

const AmbitionCard = ({ label, value, desc, icon: Icon }: any) => (
    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-slate-300 transition-all cursor-default">
        <Icon />
        <div className="mt-3">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{label}</span>
            <span className="text-xs font-bold text-slate-900 block">{value}</span>
            <span className="text-[9px] text-slate-500 leading-tight mt-1 block">{desc}</span>
        </div>
    </div>
);

import { Zap, Target } from 'lucide-react';