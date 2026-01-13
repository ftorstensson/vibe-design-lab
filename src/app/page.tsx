"use client";

// --- SECTION A: IMPORTS ---
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Mic, ArrowRight, Trash2, FolderOpen } from 'lucide-react';
import { useVibeStore } from '@/store/vibe-store';
import { clsx } from 'clsx';

export default function ProjectLobby() {
  const router = useRouter();
  const { projectList, fetchProjects, deleteProject } = useVibeStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // --- SECTION B: CORE ACTIONS ---
  const startNewProject = () => {
    const id = `proj-${Math.random().toString(36).substr(2, 9)}`;
    router.push(`/project/${id}`);
  };

  const resumeLatest = () => {
    if (projectList.length > 0) {
      router.push(`/project/${projectList[0].thread_id}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
      
      {/* --- SECTION C: HEADER --- */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="font-playfair text-6xl font-black text-slate-900 mb-4 italic tracking-tight">
          Hey Boss.
        </h1>
        <p className="text-slate-400 font-medium text-lg">
          I'm ready to build. What's the vision today?
        </p>
      </div>

      {/* --- SECTION D: MAIN CONTROLS --- */}
      <div className="w-full max-w-xl flex flex-col gap-4 px-6 mb-16">
        <button 
          onClick={startNewProject}
          className="w-full bg-[#249264] hover:bg-[#1c7a52] text-white py-6 rounded-3xl text-xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-green-200 transition-all active:scale-95"
        >
          <Plus className="w-6 h-6" />
          <span>Start New Project</span>
        </button>

        <div className="flex gap-4">
          <button className="flex-1 bg-white border border-slate-100 py-6 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all group shadow-sm">
            <Mic className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Brainstorm</span>
          </button>
          <button 
            onClick={resumeLatest}
            className="flex-1 bg-white border border-slate-100 py-6 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all group shadow-sm"
          >
            <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resume</span>
          </button>
        </div>
      </div>

      {/* --- SECTION E: RECENT PROJECTS --- */}
      <div className="w-full max-w-xl px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Recent Projects</h2>
        </div>
        
        <div className="space-y-2">
          {projectList.length === 0 && (
            <div className="py-12 border-2 border-dashed border-slate-50 rounded-3xl flex flex-col items-center justify-center text-slate-300">
               <FolderOpen className="w-8 h-8 mb-2 opacity-20" />
               <p className="text-xs font-bold uppercase tracking-widest">No projects found</p>
            </div>
          )}
          {projectList.map((p) => (
            <div 
              key={p.thread_id}
              className="group flex items-center justify-between p-6 bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 rounded-[2rem] transition-all cursor-pointer"
              onClick={() => router.push(`/project/${p.thread_id}`)}
            >
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-800 group-hover:text-black transition-colors">{p.project_name}</span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                  Edited {new Date(p.updated_at).toLocaleDateString()}
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteProject(p.thread_id); }}
                aria-label={`Delete project ${p.project_name}`}
                title="Delete project"
                className="p-3 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}