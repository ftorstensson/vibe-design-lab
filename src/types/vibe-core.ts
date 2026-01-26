// --- SECTION A: IMPORTS ---
import { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from '@xyflow/react';

// --- SECTION B: CORE COMPONENT TYPES ---
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
    domain_research: string;
    critical_teardown: string;
    lateral_reframing: string;
    opportunity_scout: string;
    build_constraints: string;
    synthesis_logic: string;
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

// FIX: Explicitly exported ProjectMetadata
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
  activeSpecialist: string | null;
  layers: {
    STRATEGY: LayerData;
    JOURNEY: LayerData;
    SITEMAP: LayerData;
    WIREFRAME: LayerData;
  };
}

// --- SECTION D: THE STORE INTERFACE ---
export interface VibeStore extends VibeManifest {
  // App & Session State
  project: { id: string; name: string };
  projectList: ProjectMetadata[];
  agencyRoster: any[]; 
  departmentRegistry: any[]; 
  isChatOpen: boolean;

  // Management Actions
  fetchProjects: () => Promise<void>;
  initProjectCloud: () => Promise<string>;
  loadProjectCloud: (id: string) => Promise<void>;
  renameProject: (newName: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  
  // Agency Lab Actions
  fetchRoster: () => Promise<void>;
  updateAgentInDB: (agentId: string, updates: any) => Promise<void>;
  updateDeptInDB: (deptId: string, updates: any) => Promise<void>;

  // UI & Physics Actions
  setActiveLayer: (layer: VibeLayer) => void;
  setChatOpen: (open?: boolean) => void;
  setActiveSpecialist: (id: string | null) => void;
  updateManifest: (partial: Partial<VibeManifest>) => void;
  setStrategyDoc: (doc: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  generateLayout: (input: Blob | string) => Promise<any>;
}