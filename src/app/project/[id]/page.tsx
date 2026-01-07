"use client";

import React, { useCallback, useRef, useState, useMemo } from 'react';
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
  Panel,
  MarkerType,
  reconnectEdge,
  ConnectionMode,
  NodeResizer,
  NodeResizeControl,
  useStore
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GripHorizontal, Box, Map, Network, Layout, Loader2, ArrowLeft, BookOpen, ChevronDown, Send, MessageSquare, ChevronRight, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { JourneyToolbar } from '@/components/JourneyToolbar';
import { SitemapToolbar } from '@/components/SitemapToolbar';
import { WireframeToolbar } from '@/components/WireframeToolbar';
import { useVibeStore } from '@/store/vibe-store';
import VoiceRecorder from '@/components/VoiceRecorder';
import StrategyView from '@/components/StrategyView';
import BlueprintReviewModal from '@/components/BlueprintReviewModal';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';

// Import Visual Nodes
import { DecisionNode, StartNode, EndNode, ActionNode } from '@/components/FlowNodes';
import { PageNode, PurposeNode } from '@/components/SitemapNodes';
import { 
    HeaderNode, TabBarNode, SearchBarNode, PrimaryButtonNode, 
    SecondaryButtonNode, FABNode, LinkNode, InputFieldNode,
    TextAreaNode, CheckboxNode, SwitchNode, ImageNode, 
    AvatarNode, VideoNode, MapNode, ListItemNode, HeadingNode,
    ParagraphNode, BadgeNode, CardNode, DividerNode, AccordionNode 
} from '@/components/WireframeNodes';

// --- CUSTOM NODES ---

const ResizeIcon = () => (
    <div className="w-full flex justify-center cursor-ns-resize py-1 bg-slate-100 hover:bg-slate-200 border-t border-slate-300">
        <ChevronDown className="w-4 h-4 text-slate-400" />
    </div>
);

const MobileFrameNode = ({ id, data, selected }: NodeProps) => {
  const height = useStore((s) => s.nodeLookup.get(id)?.measured?.height || 812);
  const showFold = height > 812;
  const { setNodes } = useReactFlow();
  const [label, setLabel] = useState(data.label as string);
  
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
    setNodes((nodes) => nodes.map(n => n.id === id ? { ...n, data: { ...n.data, label: e.target.value } } : n));
  };

  return (
    <div className="w-full h-full bg-white border-[4px] border-black rounded-xl shadow-2xl relative flex flex-col group overflow-visible min-h-[812px]">
      <NodeResizer 
        isVisible={!!selected} 
        minWidth={375} maxWidth={375} 
        minHeight={812}
        handleStyle={{ width: 10, height: 10, borderRadius: 5 }}
        lineStyle={{ border: '1px solid #000' }}
      />
      <div className="h-10 bg-black flex items-center justify-between px-4 handle cursor-move shrink-0 z-20 rounded-t-lg">
        <input 
            className="text-xs font-bold text-white bg-transparent outline-none w-full uppercase tracking-wider placeholder-gray-500"
            value={label}
            onChange={handleLabelChange}
            placeholder="SCREEN NAME"
            aria-label="Edit Screen Name"
        />
        <GripHorizontal className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1 bg-white relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity">
            <span className="text-4xl font-bold text-slate-100 uppercase tracking-widest -rotate-45">Canvas</span>
        </div>
        {showFold && (
            <div className="absolute top-[812px] left-0 right-0 border-t-2 border-dashed border-blue-400 z-50 flex justify-center pointer-events-none">
                <span className="bg-blue-400 text-white text-[9px] px-2 rounded-b font-bold uppercase tracking-widest">
                    The Fold (812px)
                </span>
            </div>
        )}
      </div>
      <NodeResizeControl style={{ opacity: 1, background: 'transparent', border: 'none' }} minWidth={375} minHeight={812} position="bottom">
         <ResizeIcon />
      </NodeResizeControl>
    </div>
  );
};

const GenericComponentNode = ({ data, type }: NodeProps) => {
  return (
    <div className="min-w-[120px] min-h-[40px] bg-white border border-purple-200 rounded-lg shadow-sm flex items-center gap-3 px-3 py-2">
      <div className="p-1.5 bg-purple-50 rounded text-purple-600"><Box className="w-4 h-4" /></div>
      <div>
        <div className="text-xs font-bold text-slate-700">{type}</div>
        <div className="text-[10px] text-slate-400 truncate max-w-[100px]">{data.label as string}</div>
      </div>
    </div>
  );
};

const nodeTypes = { 
    MobileScreen: MobileFrameNode, Header: HeaderNode, TabBar: TabBarNode,
    SearchBar: SearchBarNode, PrimaryButton: PrimaryButtonNode, SecondaryButton: SecondaryButtonNode,
    FAB: FABNode, Link: LinkNode, InputField: InputFieldNode, TextArea: TextAreaNode,
    Checkbox: CheckboxNode, Switch: SwitchNode, Image: ImageNode, ImagePlaceholder: ImageNode,
    Avatar: AvatarNode, List: ListItemNode, ListItem: ListItemNode, Heading: HeadingNode,
    Paragraph: ParagraphNode, Badge: BadgeNode, Card: CardNode, Divider: DividerNode,
    Accordion: AccordionNode, decision: DecisionNode, input: StartNode,
    output: EndNode, default: ActionNode, page: PageNode, purpose: PurposeNode,
    StickyNote: GenericComponentNode,
};

const Canvas = () => {
  const router = useRouter();
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const edgeUpdateSuccessful = useRef(true);

  // MODAL STATE
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewContent, setReviewContent] = useState("");

  const { 
    activeLayer, layers, strategyDoc, setStrategyDoc, 
    onNodesChange, onEdgesChange, onConnect, 
    setNodes, setEdges, setActiveLayer, 
    generateLayout, chatHistory, isChatOpen, setChatOpen
  } = useVibeStore();

  const isVisualLayer = activeLayer !== 'STRATEGY';
  const currentLayerKey = activeLayer as 'JOURNEY' | 'SITEMAP' | 'WIREFRAME';
  const nodes = isVisualLayer ? layers[currentLayerKey].nodes : [];
  const edges = isVisualLayer ? layers[currentLayerKey].edges : [];

  const handleEditStrategy = () => {
    setReviewContent(strategyDoc);
    setIsReviewOpen(true);
  };

  const handleSaveStrategy = (newContent: string) => {
    setStrategyDoc(newContent);
    setIsReviewOpen(false);
  };

  const handleSend = async (text?: string) => {
    const message = text || chatInput;
    if (!message.trim()) return;
    setIsGenerating(true);
    setChatInput("");
    await generateLayout(message);
    setIsGenerating(false);
  };

  const handleVoice = async (blob: Blob) => {
    setIsGenerating(true);
    await generateLayout(blob);
    setIsGenerating(false);
  };

  const edgeOptions = useMemo(() => {
    if (activeLayer === 'SITEMAP') {
        return { type: 'step', animated: false, style: { stroke: '#000', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#000' } };
    }
    return { type: 'bezier', animated: false, style: { stroke: '#000', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#000' } };
  }, [activeLayer]);

  const onReconnectStart = useCallback(() => { edgeUpdateSuccessful.current = false; }, []);
  const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
    edgeUpdateSuccessful.current = true;
    const newEdges = reconnectEdge(oldEdge, newConnection, edges);
    setEdges(newEdges);
  }, [edges, setEdges]);
  const onReconnectEnd = useCallback((_: unknown, edge: Edge) => {
    if (!edgeUpdateSuccessful.current) setEdges(edges.filter((e) => e.id !== edge.id));
    edgeUpdateSuccessful.current = true;
  }, [edges, setEdges]);

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
      if (!node.parentId) return;
      const FULL_WIDTH_COMPONENTS = ['Header', 'TabBar', 'SearchBar', 'Divider', 'List', 'ListItem', 'Input', 'InputField', 'Button', 'PrimaryButton', 'SecondaryButton', 'Card', 'Image'];
      if (node.type && FULL_WIDTH_COMPONENTS.some(t => node.type?.includes(t))) {
          const updatedNodes = nodes.map((n) => n.id === node.id ? { ...n, position: { ...n.position, x: 5 } } : n);
          setNodes(updatedNodes);
      }
  }, [nodes, setNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow/type');
      if (!type) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      if (!isVisualLayer) return;
      const parentNode = nodes.find(n => n.type === 'MobileScreen' && position.x >= n.position.x && position.x <= n.position.x + 375 && position.y >= n.position.y && position.y <= n.position.y + (n.measured?.height || 812));
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type, position: parentNode ? { x: 5, y: position.y - parentNode.position.y } : position, 
        data: { label: type }, style: { width: 'auto' },
        ...(parentNode && { parentId: parentNode.id, extent: 'parent' })
      };
      setNodes(nodes.concat(newNode));
  }, [screenToFlowPosition, nodes, setNodes, isVisualLayer]);

  return (
    <div className="flex h-screen w-screen bg-slate-100 overflow-hidden relative">
      <BlueprintReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} initialContent={reviewContent} onSave={handleSaveStrategy} />
      
      {/* LEFT: PERSISTENT LOBBY BUTTON */}
      <div className="absolute top-6 left-6 z-[60]">
        <button 
          onClick={() => router.push('/')} 
          aria-label="Go back to lobby" 
          className="p-3 bg-white hover:bg-slate-50 rounded-2xl shadow-xl border border-slate-200 transition-all active:scale-95"
        >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* MAIN PROJECT BOARD (Fills screen, Chat slides OVER or PUSHES) */}
      <div className={clsx(
          "flex-1 h-full relative bg-white transition-all duration-300 ease-in-out",
          isChatOpen ? "mr-[450px]" : "mr-0"
      )}>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-2xl border flex gap-1">
                <LayerTab label="Strategy" icon={BookOpen} isActive={activeLayer === 'STRATEGY'} onClick={() => setActiveLayer('STRATEGY')} />
                <LayerTab label="Journey" icon={Map} isActive={activeLayer === 'JOURNEY'} onClick={() => setActiveLayer('JOURNEY')} />
                <LayerTab label="Sitemap" icon={Network} isActive={activeLayer === 'SITEMAP'} onClick={() => setActiveLayer('SITEMAP')} />
                <LayerTab label="Wireframes" icon={Layout} isActive={activeLayer === 'WIREFRAME'} onClick={() => setActiveLayer('WIREFRAME')} />
            </div>
        </div>

        {activeLayer === 'STRATEGY' ? (
             <div className="h-full pt-24 pb-20 px-12 overflow-y-auto flex justify-center">
                <div className="w-full max-w-4xl"><StrategyView onEdit={handleEditStrategy} /></div>
             </div>
        ) : (
            <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onReconnect={onReconnect} onReconnectStart={onReconnectStart} onReconnectEnd={onReconnectEnd} onNodeDragStop={onNodeDragStop} onDragOver={onDragOver} onDrop={onDrop} nodeTypes={nodeTypes} fitView snapToGrid connectionMode={ConnectionMode.Loose} defaultEdgeOptions={edgeOptions}>
                <Background color="#ccc" variant={BackgroundVariant.Dots} gap={20} size={1} />
                <Controls className="!bg-white !shadow-xl !rounded-lg overflow-hidden" />
                {activeLayer === 'JOURNEY' && <JourneyToolbar />}
                {activeLayer === 'SITEMAP' && <SitemapToolbar />}
                {activeLayer === 'WIREFRAME' && <WireframeToolbar />}
            </ReactFlow>
        )}

        {/* TOGGLE CHAT BUTTON (Visible when closed) */}
        {!isChatOpen && (
            <button 
                onClick={() => setChatOpen(true)}
                aria-label="Open Project Manager"
                className="absolute top-6 right-6 z-[60] p-3 bg-slate-900 text-white rounded-2xl shadow-2xl hover:bg-black transition-all animate-in fade-in slide-in-from-right-4"
            >
                <MessageSquare className="w-6 h-6" />
            </button>
        )}
      </div>

      {/* RIGHT SIDEBAR (Project Manager) */}
      <div className={clsx(
          "fixed top-0 right-0 h-full bg-white border-l border-slate-200 flex flex-col shadow-[-20px_0_30px_rgba(0,0,0,0.05)] z-[70] transition-all duration-300 ease-in-out",
          isChatOpen ? "w-[450px] translate-x-0" : "w-[450px] translate-x-full"
      )}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block leading-none mb-1">Agentic</span>
                    <span className="text-xs font-bold text-slate-900 uppercase leading-none">Project Manager</span>
                </div>
            </div>
            <button 
                onClick={() => setChatOpen(false)} 
                aria-label="Close Project Manager" 
                className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400 hover:text-slate-900"
            >
                <PanelRightClose className="w-5 h-5" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
            {chatHistory.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-8 opacity-50">
                    <MessageSquare className="w-12 h-12 mb-4 text-slate-300" />
                    <p className="text-sm font-medium">Explain your vision to begin.</p>
                </div>
            )}
            {chatHistory.map((msg, i) => (
                <div key={i} className={clsx("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                    <div className={clsx("max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm", msg.role === 'user' ? "bg-slate-900 text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none border")}>
                        {msg.content}
                    </div>
                </div>
            ))}
            {isGenerating && <div className="flex items-center gap-2 animate-pulse text-[10px] font-bold uppercase tracking-widest text-slate-400"><Loader2 className="w-3 h-3 animate-spin" /> Thinking...</div>}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="relative bg-white rounded-2xl border border-slate-200 p-2">
                <textarea className="w-full bg-transparent border-none focus:ring-0 text-sm p-3 pb-12 resize-none min-h-[100px]" placeholder="Evolve the vision..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <VoiceRecorder onRecordingComplete={handleVoice} />
                    <button onClick={() => handleSend()} aria-label="Send message" disabled={!chatInput.trim() || isGenerating} className="bg-slate-900 text-white p-2.5 rounded-xl disabled:opacity-50"><Send className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const LayerTab = ({ label, icon: Icon, isActive, onClick }: { label: string, icon: any, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={clsx("flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all", isActive ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100")}><Icon className="w-3.5 h-3.5" /><span>{label}</span></button>
);

export default function DesignLabApp() { return <ReactFlowProvider><Canvas /></ReactFlowProvider>; }