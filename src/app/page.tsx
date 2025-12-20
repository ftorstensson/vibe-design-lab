"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Plus, Mic, ArrowRight, User } from "lucide-react";
import { clsx } from "clsx";

export default function Lobby() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);

  const startProject = () => {
    // In V2, we would create the project ID in backend first
    const newId = `proj-${Date.now()}`;
    router.push(`/project/${newId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HEADER */}
      <header className="p-4 flex justify-between items-center bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800">The Design Lab</span>
        </div>
        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
            <User className="w-4 h-4" />
        </div>
      </header>

      {/* HERO SECTION (The Strategist) */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 max-w-lg mx-auto w-full">
        
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Hey Boss.</h1>
            <p className="text-slate-500">I'm ready to build. What's the vision today?</p>
        </div>

        {/* INPUT / ACTION */}
        <div className="w-full space-y-4">
            
            <button 
                onClick={startProject}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
            >
                <Plus className="w-6 h-6" />
                Start New Project
            </button>

            <div className="grid grid-cols-2 gap-4">
                <button className="py-4 bg-white border border-slate-200 rounded-2xl font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-2">
                    <Mic className="w-5 h-5 text-purple-500" />
                    <span className="text-xs">Brainstorm</span>
                </button>
                <button className="py-4 bg-white border border-slate-200 rounded-2xl font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-2">
                    <ArrowRight className="w-5 h-5 text-blue-500" />
                    <span className="text-xs">Resume</span>
                </button>
            </div>

        </div>

        {/* RECENT PROJECTS LIST */}
        <div className="w-full pt-8 border-t border-slate-200">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Projects</h2>
            <div className="space-y-2">
                {["Umami Cookbook", "Pizza Drone Fleet", "Vibe Coder v2"].map((p, i) => (
                    <div key={i} className="p-4 bg-white rounded-xl border border-slate-100 flex justify-between items-center cursor-pointer hover:border-emerald-200 transition-colors" onClick={() => router.push(`/project/demo-${i}`)}>
                        <span className="font-medium text-slate-700">{p}</span>
                        <span className="text-xs text-slate-400">Edited 2h ago</span>
                    </div>
                ))}
            </div>
        </div>

      </main>
    </div>
  );
}