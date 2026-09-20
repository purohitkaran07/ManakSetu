import React, { useEffect, useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Node,
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

  // Default reference-matched layout nodes matching Reference Image
  const defaultReferenceNodes: Node[] = [
    {
      id: 'center-2082',
      type: 'circularStandardNode',
      position: { x: 250, y: 190 },
      data: {
        id: 1,
        standard_number: 'IS 2082',
        title: 'Stationary Storage Type Electric Water Heaters',
        standard_type: 'Product Standard',
        status: 'Active',
        year: 2018,
        is_central: true,
      },
    },
    {
      id: 'node-302',
      type: 'circularStandardNode',
      position: { x: 90, y: 70 },
      data: {
        id: 2,
        standard_number: 'IS 302',
        title: 'General Safety of Household Electrical Appliances',
        standard_type: 'Safety Standard',
        status: 'Active',
        year: 2024,
        is_central: false,
      },
    },
    {
      id: 'node-302-part1',
      type: 'circularStandardNode',
      position: { x: 380, y: 55 },
      data: {
        id: 3,
        standard_number: 'IS 302 (Part 1)',
        title: 'Safety of Household Electrical Appliances - General Requirements',
        standard_type: 'General Req.',
        status: 'Active',
        year: 2024,
        is_central: false,
      },
    },
    {
      id: 'node-302-part2',
      type: 'circularStandardNode',
      position: { x: 445, y: 195 },
      data: {
        id: 4,
        standard_number: 'IS 302 (Part 2)',
        title: 'Particular Requirements for Electric Storage Water Heaters',
        standard_type: 'Specific Safety',
        status: 'Active',
        year: 2024,
        is_central: false,
      },
    },
    {
      id: 'node-3854',
      type: 'circularStandardNode',
      position: { x: 360, y: 325 },
      data: {
        id: 5,
        standard_number: 'IS 3854',
        title: 'Switches for Domestic and Similar Purposes - Test Methods',
        standard_type: 'Test Methods',
        status: 'Active',
        year: 2023,
        is_central: false,
      },
    },
    {
      id: 'node-related',
      type: 'circularStandardNode',
      position: { x: 95, y: 295 },
      data: {
        id: 6,
        standard_number: 'Related Standards',
        title: 'View Normative & Referenced Standards',
        standard_type: 'View Connections',
        status: 'Active',
        year: 2024,
        is_central: false,
      },
    },
  ];

  // Default reference-matched edges matching Reference Image
  const defaultReferenceEdges: Edge[] = [
    {
      id: 'e-center-302',
      source: 'center-2082',
      target: 'node-302',
      label: 'APPLIES TO',
      style: { stroke: '#0067C5', strokeWidth: 2 },
      labelStyle: { fontSize: 8, fontWeight: 800, fill: '#0067C5' },
      labelBgStyle: { fill: '#EAF5FF', fillOpacity: 0.95, rx: 4, ry: 4, stroke: '#B9D5F2' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#0067C5' },
    },
    {
      id: 'e-center-302-p1',
      source: 'center-2082',
      target: 'node-302-part1',
      label: 'REFERENCES',
      style: { stroke: '#10B981', strokeWidth: 2, strokeDasharray: '4 4' },
      labelStyle: { fontSize: 8, fontWeight: 800, fill: '#059669' },
      labelBgStyle: { fill: '#ECFDF5', fillOpacity: 0.95, rx: 4, ry: 4, stroke: '#A7F3D0' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
    },
    {
      id: 'e-center-302-p2',
      source: 'center-2082',
      target: 'node-302-part2',
      label: 'PART OF',
      style: { stroke: '#F59E0B', strokeWidth: 2 },
      labelStyle: { fontSize: 8, fontWeight: 800, fill: '#D97706' },
      labelBgStyle: { fill: '#FFFBEB', fillOpacity: 0.95, rx: 4, ry: 4, stroke: '#FDE68A' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' },
    },
    {
      id: 'e-center-3854',
      source: 'center-2082',
      target: 'node-3854',
      label: 'SIMILAR TO',
      style: { stroke: '#8B5CF6', strokeWidth: 2, strokeDasharray: '4 4' },
      labelStyle: { fontSize: 8, fontWeight: 800, fill: '#7C3AED' },
      labelBgStyle: { fill: '#F5F3FF', fillOpacity: 0.95, rx: 4, ry: 4, stroke: '#DDD6FE' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#8B5CF6' },
    },
    {
      id: 'e-center-related',
      source: 'center-2082',
      target: 'node-related',
      style: { stroke: '#0067C5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#0067C5' },
    },
  ];

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
        console.error('Failed to load graph preview, using reference layout:', err);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const nodeTypes = useMemo(() => ({ circularStandardNode: CircularStandardNode as any }), []);

  // Compute active nodes: prioritize clean reference positions
  const displayNodes = useMemo(() => {
    if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
      return defaultReferenceNodes;
    }
    // If backend returns nodes, map them cleanly around the center
    const central = graphData.nodes.find((n) => n.data.is_central) || graphData.nodes[0];
    const satellites = graphData.nodes.filter((n) => n.id !== central.id);

    const positions = [
      { x: 90, y: 70 },
      { x: 380, y: 55 },
      { x: 445, y: 195 },
      { x: 360, y: 325 },
      { x: 95, y: 295 },
    ];

    const mapped: Node[] = [
      {
        id: central.id,
        type: 'circularStandardNode',
        position: { x: 250, y: 190 },
        data: central.data as unknown as Record<string, unknown>,
      },
    ];

    satellites.forEach((node, idx) => {
      const pos = positions[idx % positions.length];
      mapped.push({
        id: node.id,
        type: 'circularStandardNode',
        position: pos,
        data: node.data as unknown as Record<string, unknown>,
      });
    });

    return mapped;
  }, [graphData]);

  // Compute active edges
  const displayEdges = useMemo(() => {
    if (!graphData || !graphData.edges || graphData.edges.length === 0) {
      return defaultReferenceEdges;
    }
    return graphData.edges.map((e, idx) => {
      const isSupersedes = e.label === 'SUPERSEDES';
      const labelColors = ['#0067C5', '#10B981', '#F59E0B', '#8B5CF6'];
      const strokeColor = isSupersedes ? '#F59E0B' : labelColors[idx % labelColors.length];

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
          fontSize: 8,
          fontWeight: 800,
          fill: strokeColor,
          letterSpacing: '0.04em',
        },
        labelBgStyle: {
          fill: '#FFFFFF',
          fillOpacity: 0.95,
          rx: 4,
          ry: 4,
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

  return (
    <div className="relative w-full h-[400px] sm:h-[430px] lg:h-[460px] bg-transparent select-none">
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.6}
        maxZoom={1.3}
        panOnDrag={true}
        zoomOnScroll={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#CBD5E1" />
      </ReactFlow>
    </div>
  );
};
