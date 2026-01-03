import { Node, Edge } from '@xyflow/react';

// FIX: Added 'STRATEGY' to the Union Type
export type VibeLayer = 'STRATEGY' | 'JOURNEY' | 'SITEMAP' | 'WIREFRAME';

export interface LayerData {
  nodes: Node[];
  edges: Edge[];
}

export interface VibeManifest {
  project: {
    id: string;
    name: string;
  };
  // Strategy Document Storage
  strategyDoc: string;
  
  layers: {
    JOURNEY: LayerData;
    SITEMAP: LayerData;
    WIREFRAME: LayerData;
  };
  activeLayer: VibeLayer;
}

export interface VibeStore extends VibeManifest {
  setActiveLayer: (layer: VibeLayer) => void;
  setStrategyDoc: (doc: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateManifest: (partial: Partial<VibeManifest>) => void;
}