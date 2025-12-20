import React from 'react';
import { GitFork, Play, CircleDot, Square } from 'lucide-react';

export const JourneyToolbar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/props', JSON.stringify({ label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="absolute top-20 left-4 flex flex-col gap-2 z-40 animate-in slide-in-from-left-6">
      
      {/* TOOLKIT CONTAINER */}
      <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col gap-2">
        <div className="pb-2 border-b border-slate-100 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tools</span>
        </div>

        <ToolItem 
            icon={Play} 
            label="Start" 
            color="text-emerald-600"
            onDragStart={(e: React.DragEvent) => onDragStart(e, 'input', 'Start')} 
        />
        <ToolItem 
            icon={Square} 
            label="Action" 
            color="text-slate-700"
            onDragStart={(e: React.DragEvent) => onDragStart(e, 'default', 'Action')} 
        />
        <ToolItem 
            icon={GitFork} 
            label="Decision" 
            color="text-amber-600"
            onDragStart={(e: React.DragEvent) => onDragStart(e, 'decision', 'Decision?')} 
        />
        <ToolItem 
            icon={CircleDot} 
            label="End" 
            color="text-slate-400"
            onDragStart={(e: React.DragEvent) => onDragStart(e, 'output', 'End')} 
        />
      </div>

    </div>
  );
};

// Helper
const ToolItem = ({ icon: Icon, label, color, onDragStart }: any) => (
  <div 
    className="p-3 hover:bg-slate-50 rounded-xl cursor-grab active:cursor-grabbing flex flex-col items-center gap-1 group transition-colors"
    onDragStart={onDragStart}
    draggable
  >
    <Icon className={`w-5 h-5 ${color} transition-transform group-hover:scale-110`} />
    <span className="text-[9px] text-slate-500 font-bold">{label}</span>
  </div>
);