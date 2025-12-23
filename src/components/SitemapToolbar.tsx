import React from 'react';
import { FileText, CircleDot } from 'lucide-react';

export const SitemapToolbar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/props', JSON.stringify({ label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="absolute top-20 left-4 flex flex-col gap-2 z-40 animate-in slide-in-from-left-6">
      
      <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col gap-2">
        <div className="pb-2 border-b border-slate-100 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sitemap</span>
        </div>

        <ToolItem 
            icon={FileText} 
            label="Page" 
            color="text-slate-900"
            onDragStart={(e: React.DragEvent) => onDragStart(e, 'page', 'New Page')} 
        />
        
        <ToolItem 
            icon={CircleDot} 
            label="Purpose" 
            color="text-emerald-600"
            onDragStart={(e: React.DragEvent) => onDragStart(e, 'purpose', 'Purpose...')} 
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