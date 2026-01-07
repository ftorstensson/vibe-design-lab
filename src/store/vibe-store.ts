import { create } from 'zustand';
import { 
  Node, 
  Edge, 
  addEdge, 
  OnNodesChange, 
  OnEdgesChange, 
  applyNodeChanges, 
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Connection
} from '@xyflow/react';
import { VibeStore, VibeLayer, VibeManifest } from '@/types/vibe-core';
import { getLayoutedElements } from '@/utils/layout-engine';

const NODE_STYLE = { backgroundColor: 'transparent', border: 'none', width: 'auto', boxShadow: 'none' };

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface VibeActions {
  setActiveLayer: (layer: VibeLayer) => void;
  setStrategyDoc: (doc: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateManifest: (partial: Partial<VibeManifest>) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  generateLayout: (input: Blob | string) => Promise<any>;
  chatHistory: ChatMessage[];
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}

export const useVibeStore = create<VibeStore & VibeActions>((set, get) => ({
  project: { id: 'demo', name: 'Demo Project' },
  activeLayer: 'STRATEGY',
  strategyDoc: "# Project Strategy\n\n**Goal:** Define the core vision.\n**Target Audience:** ...\n**Core Loop:** ...",
  chatHistory: [],
  isChatOpen: true, 
  layers: { JOURNEY: { nodes: [], edges: [] }, SITEMAP: { nodes: [], edges: [] }, WIREFRAME: { nodes: [], edges: [] } },

  setActiveLayer: (layer: VibeLayer) => set({ activeLayer: layer }),
  setStrategyDoc: (doc: string) => set({ strategyDoc: doc }),
  setChatOpen: (open: boolean) => set({ isChatOpen: open }),

  setNodes: (nodes: Node[]) => {
    const { activeLayer, layers } = get();
    if (activeLayer === 'STRATEGY') return;
    set({ layers: { ...layers, [activeLayer]: { ...layers[activeLayer], nodes } } });
  },

  setEdges: (edges: Edge[]) => {
    const { activeLayer, layers } = get();
    if (activeLayer === 'STRATEGY') return;
    set({ layers: { ...layers, [activeLayer]: { ...layers[activeLayer], edges } } });
  },

  updateManifest: (partial) => set((state) => ({ ...state, ...partial })),

  onNodesChange: (changes: NodeChange[]) => {
    const { activeLayer, layers } = get();
    if (activeLayer === 'STRATEGY') return;
    const currentNodes = layers[activeLayer].nodes;
    set({ layers: { ...layers, [activeLayer]: { ...layers[activeLayer], nodes: applyNodeChanges(changes, currentNodes) } } });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    const { activeLayer, layers } = get();
    if (activeLayer === 'STRATEGY') return;
    const currentEdges = layers[activeLayer].edges;
    set({ layers: { ...layers, [activeLayer]: { ...layers[activeLayer], edges: applyEdgeChanges(changes, currentEdges) } } });
  },

  onConnect: (connection: Connection) => {
    const { activeLayer, layers } = get();
    if (activeLayer === 'STRATEGY') return;
    const currentEdges = layers[activeLayer].edges;
    set({ layers: { ...layers, [activeLayer]: { ...layers[activeLayer], edges: addEdge({ ...connection, style: { stroke: '#000', strokeWidth: 2 } }, currentEdges) } } });
  },

generateLayout: async (input: Blob | string) => {
    const { activeLayer, layers, strategyDoc, project, chatHistory } = get();
    const API_URL = 'http://localhost:8000';
    
    const userMsg = typeof input === 'string' ? input : "Voice Command Received";
    set({ chatHistory: [...chatHistory, { role: 'user', content: userMsg }] });

    try {
        const formData = new FormData();
        if (input instanceof Blob) formData.append("file", input, "voice.webm");
        else formData.append("prompt", input);
        formData.append("layer", activeLayer);

        // --- 🚀 SWITCHING TO LIVE MODE ---
        const response = await fetch(`${API_URL}/agent/design/generate`, {
            method: "POST",
            body: formData,
            mode: 'cors',
        });

        if (!response.ok) throw new Error(`Agency Error: ${response.status}`);

        const data = await response.json();

        // 1. Update Chat (The PM's Voice)
        const assistantMsg = data.user_message || "I've updated the project board for you.";
        set({ chatHistory: [...get().chatHistory, { role: 'assistant', content: assistantMsg }] });

        // 2. Update Canvas (The Strategy Doc)
        if (data.strategy_doc) {
            set({ strategyDoc: data.strategy_doc });
        }
        
        // 3. Process Visual Layers (For downstream agents)
        if (data.nodes || data.root) {
            // (Processing logic for Journey/Sitemap/Wireframe remains the same)
            // ... [Omitted for brevity, keep your existing node processing logic here]
        }
        
        return data;

    } catch (e) {
        console.error("Agency Connection Error:", e);
        set({ chatHistory: [...get().chatHistory, { role: 'assistant', content: "I've lost connection to the specialists. Check the backend." }] });
        return null;
    }
  }
}));