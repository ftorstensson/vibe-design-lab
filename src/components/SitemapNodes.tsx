"use client";
import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { ChevronDown, ChevronUp, Plus, X, Target, Info } from 'lucide-react'; // Added missing imports
import { clsx } from 'clsx';

// Shared Handle Style (Solid Black, High Visibility)
const handleCommon = { width: 10, height: 10, background: '#000', border: 'none', zIndex: 50 };

// --- EDITABLE LABEL ---
const EditableLabel = ({ id, label, field, className, placeholder }: { id: string, label: string, field: string, className?: string, placeholder?: string }) => {
  const { setNodes } = useReactFlow();
  const [text, setText] = useState(label);
  useEffect(() => { setText(label); }, [label]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    setNodes((nodes) => nodes.map(n => {
      if (n.id === id) {
        return { ...n, data: { ...n.data, [field]: text } };
      }
      return n;
    }));
  };

  return (
    <input 
        className={clsx("bg-transparent outline-none w-full border-none p-0 focus:ring-0 cursor-text pointer-events-auto", className)}
        value={text}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label={`Edit ${field}`}
    />
  );
};

// --- EDITABLE LIST ---
const EditableList = ({ id, items }: { id: string, items: string[] }) => {
  const { setNodes } = useReactFlow();
  
  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setNodes((nodes) => nodes.map(n => n.id === id ? { ...n, data: { ...n.data, content: newItems } } : n));
  };

  const addItem = () => {
    const newItems = [...items, "New Item"];
    setNodes((nodes) => nodes.map(n => n.id === id ? { ...n, data: { ...n.data, content: newItems } } : n));
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setNodes((nodes) => nodes.map(n => n.id === id ? { ...n, data: { ...n.data, content: newItems } } : n));
  };

  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1 group/item">
          <span className="text-[10px] font-bold text-slate-400 mr-1">{i + 1}.</span>
          <input 
            className="text-xs bg-transparent border-b border-transparent focus:border-black outline-none w-full font-mono text-slate-700"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            aria-label={`Edit Item ${i + 1}`}
          />
          <button 
            onClick={() => removeItem(i)} 
            className="opacity-0 group-hover/item:opacity-100 p-0.5 hover:bg-slate-200 rounded"
            aria-label="Remove Item"
          >
            <X className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      ))}
      <button 
        onClick={addItem}
        className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-black mt-2 uppercase tracking-wider"
      >
        + Add Content
      </button>
    </div>
  );
};

// 1. RICH PAGE CARD (Clean Header)
export const PageNode = ({ id, data }: NodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const template = typeof data.template === 'string' ? data.template : "VIEW";
  const label = typeof data.label === 'string' ? data.label : "UNTITLED";
  const contentList = Array.isArray(data.content) ? data.content : [];
  const goal = typeof data.goal === 'string' ? data.goal : null;
  
  const isContext = template.toLowerCase().includes('sheet') || template.toLowerCase().includes('modal');

  return (
    <div className={clsx(
        "relative w-64 bg-white border-[2px] shadow-sm transition-all group hover:shadow-lg flex flex-col overflow-visible",
        "rounded-lg",
        isContext ? "border-dashed border-slate-600" : "border-black"
    )}>
      
      {/* HEADER: Clean, Title Only */}
      <div className="p-3 border-b-[2px] border-black bg-white flex items-center justify-between">
        <div className="flex flex-col w-full">
            <EditableLabel 
                id={id} 
                label={label} 
                field="label" 
                className="font-bold text-sm text-black uppercase tracking-tight"
            />
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-black hover:bg-slate-100 p-1 rounded">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* BODY */}
      {isExpanded && (
          <div className="p-3 bg-white min-h-[80px]">
            <EditableList id={id} items={contentList} />
            
            {/* FOOTER */}
            {goal && (
                <div className="mt-4 pt-2 border-t border-slate-200">
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Goal</span>
                     <EditableLabel 
                        id={id} 
                        label={goal} 
                        field="goal" 
                        className="text-[10px] text-slate-600 italic w-full"
                    />
                </div>
            )}
          </div>
      )}
      
      {/* 4-WAY HANDLES (Solid Black) */}
      <Handle type="source" position={Position.Top} id="top" style={{ ...handleCommon, top: -5 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ ...handleCommon, right: -5 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ ...handleCommon, bottom: -5 }} />
      <Handle type="source" position={Position.Left} id="left" style={{ ...handleCommon, left: -5 }} />
    </div>
  );
};

// 2. PURPOSE NODE (The "Dot")
export const PurposeNode = ({ id, data }: NodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const label = typeof data.label === 'string' ? data.label : "Category Purpose";

  return (
    <div className="relative flex items-center justify-center">
      {/* The Dot (High Contrast) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
            "w-6 h-6 rounded-full border-2 border-black flex items-center justify-center cursor-pointer transition-all z-10",
            isOpen ? "bg-black text-white" : "bg-black text-white hover:scale-110"
        )}
      >
        <Info className="w-3 h-3" />
      </div>

      {/* The Expansion (Popover) */}
      {isOpen && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 bg-white border-2 border-black rounded-lg p-2 shadow-xl z-20 animate-in slide-in-from-top-2 fade-in">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Purpose</span>
            <EditableLabel 
                id={id} 
                label={label} 
                field="label" 
                className="text-xs font-medium text-black leading-tight"
                placeholder="Why does this exist?"
            />
        </div>
      )}

      {/* Pass-through Handles */}
      <Handle type="target" position={Position.Top} style={{ ...handleCommon, top: -6, opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ ...handleCommon, bottom: -6, opacity: 0 }} />
    </div>
  );
};