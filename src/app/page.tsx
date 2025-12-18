"use client";

import React, { useCallback, useRef, useState } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Connection, 
  Edge, 
  Node, 
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
  NodeProps,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Smartphone, GripHorizontal, Box, Map, Network, Layout, Loader2 } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { useVibeStore } from '@/store/vibe-store';
import VoiceRecorder from '@/components/VoiceRecorder'; // Make sure to copy this component from previous project if missing
import { clsx } from 'clsx';

// --- CUSTOM NODES ---
const MobileFrameNode = ({ data }: NodeProps) => {
  return (
    <div className="w-[390px] h-[844px] bg-white border-[6px] border-slate-900 rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20"></div>
      <div className="h-12 bg-slate-100 border-b border-slate-200 flex items-center justify-between px-6 handle cursor-move pt-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{data.label as string}</span>
        <GripHorizontal className="w-4 h-4 text-slate-400" />
      </div>
      <div className="flex-1 bg-white relative p-4 group">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 group-hover:opacity-5 transition-opacity">
            <Smartphone className="w-32 h-32 text-slate-300" />
        </div>
      </div>
    </div>
  );
};

const GenericComponentNode = ({ data, type }: NodeProps) => {
  return (
    <div className="min-w-[120px] min-h-[40px] bg-white border border-purple-200 rounded-lg shadow-sm flex items-center gap-3 px-3 py-2">
      <div className="p-1.5 bg-purple-50 rounded text-purple-600">
        <Box className="w-4 h-4" />
      </div>
      <div>
        <div className="text-xs font-bold text-slate-700">{type}</div>
        <div className="text-[10px] text-slate-400 truncate max-w-[100px]">
            {data.label as string || JSON.stringify(data)}
        </div>
      </div>
    </div>
  );
};

const nodeTypes = { 
    MobileScreen: MobileFrameNode,
    Header: GenericComponentNode,
    Button: GenericComponentNode,
    PrimaryButton: GenericComponentNode,
    SecondaryButton: GenericComponentNode,
    Input: GenericComponentNode,
    InputField: GenericComponentNode,
    Card: GenericComponentNode,
    StickyNote: GenericComponentNode,
    default: GenericComponentNode // Fallback for Journey/Sitemap nodes
};

// --- THE CANVAS ---
const Canvas = () => {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [isGenerating, setIsGenerating] = useState(false);

  const { 
    activeLayer, 
    layers, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    setNodes, 
    setActiveLayer,
    generateLayout // The new AI Action
  } = useVibeStore();

  const nodes = layers[activeLayer].nodes;
  const edges = layers[activeLayer].edges;

  // HANDLER: Voice Command
  const handleVoice = async (blob: Blob) => {
    setIsGenerating(true);
    await generateLayout(blob);
    setIsGenerating(false);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (activeLayer !== 'WIREFRAME') {
        alert("Switch to Wireframe Mode to add UI components.");
        return;
      }
      const type = event.dataTransfer.getData('application/reactflow/type');
      const propsString = event.dataTransfer.getData('application/reactflow/props');
      if (!type) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type, 
        position,
        data: propsString ? JSON.parse(propsString) : { label: type },
      };
      setNodes(nodes.concat(newNode));
    },
    [screenToFlowPosition, nodes, setNodes, activeLayer],
  );

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden">
      
      {activeLayer === 'WIREFRAME' && <Sidebar />}
      
      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          className="bg-slate-50"
        >
          <Background color="#94a3b8" variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls className="bg-white border border-slate-200 shadow-sm text-black" />

          {/* LAYER SWITCHER */}
          <Panel position="top-center" className="bg-white p-1.5 rounded-full shadow-lg border border-slate-200 flex gap-1 pointer-events-auto">
            <LayerTab label="Journey" icon={Map} isActive={activeLayer === 'JOURNEY'} onClick={() => setActiveLayer('JOURNEY')} />
            <LayerTab label="Sitemap" icon={Network} isActive={activeLayer === 'SITEMAP'} onClick={() => setActiveLayer('SITEMAP')} />
            <LayerTab label="Wireframes" icon={Layout} isActive={activeLayer === 'WIREFRAME'} onClick={() => setActiveLayer('WIREFRAME')} />
          </Panel>

          {/* AI CONTROL PANEL */}
          <Panel position="bottom-center" className="mb-8">
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-4 animate-in slide-in-from-bottom-4">
                <div className="flex flex-col items-start px-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Architect</span>
                    <span className="text-xs font-medium text-slate-700">
                        {isGenerating ? "Generating..." : "Ready for instructions"}
                    </span>
                </div>
                {isGenerating ? (
                    <div className="p-3 bg-slate-100 rounded-xl"><Loader2 className="w-5 h-5 animate-spin text-slate-500" /></div>
                ) : (
                    <VoiceRecorder onRecordingComplete={handleVoice} />
                )}
            </div>
          </Panel>

        </ReactFlow>
      </div>
    </div>
  );
};

const LayerTab = ({ label, icon: Icon, isActive, onClick }: { label: string, icon: any, isActive: boolean, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all",
            isActive ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        )}
    >
        <Icon className="w-3 h-3" />
        {label}
    </button>
);

export default function DesignLabApp() {
  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
}