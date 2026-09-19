import React, { useEffect, useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CircularStandardNode } from '../graph/CircularStandardNode';
import { api } from '../../services/api';
import { GraphResponse } from '../../types';

export const KnowledgeGraphPreview: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getKnowledgeGraph(1)
      .then((data) => {
        if (mounted) {
          setGraphData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load graph preview:', err);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const nodeTypes = useMemo(() => ({ circularStandardNode: CircularStandardNode as any }), []);

  // Map nodes to circular nodes
  const nodes = useMemo(() => {
    if (!graphData || !graphData.nodes) return [];
    return graphData.nodes.map((n) => ({
      id: n.id,
      type: 'circularStandardNode',
      position: n.position || { x: 0, y: 0 },
      data: n.data as unknown as Record<string, unknown>,
    }));
  }, [graphData]);

  // Edges with distinct reference styling matching reference 2
  const edges: Edge[] = useMemo(() => {
    if (!graphData || !graphData.edges) return [];
    return graphData.edges.map((e) => {
      const isSupersedes = e.label === 'SUPERSEDES';
      const strokeColor = isSupersedes ? '#F59E0B' : '#0265C2';
      const labelColor = isSupersedes ? '#B45309' : '#0067C5';

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: !isSupersedes,
        style: {
          stroke: strokeColor,
          strokeWidth: 2,
        },
        labelStyle: {
          fontSize: 9,
          fontWeight: 700,
          fill: labelColor,
          letterSpacing: '0.05em',
        },
        labelBgStyle: {
          fill: '#FFFFFF',
          fillOpacity: 0.95,
          rx: 6,
          ry: 6,
          stroke: '#E2E8F0',
          strokeWidth: 1,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
        },
      };
    });
  }, [graphData]);

  if (loading) {
    return (
      <div className="w-full h-[450px] lg:h-[500px] flex flex-col items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
        <span className="text-xs font-semibold text-slate-500">Connecting Standards Network...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[450px] lg:h-[520px] bg-transparent">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.22 }}
        minZoom={0.5}
        maxZoom={1.4}
        panOnDrag={true}
        zoomOnScroll={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} color="#CBD5E1" />
      </ReactFlow>
    </div>
  );
};
