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
  useStore,
  NodeResizeControl
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Smartphone, GripHorizontal, Box, Map, Network, Layout, Loader2, ArrowLeft, ChevronDown } from 'lucide-react';
import { JourneyToolbar } from '@/components/JourneyToolbar';
import { SitemapToolbar } from '@/components/SitemapToolbar';
import { WireframeToolbar } from '@/components/WireframeToolbar';
import { useVibeStore } from '@/store/vibe-store';
import VoiceRecorder from '@/components/VoiceRecorder';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';

// Import Visual Nodes
import { DecisionNode, StartNode, EndNode, ActionNode } from '@/components/FlowNodes';
import { PageNode, PurposeNode } from '@/components/SitemapNodes';
import { 
    HeaderNode, 
    TabBarNode,
    SearchBarNode,
    PrimaryButtonNode, 
    SecondaryButtonNode, 
    FABNode,
    LinkNode,
    InputFieldNode,
    TextAreaNode,
    CheckboxNode,
    SwitchNode,
    ImageNode, 
    AvatarNode,
    VideoNode,
    MapNode,
    ListItemNode, 
    HeadingNode,
    ParagraphNode,
    BadgeNode,
    CardNode,
    DividerNode,
    AccordionNode 
} from '@/components/WireframeNodes';

// --- CONFIG: AUTO-CENTERING ---
const FULL_WIDTH_COMPONENTS = [
    'Header', 'TabBar', 'SearchBar', 'Divider', 'List', 'ListItem', 
    'Input', 'InputField', 'Button', 'PrimaryButton', 'SecondaryButton', 'Card', 'Image'
];

// --- CUSTOM NODES (WIREFRAME CONTAINER) ---

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
      
      {/* Resizer */}
      <NodeResizer 
        isVisible={!!selected} 
        minWidth={375} maxWidth={375} 
        minHeight={812}
        handleStyle={{ width: 10, height: 10, borderRadius: 5 }}
        lineStyle={{ border: '1px solid #000' }}
      />

      {/* HEADER */}
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

      {/* CONTENT AREA */}
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

      {/* FOOTER RESIZER */}
      <NodeResizeControl style={{ opacity: 1, background: 'transparent', border: 'none' }} minWidth={375} minHeight={812} position="bottom">
         <ResizeIcon />
      </NodeResizeControl>

    </div>
  );
};

// --- FALLBACK NODE ---
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
    MobileScreen: MobileFrameNode,
    Header: HeaderNode,
    TabBar: TabBarNode,
    SearchBar: SearchBarNode,
    PrimaryButton: PrimaryButtonNode,
    SecondaryButton: SecondaryButtonNode,
    FAB: FABNode,
    Link: LinkNode,
    InputField: InputFieldNode,
    TextArea: TextAreaNode,
    Checkbox: CheckboxNode,
    Switch: SwitchNode,
    Image: ImageNode,
    ImagePlaceholder: ImageNode,
    Avatar: AvatarNode,
    List: ListItemNode,
    ListItem: ListItemNode,
    Heading: HeadingNode,
    Paragraph: ParagraphNode,
    Badge: BadgeNode,
    Card: CardNode,
    Divider: DividerNode,
    Accordion: AccordionNode,
    
    decision: DecisionNode,
    input: StartNode,
    output: EndNode,
    default: ActionNode,

    page: PageNode,
    purpose: PurposeNode,
    
    StickyNote: GenericComponentNode,
};

const Canvas = () => {
  const router = useRouter();
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [isGenerating, setIsGenerating] = useState(false);
  const edgeUpdateSuccessful = useRef(true);

  const { activeLayer, layers, onNodesChange, onEdgesChange, onConnect, setNodes, setEdges, setActiveLayer, generateLayout } = useVibeStore();

  const nodes = layers[activeLayer].nodes;
  const edges = layers[activeLayer].edges;

  const edgeOptions = useMemo(() => {
    if (activeLayer === 'SITEMAP') {
        return { type: 'step', animated: false, style: { stroke: '#000', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#000' }, interactionWidth: 25 };
    }
    return { type: 'bezier', animated: false, style: { stroke: '#000', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#000' }, interactionWidth: 25 };
  }, [activeLayer]);

  const handleVoice = async (blob: Blob) => {
    setIsGenerating(true);
    await generateLayout(blob);
    setIsGenerating(false);
  };

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

  // --- FIX: USE NODES ARRAY DIRECTLY ---
  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
      // Only apply if node is inside a parent (Phone Screen)
      if (!node.parentId) return;

      // Check if it's a component that should be centered
      if (node.type && FULL_WIDTH_COMPONENTS.some(t => node.type?.includes(t))) {
          // Update the specific node in the current list
          const updatedNodes = nodes.map((n) => {
              if (n.id === node.id) {
                  return {
                      ...n,
                      position: { ...n.position, x: 5 } // Keep Y, Snap X to 5px
                  };
              }
              return n;
          });
          setNodes(updatedNodes);
      }
  }, [nodes, setNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow/type');
      const propsString = event.dataTransfer.getData('application/reactflow/props');
      if (!type) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      
      const parentNode = nodes.find(n => 
        n.type === 'MobileScreen' &&
        position.x >= n.position.x &&
        position.x <= n.position.x + 375 && 
        position.y >= n.position.y &&
        position.y <= n.position.y + (n.measured?.height || 812)
      );

      // DEFAULTS
      let style: React.CSSProperties = { backgroundColor: 'transparent', border: 'none', width: 'auto', boxShadow: 'none' };
      let defaultWidth = 365;

      if (type === 'MobileScreen') style = { ...style, width: '375px', height: '812px' };
      if (type === 'Header') style = { ...style, width: '365px', height: '60px' };
      if (type === 'TabBar') style = { ...style, width: '365px', height: '80px' };
      if (type === 'SearchBar') style = { ...style, width: '340px', height: '45px' };
      if (type === 'PrimaryButton' || type === 'SecondaryButton') { style = { ...style, width: '300px', height: '50px' }; defaultWidth = 300; }
      if (type === 'InputField') { style = { ...style, width: '300px', height: '60px' }; defaultWidth = 300; }
      if (type === 'TextArea') { style = { ...style, width: '300px', height: '100px' }; defaultWidth = 300; }
      if (type === 'Image') { style = { ...style, width: '150px', height: '150px' }; defaultWidth = 150; }
      if (type === 'Card') { style = { ...style, width: '340px', height: '120px' }; defaultWidth = 340; }
      if (type === 'List' || type === 'ListItem') { style = { ...style, width: '365px', height: '60px' }; }
      if (type === 'Divider') { style = { ...style, width: '340px', height: '10px' }; defaultWidth = 340; }

      let finalPosition = position;
      
      if (parentNode) {
          const centeredX = (375 - defaultWidth) / 2;
          const relativeY = position.y - parentNode.position.y;
          
          finalPosition = {
              x: centeredX,
              y: relativeY
          };
      }

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type, 
        position: parentNode ? finalPosition : position, 
        data: propsString ? JSON.parse(propsString) : { label: type },
        style,
        ...(parentNode && {
            parentId: parentNode.id,
            extent: 'parent',
        })
      };
      setNodes(nodes.concat(newNode));
    },
    [screenToFlowPosition, nodes, setNodes, activeLayer],
  );

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden">
      
      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <div className="absolute top-4 left-4 z-50">
            <button onClick={() => router.push('/')} className="bg-white p-2 rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors flex items-center gap-2" aria-label="Back to Lobby">
                <ArrowLeft className="w-4 h-4" /><span className="text-xs font-bold hidden sm:inline">Lobby</span>
            </button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          onNodeDragStop={onNodeDragStop}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          className="bg-slate-50"
          snapToGrid={true}
          snapGrid={[10, 10]}
          connectionMode={ConnectionMode.Loose}
          defaultEdgeOptions={edgeOptions}
        >
          <Background color="#ccc" variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls className="!bg-white !border !border-slate-200 !shadow-xl !rounded-lg !text-slate-600 overflow-hidden" />
          <Panel position="top-center" className="bg-white p-1.5 rounded-full shadow-lg border border-slate-200 flex gap-1 pointer-events-auto">
            <LayerTab label="Journey" icon={Map} isActive={activeLayer === 'JOURNEY'} onClick={() => setActiveLayer('JOURNEY')} />
            <LayerTab label="Sitemap" icon={Network} isActive={activeLayer === 'SITEMAP'} onClick={() => setActiveLayer('SITEMAP')} />
            <LayerTab label="Wireframes" icon={Layout} isActive={activeLayer === 'WIREFRAME'} onClick={() => setActiveLayer('WIREFRAME')} />
          </Panel>
          {activeLayer === 'JOURNEY' && <JourneyToolbar />}
          {activeLayer === 'SITEMAP' && <SitemapToolbar />}
          {activeLayer === 'WIREFRAME' && <WireframeToolbar />}
          <Panel position="bottom-center" className="mb-8">
            <div className="bg-white px-2 py-2 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-4 animate-in slide-in-from-bottom-4">
                <div className="flex flex-col items-start px-2"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Architect</span><span className="text-xs font-medium text-slate-700">{isGenerating ? "Thinking..." : "Ready"}</span></div>
                {isGenerating ? <div className="p-3 bg-slate-50 rounded-xl"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div> : <VoiceRecorder onRecordingComplete={handleVoice} />}
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

const LayerTab = ({ label, icon: Icon, isActive, onClick }: { label: string, icon: any, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={clsx("flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-all border border-transparent", isActive ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900")}><Icon className="w-3 h-3" /><span className="hidden sm:inline">{label}</span></button>
);

export default function DesignLabApp() { return <ReactFlowProvider><Canvas /></ReactFlowProvider>; }