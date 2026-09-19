import React from 'react';
import { RecommendationItem } from '../../types';
import { Link } from 'react-router-dom';
import { Layers, ChevronRight, AlertCircle, Shield, FileText } from 'lucide-react';

interface Props {
  item: RecommendationItem;
}

export const CandidateCard: React.FC<Props> = ({ item }) => {
  const std = item.standard;
  const isSuperseded = std.status.toLowerCase() === 'superseded';

  return (
    <div className={`p-4 rounded-xl border transition ${
      isSuperseded
        ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
        : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm font-bold text-slate-900">
            {std.standard_number}
          </span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
              isSuperseded
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {std.status}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-medium">
            {std.standard_type}
          </span>
        </div>

        <span className="text-xs font-semibold text-slate-600">
          Score: {Math.round(item.relevance * 100)}%
        </span>
      </div>

      <p className="text-xs font-semibold text-slate-800 line-clamp-1 mb-1">
        {std.title}
      </p>
      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2">
        {item.reason}
      </p>

      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
        <span className="text-slate-500">
          Year: {std.year} • Certification: {item.certification_status}
        </span>
        <Link
          to={`/standards/${std.id}`}
          className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center"
        >
          View Scope <ChevronRight className="w-3 h-3 ml-0.5" />
        </Link>
      </div>
    </div>
  );
};
