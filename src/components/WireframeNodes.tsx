"use client";
import React, { useState, useEffect } from 'react';
import { NodeProps, useReactFlow, NodeResizer } from '@xyflow/react';
import { 
  Menu, ChevronLeft, Search, Home, User, Bell, 
  Plus, ExternalLink, Check, Play, MapPin, Image as ImageIcon,
  ChevronRight, ChevronDown // <--- ADDED THIS IMPORT
} from 'lucide-react';
import { clsx } from 'clsx';

// --- SHARED UTILS ---

const Resizer = ({ isVisible = false, minWidth = 40, minHeight = 20 }) => (
    <NodeResizer 
        isVisible={isVisible} 
        minWidth={minWidth} 
        minHeight={minHeight} 
        handleStyle={{ width: 8, height: 8, borderRadius: 0, border: '1px solid black', background: 'white' }}
        lineStyle={{ border: '1px dashed #000' }}
    />
);

const EditableLabel = ({ id, label, className, multiline = false }: { id: string, label: string, className?: string, multiline?: boolean }) => {
  const { setNodes } = useReactFlow();
  const [text, setText] = useState(label);
  useEffect(() => { setText(label); }, [label]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    setNodes((nodes) => nodes.map(n => n.id === id ? { ...n, data: { ...n.data, label: text } } : n));
  };

  if (multiline) {
      return (
        <textarea 
            className={clsx("bg-transparent outline-none w-full border-none p-0 focus:ring-0 cursor-text pointer-events-auto resize-none", className)}
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-label="Edit text"
        />
      );
  }

  return (
    <input 
        className={clsx("bg-transparent outline-none w-full border-none p-0 focus:ring-0 cursor-text pointer-events-auto text-center font-mono", className)}
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label="Edit text"
    />
  );
};

// =============================================================================
// BATCH 1: NAVIGATION & ACTIONS
// =============================================================================

export const HeaderNode = ({ id, data, selected }: NodeProps) => {
  return (
    <div className="w-full h-full bg-white border-b-[3px] border-black flex items-center justify-between px-4 min-w-[200px] min-h-[50px]">
      <Resizer isVisible={!!selected} minWidth={200} minHeight={40} />
      <ChevronLeft className="w-6 h-6 text-black" />
      <div className="flex-1">
        <EditableLabel id={id} label={data.label as string || "PAGE TITLE"} className="font-bold text-lg text-black uppercase tracking-widest" />
      </div>
      <Menu className="w-6 h-6 text-black" />
    </div>
  );
};

export const TabBarNode = ({ id, data, selected }: NodeProps) => {
    return (
      <div className="w-full h-full bg-white border-t-[3px] border-black flex items-center justify-around px-2 min-w-[200px] min-h-[60px]">
        <Resizer isVisible={!!selected} minWidth={200} minHeight={50} />
        <Home className="w-6 h-6 text-black" />
        <Search className="w-6 h-6 text-slate-400" />
        <Bell className="w-6 h-6 text-slate-400" />
        <User className="w-6 h-6 text-slate-400" />
      </div>
    );
};

export const SearchBarNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-full h-full min-w-[150px] min-h-[40px] bg-white border-[2px] border-black flex items-center px-3 gap-2">
            <Resizer isVisible={!!selected} />
            <Search className="w-4 h-4 text-black" />
            <EditableLabel id={id} label={data.label as string || "Search..."} className="text-sm text-slate-500 text-left italic" />
        </div>
    );
};

export const PrimaryButtonNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-full h-full bg-black flex items-center justify-center px-4 min-w-[100px] min-h-[40px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
            <Resizer isVisible={!!selected} />
            <EditableLabel id={id} label={data.label as string || "ACTION"} className="font-bold text-sm text-white uppercase tracking-wider" />
        </div>
    );
};

export const SecondaryButtonNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-full h-full bg-white border-[2px] border-black flex items-center justify-center px-4 min-w-[100px] min-h-[40px]">
            <Resizer isVisible={!!selected} />
            <EditableLabel id={id} label={data.label as string || "CANCEL"} className="font-bold text-sm text-black uppercase tracking-wider" />
        </div>
    );
};

export const FABNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-full h-full min-w-[50px] min-h-[50px] bg-black rounded-full flex items-center justify-center shadow-lg">
            <Resizer isVisible={!!selected} minWidth={40} minHeight={40} />
            <Plus className="w-8 h-8 text-white" />
        </div>
    );
};

export const LinkNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-auto h-auto min-w-[50px] min-h-[20px] flex items-center justify-center border-b-[2px] border-black pb-0.5">
            <Resizer isVisible={!!selected} />
            <EditableLabel id={id} label={data.label as string || "Read More"} className="font-bold text-sm text-black" />
            <ExternalLink className="w-3 h-3 text-black ml-1" />
        </div>
    );
};

// =============================================================================
// BATCH 2: INPUTS & FORMS
// =============================================================================

export const InputFieldNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-full h-full min-w-[150px] min-h-[50px] flex flex-col justify-start">
            <Resizer isVisible={!!selected} />
            <div className="text-[10px] font-bold text-black mb-1 ml-1 uppercase tracking-wider">LABEL</div>
            <div className="w-full flex-1 bg-white border-[2px] border-black flex items-center px-3">
                <EditableLabel id={id} label={data.label as string || "Placeholder..."} className="text-sm text-slate-400 text-left font-mono" />
            </div>
        </div>
    );
};

export const TextAreaNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-full h-full min-w-[150px] min-h-[80px] flex flex-col justify-start">
            <Resizer isVisible={!!selected} />
            <div className="text-[10px] font-bold text-black mb-1 ml-1 uppercase tracking-wider">MESSAGE</div>
            <div className="w-full flex-1 bg-white border-[2px] border-black p-2">
                <EditableLabel id={id} label={data.label as string || "Type here..."} className="text-sm text-slate-400 text-left font-mono h-full" multiline />
            </div>
        </div>
    );
};

export const CheckboxNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-full h-full min-w-[150px] min-h-[30px] flex items-center gap-3">
            <Resizer isVisible={!!selected} />
            <div className="w-6 h-6 border-[2px] border-black flex items-center justify-center bg-white">
                <Check className="w-4 h-4 text-black" />
            </div>
            <EditableLabel id={id} label={data.label as string || "Accept Terms"} className="text-sm font-bold text-black text-left" />
        </div>
    );
};

export const SwitchNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-[50px] h-[30px] border-[2px] border-black rounded-full flex items-center px-1 bg-black">
            <Resizer isVisible={!!selected} />
            <div className="w-5 h-5 bg-white rounded-full ml-auto" />
        </div>
    );
};

// =============================================================================
// BATCH 3: MEDIA
// =============================================================================

export const ImageNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-full h-full min-w-[100px] min-h-[100px] bg-slate-50 border-[2px] border-black flex flex-col items-center justify-center relative overflow-hidden">
            <Resizer isVisible={!!selected} />
            <svg className="absolute inset-0 w-full h-full text-slate-300 pointer-events-none" strokeWidth="2">
                <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" />
                <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" />
            </svg>
            <div className="z-10 bg-white border-2 border-black px-2 py-1 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-black" />
                <span className="text-xs font-bold text-black uppercase">IMG</span>
            </div>
        </div>
    );
};

export const AvatarNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-full h-full min-w-[50px] min-h-[50px] bg-slate-200 border-[2px] border-black rounded-full flex items-center justify-center">
            <Resizer isVisible={!!selected} />
            <User className="w-1/2 h-1/2 text-black" />
        </div>
    );
};

export const VideoNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-full h-full min-w-[150px] min-h-[100px] bg-black border-[2px] border-black flex items-center justify-center">
            <Resizer isVisible={!!selected} />
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-current ml-1" />
            </div>
        </div>
    );
};

export const MapNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-full h-full min-w-[150px] min-h-[100px] bg-slate-100 border-[2px] border-black flex items-center justify-center relative">
            <Resizer isVisible={!!selected} />
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-px">
                {[...Array(16)].map((_, i) => <div key={i} className="border-r border-b border-slate-300/50" />)}
            </div>
            <MapPin className="w-8 h-8 text-black z-10" />
        </div>
    );
};

// =============================================================================
// BATCH 4: CONTENT & STRUCTURE
// =============================================================================

export const ListItemNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-full h-full min-w-[200px] min-h-[50px] bg-white border-b-[2px] border-black flex items-center px-2 gap-3">
            <Resizer isVisible={!!selected} />
            <div className="w-8 h-8 bg-slate-200 border border-black rounded-full flex-shrink-0" />
            <div className="flex-1 flex flex-col justify-center">
                <EditableLabel id={id} label={data.label as string || "List Item Title"} className="text-sm font-bold text-black text-left w-full" />
                <div className="h-2 w-1/2 bg-slate-300 mt-1" />
            </div>
            <ChevronRight className="w-5 h-5 text-black" />
        </div>
    );
};

export const HeadingNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-full h-full min-w-[100px] min-h-[40px] flex items-center">
            <Resizer isVisible={!!selected} />
            <EditableLabel 
                id={id} 
                label={data.label as string || "HEADING"} 
                className="text-2xl font-black text-black text-left w-full uppercase leading-none" 
            />
        </div>
    );
};

export const ParagraphNode = ({ id, data, selected }: NodeProps) => {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
    
    return (
        <div className="w-full h-full min-w-[150px] min-h-[60px] p-2 overflow-hidden bg-transparent">
            <Resizer isVisible={!!selected} />
            <p className="text-xs font-mono text-slate-600 text-justify leading-relaxed pointer-events-none">
                {lorem} {lorem}
            </p>
        </div>
    );
};

export const BadgeNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-auto h-auto min-w-[30px] min-h-[20px] bg-black text-white px-2 py-0.5 rounded-full flex items-center justify-center">
            <Resizer isVisible={!!selected} />
            <EditableLabel id={id} label={data.label as string || "NEW"} className="text-[10px] font-bold text-white uppercase" />
        </div>
    );
};

export const CardNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-full h-full min-w-[150px] min-h-[100px] p-4 bg-white border-[2px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
             <Resizer isVisible={!!selected} />
             <EditableLabel 
                id={id} 
                label={data.label as string || "Card Title"} 
                className="text-sm font-bold text-black text-left mb-2 block" 
            />
            <div className="space-y-2 opacity-20">
                <div className="w-full h-2 bg-black rounded-full" />
                <div className="w-full h-2 bg-black rounded-full" />
                <div className="w-2/3 h-2 bg-black rounded-full" />
            </div>
        </div>
    );
};

// FIX: Divider is now a proper line
export const DividerNode = ({ id, selected }: NodeProps) => {
    return (
        <div className="w-full h-4 flex items-center justify-center min-w-[100px] group">
             <Resizer isVisible={!!selected} minHeight={4} />
             <div className="w-full h-[2px] bg-black group-hover:bg-slate-700" />
        </div>
    );
};

// FIX: Accordion Component
export const AccordionNode = ({ id, data, selected }: NodeProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="w-full h-auto min-w-[200px] bg-white border-2 border-black rounded-lg overflow-hidden">
             <Resizer isVisible={!!selected} />
             <div 
                className="flex items-center justify-between p-2 bg-slate-50 cursor-pointer border-b-2 border-transparent hover:bg-slate-100"
                onClick={() => setIsOpen(!isOpen)}
             >
                <EditableLabel id={id} label={data.label as string || "FAQ Item"} className="text-sm font-bold text-black text-left" />
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
             </div>
             {isOpen && (
                 <div className="p-2 text-[10px] font-mono text-slate-500 leading-relaxed border-t-2 border-black">
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Expand for more details.
                 </div>
             )}
        </div>
    );
};