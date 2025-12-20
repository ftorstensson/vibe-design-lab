// PRESERVES: UX-VIS-001 (Canvas State), SYS-DAT-001 (Manifest Structure)
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

// SHARED STYLE FOR NO GHOST BOX
const NODE_STYLE = { backgroundColor: 'transparent', border: 'none', width: 'auto', boxShadow: 'none' };

interface VibeActions {
  setActiveLayer: (layer: VibeLayer) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateManifest: (partial: Partial<VibeManifest>) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  generateLayout: (input: Blob | string) => Promise<void>;
}

export const useVibeStore = create<VibeStore & VibeActions>((set, get) => ({
  
  project: { id: 'demo', name: 'Demo Project' },
  activeLayer: 'JOURNEY',
  
  layers: {
    JOURNEY: { nodes: [], edges: [] }, // <--- CLEAN SLATE
    SITEMAP: { nodes: [], edges: [] },
    WIREFRAME: { nodes: [], edges: [] }
  },

  setActiveLayer: (layer: VibeLayer) => set({ activeLayer: layer }),

  setNodes: (nodes: Node[]) => {
    const { activeLayer, layers } = get();
    set({ layers: { ...layers, [activeLayer]: { ...layers[activeLayer], nodes } } });
  },

  setEdges: (edges: Edge[]) => {
    const { activeLayer, layers } = get();
    set({ layers: { ...layers, [activeLayer]: { ...layers[activeLayer], edges } } });
  },

  updateManifest: (partial) => set((state) => ({ ...state, ...partial })),

  onNodesChange: (changes: NodeChange[]) => {
    const { activeLayer, layers } = get();
    const currentNodes = layers[activeLayer].nodes;
    const updatedNodes = applyNodeChanges(changes, currentNodes);
    set({ layers: { ...layers, [activeLayer]: { ...layers[activeLayer], nodes: updatedNodes } } });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    const { activeLayer, layers } = get();
    const currentEdges = layers[activeLayer].edges;
    const updatedEdges = applyEdgeChanges(changes, currentEdges);
    set({ layers: { ...layers, [activeLayer]: { ...layers[activeLayer], edges: updatedEdges } } });
  },

  onConnect: (connection: Connection) => {
    const { activeLayer, layers } = get();
    const currentEdges = layers[activeLayer].edges;
    const updatedEdges = addEdge({ ...connection, style: { stroke: '#000', strokeWidth: 2 } }, currentEdges);
    set({ layers: { ...layers, [activeLayer]: { ...layers[activeLayer], edges: updatedEdges } } });
  },

  generateLayout: async (input: Blob | string) => {
    const { activeLayer, layers } = get();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    try {
        const formData = new FormData();
        if (input instanceof Blob) {
            formData.append("file", input, "voice_command.webm");
        } else {
            formData.append("prompt", input);
        }
        
        formData.append("layer", activeLayer);

        const response = await fetch(`${API_URL}/agent/design/generate`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Architect failed to generate");

        const data = await response.json();
        
        const rawNodes: Node[] = data.nodes.map((n: any) => ({
            id: n.id,
            type: activeLayer === 'WIREFRAME' && n.type === 'MobileScreen' ? 'MobileScreen' : n.type,
            data: { label: n.label },
            position: { x: 0, y: 0 },
            parentId: n.parentNode, 
            extent: n.parentNode ? 'parent' : undefined,
            style: NODE_STYLE // Ensures new nodes are ghost-free
        }));

        const rawEdges: Edge[] = data.edges.map((e: any) => ({
            id: e.id || `${e.source}-${e.target}`,
            source: e.source,
            target: e.target,
            label: e.label || "",
            style: { stroke: '#000', strokeWidth: 2 }
        }));

        const direction = activeLayer === 'SITEMAP' ? 'TB' : 'LR';
        const layout = getLayoutedElements(rawNodes, rawEdges, direction);

        set({
            layers: {
                ...layers,
                [activeLayer]: { nodes: layout.nodes, edges: layout.edges }
            }
        });

    } catch (e) {
        console.error("Generation Error:", e);
        alert("The Architect encountered an error.");
    }
  }

}));