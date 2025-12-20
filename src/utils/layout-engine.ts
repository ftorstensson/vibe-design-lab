import dagre from 'dagre';
import { Node, Edge, Position } from '@xyflow/react';

const NODE_WIDTH = 150;
const NODE_HEIGHT = 150; // Increased to match the square shapes

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ 
      rankdir: direction,
      align: 'UL',
      nodesep: 80,
      ranksep: 100
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
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - (NODE_WIDTH / 2),
        y: nodeWithPosition.y - (NODE_HEIGHT / 2),
      },
    };
  });

  // SMART EDGES: Assign specific handles based on direction
  const layoutedEdges = edges.map((edge) => {
      if (isHorizontal) {
          return { ...edge, sourceHandle: 'right', targetHandle: 'left' };
      } else {
          return { ...edge, sourceHandle: 'bottom', targetHandle: 'top' };
      }
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
};