"use client";

import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

// --- VISUAL STYLES ---
const handleCommon = { width: 10, height: 10, background: '#000', border: 'none', zIndex: 50 };

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

// 1. DECISION NODE (Diamond)
export const DecisionNode = ({ id, data }: NodeProps) => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center filter drop-shadow-sm group">
      {/* SVG Shape */}
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
        <path d="M 64 0 L 128 64 L 64 128 L 0 64 Z" fill="white" stroke="black" strokeWidth="2" />
      </svg>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-20 pointer-events-auto pb-1">
        <EditableLabel id={id} label={data.label as string} />
      </div>

      {/* Handles: Pushed to -10px */}
      <Handle type="source" position={Position.Top} id="top" style={{ ...handleCommon, top: -10 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ ...handleCommon, right: -10 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ ...handleCommon, bottom: -10 }} />
      <Handle type="source" position={Position.Left} id="left" style={{ ...handleCommon, left: -10 }} />
    </div>
  );
};

// 2. START NODE
export const StartNode = ({ id, data }: NodeProps) => {
  return (
    <div className="relative px-4 py-3 bg-white border-2 border-black rounded-full min-w-[120px] text-center shadow-sm flex items-center justify-center">
      <div className="relative z-10 w-full flex items-center justify-center gap-2">
        <div className="flex-1">
            <EditableLabel id={id} label={data.label as string} />
        </div>
      </div>
      <Handle type="source" position={Position.Top} id="top" style={handleCommon} />
      <Handle type="source" position={Position.Right} id="right" style={handleCommon} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleCommon} />
      <Handle type="source" position={Position.Left} id="left" style={handleCommon} />
    </div>
  );
};

// 3. END NODE
export const EndNode = ({ id, data }: NodeProps) => {
  return (
    <div className="relative w-24 h-24 bg-white border-2 border-black rounded-full flex items-center justify-center text-center shadow-sm">
      <div className="relative z-10 w-16 flex flex-col items-center gap-1">
        <EditableLabel id={id} label={data.label as string} />
      </div>
      <Handle type="source" position={Position.Top} id="top" style={handleCommon} />
      <Handle type="source" position={Position.Left} id="left" style={handleCommon} />
      <Handle type="source" position={Position.Right} id="right" style={handleCommon} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleCommon} />
    </div>
  );
};

// 4. ACTION NODE
export const ActionNode = ({ id, data }: NodeProps) => {
  return (
    <div className="relative w-32 h-32 bg-white border-2 border-black flex items-center justify-center text-center shadow-sm rounded-xl">
      <div className="relative z-10 w-24">
        <EditableLabel id={id} label={data.label as string} />
      </div>
      <Handle type="source" position={Position.Top} id="top" style={handleCommon} />
      <Handle type="source" position={Position.Right} id="right" style={handleCommon} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleCommon} />
      <Handle type="source" position={Position.Left} id="left" style={handleCommon} />
    </div>
  );
};