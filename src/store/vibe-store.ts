import { create } from 'zustand';
import { 
  Node, Edge, addEdge, applyNodeChanges, applyEdgeChanges, 
  NodeChange, EdgeChange, Connection 
} from '@xyflow/react';
import { VibeStore, VibeLayer, DeptSlot, StrategyPaper } from '@/types/vibe-core';
import { getLayoutedElements } from '@/utils/layout-engine';

const NODE_STYLE = { backgroundColor: 'transparent', border: 'none', width: 'auto', boxShadow: 'none' };

const INITIAL_REGISTRY: Record<string, DeptSlot> = {
  product_strategy: { id: 'product_strategy', deptId: '1', label: 'Product Strategy', icon: 'landscape', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  growth_lifecycle: { id: 'growth_lifecycle', deptId: '2', label: 'Growth & Lifecycle', icon: 'growth', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  audience_research: { id: 'audience_research', deptId: '3', label: 'Audience & Research', icon: 'audience', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  category_convention: { id: 'category_convention', deptId: '4', label: 'Category & Convention', icon: 'vibe', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  value_prop: { id: 'value_prop', deptId: '5', label: 'Value Prop & Messaging', icon: 'message', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  experience_principles: { id: 'experience_principles', deptId: '6', label: 'Experience & Principles', icon: 'experience', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  ia_discoverability: { id: 'ia_discoverability', deptId: '7', label: 'IA & Discoverability', icon: 'loop', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  content_systems: { id: 'content_systems', deptId: '8', label: 'Content Systems', icon: 'content', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  measurement_learning: { id: 'measurement_learning', deptId: '9', label: 'Measurement & Learning', icon: 'metrics', status: 'NOT_STARTED', activeVersion: 0, history: [] },
};

const flattenTree = (node: any, parentId: string | null = null, depth = 0): Node[] => {
    const rfNode: Node = {
        id: node.id, type: node.type, data: { label: node.label, ...node.layout }, 
        position: { x: 20, y: (depth * 80) + 60 },
        parentId: parentId || undefined, extent: parentId ? 'parent' : undefined,
        style: NODE_STYLE
    };
    let childrenNodes: Node[] = [];
    if (node.children && Array.isArray(node.children)) {
        node.children.forEach((child: any, index: number) => {
            const childNodeList = flattenTree(child, node.id, depth + 1);
            childNodeList[0].position.y = (index * 80) + 60;
            childrenNodes = [...childrenNodes, ...childNodeList];
        });
    }
    return [rfNode, ...childrenNodes];
};

export const useVibeStore = create<VibeStore>((set, get) => ({
  project: { id: 'demo', name: 'Demo Project' },
  activeLayer: 'STRATEGY',
  strategyLedger: INITIAL_REGISTRY,
  strategyDoc: "",
  chatHistory: [],
  isChatOpen: true,
  layers: { 
    STRATEGY: { nodes: [], edges: [] }, 
    JOURNEY: { nodes: [], edges: [] }, 
    SITEMAP: { nodes: [], edges: [] }, 
    WIREFRAME: { nodes: [] , edges: [] } 
  },

  setActiveLayer: (layer: VibeLayer) => set({ activeLayer: layer }),
  setStrategyDoc: (doc: string) => set({ strategyDoc: doc }),
  setChatOpen: (open: boolean) => set({ isChatOpen: open }),
  setNodes: (nodes: Node[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], nodes } } })),
  setEdges: (edges: Edge[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], edges } } })),
  updateManifest: (partial) => set((state) => ({ ...state, ...partial })),

  onNodesChange: (changes: NodeChange[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], nodes: applyNodeChanges(changes, state.layers[state.activeLayer].nodes) } } })),
  onEdgesChange: (changes: EdgeChange[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], edges: applyEdgeChanges(changes, state.layers[state.activeLayer].edges) } } })),
  onConnect: (connection: Connection) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], edges: addEdge({ ...connection, style: { stroke: '#000', strokeWidth: 2 } }, state.layers[state.activeLayer].edges) } } })),

  generateLayout: async (input: Blob | string) => {
    const API_URL = 'http://localhost:8000';
    
    // 1. Snapshot latest state for the request
    const { activeLayer, chatHistory, strategyLedger } = get();
    const userMsg = typeof input === 'string' ? input : "Voice Command Received";
    const updatedChat = [...chatHistory, { role: 'user' as const, content: userMsg }];
    
    // Immediate UI update for chat
    set({ chatHistory: updatedChat });

    try {
        const formData = new FormData();
        if (input instanceof Blob) formData.append("file", input, "voice.webm");
        else formData.append("prompt", input);
        
        formData.append("layer", activeLayer);
        formData.append("chat_history", JSON.stringify(updatedChat));
        formData.append("strategy_context", JSON.stringify(strategyLedger));

        const response = await fetch(`${API_URL}/agent/design/generate`, { method: "POST", body: formData, mode: 'cors' });
        if (!response.ok) throw new Error(`Agency Error: ${response.status}`);
        const data = await response.json();

        // 2. Functional Update: Ensure we merge with the LATEST state from the store
        set((state) => {
            const nextHistory = [...state.chatHistory, { role: 'assistant' as const, content: data.user_message }];
            let nextLayers = { ...state.layers };
            let nextLedger = { ...state.strategyLedger };

            if (state.activeLayer === 'STRATEGY' && data.patch) {
                const { dept_id, content, version_note } = data.patch;
                const currentDept = nextLedger[dept_id];
                
                if (currentDept) {
                    const newPaper: StrategyPaper = { 
                        ...content, 
                        version_note, 
                        timestamp: new Date().toISOString(), 
                        version: (currentDept.history.length + 1).toFixed(1) 
                    };

                    nextLedger[dept_id] = { 
                        ...currentDept, 
                        status: 'STABLE' as const, 
                        history: [...currentDept.history, newPaper], 
                        activeVersion: currentDept.history.length 
                    };

                    // Re-calculate all nodes from the updated ledger to maintain sync
                    const newNodes = (Object.values(nextLedger) as DeptSlot[])
                        .filter(d => d.history.length > 0)
                        .map((d, idx) => ({
                            id: d.id,
                            type: 'strategy',
                            position: { x: idx * 600, y: 50 },
                            data: { ...d.history[d.activeVersion], label: d.label, deptId: d.deptId, icon: d.icon }
                        }));

                    nextLayers.STRATEGY = { nodes: newNodes, edges: [] };
                }
            } else if (data.nodes || data.root) {
                // Visual Layer Processing (Journey, Sitemap, Wireframe)
                let newNodes: Node[] = [];
                let newEdges: Edge[] = [];
                if (state.activeLayer === 'WIREFRAME' && data.root) {
                    newNodes = flattenTree(data.root);
                } else if (data.nodes) {
                    newNodes = data.nodes.map((n: any) => ({ id: n.id, type: n.type, data: { ...n }, position: { x: 0, y: 0 }, style: NODE_STYLE }));
                    if (data.edges) newEdges = data.edges.map((e: any) => ({ id: e.id || `${e.source}-${e.target}`, source: e.source, target: e.target, style: { stroke: '#000', strokeWidth: 2 } }));
                }
                const direction = state.activeLayer === 'SITEMAP' ? 'TB' : 'LR';
                const layout = getLayoutedElements(newNodes, newEdges, direction);
                nextLayers[state.activeLayer] = { nodes: layout.nodes, edges: layout.edges };
            }

            return {
                chatHistory: nextHistory,
                strategyLedger: nextLedger,
                layers: nextLayers
            };
        });

        return data;
    } catch (e) { 
        console.error("Critical Store Error:", e);
        return null; 
    }
  }
}));