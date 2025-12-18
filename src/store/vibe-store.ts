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

// --- MOCK DATA ---
const INITIAL_JOURNEY_NODES: Node[] = [
  { id: '1', type: 'input', data: { label: 'Start: App Open' }, position: { x: 250, y: 0 } },
  { id: '2', data: { label: 'Auth Check' }, position: { x: 250, y: 100 } },
];
const INITIAL_JOURNEY_EDGES: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

interface VibeActions {
  setActiveLayer: (layer: VibeLayer) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateManifest: (partial: Partial<VibeManifest>) => void;
  
  // React Flow Handlers
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;

  // AI Actions
  generateLayout: (input: Blob | string) => Promise<void>;
}

export const useVibeStore = create<VibeStore & VibeActions>((set, get) => ({
  
  // 1. STATE
  project: { id: 'demo', name: 'Demo Project' },
  activeLayer: 'JOURNEY',
  
  layers: {
    JOURNEY: { nodes: INITIAL_JOURNEY_NODES, edges: INITIAL_JOURNEY_EDGES },
    SITEMAP: { nodes: [], edges: [] },
    WIREFRAME: { nodes: [], edges: [] }
  },

  // 2. SETTERS
  setActiveLayer: (layer: VibeLayer) => set({ activeLayer: layer }),

  setNodes: (nodes: Node[]) => {
    const { activeLayer, layers } = get();
    set({
      layers: {
        ...layers,
        [activeLayer]: { ...layers[activeLayer], nodes }
      }
    });
  },

  setEdges: (edges: Edge[]) => {
    const { activeLayer, layers } = get();
    set({
      layers: {
        ...layers,
        [activeLayer]: { ...layers[activeLayer], edges }
      }
    });
  },

  updateManifest: (partial) => set((state) => ({ ...state, ...partial })),

  // 3. HANDLERS
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
    const updatedEdges = addEdge(connection, currentEdges);
    set({ layers: { ...layers, [activeLayer]: { ...layers[activeLayer], edges: updatedEdges } } });
  },

  // 4. THE AI BRIDGE
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

        // Call the Architect
        const response = await fetch(`${API_URL}/agent/design/generate`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Architect failed to generate");

        const data = await response.json();
        
        // Convert AI output to React Flow Nodes
        // The AI returns { nodes: [{id, type, label}], edges: [] }
        // We map these to React Flow structure
        const rawNodes: Node[] = data.nodes.map((n: any) => ({
            id: n.id,
            // For Wireframe layer, we default to MobileScreen containers, else default nodes
            type: activeLayer === 'WIREFRAME' ? 'MobileScreen' : 'default', 
            data: { label: n.label },
            position: { x: 0, y: 0 } // Layout engine will fix this
        }));

        const rawEdges: Edge[] = data.edges.map((e: any) => ({
            id: e.id || `${e.source}-${e.target}`,
            source: e.source,
            target: e.target,
            label: e.label || ""
        }));

        // Run the Layout Engine (The "Eyes")
        const layout = getLayoutedElements(rawNodes, rawEdges, 'TB'); // Top-Bottom layout

        // Update Store
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