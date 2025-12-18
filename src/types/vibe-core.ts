import { Node, Edge } from '@xyflow/react';

// The 3 Lenses (View Modes)
export type VibeLayer = 'JOURNEY' | 'SITEMAP' | 'WIREFRAME';

// The Data Structure for a single layer
export interface LayerData {
  nodes: Node[];
  edges: Edge[];
}

// THE VIBE MANIFEST (The Single Source of Truth)
export interface VibeManifest {
  project: {
    id: string;
    name: string;
  };
  // The 3 Layers exist simultaneously in memory
  layers: {
    JOURNEY: LayerData;   // Logic Flowchart
    SITEMAP: LayerData;   // Tree Structure
    WIREFRAME: LayerData; // The Mobile Screens
  };
  activeLayer: VibeLayer;
}

// Store Actions (The things we can do to the brain)
export interface VibeStore extends VibeManifest {
  setActiveLayer: (layer: VibeLayer) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateManifest: (partial: Partial<VibeManifest>) => void;
}