"use client";

// --- SECTION A: IMPORTS ---
import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { 
  ReactFlow, Background, Controls, Connection, Edge, Node, 
  BackgroundVariant, ReactFlowProvider, useReactFlow, NodeProps, 
  Panel, MarkerType, reconnectEdge, ConnectionMode, NodeResizer, 
  NodeResizeControl, useStore 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
    GripHorizontal, Box, Map, Network, Layout, Loader2, 
    ArrowLeft, BookOpen, ChevronDown, Send, MessageSquare, 
    PanelRightClose, PanelRightOpen, X, Fingerprint, Zap, BarChart3, Users, TrendingUp, ShieldAlert, Target, Search
} from 'lucide-react';
import { JourneyToolbar } from '@/components/JourneyToolbar';
import { SitemapToolbar } from '@/components/SitemapToolbar';
import { WireframeToolbar } from '@/components/WireframeToolbar';
import { useVibeStore } from '@/store/vibe-store';
import VoiceRecorder from '@/components/VoiceRecorder';
import { StrategyNode } from '@/components/StrategyNodes';
import { clsx } from 'clsx';
import { useRouter, useParams } from 'next/navigation';

// --- SECTION B: NODE TYPES & HELPERS ---
import { DecisionNode, StartNode, EndNode, ActionNode } from '@/components/FlowNodes';
import { PageNode, PurposeNode } from '@/components/SitemapNodes';
import { 
    HeaderNode, TabBarNode, SearchBarNode, PrimaryButtonNode, 
    SecondaryButtonNode, FABNode, LinkNode, InputFieldNode,
    TextAreaNode, CheckboxNode, SwitchNode, ImageNode, 
    AvatarNode, VideoNode, MapNode, ListItemNode, HeadingNode,
    ParagraphNode, BadgeNode, CardNode, DividerNode, AccordionNode 
} from '@/components/WireframeNodes';

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
  return (
    <div className="w-full h-full bg-white border-[4px] border-black rounded-xl shadow-2xl relative flex flex-col group min-h-[812px]">
      <NodeResizer isVisible={!!selected} minWidth={375} maxWidth={375} minHeight={812} handleStyle={{ width: 10, height: 10, borderRadius: 5 }} lineStyle={{ border: '1px solid #000' }} />
      <div className="h-10 bg-black flex items-center justify-between px-4 handle cursor-move shrink-0 z-20 rounded-t-lg font-sans">
        <input className="text-xs font-bold text-white bg-transparent outline-none w-full uppercase tracking-wider placeholder-gray-500" value={label} onChange={(e) => setLabel(e.target.value)} onBlur={() => setNodes(nodes => nodes.map(n => n.id === id ? { ...n, data: { ...n.data, label } } : n))} placeholder="SCREEN NAME" aria-label="Edit Screen Name" />
        <GripHorizontal className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1 bg-white relative overflow-hidden">{showFold && (<div className="absolute top-[812px] left-0 right-0 border-t-2 border-dashed border-blue-400 z-50 flex justify-center pointer-events-none font-sans"><span className="bg-blue-400 text-white text-[9px] px-2 rounded-b font-bold uppercase tracking-widest font-sans">The Fold</span></div>)}</div>
      <NodeResizeControl style={{ opacity: 1, background: 'transparent', border: 'none' }} minWidth={375} minHeight={812} position="bottom"><ResizeIcon /></NodeResizeControl>
    </div>
  );
};

const GenericComponentNode = ({ data, type }: NodeProps) => (
  <div className="min-w-[120px] min-h-[40px] bg-white border border-purple-200 rounded-lg shadow-sm flex items-center gap-3 px-3 py-2 font-sans text-black">
    <div className="p-1.5 bg-purple-50 rounded text-purple-600"><Box className="w-4 h-4" /></div>
    <div><div className="text-xs font-bold">{type}</div><div className="text-[10px] text-slate-400 truncate max-w-[100px]">{data.label as string}</div></div>
  </div>
);

const nodeTypes = { 
    strategy: StrategyNode, MobileScreen: MobileFrameNode, Header: HeaderNode, TabBar: TabBarNode, SearchBar: SearchBarNode, PrimaryButton: PrimaryButtonNode, SecondaryButton: SecondaryButtonNode,
    FAB: FABNode, Link: LinkNode, InputField: InputFieldNode, TextArea: TextAreaNode, Checkbox: CheckboxNode, Switch: SwitchNode, Image: ImageNode, ImagePlaceholder: ImageNode,
    Avatar: AvatarNode, List: ListItemNode, ListItem: ListItemNode, Heading: HeadingNode, Paragraph: ParagraphNode, Badge: BadgeNode, Card: CardNode, Divider: DividerNode,
    Accordion: AccordionNode, decision: DecisionNode, input: StartNode, output: EndNode, default: ActionNode, page: PageNode, purpose: PurposeNode,
    StickyNote: GenericComponentNode,
};

// --- SECTION C: MAIN PAGE COMPONENT ---
const Canvas = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  
  const { 
    activeLayer, layers, onNodesChange, onEdgesChange, onConnect, 
    setActiveLayer, generateLayout, chatHistory, isChatOpen, setChatOpen,
    project, renameProject, loadProjectCloud, activeSpecialist, setActiveSpecialist
  } = useVibeStore();

  // --- SECTION D: HYDRATION ---
  useEffect(() => {
    // 🛡️ Synchronously set the ID and start hydration immediately
    if (id) loadProjectCloud(id as string);
  }, [id, loadProjectCloud]);

  const handleSend = async () => {
    if (!chatInput.trim()) return;
    setIsGenerating(true);
    const msg = chatInput;
    setChatInput("");
    await generateLayout(msg);
    setIsGenerating(false);
  };

  const handleVoice = async (blob: Blob) => {
    setIsGenerating(true);
    await generateLayout(blob);
    setIsGenerating(false);
  };

  const handleRename = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditingName(false);
    if (e.target.value !== project.name) renameProject(e.target.value);
  };

  const nodes = layers[activeLayer]?.nodes || [];
  const edges = layers[activeLayer]?.edges || [];

  // SPECIALIST UI MAPPING (Updated for Dept 1-6)
  const specialistMap: Record<string, { label: string, icon: any, color: string }> = {
    the_big_idea: { label: 'Venture Architect', icon: Zap, color: 'bg-purple-600' },
    market_reality: { label: 'Market Scout', icon: BarChart3, color: 'bg-blue-600' },
    audience_ecosystem: { label: 'Psychologist', icon: Users, color: 'bg-orange-600' },
    content_structure: { label: 'System Modeler', icon: TrendingUp, color: 'bg-green-600' },
    ux_feasibility: { label: 'Scope Assassin', icon: ShieldAlert, color: 'bg-red-600' },
    landscape_conventions: { label: 'Visual Scout', icon: Search, color: 'bg-indigo-600' },
  };

  const currentSpecialist = activeSpecialist ? specialistMap[activeSpecialist] : null;

  return (
    <div className="flex h-screen w-screen bg-slate-100 overflow-hidden relative font-sans">
      
      {/* TOP LEFT HEADER */}
      <div className="absolute top-6 left-6 z-[60] flex items-center gap-4">
        <button onClick={() => router.push('/')} aria-label="Back to Lobby" className="p-3 bg-white hover:bg-slate-50 rounded-2xl shadow-xl border border-slate-200 transition-all active:scale-95 text-slate-400"><ArrowLeft className="w-5 h-5" /></button>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col min-w-[200px]">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Current Project</span>
            {isEditingName ? (
                <input autoFocus className="text-xs font-bold text-slate-900 outline-none bg-slate-50 rounded px-1" defaultValue={project.name} onBlur={handleRename} onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} aria-label="Project name" placeholder="Enter name..." />
            ) : (
                <span onClick={() => setIsEditingName(true)} className="text-xs font-bold text-slate-900 cursor-pointer hover:text-slate-500 transition-colors uppercase">{project.name}</span>
            )}
        </div>
      </div>

      <div className={clsx("flex-1 h-full relative bg-white transition-all duration-300 ease-in-out", isChatOpen ? "mr-[450px]" : "mr-0")}>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-2xl border flex gap-1">
                <LayerTab label="Strategy" icon={Target} isActive={activeLayer === 'STRATEGY'} onClick={() => setActiveLayer('STRATEGY')} />
                <LayerTab label="Landscape" icon={Search} isActive={activeLayer === 'LANDSCAPE'} onClick={() => setActiveLayer('LANDSCAPE')} />
                <LayerTab label="Journey" icon={Zap} isActive={activeLayer === 'JOURNEY'} onClick={() => setActiveLayer('JOURNEY')} />
                <LayerTab label="Sitemap" icon={Network} isActive={activeLayer === 'SITEMAP'} onClick={() => setActiveLayer('SITEMAP')} />
                <LayerTab label="Wireframes" icon={Layout} isActive={activeLayer === 'WIREFRAME'} onClick={() => setActiveLayer('WIREFRAME')} />
            </div>
        </div>

        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView snapToGrid connectionMode={ConnectionMode.Loose}>
            <Background color="#ccc" variant={BackgroundVariant.Dots} gap={20} size={1} />
            <Controls className="!bg-white !shadow-xl !rounded-lg overflow-hidden" />
            {activeLayer === 'JOURNEY' && <JourneyToolbar />}
            {activeLayer === 'SITEMAP' && <SitemapToolbar />}
            {activeLayer === 'WIREFRAME' && <WireframeToolbar />}
        </ReactFlow>

        {!isChatOpen && (<button onClick={() => setChatOpen(true)} aria-label="Open Project Manager" className="absolute top-6 right-6 z-[60] p-3 bg-slate-900 text-white rounded-2xl shadow-2xl hover:bg-black transition-all"><MessageSquare className="w-6 h-6" /></button>)}
      </div>

      {/* CHAT SIDEBAR */}
      <div className={clsx(
          "fixed top-0 right-0 h-full bg-white border-l border-slate-200 flex flex-col shadow-2xl z-[70] transition-all duration-300 font-sans",
          isChatOpen ? "w-[450px] translate-x-0" : "w-[450px] translate-x-full"
      )}>
        <div className={clsx(
            "p-4 border-b border-slate-100 flex items-center justify-between transition-colors duration-500",
            currentSpecialist ? "bg-slate-900" : "bg-slate-50/50"
        )}>
            <div className="flex items-center gap-3">
                <div className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all shadow-lg",
                    currentSpecialist ? currentSpecialist.color : "bg-slate-900"
                )}>
                    {currentSpecialist ? <currentSpecialist.icon className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                </div>
                <div>
                    <span className="text-[10px] font-black uppercase tracking-widest block leading-none mb-1 text-slate-400">
                        {currentSpecialist ? "Direct Access" : "Agency Hub"}
                    </span>
                    <span className={clsx("text-xs font-bold uppercase", currentSpecialist ? "text-white" : "text-slate-900")}>
                        {currentSpecialist ? currentSpecialist.label : "Project Manager"}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-1">
                {currentSpecialist && (
                    <button onClick={() => setActiveSpecialist(null)} className="p-2 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5" title="Return to PM">
                        <X className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Exit</span>
                    </button>
                )}
                <button onClick={() => setChatOpen(false)} aria-label="Close" className={clsx("p-2 rounded-lg", currentSpecialist ? "text-slate-400 hover:text-white" : "text-slate-400 hover:bg-slate-100")}><PanelRightClose className="w-5 h-5" /></button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
            {chatHistory.map((msg: {role: string, content: string}, i: number) => (
                <div key={i} className={clsx("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                    <div className={clsx("max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm", msg.role === 'user' ? "bg-slate-900 text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none border border-slate-100")}>
                        {msg.content}
                    </div>
                </div>
            ))}
            {isGenerating && <div className="flex items-center gap-2 animate-pulse text-[10px] font-black uppercase tracking-widest text-slate-400 p-2"><Loader2 className="w-3 h-3 animate-spin" /> {currentSpecialist ? `Consulting ${currentSpecialist.label}...` : "Thinking..."}</div>}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="relative bg-white rounded-2xl border border-slate-200 p-2 focus-within:border-slate-400 transition-all">
                <textarea className="w-full bg-transparent border-none focus:ring-0 text-sm p-3 pb-12 resize-none min-h-[100px]" placeholder={currentSpecialist ? `Interview the ${currentSpecialist.label}...` : "Evolve the vision..."} value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <VoiceRecorder onRecordingComplete={handleVoice} />
                    <button onClick={handleSend} aria-label="Send" disabled={!chatInput.trim() || isGenerating} className="bg-slate-900 text-white p-2.5 rounded-xl disabled:opacity-50 hover:bg-black transition-all shadow-md"><Send className="w-4 h-4" /></button>
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