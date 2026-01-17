// --- SECTION A: IMPORTS ---
import { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from '@xyflow/react';

// --- SECTION B: CORE TYPES ---
export type VibeLayer = 'STRATEGY' | 'JOURNEY' | 'SITEMAP' | 'WIREFRAME';
export type DeptStatus = 'NOT_STARTED' | 'DRAFTING' | 'STABLE' | 'EVOLVING';

export interface StrategyPaper {
  version: string;
  timestamp: string;
  masthead: string;
  headline: string;
  context: string;
  position_narrative: string;
  uncomfortable_truths: string[];
  risky_assumptions: string[];
  appendix: {
    researcher_notes: string;
    devils_advocate_teardown: string;
    outside_thinker_reframing: string;
    rejected_alternatives: string[];
    link_bank: string[];
  };
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
export interface VibeManifest {
  project_name: string;
  strategyLedger: Record<string, DeptSlot>;
  chatHistory: ChatMessage[];
  strategyDoc: string;
  activeLayer: VibeLayer;
  activeSpecialist: string | null; // <--- NEW: Tracking direct interviews
  layers: {
    STRATEGY: LayerData;
    JOURNEY: LayerData;
    SITEMAP: LayerData;
    WIREFRAME: LayerData;
  };
}

// --- SECTION D: THE STORE INTERFACE ---
export interface VibeStore extends VibeManifest {
  project: { id: string; name: string };
  projectList: ProjectMetadata[];
  isChatOpen: boolean;
  fetchProjects: () => Promise<void>;
  initProjectCloud: () => Promise<string>;
  loadProjectCloud: (id: string) => Promise<void>;
  renameProject: (newName: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  setActiveLayer: (layer: VibeLayer) => void;
  setChatOpen: (open: boolean) => void;
  setActiveSpecialist: (id: string | null) => void; // <--- NEW
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  generateLayout: (input: Blob | string) => Promise<any>;
  updateManifest: (partial: Partial<VibeManifest>) => void;
  setStrategyDoc: (doc: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}