import { create } from 'zustand';
import { 
  Node, Edge, addEdge, applyNodeChanges, applyEdgeChanges, 
  NodeChange, EdgeChange, Connection 
} from '@xyflow/react';
import { VibeStore, VibeLayer, DeptSlot, VibeManifest, ChatMessage, MilestoneDefinition } from '@/types/vibe-core';

// UCC v1.1 Relative Pathing for Cloud Run
const API_URL = '/api';
const NODE_STYLE = { backgroundColor: 'transparent', border: 'none', width: 'auto', boxShadow: 'none' };

const INITIAL_LEDGER: Record<string, DeptSlot> = {
  the_big_idea: { id: 'the_big_idea', deptId: 'STRATEGY_POD', label: 'The Big Idea', icon: 'Zap', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  the_opportunity: { id: 'the_opportunity', deptId: 'STRATEGY_POD', label: 'The Opportunity', icon: 'BarChart3', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  the_people: { id: 'the_people', deptId: 'STRATEGY_POD', label: 'The People', icon: 'Users', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  the_experience: { id: 'the_experience', deptId: 'STRATEGY_POD', label: 'The Experience', icon: 'Magnet', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  the_mvp: { id: 'the_mvp', deptId: 'STRATEGY_POD', label: 'The MVP', icon: 'ShieldCheck', status: 'NOT_STARTED', activeVersion: 0, history: [] },
};

const STRATEGY_ORDER = ['the_big_idea', 'the_opportunity', 'the_people', 'the_experience', 'the_mvp'];

const generateStrategySkeleton = (ledger: Record<string, DeptSlot>) => {
    return STRATEGY_ORDER.map((key, idx) => {
        const dept = ledger[key] || INITIAL_LEDGER[key];
        return {
            id: dept.id,
            type: 'strategy',
            position: { x: idx * 650, y: 50 },
            data: { 
                ...(dept.history[dept.activeVersion] || {}),
                label: dept.label,
                deptId: dept.id,
                status: dept.status,
                isGhost: dept.history.length === 0
            }
        };
    });
};

export const useVibeStore = create<VibeStore>((set, get) => ({
  project_name: 'New Project',
  strategyLedger: INITIAL_LEDGER,
  chatHistory: [],
  strategyDoc: "",
  projectLedger: [],
  mission_manifesto: {},
  activeLayer: 'STRATEGY',
  activeSpecialist: null,
  layers: { STRATEGY: { nodes: [], edges: [] }, LANDSCAPE: { nodes: [], edges: [] }, JOURNEY: { nodes: [], edges: [] }, SITEMAP: { nodes: [], edges: [] }, WIREFRAME: { nodes: [], edges: [] } },
  project: { id: '', name: 'New Project' },
  projectList: [],
  agencyRoster: [], 
  departmentRegistry: [],
  milestoneRegistry: [], 
  isChatOpen: true,
  lastWorldview: null,
  isInspectorOpen: false,

  setInspectorOpen: (open: boolean) => set({ isInspectorOpen: open }),
  setActiveLayer: (layer: VibeLayer) => set({ activeLayer: layer }),
  setChatOpen: (open: boolean = true) => set({ isChatOpen: open }),
  setActiveSpecialist: (id: string | null) => set({ activeSpecialist: id }),
  updateManifest: (partial: Partial<VibeManifest>) => set((state: VibeStore) => ({ ...state, ...partial })),
  setStrategyDoc: (doc: string) => set({ strategyDoc: doc }),
  setNodes: (nodes: Node[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], nodes } } })),
  setEdges: (edges: Edge[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], edges } } })),
  onNodesChange: (changes: NodeChange[]) => set((state: VibeStore) => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], nodes: applyNodeChanges(changes, state.layers[state.activeLayer].nodes) } } })),
  onEdgesChange: (changes: EdgeChange[]) => set((state: VibeStore) => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], edges: applyEdgeChanges(changes, state.layers[state.activeLayer].edges) } } })),
  onConnect: (connection: Connection) => set((state: VibeStore) => {
      const updatedEdges = addEdge({ ...connection, style: { stroke: '#000', strokeWidth: 2 } }, state.layers[state.activeLayer].edges);
      return { layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], edges: updatedEdges } } };
  }),

  fetchProjects: async () => {
    try {
      const res = await fetch(`${API_URL}/agent/projects`);
      const data = await res.json();
      set({ projectList: data.projects || [] });
    } catch (e) { console.error("Project fetch failed", e); }
  },

  initProjectCloud: async () => {
    const id = `proj-${Math.random().toString(36).substr(2, 9)}`;
    const skeletonNodes = generateStrategySkeleton(INITIAL_LEDGER);
    set({ project: { id, name: "UNTITLED PROJECT" }, project_name: "UNTITLED PROJECT", chatHistory: [], mission_manifesto: {}, strategyLedger: INITIAL_LEDGER, layers: { ...get().layers, STRATEGY: { nodes: skeletonNodes, edges: [] } } });
    await fetch(`${API_URL}/agent/projects`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ thread_id: id, project_name: 'UNTITLED PROJECT' }) });
    return id;
  },

  loadProjectCloud: async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/agent/projects/${id}`);
      const data = await res.json();
      if (data) {
        const m = data.vibe_manifest || {};
        set({ 
            project: { id, name: data.project_name || 'UNTITLED' }, 
            project_name: data.project_name || 'UNTITLED', 
            strategyLedger: m.strategyLedger || INITIAL_LEDGER, 
            mission_manifesto: m.mission_manifesto || m.slots?.manifesto || {},
            chatHistory: m.chatHistory || [], 
            layers: { ...get().layers, ...(m.layers || {}) }
        });
      }
    } catch (e) { console.error("Hydration failed", e); }
  },

  fetchRoster: async () => {
    try {
        const [resA, resD, resM] = await Promise.all([
          fetch(`${API_URL}/agent/roster`),
          fetch(`${API_URL}/agent/departments`),
          fetch(`${API_URL}/agent/milestones`)
        ]);
        const [dataA, dataD, dataM] = await Promise.all([resA.json(), resD.json(), resM.json()]);
        set({ 
          agencyRoster: dataA.roster || [], 
          departmentRegistry: dataD.departments || [], 
          milestoneRegistry: dataM.milestones || [] 
        });
    } catch (e) { console.error("Roster fetch failed", e); }
  },

  updateAgentInDB: async (agentId: string, updates: any) => {
    await fetch(`${API_URL}/agent/roster/${agentId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    await get().fetchRoster();
  },

  updateMilestoneInDB: async (mId: string, updates: any) => {
    await fetch(`${API_URL}/agent/milestones/${mId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    await get().fetchRoster();
  },

  updateDeptInDB: async (deptId: string, updates: any) => {
    await fetch(`${API_URL}/agent/departments/${deptId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    await get().fetchRoster();
  },

  generateLayout: async (input: Blob | string) => {
    const { project, activeLayer, chatHistory, activeSpecialist } = get();
    if (!project.id) return null;
    const userMsg = typeof input === 'string' ? input : "Voice Note";
    const updatedChat = [...chatHistory, { role: 'user' as const, content: userMsg }];
    set({ chatHistory: updatedChat });

    const formData = new FormData();
    if (input instanceof Blob) formData.append("file", input, "voice.webm");
    else formData.append("prompt", input);
    formData.append("project_id", project.id);
    formData.append("layer", activeLayer);
    if (activeSpecialist) formData.append("specialist_id", activeSpecialist);

    const response = await fetch(`${API_URL}/agent/design/generate`, { method: "POST", body: formData });
    const data = await response.json();

    if (data.user_message) {
      set({ chatHistory: [...updatedChat, { role: 'assistant' as const, content: data.user_message }] });
    }

    return data;
  }
}));
