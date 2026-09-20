import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GraphNodeData } from '../../types';
import { FileText, ShieldCheck, AlertTriangle, Cpu } from 'lucide-react';

export const CustomStandardNode: React.FC<NodeProps> = memo(({ data, selected }) => {
  const nodeData = data as unknown as GraphNodeData;
  const isCentral = nodeData.is_central;
  const isSuperseded = (nodeData.status || '').toLowerCase() === 'superseded';

  const getIcon = () => {
    if (isSuperseded) return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    if ((nodeData.standard_type || '').toLowerCase().includes('safety')) return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    if ((nodeData.standard_type || '').toLowerCase().includes('control')) return <Cpu className="w-4 h-4 text-indigo-600" />;
    return <FileText className="w-4 h-4 text-[#0067C5]" />;
  };

  return (
    <div
      className={`relative rounded-xl p-3.5 min-w-[200px] max-w-[240px] text-left transition-all duration-200 ${
        isCentral
          ? 'bg-white border-2 border-[#0067C5] shadow-lg shadow-blue-500/10 ring-4 ring-blue-100'
          : isSuperseded
          ? 'bg-amber-50/95 border-2 border-amber-300 shadow-sm text-slate-800'
          : 'bg-white border border-slate-200 shadow-sm hover:shadow-md text-slate-900'
      } ${selected ? 'ring-2 ring-[#0067C5] ring-offset-2' : ''}`}
    >
      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} className="!bg-[#0067C5]" />
      <Handle type="source" position={Position.Bottom} className="!bg-[#0067C5]" />
      <Handle type="target" position={Position.Left} className="!bg-[#0067C5]" />
      <Handle type="source" position={Position.Right} className="!bg-[#0067C5]" />

      {/* Node Header */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center space-x-1.5">
          <div className={`p-1.5 rounded-md ${isCentral ? 'bg-blue-50' : 'bg-slate-100'}`}>
            {getIcon()}
          </div>
          <span className={`text-xs font-bold tracking-tight ${isCentral ? 'text-[#0067C5]' : 'text-[#0B192C]'}`}>
            {nodeData.standard_number}
          </span>
        </div>
        <span
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
            isSuperseded
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {nodeData.status}
        </span>
      </div>

      {/* Title */}
      <p className="text-[11px] text-slate-700 font-medium line-clamp-2 leading-tight mb-2">
        {nodeData.title}
      </p>

      {/* Meta tags */}
      <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-slate-100">
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
          {nodeData.standard_type}
        </span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-[#0067C5] font-semibold">
          Year {nodeData.year}
        </span>
      </div>
    </div>
  );
});
