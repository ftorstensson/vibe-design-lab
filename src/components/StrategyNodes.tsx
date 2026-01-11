"use client";
import React, { useState } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { ChevronDown, ChevronUp, ScrollText, History, Info, BarChart3, Users, Repeat, Zap, ShieldAlert, TrendingUp, MessageSquare, Layers, LineChart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ICON_MAP: Record<string, any> = {
  landscape: BarChart3,
  growth: TrendingUp,
  audience: Users,
  vibe: Zap,
  message: MessageSquare,
  experience: ShieldAlert,
  loop: Repeat,
  content: Layers,
  metrics: LineChart,
};

export const ExecutivePaperNode = ({ data }: NodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const summary = Array.isArray(data.summary) ? data.summary : [];
  const report = typeof data.report === 'string' ? data.report : "";
  const context = typeof data.context === 'string' ? data.context : "";
  const label = typeof data.label === 'string' ? data.label : "Strategy Paper";
  const deptId = typeof data.deptId === 'string' ? data.deptId : "0";
  const version = typeof data.version === 'string' ? data.version : "1.0";
  
  const IconComponent = ICON_MAP[data.icon as string] || ScrollText;

  return (
    <div className="w-[500px] bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden transition-all ring-1 ring-black/5 font-sans">
      <div className="p-8 border-b border-slate-100 bg-white relative">
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                <IconComponent className="w-3 h-3" />
                <span>Dept {deptId} // Strategy Unit</span>
            </div>
            <div className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-[9px] font-bold text-slate-400 rounded">
                v{version}
            </div>
        </div>
        <h2 className="font-playfair text-3xl font-black text-slate-900 leading-tight mb-4 italic">{label}</h2>
        <p className="text-sm font-medium leading-relaxed text-slate-600 border-l-2 border-slate-900 pl-4 italic">{context}</p>
      </div>

      <div className="p-8 bg-white space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {summary.map((item: string, i: number) => (
            <div key={i} className="flex items-start gap-4 group">
              <span className="text-slate-900 font-black text-xs mt-1">0{i+1}.</span>
              <p className="text-sm font-bold text-slate-800 leading-snug">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 pb-8">
        <button onClick={() => setIsExpanded(!isExpanded)} className="w-full py-4 bg-slate-900 text-white flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg active:scale-[0.98]">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Open Departmental Deep-Dive</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isExpanded && (
            <div className="mt-4 p-6 bg-slate-50 border border-slate-200 rounded-lg animate-in slide-in-from-top-2">
                <div className="prose prose-slate prose-sm max-w-none prose-headings:font-playfair">
                    <ReactMarkdown>{report}</ReactMarkdown>
                </div>
            </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center px-8 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-2"><History className="w-3 h-3" /><span>Version Ledger</span></div>
          <span className="italic underline underline-offset-2">Confidential Agency Document</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-black w-2 h-2 border-none" />
      <Handle type="target" position={Position.Top} className="!bg-black w-2 h-2 border-none" />
    </div>
  );
};

export const StrategyNode = ExecutivePaperNode;