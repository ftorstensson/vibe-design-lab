// --- SECTION A: IMPORTS ---
import { create } from 'zustand';
import { 
  Node, Edge, addEdge, applyNodeChanges, applyEdgeChanges, 
  NodeChange, EdgeChange, Connection 
} from '@xyflow/react';
import { VibeStore, VibeLayer, DeptSlot, StrategyPaper, VibeManifest, ChatMessage, ProjectMetadata } from '@/types/vibe-core';

// --- SECTION B: CONSTANTS & INITIAL STATE ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const NODE_STYLE = { backgroundColor: 'transparent', border: 'none', width: 'auto', boxShadow: 'none' };

const INITIAL_LEDGER: Record<string, DeptSlot> = {
  product_strategy: { id: 'product_strategy', deptId: '1', label: 'Product Strategy', icon: 'landscape', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  growth_lifecycle: { id: 'growth_lifecycle', deptId: '2', label: 'Growth & Lifecycle', icon: 'growth', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  audience_research: { id: 'audience_research', deptId: '3', label: 'Audience & Research', icon: 'audience', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  category_convention: { id: 'category_convention', deptId: '4', label: 'Category & Convention', icon: 'vibe', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  value_prop: { id: 'value_prop', deptId: '5', label: 'Value Prop & Messaging', icon: 'message', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  experience_principles: { id: 'experience_principles', deptId: '6', label: 'Experience & Principles', icon: 'experience', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  ia_discoverability: { id: 'ia_discoverability', deptId: '7', label: 'IA & Discoverability', icon: 'loop', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  content_systems: { id: 'content_systems', deptId: '8', label: 'Content Systems', icon: 'content', status: 'NOT_STARTED', activeVersion: 0, history: [] },
  measurement_learning: { id: 'measurement_learning', deptId: '9', label: 'Measurement & Learning', icon: 'metrics', status: 'NOT_STARTED', activeVersion: 0, history: [] },
};

// --- SECTION C: THE STORE INITIALIZATION ---
export const useVibeStore = create<VibeStore>((set, get) => ({
  // Manifest Properties
  project_name: 'New Project',
  strategyLedger: INITIAL_LEDGER,
  chatHistory: [],
  strategyDoc: "",
  activeLayer: 'STRATEGY',
  layers: { 
    STRATEGY: { nodes: [], edges: [] }, JOURNEY: { nodes: [], edges: [] }, 
    SITEMAP: { nodes: [], edges: [] }, WIREFRAME: { nodes: [] , edges: [] } 
  },

  // Local UI State
  project: { id: '', name: 'New Project' },
  projectList: [],
  isChatOpen: true,

  // --- SECTION D: UI ACTIONS ---
  setActiveLayer: (layer: VibeLayer) => set({ activeLayer: layer }),
  setChatOpen: (open: boolean) => set({ isChatOpen: open }),
  setStrategyDoc: (doc: string) => set({ strategyDoc: doc }),
  setNodes: (nodes: Node[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], nodes } } })),
  setEdges: (edges: Edge[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], edges } } })),
  updateManifest: (partial: Partial<VibeManifest>) => set((state) => ({ ...state, ...partial })),
  
  onNodesChange: (changes: NodeChange[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], nodes: applyNodeChanges(changes, state.layers[state.activeLayer].nodes) } } })),
  onEdgesChange: (changes: EdgeChange[]) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], edges: applyEdgeChanges(changes, state.layers[state.activeLayer].edges) } } })),
  onConnect: (connection: Connection) => set(state => ({ layers: { ...state.layers, [state.activeLayer]: { ...state.layers[state.activeLayer], edges: addEdge({ ...connection, style: { stroke: '#000', strokeWidth: 2 } }, state.layers[state.activeLayer].edges) } } })),

  // --- SECTION E: PERSISTENCE (HYGIENE) ---
  fetchProjects: async () => {
    try {
      const res = await fetch(`${API_URL}/agent/projects`);
      const data = await res.json();
      set({ projectList: data.projects || [] });
    } catch (e) { console.error("Failed to fetch projects", e); }
  },

  initProjectCloud: async () => {
    const id = `proj-${Math.random().toString(36).substr(2, 9)}`;
    try {
      await fetch(`${API_URL}/agent/projects/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: id, project_name: 'UNTITLED PROJECT' }),
      });
      return id;
    } catch (e) { return id; }
  },

  loadProjectCloud: async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/agent/projects/${id}`);
      const data = await res.json();
      const dbName = data.project_name || 'UNTITLED PROJECT';
      
      if (data.vibe_manifest) {
        const m = data.vibe_manifest as VibeManifest;
        set({
          project: { id, name: dbName },
          project_name: dbName,
          strategyLedger: m.strategyLedger || INITIAL_LEDGER,
          chatHistory: m.chatHistory || [],
          strategyDoc: m.strategyDoc || "",
          activeLayer: m.activeLayer || 'STRATEGY',
          layers: m.layers || { STRATEGY: { nodes: [], edges: [] }, JOURNEY: { nodes: [], edges: [] }, SITEMAP: { nodes: [], edges: [] }, WIREFRAME: { nodes: [] , edges: [] } }
        });
      } else {
        set({ 
          project: { id, name: dbName }, 
          project_name: dbName,
          strategyLedger: INITIAL_LEDGER, 
          chatHistory: [], 
          strategyDoc: "",
          activeLayer: 'STRATEGY',
          layers: { STRATEGY: { nodes: [], edges: [] }, JOURNEY: { nodes: [], edges: [] }, SITEMAP: { nodes: [], edges: [] }, WIREFRAME: { nodes: [] , edges: [] } } 
        });
      }
    } catch (e) { console.error("Hydration failed", e); }
  },

  renameProject: async (newName: string) => {
    const { project } = get();
    try {
      await fetch(`${API_URL}/agent/thread/${project.id}/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
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

  // --- SECTION F: THE GENERATOR (AUTOSAVE) ---
  generateLayout: async (input: Blob | string) => {
    const { activeLayer, strategyLedger, chatHistory, project } = get();
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

      const response = await fetch(`${API_URL}/agent/design/generate`, { method: "POST", body: formData, mode: 'cors' });
      const data = await response.json();

      set((state) => {
        const nextHistory: ChatMessage[] = [...state.chatHistory, { role: 'assistant', content: data.user_message }];
        let nextLedger = { ...state.strategyLedger };
        let nextLayers = { ...state.layers };

        if (state.activeLayer === 'STRATEGY' && data.patch) {
          const { dept_id, content, version_note } = data.patch;
          const currentDept = nextLedger[dept_id];
          if (currentDept) {
            const newPaper = { ...content, version_note, timestamp: new Date().toISOString(), version: (currentDept.history.length + 1).toFixed(1) };
            nextLedger[dept_id] = { ...currentDept, status: 'STABLE', history: [...currentDept.history, newPaper], activeVersion: currentDept.history.length };
            const newNodes = (Object.values(nextLedger) as DeptSlot[]).filter(d => d.history.length > 0).map((d, idx) => ({
              id: d.id, type: 'strategy', position: { x: idx * 600, y: 50 },
              data: { ...d.history[d.activeVersion], label: d.label, deptId: d.deptId, icon: d.icon }
            }));
            nextLayers.STRATEGY = { nodes: newNodes, edges: [] };
          }
        }
        
        // Autosave Manifest to Cloud
        const manifest: VibeManifest = { 
            project_name: state.project_name, 
            strategyLedger: nextLedger, 
            chatHistory: nextHistory, 
            strategyDoc: state.strategyDoc,
            activeLayer: state.activeLayer,
            layers: nextLayers
        };
        
        fetch(`${API_URL}/agent/projects/save`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ thread_id: state.project.id, manifest }) 
        });

        return { chatHistory: nextHistory, strategyLedger: nextLedger, layers: nextLayers };
      });
      return data;
    } catch (e) { return null; }
  }
}));