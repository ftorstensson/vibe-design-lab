"use client";

import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { clsx } from 'clsx';

// --- VISUAL STYLES ---
const handleStyle = { width: 10, height: 10, background: '#000', border: 'none', zIndex: 50 };

const EditableLabel = ({ id, label }: { id: string, label: string }) => {
  const { setNodes } = useReactFlow();
  const [text, setText] = useState(label);
  useEffect(() => { setText(label); }, [label]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    setNodes((nodes) => nodes.map(n => n.id === id ? { ...n, data: { ...n.data, label: text } } : n));
  };

  return (
    <textarea 
        className="text-[10px] font-bold text-black text-center bg-transparent outline-none w-full border-none p-0 focus:ring-0 cursor-text pointer-events-auto resize-none overflow-hidden"
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        rows={3}
        aria-label="Edit Node Label"
    />
  );
};

// HELPER: Get Border Style based on Variant
const getVariantStyle = (data: any) => {
    if (data.variant === 'hero') return "border-[4px] border-black shadow-lg"; // Thick
    if (data.variant === 'sad') return "border-2 border-slate-400 border-dashed text-slate-500"; // Ghost
    return "border-2 border-black"; // Default
};

// 1. DECISION NODE
export const DecisionNode = ({ id, data }: NodeProps) => {
  const style = getVariantStyle(data);
  return (
    <div className="relative w-32 h-32 flex items-center justify-center group">
      <div className={clsx("absolute inset-0 bg-white transform rotate-45 z-0 shadow-sm", style)}></div>
      <div className="relative z-10 flex flex-col items-center justify-center w-20 pointer-events-auto pb-1">
        <EditableLabel id={id} label={data.label as string} />
      </div>
      <Handle type="source" position={Position.Top} id="top" style={{ ...handleStyle, top: -6, left: '50%', transform: 'translateX(-50%)' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ ...handleStyle, right: -6, top: '50%', transform: 'translateY(-50%)' }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ ...handleStyle, bottom: -6, left: '50%', transform: 'translateX(-50%)' }} />
      <Handle type="source" position={Position.Left} id="left" style={{ ...handleStyle, left: -6, top: '50%', transform: 'translateY(-50%)' }} />
    </div>
  );
};

// 2. START NODE
export const StartNode = ({ id, data }: NodeProps) => {
  const style = getVariantStyle(data);
  return (
    <div className={clsx("relative px-4 py-3 bg-white rounded-full min-w-[120px] text-center shadow-sm flex items-center justify-center", style)}>
      <div className="relative z-10 w-full flex items-center justify-center gap-2">
        <div className="flex-1">
            <EditableLabel id={id} label={data.label as string} />
        </div>
      </div>
      <Handle type="source" position={Position.Top} id="top" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" style={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle} />
      <Handle type="source" position={Position.Left} id="left" style={handleStyle} />
    </div>
  );
};

// 3. END NODE
export const EndNode = ({ id, data }: NodeProps) => {
  const style = getVariantStyle(data);
  return (
    <div className={clsx("relative w-24 h-24 bg-white rounded-full flex items-center justify-center text-center shadow-sm", style)}>
      <div className="relative z-10 w-16 flex flex-col items-center gap-1">
        <EditableLabel id={id} label={data.label as string} />
      </div>
      <Handle type="source" position={Position.Top} id="top" style={handleStyle} />
      <Handle type="source" position={Position.Left} id="left" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" style={handleStyle} />
    </div>
  );
};

// 4. ACTION NODE
export const ActionNode = ({ id, data }: NodeProps) => {
  const style = getVariantStyle(data);
  return (
    <div className={clsx("relative w-32 h-32 bg-white flex items-center justify-center text-center shadow-sm rounded-xl", style)}>
      <div className="relative z-10 w-24">
        <EditableLabel id={id} label={data.label as string} />
      </div>
      <Handle type="source" position={Position.Top} id="top" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" style={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle} />
      <Handle type="source" position={Position.Left} id="left" style={handleStyle} />
    </div>
  );
};