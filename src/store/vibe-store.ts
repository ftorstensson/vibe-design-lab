// src/store/vibe-store.ts
import { create } from 'zustand';
import { 
  Node, Edge, addEdge, applyNodeChanges, applyEdgeChanges, 
  NodeChange, EdgeChange, Connection 
} from '@xyflow/react';
import { VibeStore, VibeLayer, DeptSlot, VibeManifest, ChatMessage } from '@/types/vibe-core';
import { getLayoutedElements } from '@/utils/layout-engine';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const NODE_STYLE = { backgroundColor: 'transparent', border: 'none', width: 'auto', boxShadow: 'none' };

const EMPTY_LAYERS = {
    STRATEGY: { nodes: [], edges: [] },
    LANDSCAPE: { nodes: [], edges: [] },
    JOURNEY: { nodes: [], edges: [] },
    SITEMAP: { nodes: [], edges: [] },
    WIREFRAME: { nodes: [] , edges: [] }
};

const INITIAL_LEDGER: Record<string, DeptSlot> = {
  the_big_idea: { id: 'the_big_idea', deptId: '1', label: 'The Big Idea', icon: 'Zap', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  market_research: { id: 'market_research', deptId: '2', label: 'Market Research', icon: 'BarChart3', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  audience_mapping: { id: 'audience_mapping', deptId: '3', label: 'Audience Mapping', icon: 'Users', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  user_experience: { id: 'user_experience', deptId: '4', label: 'User Experience', icon: 'Magnet', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  the_mvp: { id: 'the_mvp', deptId: '5', label: 'The MVP - Killer App', icon: 'ShieldCheck', status: 'NOT_STARTED', activeVersion: 0, history: [] },
};

const generateStrategySkeleton = (ledger: Record<string, DeptSlot>) => {
    return Object.values(ledger).map((dept, idx) => ({
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
    }));
};

const flattenTree = (node: any, parentId: string | null = null, depth = 0): Node[] => {
    const rfNode: Node = { id: node.id, type: node.type, data: { label: node.label, ...node.layout }, position: { x: 20, y: (depth * 80) + 60 }, parentId: parentId || undefined, extent: parentId ? 'parent' : undefined, style: NODE_STYLE };
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

export const useVibeStore = create<VibeStore>((set, get) => ({
  project_name: 'New Project',
  strategyLedger: INITIAL_LEDGER,
  chatHistory: [],
  strategyDoc: "",
  activeLayer: 'STRATEGY',
  activeSpecialist: null,
  layers: { ...EMPTY_LAYERS },
  project: { id: '', name: 'New Project' },
  projectList: [],
  agencyRoster: [], 
  departmentRegistry: [],
  isChatOpen: true,

  setActiveLayer: (layer: VibeLayer) => set({ activeLayer: layer }),
  setChatOpen: (open: boolean = true) => set({ isChatOpen: open }),
  setActiveSpecialist: (id: string | null) => set({ activeSpecialist: id }),
  setStrategyDoc: (doc: string) => set({ strategyDoc: doc }),
  setNodes: (nodes: Node[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], nodes } } })),
  setEdges: (edges: Edge[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], edges } } })),
  updateManifest: (partial: Partial<VibeManifest>) => set((state: VibeStore) => ({ ...state, ...partial })),
  
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
    } catch (e) { console.error(e); }
  },

  initProjectCloud: async () => {
    const id = `proj-${Math.random().toString(36).substr(2, 9)}`;
    const skeletonNodes = generateStrategySkeleton(INITIAL_LEDGER);
    set({ 
        project: { id, name: 'UNTITLED PROJECT' },
        project_name: 'UNTITLED PROJECT',
        strategyLedger: INITIAL_LEDGER,
        chatHistory: [],
        activeSpecialist: null,
        layers: { ...EMPTY_LAYERS, STRATEGY: { nodes: skeletonNodes, edges: [] } }
    });
    await fetch(`${API_URL}/agent/projects/init`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ thread_id: id, project_name: 'UNTITLED PROJECT' }) });
    return id;
  },

  loadProjectCloud: async (id: string) => {
    set(state => ({ project: { ...state.project, id } }));
    try {
      const res = await fetch(`${API_URL}/agent/projects/${id}`);
      const data = await res.json();
      const dbName = data.project_name || 'UNTITLED';
      if (data.vibe_manifest) {
        const m = data.vibe_manifest as VibeManifest;
        const currentLedger = m.strategyLedger || INITIAL_LEDGER;
        const skeletonNodes = generateStrategySkeleton(currentLedger);
        const mergedLayers = { ...EMPTY_LAYERS, ...(m.layers || {}), STRATEGY: { nodes: skeletonNodes, edges: [] } };

        set({ 
            project: { id, name: dbName }, 
            project_name: dbName, 
            strategyLedger: currentLedger, 
            chatHistory: m.chatHistory || [], 
            strategyDoc: m.strategyDoc || "", 
            activeLayer: m.activeLayer || 'STRATEGY', 
            activeSpecialist: m.activeSpecialist || null, 
            layers: mergedLayers
        });
      }
    } catch (e) { console.error("Hydration failed", e); }
  },

  renameProject: async (newName: string) => {
    const { project } = get();
    await fetch(`${API_URL}/agent/thread/${project.id}/rename`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName }) });
    set({ project: { ...project, name: newName }, project_name: newName });
  },

  deleteProject: async (id: string) => {
    await fetch(`${API_URL}/agent/thread/${id}`, { method: 'DELETE' });
    await get().fetchProjects();
  },

  togglePin: async (id: string) => {
    await fetch(`${API_URL}/agent/thread/${id}/pin`, { method: 'POST' });
    await get().fetchProjects();
  },

  fetchRoster: async () => {
    try {
        const resA = await fetch(`${API_URL}/agent/roster`);
        const dataA = await resA.json();
        const resD = await fetch(`${API_URL}/agent/departments`);
        const dataD = await resD.json();
        set({ agencyRoster: dataA.roster || [], departmentRegistry: dataD.departments || [] });
    } catch (e) { console.error(e); }
  },

  updateAgentInDB: async (agentId: string, updates: any) => {
    await fetch(`${API_URL}/agent/roster/${agentId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    await get().fetchRoster();
  },

  updateDeptInDB: async (deptId: string, updates: any) => {
    await fetch(`${API_URL}/agent/departments/${deptId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    await get().fetchRoster();
  },

  generateLayout: async (input: Blob | string) => {
    const { activeLayer, strategyLedger, chatHistory, project, activeSpecialist } = get();
    if (!project.id) return null;

    const userMsg = typeof input === 'string' ? input : "Voice Command Received";
    const updatedChat: ChatMessage[] = [...chatHistory, { role: 'user', content: userMsg }];
    set({ chatHistory: updatedChat });

    const ambitionDNA = "Mode: Vibe Coding (AI-First). Ambition: Venture-Grade. Goal: Scale and logic-driven defensibility.";

    try {
      const formData = new FormData();
      if (input instanceof Blob) formData.append("file", input, "voice.webm");
      else formData.append("prompt", input);
      
      formData.append("layer", activeLayer);
      formData.append("project_id", project.id);
      formData.append("chat_history", JSON.stringify(updatedChat));
      formData.append("strategy_context", JSON.stringify(strategyLedger));
      formData.append("ambition_dna", ambitionDNA); 
      
      if (activeSpecialist) formData.append("specialist_id", activeSpecialist);

      const response = await fetch(`${API_URL}/agent/design/generate`, { method: "POST", body: formData, mode: 'cors' });
      const data = await response.json();

      set((state: VibeStore) => {
        const nextHistory: ChatMessage[] = [...state.chatHistory, { role: 'assistant' as const, content: data.user_message }];
        let nextLedger = { ...state.strategyLedger };
        let nextLayers = { ...state.layers };
        
        let nextProjectName = state.project_name;
        if (data.suggested_project_name) nextProjectName = data.suggested_project_name;

        if (state.activeLayer === 'STRATEGY' && data.patch) {
            const { dept_id, content } = data.patch;
            const currentDept = nextLedger[dept_id];
            if (currentDept) {
                const newPaper = { 
                  ...content, 
                  timestamp: new Date().toISOString(), 
                  version: (currentDept.history.length + 1).toFixed(1) 
                };
                nextLedger[dept_id] = { ...currentDept, status: 'STABLE' as const, history: [...currentDept.history, newPaper], activeVersion: currentDept.history.length };
                const newNodes = generateStrategySkeleton(nextLedger);
                nextLayers.STRATEGY = { nodes: newNodes, edges: [] };
            }
        } 
        else if (data.nodes || data.root) {
            let newNodes: Node[] = [];
            let newEdges: Edge[] = [];
            if (state.activeLayer === 'WIREFRAME' && data.root) {
                newNodes = flattenTree(data.root);
            } else if (data.nodes) {
                newNodes = data.nodes.map((n: any) => ({ id: n.id, type: n.type, data: { ...n }, position: { x: 0, y: 0 }, style: NODE_STYLE }));
                if (data.edges) newEdges = data.edges.map((e: any) => ({ id: e.id || `${e.source}-${e.target}`, source: e.source, target: e.target, style: { stroke: '#000', strokeWidth: 2 } }));
            }
            const direction = state.activeLayer === 'SITEMAP' ? 'TB' : 'LR';
            const layout = getLayoutedElements(newNodes, newEdges, direction);
            nextLayers[state.activeLayer] = { nodes: layout.nodes, edges: layout.edges };
        }

        return { chatHistory: nextHistory, strategyLedger: nextLedger, layers: nextLayers, project_name: nextProjectName, project: { ...state.project, name: nextProjectName } };
      });

      const latest = get();
      const manifest: VibeManifest = { project_name: latest.project_name, strategyLedger: latest.strategyLedger, chatHistory: latest.chatHistory, strategyDoc: latest.strategyDoc, activeLayer: latest.activeLayer, activeSpecialist: latest.activeSpecialist, layers: latest.layers };
      await fetch(`${API_URL}/agent/projects/save`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ thread_id: project.id, manifest }) });
      return data;
    } catch (e) { 
      console.error("Critical Connection Error:", e);
      return null; 
    }
  }
}));