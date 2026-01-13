// --- SECTION A: IMPORTS ---
import { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from '@xyflow/react';

// --- SECTION B: CORE COMPONENT TYPES ---
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

export interface ProjectMetadata {
  thread_id: string;
  project_name: string;
  updated_at: string;
  is_pinned?: boolean;
}

export interface LayerData {
  nodes: Node[];
  edges: Edge[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// --- SECTION C: THE UNIFIED MANIFEST ---
// Everything in this interface is what gets saved to Firestore
export interface VibeManifest {
  project_name: string;
  strategyLedger: Record<string, DeptSlot>;
  chatHistory: ChatMessage[];
  strategyDoc: string;
  activeLayer: VibeLayer;
  layers: {
    STRATEGY: LayerData;
    JOURNEY: LayerData;
    SITEMAP: LayerData;
    WIREFRAME: LayerData;
  };
}

// --- SECTION D: THE STORE (Manifest + Actions) ---
export interface VibeStore extends VibeManifest {
  // Global Project State (Local only)
  project: { id: string; name: string };
  projectList: ProjectMetadata[];
  isChatOpen: boolean;

  // Persistence Actions
  fetchProjects: () => Promise<void>;
  initProjectCloud: () => Promise<string>;
  loadProjectCloud: (id: string) => Promise<void>;
  renameProject: (newName: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  
  // State Modification Actions
  setActiveLayer: (layer: VibeLayer) => void;
  setChatOpen: (open: boolean) => void;
  setStrategyDoc: (doc: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateManifest: (partial: Partial<VibeManifest>) => void;
  
  // Physics & AI Logic
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  generateLayout: (input: Blob | string) => Promise<any>;
}