// --- SECTION A: CORE STRATEGY TYPES ---
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

// --- SECTION B: PROJECT METADATA ---
export interface ProjectMetadata {
  thread_id: string;
  project_name: string;
  updated_at: string;
}

export interface LayerData {
  nodes: Node[];
  edges: Edge[];
}

// --- SECTION C: STORE INTERFACE ---
export interface VibeManifest {
  project: {
    id: string;
    name: string;
  };
  projectList: ProjectMetadata[]; // For the homepage list
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
  // Navigation & UI
  setActiveLayer: (layer: VibeLayer) => void;
  setChatOpen: (open: boolean) => void;
  isChatOpen: boolean;
  chatHistory: ChatMessage[];
  
  // Project Management
  fetchProjects: () => Promise<void>;
  initProject: (id: string, name?: string) => void;
  renameProject: (newName: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Flow Actions
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  generateLayout: (input: Blob | string) => Promise<any>;
}