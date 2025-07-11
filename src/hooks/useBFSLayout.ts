import { useMemo } from 'react';
import type { SceneData, VideoNode } from '@/types/scene';
import { MarkerType, type Node, type Edge } from '@xyflow/react';

type PositionedNode = Node<VideoNode & Record<string, unknown>>;

export function useBFSLayout(sceneData?: SceneData | null): {
  nodes: PositionedNode[];
  edges: Edge[];
} {
  return useMemo(() => {
    if (!sceneData) return { nodes: [], edges: [] };

    const videoNodes = sceneData.scene.nodes;
    const nodesMap: Record<string, VideoNode> = {};
    videoNodes.forEach((node) => {
      nodesMap[node.videoId] = node;
    });

    const visited = new Set<string>();
    const levelMap: Record<string, number> = {};
    const positionedNodes: PositionedNode[] = [];
    const edges: Edge[] = [];

    const targeted = new Set<string>();
    videoNodes.forEach((node) => {
      node.choices?.forEach((c) => targeted.add(c.targetId));
      if (node.defaultChoice) targeted.add(node.defaultChoice);
    });
    const rootNodes = videoNodes.filter((n) => !targeted.has(n.videoId));

    const queue: { id: string; level: number }[] = rootNodes.map((n) => ({
      id: n.videoId,
      level: 0,
    }));

    while (queue.length > 0) {
      const { id, level } = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      levelMap[id] = level;

      const node = nodesMap[id];
      if (!node) continue;

      const targets = [
        ...(node.choices?.map((c) => c.targetId) ?? []),
        ...(node.defaultChoice ? [node.defaultChoice] : []),
      ];

      targets.forEach((targetId) => {
        if (!visited.has(targetId)) {
          queue.push({ id: targetId, level: level + 1 });
        }
      });
    }

    const nodesPerLevel: Record<number, number> = {};
    const currentIndexPerLevel: Record<number, number> = {};

    Object.values(levelMap).forEach((lvl) => {
      nodesPerLevel[lvl] = (nodesPerLevel[lvl] || 0) + 1;
    });

    Object.entries(levelMap).forEach(([id, level]) => {
      const node = nodesMap[id];
      const indexInLevel = currentIndexPerLevel[level] || 0;
      currentIndexPerLevel[level] = indexInLevel + 1;

      const x = level * 600;
      const y = indexInLevel * 300;

      positionedNodes.push({
        id: node.videoId,             
        type: 'custom',
        position: { x, y },
        data: node as VideoNode & Record<string, unknown>, 
      });
    });

    videoNodes.forEach((node) => {
      const sourceId = node.videoId;

      // Choice edges — blue & dashed
      node.choices?.forEach((choice, index) => {
        edges.push({
          id: `${sourceId}-choice-${index}`,
          source: sourceId,
          target: choice.targetId,
          type: 'floating',
          style: {
            stroke: '#3B82F6',
            strokeDasharray: '5 5',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#3B82F6',
          },
        });
      });

      // Default edge — gray & solid (only if not duplicated)
      const alreadyLinked = node.choices?.some(
        (c) => c.targetId === node.defaultChoice
      );
      if (node.defaultChoice && !alreadyLinked) {
        edges.push({
          id: `${sourceId}-default`,
          source: sourceId,
          target: node.defaultChoice,
          type: 'floating',
          style: {
            stroke: '#9CA3AF',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#9CA3AF',
          },
        });
      }
    });

    return { nodes: positionedNodes, edges };
  }, [sceneData]);
}
