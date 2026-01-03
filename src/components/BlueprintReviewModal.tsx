"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, FileText } from 'lucide-react';

interface BlueprintReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent: string;
  onSave: (content: string) => void;
  title?: string;
}

export default function BlueprintReviewModal({ isOpen, onClose, initialContent, onSave, title = "Review Blueprint" }: BlueprintReviewModalProps) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] border border-slate-200">
        
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-2xl">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="p-2 bg-emerald-100 rounded-lg">
                <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="font-bold text-lg">{title}</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-0 overflow-hidden relative group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-6 text-sm font-mono text-slate-700 bg-slate-50 focus:outline-none focus:bg-white transition-colors resize-none leading-relaxed"
            spellCheck={false}
            aria-label="Strategy Content Editor"
          />
        </div>

        <div className="p-4 border-t border-slate-100 bg-white rounded-b-2xl flex justify-between items-center">
          <span className="text-xs text-slate-400 italic">Review the strategy before committing.</span>
          <div className="flex gap-2">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={() => onSave(content)}
                className="flex items-center gap-2 px-6 py-2 bg-black hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
                <Save className="w-4 h-4" />
                Approve & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}