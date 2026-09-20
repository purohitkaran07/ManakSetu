import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GraphNodeData } from '../../types';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Settings,
  FlaskConical,
  Network,
  Share2,
} from 'lucide-react';

export const CircularStandardNode: React.FC<NodeProps> = memo(({ data, selected }) => {
  const nodeData = data as unknown as GraphNodeData;
  const isCentral = nodeData.is_central;
  const isSuperseded = (nodeData.status || '').toLowerCase() === 'superseded';
  const stdNum = (nodeData.standard_number || '').trim();
  const title = (nodeData.title || '').toLowerCase();

  // Determine specific node role matching reference image
  const getNodeConfig = () => {
    if (isCentral || stdNum.includes('2082')) {
      return {
        number: 'IS 2082',
        subtitle: 'Product Standard',
        icon: <FileText className="w-5 h-5 text-[#0067C5]" />,
        isCenter: true,
      };
    }
    if (stdNum.includes('Part 2') || title.includes('particular')) {
      return {
        number: 'IS 302 (Part 2)',
        subtitle: 'Specific Safety',
        icon: <Settings className="w-4 h-4 text-[#0067C5]" />,
        isCenter: false,
      };
    }
    if (stdNum.includes('Part 1') || title.includes('general')) {
      return {
        number: 'IS 302 (Part 1)',
        subtitle: 'General Req.',
        icon: <FileText className="w-4 h-4 text-[#0067C5]" />,
        isCenter: false,
      };
    }
    if (stdNum.includes('3854') || title.includes('switch') || title.includes('test')) {
      return {
        number: 'IS 3854',
        subtitle: 'Test Methods',
        icon: <FlaskConical className="w-4 h-4 text-[#0067C5]" />,
        isCenter: false,
      };
    }
    if (stdNum.includes('302') && !stdNum.includes('Part')) {
      return {
        number: 'IS 302',
        subtitle: 'Safety',
        icon: <ShieldCheck className="w-4 h-4 text-[#0067C5]" />,
        isCenter: false,
      };
    }
    if (title.includes('related') || stdNum.includes('Related')) {
      return {
        number: 'Related Standards',
        subtitle: 'View Connections',
        icon: <Network className="w-4 h-4 text-[#0067C5]" />,
        isCenter: false,
      };
    }
    return {
      number: stdNum || 'Standard',
      subtitle: nodeData.standard_type || 'Normative',
      icon: <FileText className="w-4 h-4 text-[#0067C5]" />,
      isCenter: false,
    };
  };

  const config = getNodeConfig();

  if (config.isCenter) {
    return (
      <div
        className={`relative rounded-full w-28 h-28 sm:w-32 sm:h-32 bg-white border-2 border-blue-200 shadow-xl shadow-blue-500/10 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all duration-300 hover:scale-105 ${
          selected ? 'ring-4 ring-blue-300' : ''
        }`}
      >
        <Handle type="target" position={Position.Top} className="!opacity-0 !w-1 !h-1" />
        <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-1 !h-1" />
        <Handle type="target" position={Position.Left} className="!opacity-0 !w-1 !h-1" />
        <Handle type="source" position={Position.Right} className="!opacity-0 !w-1 !h-1" />

        <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center mb-1">
          {config.icon}
        </div>
        <span className="text-sm sm:text-base font-black text-[#0B192C] tracking-tight leading-none">
          {config.number}
        </span>
        <span className="text-[10px] sm:text-[11px] font-semibold text-[#0067C5] mt-1 block leading-tight">
          {config.subtitle}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full w-22 h-22 sm:w-24 sm:h-24 bg-white border ${
        isSuperseded ? 'border-amber-300' : 'border-slate-200'
      } shadow-md hover:shadow-lg hover:border-blue-400 transition-all duration-200 flex flex-col items-center justify-center p-1.5 text-center cursor-pointer hover:scale-105 ${
        selected ? 'ring-2 ring-blue-400' : ''
      }`}
    >
      <Handle type="target" position={Position.Top} className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-1 !h-1" />
      <Handle type="target" position={Position.Left} className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Right} className="!opacity-0 !w-1 !h-1" />

      <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center mb-0.5">
        {isSuperseded ? (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
        ) : (
          config.icon
        )}
      </div>

      <span className="text-[11px] font-bold text-[#0B192C] leading-tight px-1 line-clamp-1">
        {config.number}
      </span>

      <span
        className={`text-[9px] font-medium leading-tight mt-0.5 ${
          isSuperseded ? 'text-amber-600 font-bold' : 'text-slate-500'
        }`}
      >
        {isSuperseded ? 'Superseded' : config.subtitle}
      </span>
    </div>
  );
});
