"use client";

import React, { useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Smartphone, GripHorizontal } from 'lucide-react';

// --- 1. CUSTOM NODE: The "Phone Frame" ---
// This is our fundamental unit. A mobile screen that lives on the canvas.
const MobileFrameNode = ({ data }: { data: { label: string } }) => {
  return (
    <div className="w-[320px] h-[600px] bg-white border-4 border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col">
      
      {/* STATUS BAR MOCK */}
      <div className="h-6 bg-slate-900 w-full flex justify-center items-end pb-1">
        <div className="w-20 h-4 bg-black rounded-b-xl"></div>
      </div>

      {/* HEADER (Draggable Handle) */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between handle">
        <span className="font-bold text-slate-700 text-sm">{data.label}</span>
        <GripHorizontal className="w-4 h-4 text-slate-400" />
      </div>

      {/* SCREEN CONTENT (The Drop Zone) */}
      <div className="flex-1 bg-slate-50 p-4 flex flex-col items-center justify-center text-center space-y-4">
        <p className="text-xs text-slate-400 uppercase tracking-widest">Drop Components Here</p>
        
        {/* Example Mock Component */}
        <div className="w-full p-4 bg-white border-2 border-dashed border-slate-300 rounded-xl">
            <span className="text-slate-400 text-xs">Button Placeholder</span>
        </div>
      </div>

      {/* HOME BAR */}
      <div className="h-2 w-32 bg-slate-900 rounded-full mx-auto mb-2 opacity-20"></div>
    </div>
  );
};

// Register the custom node type
const nodeTypes = { mobileFrame: MobileFrameNode };

// --- 2. INITIAL STATE ---
const initialNodes: Node[] = [
  { 
    id: '1', 
    type: 'mobileFrame', 
    position: { x: 100, y: 100 }, 
    data: { label: '01. Lobby Screen' } 
  },
  { 
    id: '2', 
    type: 'mobileFrame', 
    position: { x: 500, y: 100 }, 
    data: { label: '02. Project List' } 
  },
];

const initialEdges: Edge[] = [];

// --- 3. THE CANVAS APP ---
export default function DesignLabCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="h-screen w-screen bg-slate-50">
        <div className="absolute top-4 left-4 z-50 bg-white px-4 py-2 rounded-lg shadow-md border border-slate-200">
            <h1 className="font-bold text-slate-800 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-purple-600" />
                Vibe Design Lab <span className="text-xs font-normal text-slate-400">v0.1</span>
            </h1>
        </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-50"
      >
        <Background color="#94a3b8" variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls className="bg-white border border-slate-200 shadow-sm" />
      </ReactFlow>
    </div>
  );
}