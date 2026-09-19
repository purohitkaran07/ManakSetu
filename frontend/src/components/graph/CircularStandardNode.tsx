import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GraphNodeData } from '../../types';
import { FileText, Shield, AlertTriangle, Cpu, Settings, Compass } from 'lucide-react';

export const CircularStandardNode: React.FC<NodeProps> = memo(({ data, selected }) => {
  const nodeData = data as unknown as GraphNodeData;
  const isCentral = nodeData.is_central;
  const isSuperseded = (nodeData.status || '').toLowerCase() === 'superseded';

  const getNodeIcon = () => {
    if (isSuperseded) return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    const title = (nodeData.title || '').toLowerCase();
    const stdNum = (nodeData.standard_number || '').toLowerCase();
    if (stdNum.includes('part 2') || title.includes('particular')) {
      return <Settings className="w-5 h-5 text-blue-600" />;
    }
    if (stdNum.includes('part 1') && title.includes('general')) {
      return <FileText className="w-5 h-5 text-emerald-600" />;
    }
    if (title.includes('safety') || title.includes('appliances')) {
      return <Shield className="w-5 h-5 text-blue-600" />;
    }
    if (title.includes('control') || stdNum.includes('60730')) {
      return <Cpu className="w-5 h-5 text-purple-600" />;
    }
    if (title.includes('thermocouple') || stdNum.includes('16923')) {
      return <Compass className="w-5 h-5 text-sky-600" />;
    }
    return <FileText className="w-5 h-5 text-blue-600" />;
  };

  const getSubtitle = () => {
    if (isCentral) return 'Product Standard';
    const stdNum = nodeData.standard_number || '';
    if (stdNum.includes('Part 2/Sec 21')) return 'Specific Safety';
    if (stdNum.includes('Part 1')) return 'General Req.';
    if (stdNum.includes('302')) return 'Safety Standard';
    if (stdNum.includes('60730')) return 'Control Standard';
    if (stdNum.includes('16923')) return 'Measurement Standard';
    return nodeData.standard_type || 'Standard';
  };

  if (isCentral) {
    return (
      <div
        className={`relative rounded-full w-32 h-32 sm:w-36 sm:h-36 bg-white border-2 border-blue-400 shadow-xl shadow-blue-500/15 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-transform hover:scale-105 ${
          selected ? 'ring-4 ring-blue-200' : ''
        }`}
      >
        <Handle type="target" position={Position.Top} className="!opacity-0 !w-1 !h-1" />
        <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-1 !h-1" />
        <Handle type="target" position={Position.Left} className="!opacity-0 !w-1 !h-1" />
        <Handle type="source" position={Position.Right} className="!opacity-0 !w-1 !h-1" />

        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
          <FileText className="w-5 h-5" />
        </div>
        <span className="text-sm sm:text-base font-black text-[#062B52] tracking-tight leading-none">
          IS 2082
        </span>
        <span className="text-[10px] sm:text-[11px] font-semibold text-blue-600 mt-1 block">
          Product Standard
        </span>
        <span className="text-[9px] text-slate-400 font-medium mt-0.5">
          {nodeData.year || '2018'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full w-24 h-24 sm:w-28 sm:h-28 bg-white border ${
        isSuperseded ? 'border-amber-300 shadow-amber-500/10' : 'border-slate-200 shadow-slate-900/5'
      } shadow-lg hover:shadow-xl hover:border-blue-400 transition-all flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:scale-105 ${
        selected ? 'ring-2 ring-blue-400' : ''
      }`}
    >
      <Handle type="target" position={Position.Top} className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-1 !h-1" />
      <Handle type="target" position={Position.Left} className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Right} className="!opacity-0 !w-1 !h-1" />

      <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center mb-1">
        {getNodeIcon()}
      </div>

      <span className="text-[11px] sm:text-xs font-bold text-[#062B52] leading-tight px-1 line-clamp-1">
        {nodeData.standard_number?.replace(':2018', '').replace(':2024', '').replace(':1999', '')}
      </span>

      <span
        className={`text-[9px] font-medium leading-tight mt-0.5 ${
          isSuperseded ? 'text-amber-600 font-bold' : 'text-slate-500'
        }`}
      >
        {isSuperseded ? 'Superseded' : getSubtitle()}
      </span>
    </div>
  );
});
