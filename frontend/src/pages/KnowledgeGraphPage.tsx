import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Node,
  Edge,
  MarkerType,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomStandardNode } from '../components/graph/CustomStandardNode';
import { StandardDetailDrawer } from '../components/graph/StandardDetailDrawer';
import { api } from '../services/api';
import { GraphResponse, StandardDetail, GraphNodeData } from '../types';
import {
  Network,
  Search,
  Filter,
  RotateCcw,
  Layers,
  Info,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';

export const KnowledgeGraphPage: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [centralId, setCentralId] = useState<number>(1);
  const [relationshipFilter, setRelationshipFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedStandard, setSelectedStandard] = useState<StandardDetail | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const nodeTypes = useMemo(() => ({ customStandardNode: CustomStandardNode as any }), []);

  const fetchGraph = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getKnowledgeGraph(
        centralId,
        relationshipFilter || undefined
      );
      setGraphData(data);

      // Build nodes
      const rfNodes: Node[] = data.nodes.map((n) => ({
        id: n.id,
        type: 'customStandardNode',
        position: n.position || { x: 0, y: 0 },
        data: n.data as unknown as Record<string, unknown>,
      }));

      // Build edges
      const rfEdges: Edge[] = data.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: e.animated,
        style: {
          stroke: e.label === 'SUPERSEDES' ? '#F59E0B' : '#2563EB',
          strokeWidth: 2.5,
        },
        labelStyle: {
          fontSize: 10,
          fontWeight: 700,
          fill: e.label === 'SUPERSEDES' ? '#B45309' : '#1D4ED8',
        },
        labelBgStyle: {
          fill: '#FFFFFF',
          fillOpacity: 0.95,
          rx: 4,
          ry: 4,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: e.label === 'SUPERSEDES' ? '#F59E0B' : '#2563EB',
        },
      }));

      setNodes(rfNodes);
      setEdges(rfEdges);
    } catch (err: any) {
      console.error('Failed to load knowledge graph:', err);
      setError('Failed to load graph network from backend API.');
    } finally {
      setLoading(false);
    }
  }, [centralId, relationshipFilter, setNodes, setEdges]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  // Handle clicking a node to display detail drawer
  const onNodeClick = useCallback(async (_: React.MouseEvent, node: Node) => {
    const stdId = Number(node.id);
    try {
      const detail = await api.getStandardDetail(stdId);
      setSelectedStandard(detail);
      setDrawerOpen(true);
    } catch (err) {
      console.error('Failed to fetch node detail:', err);
    }
  }, []);

  const handleSelectRelated = (relatedId: number) => {
    setCentralId(relatedId);
    api.getStandardDetail(relatedId).then((data) => {
      setSelectedStandard(data);
    });
  };

  // Filter nodes if search query is entered
  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return nodes;
    const query = searchQuery.toLowerCase();
    return nodes.map((node) => {
      const nodeData = node.data as unknown as GraphNodeData;
      const isMatch =
        (nodeData.standard_number || '').toLowerCase().includes(query) ||
        (nodeData.title || '').toLowerCase().includes(query);
      return {
        ...node,
        style: {
          opacity: isMatch ? 1 : 0.25,
          transition: 'opacity 0.2s ease',
        },
      };
    });
  }, [nodes, searchQuery]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-100 overflow-hidden relative">
      {/* Top Filter & Toolbar Strip */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              Standards Knowledge Graph
              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded font-semibold">
                Live SQLite
              </span>
            </h1>
            <p className="text-[11px] text-slate-500">
              Explore how Indian Standards reference, supersede and relate to one another.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Node Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Highlight standard..."
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs w-44"
            />
          </div>

          {/* Relationship Filter */}
          <select
            value={relationshipFilter}
            onChange={(e) => setRelationshipFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
          >
            <option value="">All Relationships</option>
            <option value="REFERENCES">REFERENCES</option>
            <option value="SUPERSEDES">SUPERSEDES</option>
          </select>

          {/* Reset button */}
          <button
            type="button"
            onClick={() => {
              setCentralId(1);
              setRelationshipFilter('');
              setSearchQuery('');
            }}
            className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 hover:text-slate-900 text-xs font-semibold shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </button>
        </div>
      </div>

      {/* Main Graph Area */}
      <div className="flex-1 w-full h-full relative flex">
        <div className="flex-1 h-full">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <span className="text-xs font-medium">Rendering graph nodes and relationships...</span>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-2xl border border-red-200 text-center space-y-2 max-w-sm">
                <p className="text-xs text-red-600 font-bold">{error}</p>
                <button
                  onClick={fetchGraph}
                  className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white font-semibold"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <ReactFlow
              nodes={filteredNodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.25 }}
              minZoom={0.3}
              maxZoom={2}
              proOptions={{ hideAttribution: true }}
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#94A3B8" />
              <Controls className="!bottom-6 !left-6 !bg-white !border !border-slate-200 !shadow-md !rounded-xl" />
              <MiniMap
                className="!bottom-6 !right-6 !bg-white/90 !border !border-slate-200 !shadow-md !rounded-xl overflow-hidden"
                nodeStrokeColor="#2563EB"
                nodeColor="#EFF6FF"
              />
            </ReactFlow>
          )}

          {/* Floating Instructions & Legend Badge */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs text-[11px] text-slate-700 space-y-1.5 pointer-events-none">
            <div className="font-bold text-slate-900 flex items-center">
              <Info className="w-3.5 h-3.5 mr-1 text-[#0067C5]" />
              Graph Legend & Relationships
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
              <span className="flex items-center text-emerald-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>
                Current Standard
              </span>
              <span className="flex items-center text-amber-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span>
                Superseded Standard
              </span>
              <span className="flex items-center text-blue-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                Referenced Standard
              </span>
            </div>
            <div className="flex items-center space-x-3 text-[10px] pt-1 border-t border-slate-100 font-semibold">
              <span className="text-[#0067C5]">→ REFERENCES</span>
              <span className="text-amber-700">→ SUPERSEDES</span>
            </div>
            <p className="text-[10px] text-slate-400">Click any standard node to inspect technical metadata</p>
          </div>
        </div>

        {/* Right Slide-out Standard Detail Panel */}
        {drawerOpen && (
          <div className="w-80 sm:w-96 h-full z-20 transition-all duration-300">
            <StandardDetailDrawer
              standard={selectedStandard}
              onClose={() => setDrawerOpen(false)}
              onSelectRelated={handleSelectRelated}
            />
          </div>
        )}
      </div>
    </div>
  );
};
