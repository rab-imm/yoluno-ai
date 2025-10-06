import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface FamilyMember {
  id: string;
  name: string;
  relationship?: string;
  photo_url?: string;
  birth_date?: string;
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

const MemberNode = ({ data }: any) => {
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
  // Build tree structure
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Simple layout algorithm: arrange by generation
    const generations = new Map<string, number>();
    const positioned = new Set<string>();

    // Calculate generations
    const calculateGeneration = (memberId: string, gen: number = 0) => {
      if (positioned.has(memberId)) return;
      positioned.add(memberId);
      generations.set(memberId, gen);

      const childRels = relationships.filter(
        (r) => r.person_id === memberId && r.relationship_type === "parent"
      );
      childRels.forEach((rel) => calculateGeneration(rel.related_person_id, gen + 1));
    };

    // Start with root members (no parents)
    const rootMembers = members.filter(
      (m) => !relationships.some((r) => r.related_person_id === m.id && r.relationship_type === "parent")
    );
    rootMembers.forEach((m) => calculateGeneration(m.id));

    // Position nodes by generation
    const genMap = new Map<number, string[]>();
    generations.forEach((gen, memberId) => {
      if (!genMap.has(gen)) genMap.set(gen, []);
      genMap.get(gen)!.push(memberId);
    });

    genMap.forEach((memberIds, gen) => {
      memberIds.forEach((memberId, index) => {
        const member = members.find((m) => m.id === memberId);
        if (!member) return;

        nodes.push({
          id: memberId,
          type: "member",
          position: {
            x: index * 200,
            y: gen * 150,
          },
          data: { member, onClick: onMemberClick },
        });
      });
    });

    // Create edges
    relationships.forEach((rel) => {
      if (rel.relationship_type === "parent") {
        edges.push({
          id: rel.id,
          source: rel.person_id,
          target: rel.related_person_id,
          type: ConnectionLineType.SmoothStep,
          animated: false,
          style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
        });
      }
    });

    return { nodes, edges };
  }, [members, relationships, onMemberClick]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const fitView = useCallback(() => {
    // This would be called from ReactFlow instance
  }, []);

  return (
    <div className="w-full h-[600px] border rounded-lg bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultEdgeOptions={{
          type: ConnectionLineType.SmoothStep,
        }}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => "hsl(var(--primary))"}
          maskColor="hsl(var(--muted) / 0.6)"
          className="bg-background border rounded"
        />
        <Panel position="top-right" className="flex gap-2">
          <Button size="sm" variant="outline">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};
