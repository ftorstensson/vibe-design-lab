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

// SHARED STYLE
const NODE_STYLE = { backgroundColor: 'transparent', border: 'none', width: 'auto', boxShadow: 'none' };

// HELPER: Flatten Tree
const flattenTree = (node: any, parentId: string | null = null, depth = 0): Node[] => {
    const rfNode: Node = {
        id: node.id,
        type: node.type,
        data: { label: node.label, ...node.layout }, 
        position: { x: 20, y: (depth * 80) + 60 },
        parentId: parentId || undefined,
        extent: parentId ? 'parent' : undefined,
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

// ACTIONS INTERFACE
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
}

export const useVibeStore = create<VibeStore & VibeActions>((set, get) => ({
  
  project: { id: 'demo', name: 'Demo Project' },
  activeLayer: 'STRATEGY', // Default to Strategy
  strategyDoc: "# Project Strategy\n\n**Goal:** Define the core vision.\n**Target Audience:** ...\n**Core Loop:** ...",
  
  layers: {
    JOURNEY: { nodes: [], edges: [] }, 
    SITEMAP: { nodes: [], edges: [] },
    WIREFRAME: { nodes: [], edges: [] }
  },

  setActiveLayer: (layer: VibeLayer) => set({ activeLayer: layer }),
  setStrategyDoc: (doc: string) => set({ strategyDoc: doc }),

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
    const updatedNodes = applyNodeChanges(changes, currentNodes);
    set({ layers: { ...layers, [activeLayer]: { ...layers[activeLayer], nodes: updatedNodes } } });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    const { activeLayer, layers } = get();
    if (activeLayer === 'STRATEGY') return;
    const currentEdges = layers[activeLayer].edges;
    const updatedEdges = applyEdgeChanges(changes, currentEdges);
    set({ layers: { ...layers, [activeLayer]: { ...layers[activeLayer], edges: updatedEdges } } });
  },

  onConnect: (connection: Connection) => {
    const { activeLayer, layers } = get();
    if (activeLayer === 'STRATEGY') return;
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

        // IF STRATEGY: Return text for modal
        if (activeLayer === 'STRATEGY') {
            return data; 
        }
        
        // IF VISUAL: Process Nodes
        let newNodes: Node[] = [];
        let newEdges: Edge[] = [];

        if (activeLayer === 'WIREFRAME') {
            if (data.root) {
                newNodes = flattenTree(data.root);
            }
        } else {
            newNodes = data.nodes.map((n: any) => ({
                id: n.id,
                type: n.type,
                data: { ...n },
                position: { x: 0, y: 0 },
                style: NODE_STYLE
            }));
            
            newEdges = data.edges.map((e: any) => ({
                id: e.id || `${e.source}-${e.target}`,
                source: e.source,
                target: e.target,
                style: { stroke: '#000', strokeWidth: 2 }
            }));
        }

        const direction = activeLayer === 'SITEMAP' ? 'TB' : 'LR';
        const layout = getLayoutedElements(newNodes, newEdges, direction);

        set({
            layers: {
                ...layers,
                [activeLayer]: { nodes: layout.nodes, edges: layout.edges }
            }
        });
        
        return data;

    } catch (e) {
        console.error("Generation Error:", e);
        alert("The Architect encountered an error. Check console.");
        return null;
    }
  }

}));