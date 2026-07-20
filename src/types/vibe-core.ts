// src/types/vibe-core.ts
import { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from '@xyflow/react';

export type VibeLayer = 'STRATEGY' | 'LANDSCAPE' | 'JOURNEY' | 'SITEMAP' | 'WIREFRAME';
export type DeptStatus = 'NOT_STARTED' | 'DRAFTING' | 'STABLE' | 'EVOLVING';

export interface StrategyPaper {
  version: string;
  timestamp: string;
  masthead: string;
  headline: string;
  content: any; 
  brief?: {
    identity_narrative: string;
    founding_voice: string[];
    evidence_mandate: string;
  };
  appendix: any[]; 
  version_note: string;
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


export interface MilestoneRequirement {
  id: string;
  headline: string;
  intent_blurb: string;
  directive: string;
  is_archived: boolean;
}

export interface MilestoneDefinition {
  milestone_id: string;
  label: string;
  checklist_prompt: string;
  purpose: string;
  research_architecture: MilestoneRequirement[];
}

export interface SpecialistAgent {
  id: string;
  display_name: string;
  role: string;
  layer_id: VibeLayer | 'GLOBAL'; 
  dept_id: string;
  role_index: number;
  model_tier: 'FLASH' | 'PRO';
  system_prompt: string;
  optimization_target?: string; 
  loss_function?: string;
  physics_constraints?: string; 
}

export interface VibeManifest {
  project_name: string;
  strategyLedger: Record<string, DeptSlot>;
  chatHistory: ChatMessage[];
  strategyDoc: string;
  projectLedger: any[];
  activeLayer: VibeLayer;
  activeSpecialist: string | null; mission_manifesto: any;
  layers: {
    STRATEGY: LayerData;
    LANDSCAPE: LayerData;
    JOURNEY: LayerData;
    SITEMAP: LayerData;
    WIREFRAME: LayerData;
  };
}

export interface VibeStore extends VibeManifest {
  project: { id: string; name: string };
  projectList: ProjectMetadata[];
  agencyRoster: SpecialistAgent[]; 
  departmentRegistry: any[];
  milestoneRegistry: MilestoneDefinition[]; 
  isChatOpen: boolean;

  // --- INSPECTOR PROPERTIES ---
  lastWorldview: any;
  isInspectorOpen: boolean;
  setInspectorOpen: (open: boolean) => void;

  fetchProjects: () => Promise<void>;
  initProjectCloud: () => Promise<string>;
  loadProjectCloud: (id: string) => Promise<void>;
  renameProject: (newName: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  
  fetchRoster: () => Promise<void>;
  updateAgentInDB: (agentId: string, updates: Partial<SpecialistAgent>) => Promise<void>;
  updateDeptInDB: (deptId: string, updates: any) => Promise<void>;
  updateMilestoneInDB: (mId: string, updates: any) => Promise<void>;

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