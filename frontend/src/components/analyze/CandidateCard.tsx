import React from 'react';
import { RecommendationItem } from '../../types';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Props {
  item: RecommendationItem;
}

export const CandidateCard: React.FC<Props> = ({ item }) => {
  const std = item.standard;
  const isSuperseded = std.status.toLowerCase() === 'superseded';

  return (
    <div
      className={`p-4 rounded-xl border transition ${
        isSuperseded
          ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs sm:text-sm font-bold text-[#0B192C]">
            {std.standard_number}
          </span>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
              isSuperseded
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {std.status}
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-[#0067C5] font-medium">
            {std.standard_type}
          </span>
        </div>

        <span className="text-xs font-semibold text-slate-600">
          Score: {Math.round(item.relevance * 100)}%
        </span>
      </div>

      <p className="text-xs font-semibold text-[#0B192C] line-clamp-1 mb-1">
        {std.title}
      </p>
      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2">
        {item.reason}
      </p>

      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
        <span className="text-slate-500">
          Year: {std.year} • {item.certification_status}
        </span>
        <Link
          to={`/standards/${std.id}`}
          className="font-bold text-[#0067C5] hover:text-[#004C99] inline-flex items-center"
        >
          View Scope <ChevronRight className="w-3 h-3 ml-0.5" />
        </Link>
      </div>
    </div>
  );
};
