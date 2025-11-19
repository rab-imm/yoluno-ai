import { useCallback, useMemo, useState, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  NodeMouseHandler,
  EdgeMouseHandler,
  OnNodesChange,
  OnEdgesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { calculateTreeLayout, exportTreeToJSON } from "@/lib/familyTreeLayout";
import { TreeControls } from "./TreeControls";
import { TreeExportPanel } from "./TreeExportPanel";
import { RelationshipEditor } from "./RelationshipEditor";
import { TreeSearch } from "./TreeSearch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

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

interface FamilyTreeFlowProps {
  members: FamilyMember[];
  relationships: FamilyRelationship[];
  onMemberClick: (member: FamilyMember) => void;
}

interface NodeData extends Record<string, unknown> {
  member: FamilyMember;
  onClick: (member: FamilyMember) => void;
}

const MemberNode = ({ data }: { data: NodeData }) => {
  return (
    <div
      onClick={() => data.onClick(data.member)}
      className="cursor-pointer bg-card border-2 border-border rounded-xl p-3 shadow-lg hover:shadow-xl transition-all hover:border-primary min-w-[160px]"
    >
      <div className="flex flex-col items-center gap-2">
        {data.member.photo_url ? (
          <img
            src={data.member.photo_url}
            alt={data.member.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
            {data.member.name.charAt(0)}
          </div>
        )}
        <div className="text-center">
          <p className="font-semibold text-sm">{data.member.name}</p>
          {data.member.relationship && (
            <p className="text-xs text-muted-foreground">{data.member.relationship}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  member: MemberNode,
};

export const FamilyTreeFlow = ({ members, relationships, onMemberClick }: FamilyTreeFlowProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState<{
    id: string;
    type: string;
    from: string;
    to: string;
  } | null>(null);
  const [useCustomLayout, setUseCustomLayout] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [relationshipFilter, setRelationshipFilter] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { fitView, zoomIn, zoomOut, setViewport, getViewport } = useReactFlow();

  // Filter members based on search and relationship filter
  const filteredMembers = useMemo(() => {
    let filtered = members;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(query)
      );
    }

    // Apply relationship filter
    if (relationshipFilter) {
      const filteredIds = new Set(filtered.map(m => m.id));
      const relatedIds = new Set<string>();
      
      relationships.forEach(rel => {
        if (rel.relationship_type === relationshipFilter) {
          if (filteredIds.has(rel.person_id)) relatedIds.add(rel.person_id);
          if (filteredIds.has(rel.related_person_id)) relatedIds.add(rel.related_person_id);
        }
      });
      
      filtered = filtered.filter(m => relatedIds.has(m.id));
    }

    return filtered;
  }, [members, searchQuery, relationshipFilter, relationships]);

  // Calculate layout using advanced algorithm
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const layout = calculateTreeLayout(filteredMembers, relationships, useCustomLayout);
    return {
      nodes: layout.nodes.map(node => {
        const member = (node.data as { member: FamilyMember }).member;
        return {
          ...node,
          data: { 
            member,
            onClick: onMemberClick 
          } as NodeData,
          className: searchQuery && 
            member.name.toLowerCase().includes(searchQuery.toLowerCase())
              ? "ring-2 ring-primary ring-offset-2"
              : "",
        };
      }),
      edges: layout.edges,
    };
  }, [filteredMembers, relationships, onMemberClick, useCustomLayout, searchQuery]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  // Save node positions to database when dragged
  const handleNodesChange: OnNodesChange<Node<NodeData>> = useCallback(
    (changes) => {
      onNodesChange(changes);
      
      // Save positions after drag
      changes.forEach(async (change) => {
        if (change.type === 'position' && change.dragging === false && change.position) {
          const { error } = await supabase
            .from('family_members')
            .update({
              tree_position_x: Math.round(change.position.x),
              tree_position_y: Math.round(change.position.y),
            })
            .eq('id', change.id);

          if (error) {
            console.error('Failed to save node position:', error);
          }
        }
      });
    },
    [onNodesChange]
  );

  // Handle edge clicks for editing
  const handleEdgeClick: EdgeMouseHandler = useCallback(
    (event, edge) => {
      if (!isEditMode) return;

      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);

      if (sourceNode && targetNode) {
        setSelectedRelationship({
          id: edge.id,
          type: edge.label as string || 'unknown',
          from: sourceNode.data.member.name,
          to: targetNode.data.member.name,
        });
      }
    },
    [isEditMode, nodes]
  );

  // Update relationship type
  const handleUpdateRelationship = async (relationshipId: string, newType: string) => {
    const { error } = await supabase
      .from('family_relationships')
      .update({ relationship_type: newType })
      .eq('id', relationshipId);

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Relationship updated",
        description: "The relationship type has been changed",
      });
      // Trigger re-fetch by parent component
    }
  };

  // Delete relationship
  const handleDeleteRelationship = async (relationshipId: string) => {
    const { error } = await supabase
      .from('family_relationships')
      .delete()
      .eq('id', relationshipId);

    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Relationship deleted",
        description: "The relationship has been removed",
      });
    }
  };

  // Reset to auto-layout
  const handleResetLayout = () => {
    setUseCustomLayout(false);
    toast({
      title: "Layout reset",
      description: "Tree positions reset to automatic layout",
    });
  };

  // Export data
  const handleExportData = () => {
    return exportTreeToJSON(members, relationships);
  };

  const currentZoom = getViewport().zoom;

  const handleZoomChange = (zoom: number) => {
    const viewport = getViewport();
    setViewport({ ...viewport, zoom });
  };

  return (
    <div 
      ref={reactFlowWrapper}
      className={`w-full border rounded-lg bg-background ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[600px]'
      }`}
      id="family-tree-container"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={handleEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        nodesDraggable={isEditMode}
      >
        <Background />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => "hsl(var(--primary))"}
          maskColor="hsl(var(--muted) / 0.6)"
          className="bg-background border rounded"
        />
        
        <Panel position="top-right" className="space-y-2">
          <TreeControls
            onZoomIn={() => zoomIn()}
            onZoomOut={() => zoomOut()}
            onFitView={() => fitView()}
            onResetZoom={() => handleZoomChange(1)}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            isFullscreen={isFullscreen}
            currentZoom={currentZoom}
            onZoomChange={handleZoomChange}
          />
          
          <TreeExportPanel
            treeElementId="family-tree-container"
            exportData={handleExportData}
          />
        </Panel>

        <Panel position="top-left" className="space-y-2">
          <RelationshipEditor
            isEditMode={isEditMode}
            onToggleEditMode={() => setIsEditMode(!isEditMode)}
            selectedRelationship={selectedRelationship}
            onUpdateRelationship={handleUpdateRelationship}
            onDeleteRelationship={handleDeleteRelationship}
            onClearSelection={() => setSelectedRelationship(null)}
          />
          
          {useCustomLayout && (
            <Button size="sm" variant="outline" onClick={handleResetLayout}>
              Reset Layout
            </Button>
          )}
        </Panel>
      </ReactFlow>
    </div>
  );
};
