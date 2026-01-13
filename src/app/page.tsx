"use client";
// --- SECTION A: IMPORTS ---
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MoreVertical, Trash2, Pin } from 'lucide-react';
import { useVibeStore } from '@/store/vibe-store';

export default function ProjectLobby() {
  const router = useRouter();
  const { projectList, fetchProjects, deleteProject, togglePin, initProjectCloud } = useVibeStore();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => { 
    fetchProjects(); 
  }, [fetchProjects]);

  const handleCreate = async () => {
    const id = await initProjectCloud();
    router.push(`/project/${id}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-24 font-sans">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="font-playfair text-6xl font-black text-slate-900 mb-4 italic tracking-tight tracking-tighter">Hey Boss.</h1>
        <p className="text-slate-400 font-medium text-lg tracking-tight">I'm ready to build. What's the vision today?</p>
      </div>

      <div className="w-full max-w-xl flex flex-col gap-4 px-6 mb-20">
        <button onClick={handleCreate} className="w-full bg-[#249264] hover:bg-[#1c7a52] text-white py-6 rounded-3xl text-xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-green-200 transition-all active:scale-95">
          <Plus className="w-6 h-6" /><span>Start New Project</span>
        </button>
      </div>

      <div className="w-full max-w-xl px-6 pb-20">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8 px-4">Recent Projects</h2>
        <div className="space-y-3">
          {projectList.map((p: any) => (
            <div key={p.thread_id} className="group relative flex items-center justify-between p-6 bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 rounded-[2rem] transition-all cursor-pointer" onClick={() => router.push(`/project/${p.thread_id}`)}>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  {p.is_pinned && <Pin className="w-3 h-3 text-blue-500 fill-blue-500" />}
                  {p.project_name}
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Edited {new Date(p.updated_at).toLocaleDateString()}</span>
              </div>
              
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === p.thread_id ? null : p.thread_id); }} 
                  aria-label="Project actions"
                  title="Project actions"
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-slate-300" />
                </button>
                {activeMenu === p.thread_id && (
                  <div className="absolute right-0 top-10 w-48 bg-white border border-slate-100 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200" onMouseLeave={() => setActiveMenu(null)}>
                    <MenuAction icon={Pin} label={p.is_pinned ? "Unpin Project" : "Pin Project"} onClick={() => togglePin(p.thread_id)} />
                    <MenuAction icon={Trash2} label="Delete Project" color="text-red-500" onClick={() => { if (confirm(`Delete "${p.project_name}"?`)) deleteProject(p.thread_id); }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MenuAction = ({ icon: Icon, label, onClick, color = "text-slate-600" }: any) => (
  <button onClick={(e) => { e.stopPropagation(); onClick(); }} className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-slate-50 transition-colors text-xs font-bold ${color}`}>
    <Icon className="w-4 h-4" /><span>{label}</span>
  </button>
);