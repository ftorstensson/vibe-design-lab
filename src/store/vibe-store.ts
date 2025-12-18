import { create } from 'zustand';
import { 
  Node, 
  Edge, 
  addEdge, 
  OnNodesChange, 
  OnEdgesChange, 
  applyNodeChanges, 
  applyEdgeChanges,
  NodeChange,   // <--- Added explicit type
  EdgeChange,   // <--- Added explicit type
  Connection    // <--- Added explicit type
} from '@xyflow/react';
import { VibeStore, VibeLayer, VibeManifest } from '@/types/vibe-core';

// --- MOCK DATA FOR INITIALIZATION ---
const INITIAL_JOURNEY_NODES: Node[] = [
  { id: '1', type: 'input', data: { label: 'User Opens App' }, position: { x: 250, y: 0 } },
  { id: '2', data: { label: 'Log In?' }, position: { x: 250, y: 100 } },
  { id: '3', data: { label: 'Dashboard' }, position: { x: 250, y: 200 } },
];
const INITIAL_JOURNEY_EDGES: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

export const useVibeStore = create<VibeStore & {
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
}>((set, get) => ({
  
  // 1. STATE (The Manifest)
  project: { id: 'demo', name: 'Demo Project' },
  activeLayer: 'JOURNEY', // Default View
  
  layers: {
    JOURNEY: { nodes: INITIAL_JOURNEY_NODES, edges: INITIAL_JOURNEY_EDGES },
    SITEMAP: { nodes: [], edges: [] },
    WIREFRAME: { nodes: [], edges: [] }
  },

  // 2. ACTIONS (Setters)
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

  updateManifest: (partial: Partial<VibeManifest>) => set((state) => ({ ...state, ...partial })),

  // 3. REACT FLOW HANDLERS (Typed for Strict Mode)
  onNodesChange: (changes: NodeChange[]) => {
    const { activeLayer, layers } = get();
    const currentNodes = layers[activeLayer].nodes;
    const updatedNodes = applyNodeChanges(changes, currentNodes);
    
    set({
      layers: {
        ...layers,
        [activeLayer]: { ...layers[activeLayer], nodes: updatedNodes }
      }
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    const { activeLayer, layers } = get();
    const currentEdges = layers[activeLayer].edges;
    const updatedEdges = applyEdgeChanges(changes, currentEdges);

    set({
      layers: {
        ...layers,
        [activeLayer]: { ...layers[activeLayer], edges: updatedEdges }
      }
    });
  },

  onConnect: (connection: Connection) => {
    const { activeLayer, layers } = get();
    const currentEdges = layers[activeLayer].edges;
    const updatedEdges = addEdge(connection, currentEdges);

    set({
      layers: {
        ...layers,
        [activeLayer]: { ...layers[activeLayer], edges: updatedEdges }
      }
    });
  },

}));