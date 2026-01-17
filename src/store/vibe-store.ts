// --- SECTION A: IMPORTS ---
import { create } from 'zustand';
import { 
  Node, Edge, addEdge, applyNodeChanges, applyEdgeChanges, 
  NodeChange, EdgeChange, Connection 
} from '@xyflow/react';
import { VibeStore, VibeLayer, DeptSlot, StrategyPaper, VibeManifest, ChatMessage } from '@/types/vibe-core';
import { getLayoutedElements } from '@/utils/layout-engine';

// --- SECTION B: CONSTANTS & THE FIVE PILLARS ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const NODE_STYLE = { backgroundColor: 'transparent', border: 'none', width: 'auto', boxShadow: 'none' };

const INITIAL_LEDGER: Record<string, DeptSlot> = {
  the_big_idea: { id: 'the_big_idea', deptId: '1', label: 'The Big Idea', icon: 'the_big_idea', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  market_reality: { id: 'market_reality', deptId: '2', label: 'Market Reality', icon: 'market_reality', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  audience_ecosystem: { id: 'audience_ecosystem', deptId: '3', label: 'Audience & Ecosystem', icon: 'audience_ecosystem', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  content_structure: { id: 'content_structure', deptId: '4', label: 'Content & Structure', icon: 'content_structure', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  ux_feasibility: { id: 'ux_feasibility', deptId: '5', label: 'UX & Feasibility', icon: 'ux_feasibility', status: 'NOT_STARTED', activeVersion: 0, history: [] },
};

// --- SECTION C: HELPERS ---
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

// --- SECTION D: STORE INITIALIZATION ---
export const useVibeStore = create<VibeStore>((set, get) => ({
  project_name: 'New Project',
  strategyLedger: INITIAL_LEDGER,
  chatHistory: [],
  strategyDoc: "",
  activeLayer: 'STRATEGY',
  activeSpecialist: null,
  layers: { STRATEGY: { nodes: [], edges: [] }, JOURNEY: { nodes: [], edges: [] }, SITEMAP: { nodes: [], edges: [] }, WIREFRAME: { nodes: [] , edges: [] } },
  project: { id: '', name: 'New Project' },
  projectList: [],
  isChatOpen: true,

  // --- SECTION E: UI ACTIONS ---
  setActiveLayer: (layer: VibeLayer) => set({ activeLayer: layer }),
  setChatOpen: (open: boolean = true) => set({ isChatOpen: open }),
  setActiveSpecialist: (id: string | null) => set({ activeSpecialist: id }),
  setStrategyDoc: (doc: string) => set({ strategyDoc: doc }),
  setNodes: (nodes: Node[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], nodes } } })),
  setEdges: (edges: Edge[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], edges } } })),
  updateManifest: (partial: Partial<VibeManifest>) => set((state) => ({ ...state, ...partial })),
  onNodesChange: (changes: NodeChange[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], nodes: applyNodeChanges(changes, state.layers[state.activeLayer].nodes) } } })),
  onEdgesChange: (changes: EdgeChange[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], edges: applyEdgeChanges(changes, state.layers[state.activeLayer].edges) } } })),
  onConnect: (connection: Connection) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], edges: addEdge({ ...connection, style: { stroke: '#000', strokeWidth: 2 } }, state.layers[state.activeLayer].edges) } } })),

  // --- SECTION F: PERSISTENCE (THE FILING CABINET) ---
  fetchProjects: async () => {
    try {
      const res = await fetch(`${API_URL}/agent/projects`);
      const data = await res.json();
      set({ projectList: data.projects || [] });
    } catch (e) { console.error("Fetch projects failed", e); }
  },

  initProjectCloud: async () => {
    const id = `proj-${Math.random().toString(36).substr(2, 9)}`;
    try {
      await fetch(`${API_URL}/agent/projects/init`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ thread_id: id, project_name: 'UNTITLED PROJECT' }) });
      // Set ID immediately locally to allow instant interaction
      set(state => ({ project: { ...state.project, id, name: 'UNTITLED PROJECT' } }));
      return id;
    } catch (e) { return id; }
  },

  loadProjectCloud: async (id: string) => {
    // 🛡️ SHIELD: Set the ID synchronously first to prevent "REJECTED" error
    set(state => ({ project: { ...state.project, id } }));

    try {
      const res = await fetch(`${API_URL}/agent/projects/${id}`);
      const data = await res.json();
      const dbName = data.project_name || 'UNTITLED';
      if (data.vibe_manifest) {
        const m = data.vibe_manifest as VibeManifest;
        set({ 
            project: { id, name: dbName }, 
            project_name: dbName, 
            strategyLedger: m.strategyLedger || INITIAL_LEDGER, 
            chatHistory: m.chatHistory || [], 
            strategyDoc: m.strategyDoc || "", 
            activeLayer: m.activeLayer || 'STRATEGY', 
            activeSpecialist: m.activeSpecialist || null, 
            layers: m.layers || { STRATEGY: { nodes: [], edges: [] }, JOURNEY: { nodes: [], edges: [] }, SITEMAP: { nodes: [], edges: [] }, WIREFRAME: { nodes: [] , edges: [] } } 
        });
      }
    } catch (e) { console.error("Hydration failed", e); }
  },

  renameProject: async (newName: string) => {
    const { project } = get();
    try {
      await fetch(`${API_URL}/agent/thread/${project.id}/rename`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName }) });
      set({ project: { ...project, name: newName }, project_name: newName });
    } catch (e) { console.error("Rename failed", e); }
  },

  deleteProject: async (id: string) => {
    try {
      await fetch(`${API_URL}/agent/thread/${id}`, { method: 'DELETE' });
      await get().fetchProjects();
    } catch (e) { console.error("Delete failed", e); }
  },

  togglePin: async (id: string) => {
    try {
      await fetch(`${API_URL}/agent/thread/${id}/pin`, { method: 'POST' });
      await get().fetchProjects();
    } catch (e) { console.error("Pin failed", e); }
  },

  // --- SECTION G: THE GENERATOR (SYNC & PATCH LOGIC) ---
  generateLayout: async (input: Blob | string) => {
    const { activeLayer, strategyLedger, chatHistory, project, activeSpecialist } = get();
    
    // Safety check remains but should no longer trigger due to synchronous ID setting
    if (!project.id) {
        console.error("❌ REJECTED: Store has no Project ID.");
        return null;
    }

    const userMsg = typeof input === 'string' ? input : "Voice Command Received";
    const updatedChat: ChatMessage[] = [...chatHistory, { role: 'user', content: userMsg }];
    set({ chatHistory: updatedChat });

    try {
      const formData = new FormData();
      if (input instanceof Blob) formData.append("file", input, "voice.webm");
      else formData.append("prompt", input);
      formData.append("layer", activeLayer);
      formData.append("project_id", project.id);
      formData.append("chat_history", JSON.stringify(updatedChat));
      formData.append("strategy_context", JSON.stringify(strategyLedger));
      if (activeSpecialist) formData.append("specialist_id", activeSpecialist);

      const response = await fetch(`${API_URL}/agent/design/generate`, { method: "POST", body: formData, mode: 'cors' });
      const data = await response.json();

      set((state) => {
        const nextHistory: ChatMessage[] = [...state.chatHistory, { role: 'assistant' as const, content: data.user_message }];
        let nextLedger = { ...state.strategyLedger };
        let nextLayers = { ...state.layers };

        if (state.activeLayer === 'STRATEGY' && data.patch) {
          const { dept_id, content } = data.patch;
          const currentDept = nextLedger[dept_id];
          if (currentDept) {
            const newPaper = { ...content, timestamp: new Date().toISOString(), version: (currentDept.history.length + 1).toFixed(1) };
            nextLedger[dept_id] = { ...currentDept, status: 'STABLE' as const, history: [...currentDept.history, newPaper], activeVersion: currentDept.history.length };
            const newNodes = (Object.values(nextLedger) as DeptSlot[]).filter(d => d.history.length > 0).map((d, idx) => ({
              id: d.id, type: 'strategy', position: { x: idx * 650, y: 50 },
              data: { ...d.history[d.activeVersion], label: d.label, deptId: d.deptId, icon: d.icon, version: d.history[d.activeVersion].version }
            }));
            nextLayers.STRATEGY = { nodes: newNodes, edges: [] };
          }
        } else if (data.nodes || data.root) {
            let newNodes: Node[] = [];
            let newEdges: Edge[] = [];
            if (state.activeLayer === 'WIREFRAME' && data.root) newNodes = flattenTree(data.root);
            else if (data.nodes) {
                newNodes = data.nodes.map((n: any) => ({ id: n.id, type: n.type, data: { ...n }, position: { x: 0, y: 0 }, style: NODE_STYLE }));
                if (data.edges) newEdges = data.edges.map((e: any) => ({ id: e.id || `${e.source}-${e.target}`, source: e.source, target: e.target, style: { stroke: '#000', strokeWidth: 2 } }));
            }
            const direction = state.activeLayer === 'SITEMAP' ? 'TB' : 'LR';
            const layout = getLayoutedElements(newNodes, newEdges, direction);
            nextLayers[state.activeLayer] = { nodes: layout.nodes, edges: layout.edges };
        }

        // --- AUTOSAVE MANIFEST ---
        const manifest: VibeManifest = { project_name: state.project_name, strategyLedger: nextLedger, chatHistory: nextHistory, strategyDoc: state.strategyDoc, activeLayer: state.activeLayer, activeSpecialist: state.activeSpecialist, layers: nextLayers };
        fetch(`${API_URL}/agent/projects/save`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ thread_id: state.project.id, manifest }) });

        return { chatHistory: nextHistory, strategyLedger: nextLedger, layers: nextLayers };
      });
      return data;
    } catch (e) { return null; }
  }
}));