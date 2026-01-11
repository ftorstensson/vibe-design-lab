import { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from '@xyflow/react';

export type VibeLayer = 'STRATEGY' | 'JOURNEY' | 'SITEMAP' | 'WIREFRAME';
export type DeptStatus = 'NOT_STARTED' | 'DRAFTING' | 'STABLE' | 'EVOLVING';

export interface StrategyPaper {
  version: string;
  timestamp: string;
  context: string;
  summary: string[];
  report: string;
  version_note: string;
}

export interface DeptSlot {
  id: string;
  deptId: string;
  label: string;
  icon: string;
  status: DeptStatus;
  activeVersion: number;
  history: StrategyPaper[];
}

export interface LayerData {
  nodes: Node[];
  edges: Edge[];
}

export interface VibeManifest {
  project: {
    id: string;
    name: string;
  };
  strategyLedger: Record<string, DeptSlot>;
  strategyDoc: string; 
  layers: {
    STRATEGY: LayerData;
    JOURNEY: LayerData;
    SITEMAP: LayerData;
    WIREFRAME: LayerData;
  };
  activeLayer: VibeLayer;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface VibeStore extends VibeManifest {
  setActiveLayer: (layer: VibeLayer) => void;
  setStrategyDoc: (doc: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateManifest: (partial: Partial<VibeManifest>) => void;
  setChatOpen: (open: boolean) => void;
  isChatOpen: boolean;
  chatHistory: ChatMessage[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  generateLayout: (input: Blob | string) => Promise<any>;
}