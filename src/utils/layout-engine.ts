import dagre from 'dagre';
import { Node, Edge, Position } from '@xyflow/react';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 150;

/**
 * SPINE + RIBS LAYOUT ENGINE
 * Replaces Dagre for Journey Flows to ensure the "Happy Path" is a straight line.
 */
export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';

  // 1. Fallback to Dagre for Sitemap/Wireframes (Tree structures)
  if (!isHorizontal) {
    return runDagreLayout(nodes, edges);
  }

  // 2. SPINE LAYOUT (For User Journeys)
  // Logic: Hero nodes go on Y=0. Others go above/below.
  
  const heroNodes = nodes.filter(n => n.data.variant === 'hero');
  const otherNodes = nodes.filter(n => n.data.variant !== 'hero');

  // Sort heroes by logic (simplistic assumption: ID order or connection order)
  // In a real graph traverse, we'd follow the edges. For now, we assume AI output order roughly matches flow.
  
  // Position Spine (Heroes)
  let currentX = 0;
  heroNodes.forEach((node) => {
    node.position = { x: currentX, y: 0 };
    node.targetPosition = Position.Left;
    node.sourcePosition = Position.Right;
    currentX += 350; // Wide spacing
  });

  // Position Ribs (Others) relative to their source
  otherNodes.forEach((node, i) => {
    // Find who connects to this node
    const sourceEdge = edges.find(e => e.target === node.id);
    const parent = nodes.find(n => n.id === sourceEdge?.source);

    if (parent) {
      // Alternate Top/Bottom
      const offset = (i % 2 === 0) ? -250 : 250; 
      node.position = { 
          x: parent.position.x, 
          y: parent.position.y + offset 
      };
    } else {
      // Orphan: Put it at the end
      node.position = { x: currentX, y: 200 };
      currentX += 200;
    }
    
    node.targetPosition = Position.Left;
    node.sourcePosition = Position.Right;
  });

  // Smart Edges
  const layoutedEdges = edges.map((edge) => ({
      ...edge,
      sourceHandle: 'right',
      targetHandle: 'left',
      type: 'bezier'
  }));

  return { nodes, edges: layoutedEdges };
};

// --- DAGRE FALLBACK (For Sitemaps) ---
const runDagreLayout = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 100 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 250, height: 100 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return {
        nodes: nodes.map((node) => {
            const pos = dagreGraph.node(node.id);
            return {
                ...node,
                targetPosition: Position.Top,
                sourcePosition: Position.Bottom,
                position: { x: pos.x - 125, y: pos.y - 50 }
            };
        }),
        edges: edges.map(e => ({ ...e, type: 'step', sourceHandle: 'bottom', targetHandle: 'top' }))
    };
};