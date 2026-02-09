"use client";
import React from 'react';
import { X, Database, Terminal } from 'lucide-react';
import { useVibeStore } from '@/store/vibe-store';

export const ContextInspector = () => {
  const { isInspectorOpen, setInspectorOpen, lastWorldview } = useVibeStore();

  if (!isInspectorOpen) return null;

  return (
    <div className="fixed inset-y-0 right-[450px] w-[600px] bg-slate-900 shadow-2xl z-[80] flex flex-col animate-in slide-in-from-right duration-300 border-l border-white/10 font-mono text-[11px]">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/50">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white uppercase tracking-widest text-[10px]">Strategic Worldview Inspector</span>
        </div>
        <button 
          onClick={() => setInspectorOpen(false)}
          aria-label="Close Inspector"
          title="Close Inspector"
          className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 scrollbar-hide text-emerald-400/80 leading-relaxed">
        {lastWorldview ? (
            <pre className="whitespace-pre-wrap">
                {JSON.stringify(lastWorldview, null, 2)}
            </pre>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                <Database className="w-12 h-12 mb-4" />
                <p>No worldview data captured yet.</p>
                <p className="mt-1">Send a message to see the logic payload.</p>
            </div>
        )}
      </div>

      <div className="p-4 bg-black/50 border-t border-white/10 text-[9px] text-slate-500 uppercase tracking-widest flex justify-between">
        <span>Ground Truth Layer: Strategy</span>
        <span>Snowball State: v2.9</span>
      </div>
    </div>
  );
};