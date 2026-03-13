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
  the_opportunity: { id: 'the_opportunity', deptId: '2', label: 'The Opportunity', icon: 'BarChart3', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  the_people: { id: 'the_people', deptId: '3', label: 'The People', icon: 'Users', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  the_experience: { id: 'the_experience', deptId: '4', label: 'The Experience', icon: 'Magnet', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  the_mvp: { id: 'the_mvp', deptId: '5', label: 'The MVP - Killer App', icon: 'ShieldCheck', status: 'NOT_STARTED', activeVersion: 0, history: [] },
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
  // --- MANIFEST STATE (FLATTENED) ---
  project_name: 'New Project',
  strategyLedger: INITIAL_LEDGER,
  chatHistory: [],
  strategyDoc: "",
  projectLedger: [],
  mission_manifesto: {},
  activeLayer: 'STRATEGY',
  activeSpecialist: null,
  layers: { ...EMPTY_LAYERS },
  
  // --- SESSION STATE ---
  project: { id: '', name: 'New Project' },
  projectList: [],
  agencyRoster: [], 
  departmentRegistry: [],
  isChatOpen: true,
  lastWorldview: null,
  isInspectorOpen: false,

  // --- ACTIONS ---
  setInspectorOpen: (open: boolean) => set({ isInspectorOpen: open }),
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
    const initialManifest = {
        project_name: "UNTITLED PROJECT",
        mission_manifesto: {},
        strategyLedger: INITIAL_LEDGER,
        projectLedger: [],
        chatHistory: [],
        layers: { ...EMPTY_LAYERS, STRATEGY: { nodes: skeletonNodes, edges: [] } }
    };
    set({ project: { id, name: "UNTITLED PROJECT" }, ...initialManifest });
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
        const savedStrategy = m.layers?.STRATEGY || { nodes: [], edges: [] };
        
        const finalizedNodes = skeletonNodes.map(sNode => {
            const saved = savedStrategy.nodes.find(n => n.id === sNode.id);
            return saved ? { ...sNode, position: saved.position } : sNode;
        });
        const mergedLayers = { ...EMPTY_LAYERS, ...(m.layers || {}), STRATEGY: { nodes: finalizedNodes, edges: savedStrategy.edges } };

        set({ 
            ...get(),
            project: { id, name: dbName }, 
            project_name: dbName, 
            strategyLedger: currentLedger, 
            projectLedger: m.projectLedger || [],
            mission_manifesto: m.mission_manifesto || {},
            chatHistory: m.chatHistory || [], 
            strategyDoc: m.strategyDoc || "", 
            activeLayer: m.activeLayer || 'STRATEGY', 
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

    set({ lastWorldview: { layer: activeLayer, history: updatedChat, context: strategyLedger, ledger: get().projectLedger, dna: ambitionDNA, specialist: activeSpecialist } });

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
        const nextHistory = [...state.chatHistory, { role: "assistant" as const, content: data.user_message }];
        let nextProjectName = data.suggested_project_name || state.project_name;
        let nextManifesto = data.manifesto || state.mission_manifesto || {};

        let nextLedger = { ...state.strategyLedger };
        let nextLayers = { ...state.layers };

        if (state.activeLayer === "STRATEGY" && data.patch) {
            const { dept_id, content } = data.patch;
            if (nextLedger[dept_id]) {
                const newPaper = { ...content, manifesto: nextManifesto, timestamp: new Date().toISOString(), version: (nextLedger[dept_id].history.length + 1).toFixed(1) };
                nextLedger[dept_id] = { ...nextLedger[dept_id], status: "STABLE" as const, history: [...nextLedger[dept_id].history, newPaper], activeVersion: nextLedger[dept_id].history.length };
                nextLayers.STRATEGY = { nodes: generateStrategySkeleton(nextLedger), edges: [] };
            }
        } else if (data.nodes || data.root) {
            let newNodes = state.activeLayer === "WIREFRAME" && data.root ? flattenTree(data.root) : (data.nodes || []).map((n: any) => ({ id: n.id, type: n.type, data: { ...n }, position: { x: 0, y: 0 }, style: NODE_STYLE }));
            let newEdges = (data.edges || []).map((e: any) => ({ id: e.id || `${e.source}-${e.target}`, source: e.source, target: e.target, style: { stroke: "#000", strokeWidth: 2 } }));
            const layout = getLayoutedElements(newNodes, newEdges, state.activeLayer === "SITEMAP" ? "TB" : "LR");
            nextLayers[state.activeLayer] = { nodes: layout.nodes, edges: layout.edges };
        }

        return { 
            ...state, 
            chatHistory: nextHistory, 
            project_name: nextProjectName, 
            project: { ...state.project, name: nextProjectName },
            mission_manifesto: nextManifesto,
            strategyLedger: nextLedger,
            layers: nextLayers
        };
      });

      const latest = get();
      const manifest: VibeManifest = {
        project_name: latest.project_name,
        strategyLedger: latest.strategyLedger,
        projectLedger: latest.projectLedger,
        chatHistory: latest.chatHistory,
        strategyDoc: latest.strategyDoc,
        activeLayer: latest.activeLayer,
        activeSpecialist: latest.activeSpecialist,
        mission_manifesto: latest.mission_manifesto,
        layers: latest.layers
      };
      await fetch(`${API_URL}/agent/projects/save`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ thread_id: project.id, manifest }) });
      return data;
    } catch (e) { 
      console.error("Critical Connection Error:", e);
      return null; 
    }
  }
}));