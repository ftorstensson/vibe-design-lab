import dagre from 'dagre';
import { Node, Edge, Position } from '@xyflow/react';

const NODE_WIDTH = 250; // Wider to match Page Cards
const NODE_HEIGHT = 100;

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  
  dagreGraph.setGraph({ 
      rankdir: direction,
      align: isHorizontal ? 'UL' : undefined, // Center alignment for Trees looks better
      nodesep: isHorizontal ? 80 : 100, // Space between sibling nodes
      ranksep: isHorizontal ? 100 : 80  // Space between hierarchy levels
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    if (!nodeWithPosition) return node;

    return {
      ...node,
      // React Flow positioning logic
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - (NODE_WIDTH / 2),
        y: nodeWithPosition.y - (NODE_HEIGHT / 2),
      },
    };
  });

  // SMART EDGES: Assign handles based on layout direction
  const layoutedEdges = edges.map((edge) => {
      // SITEMAP (Vertical Tree) -> Use Step Lines (SmoothStep or Step)
      if (!isHorizontal) {
          return { 
              ...edge, 
              type: 'step', // Forces Right-Angles
              sourceHandle: 'bottom', // Force exit from bottom
              targetHandle: 'top',    // Force enter at top
              style: { stroke: '#000', strokeWidth: 2 }
          };
      } 
      // JOURNEY (Horizontal Flow) -> Use Bezier Curves
      else {
          return { 
              ...edge, 
              type: 'bezier', // Forces Curves
              sourceHandle: 'right', 
              targetHandle: 'left',
              style: { stroke: '#000', strokeWidth: 2 }
          };
      }
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
};