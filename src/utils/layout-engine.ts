import dagre from 'dagre';
import { Node, Edge, Position } from '@xyflow/react';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;

/**
 * Auto-calculates X/Y coordinates for nodes using the Dagre algorithm.
 * Crucial for AI-generated flows which lack spatial awareness.
 */
export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    // We default to a standard size if not specified, prevents layout collapse
    dagreGraph.setNode(node.id, { 
        width: node.measured?.width || NODE_WIDTH, 
        height: node.measured?.height || NODE_HEIGHT 
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    // We shift the node so the center point aligns (Dagre gives center, React Flow wants top-left)
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      // We assume the node has dimensions, otherwise fallback to defaults
      position: {
        x: nodeWithPosition.x - (node.measured?.width || NODE_WIDTH) / 2,
        y: nodeWithPosition.y - (node.measured?.height || NODE_HEIGHT) / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};