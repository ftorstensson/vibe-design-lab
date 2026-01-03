"use client";
import React from 'react';
import { useVibeStore } from '@/store/vibe-store';
import { Edit2 } from 'lucide-react';

export default function StrategyView({ onEdit }: { onEdit: () => void }) {
  const { strategyDoc } = useVibeStore();

  return (
    <div className="w-full h-full bg-slate-50 overflow-y-auto p-8 flex justify-center">
      <div className="max-w-3xl w-full bg-white min-h-[80vh] shadow-sm border border-slate-200 rounded-xl p-12 relative group">
        
        <button 
            onClick={onEdit}
            className="absolute top-8 right-8 p-3 rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all opacity-0 group-hover:opacity-100"
            title="Edit Strategy"
            aria-label="Edit Strategy"
        >
            <Edit2 className="w-4 h-4" />
        </button>

        <div className="prose prose-slate max-w-none">
            {strategyDoc.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-black tracking-tight mb-6 mt-2 text-slate-900">{line.replace('# ', '')}</h1>
                if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-slate-800 border-b border-slate-100 pb-2">{line.replace('## ', '')}</h2>
                if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-6 mb-3 text-slate-800">{line.replace('### ', '')}</h3>
                // FIX: Use div instead of li to avoid validation error
                if (line.startsWith('- ')) return (
                    <div key={i} className="ml-4 flex items-start gap-2 mb-1 text-slate-600">
                        <span className="text-emerald-500 mt-1.5">•</span>
                        <span>{line.replace('- ', '')}</span>
                    </div>
                );
                if (line.trim() === '') return <div key={i} className="h-4" />
                return <p key={i} className="text-slate-600 leading-relaxed mb-2">{line}</p>
            })}
        </div>

      </div>
    </div>
  );
}