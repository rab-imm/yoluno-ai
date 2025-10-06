import dagre from '@dagrejs/dagre';
import { Node, Edge } from '@xyflow/react';

interface FamilyMember {
  id: string;
  name: string;
  relationship?: string;
  photo_url?: string;
  birth_date?: string;
  tree_position_x?: number;
  tree_position_y?: number;
}

interface FamilyRelationship {
  id: string;
  person_id: string;
  related_person_id: string;
  relationship_type: string;
}

const NODE_WIDTH = 180;
const NODE_HEIGHT = 120;
const RANK_SEP = 200; // Vertical spacing between generations
const NODE_SEP = 150; // Horizontal spacing between nodes

export const getEdgeStyle = (relationshipType: string) => {
  const styles = {
    parent: { stroke: 'hsl(var(--primary))', strokeWidth: 3, strokeDasharray: 'none' },
    spouse: { stroke: 'hsl(var(--chart-2))', strokeWidth: 4, strokeDasharray: 'none' },
    sibling: { stroke: 'hsl(var(--chart-3))', strokeWidth: 2, strokeDasharray: '5,5' },
    grandparent: { stroke: 'hsl(var(--primary) / 0.5)', strokeWidth: 2, strokeDasharray: 'none' },
    extended: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3,3' },
  };
  return styles[relationshipType as keyof typeof styles] || styles.extended;
};

export const calculateTreeLayout = (
  members: FamilyMember[],
  relationships: FamilyRelationship[],
  useCustomPositions: boolean = false
): { nodes: Node[]; edges: Edge[] } => {
  // If members have custom positions and we should use them
  if (useCustomPositions && members.some(m => m.tree_position_x != null)) {
    const customNodes = members
      .filter(m => m.tree_position_x != null && m.tree_position_y != null)
      .map(member => ({
        id: member.id,
        type: 'member',
        position: {
          x: member.tree_position_x!,
          y: member.tree_position_y!,
        },
        data: { member },
      }));

    const customEdges = relationships.map(rel => ({
      id: rel.id,
      source: rel.person_id,
      target: rel.related_person_id,
      type: 'smoothstep',
      animated: false,
      style: getEdgeStyle(rel.relationship_type),
      label: rel.relationship_type,
      labelStyle: { fontSize: 10, fill: 'hsl(var(--muted-foreground))' },
    }));

    return { nodes: customNodes, edges: customEdges };
  }

  // Create directed graph
  const g = new dagre.graphlib.Graph();
  g.setGraph({ 
    rankdir: 'TB',
    ranksep: RANK_SEP,
    nodesep: NODE_SEP,
    edgesep: 50,
    marginx: 50,
    marginy: 50,
  });
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes
  members.forEach(member => {
    g.setNode(member.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Add edges with proper hierarchy
  relationships.forEach(rel => {
    // Only add parent-child edges for layout calculation
    if (rel.relationship_type === 'parent') {
      g.setEdge(rel.person_id, rel.related_person_id);
    }
  });

  // Calculate layout
  dagre.layout(g);

  // Create nodes with calculated positions
  const nodes: Node[] = members.map(member => {
    const nodeData = g.node(member.id);
    return {
      id: member.id,
      type: 'member',
      position: {
        x: nodeData.x - NODE_WIDTH / 2,
        y: nodeData.y - NODE_HEIGHT / 2,
      },
      data: { member },
    };
  });

  // Group spouses horizontally
  const spouseRelations = relationships.filter(r => r.relationship_type === 'spouse');
  spouseRelations.forEach(rel => {
    const person1Node = nodes.find(n => n.id === rel.person_id);
    const person2Node = nodes.find(n => n.id === rel.related_person_id);
    
    if (person1Node && person2Node) {
      // Position spouses side by side at same Y level
      const avgY = (person1Node.position.y + person2Node.position.y) / 2;
      person1Node.position.y = avgY;
      person2Node.position.y = avgY;
    }
  });

  // Create edges with styling
  const edges: Edge[] = relationships.map(rel => ({
    id: rel.id,
    source: rel.person_id,
    target: rel.related_person_id,
    type: 'smoothstep',
    animated: false,
    style: getEdgeStyle(rel.relationship_type),
    label: rel.relationship_type,
    labelStyle: { fontSize: 10, fill: 'hsl(var(--muted-foreground))' },
    labelBgStyle: { fill: 'hsl(var(--background))', fillOpacity: 0.8 },
  }));

  return { nodes, edges };
};

export const exportTreeToJSON = (members: FamilyMember[], relationships: FamilyRelationship[]) => {
  return JSON.stringify({ members, relationships }, null, 2);
};
