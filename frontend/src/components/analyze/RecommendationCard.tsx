import React from 'react';
import { RecommendationItem } from '../../types';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Network,
  ChevronRight,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  item: RecommendationItem;
  rank: number;
}

export const RecommendationCard: React.FC<Props> = ({ item, rank }) => {
  const std = item.standard;
  const relevancePercent = Math.round(item.relevance * 100);

  const getConfidenceColor = (conf: string) => {
    switch (conf.toLowerCase()) {
      case 'high':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'medium':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-6 overflow-hidden relative group">
      {/* Top Banner & Rank */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#0067C5] font-black text-xs sm:text-sm flex items-center justify-center">
            0{rank}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base sm:text-lg font-extrabold text-[#0B192C] tracking-tight">
                {std.standard_number}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {std.status}
              </span>
              <span className="hidden sm:inline text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                Verified Indian Standard
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {std.classification} • Year {std.year}
            </span>
          </div>
        </div>

        {/* Relevance Bar & Badge */}
        <div className="flex items-center space-x-3 text-right">
          <div>
            <div className="flex items-center justify-end space-x-1.5">
              <span className="text-xs font-bold text-[#0B192C]">
                {relevancePercent}% Match
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getConfidenceColor(item.confidence)}`}>
                {item.confidence} Confidence
              </span>
            </div>
            <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1 ml-auto">
              <div
                className="h-full bg-[#0067C5] rounded-full"
                style={{ width: `${Math.min(relevancePercent, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Title & Metadata Badges */}
      <div className="my-4">
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className="text-[10px] font-bold text-[#0067C5] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase tracking-wider">
            {std.standard_type}
          </span>
          <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            Certification: <strong className="font-semibold text-slate-800">{item.certification_status}</strong>
          </span>
          {std.source_reference && (
            <span className="hidden sm:inline text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded" title={std.source_reference}>
              Ref: {std.source_reference.split('/')[0].trim()}
            </span>
          )}
        </div>
        <h4 className="text-base font-bold text-[#0B192C] leading-snug">
          {std.title}
        </h4>
        <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
          {std.scope}
        </p>
      </div>

      {/* Recommendation Reasoning & Grounded Evidence */}
      <div className="mt-4 pt-4 border-t border-slate-100 bg-[#F8FAFC] -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6 space-y-3">
        <div>
          <h5 className="text-[11px] font-bold text-[#0B192C] uppercase tracking-wider flex items-center mb-1">
            <Info className="w-3.5 h-3.5 mr-1.5 text-[#0067C5]" />
            Applicability Assessment
          </h5>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {item.reason}
          </p>
        </div>

        {/* Grounded Evidence List */}
        <div>
          <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Technical Evidence Alignment:
          </h5>
          <ul className="space-y-1 text-xs text-slate-600">
            {item.evidence.map((ev, eIdx) => (
              <li key={eIdx} className="flex items-start">
                <CheckCircle className="w-3.5 h-3.5 mr-2 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{ev}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <Link
            to={`/standards/${std.id}`}
            className="inline-flex items-center font-bold text-[#0067C5] hover:text-[#004C99] hover:underline"
          >
            View Standard Scope & Details
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>

          <Link
            to="/graph"
            className="inline-flex items-center font-semibold text-slate-700 hover:text-[#0067C5] bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:border-blue-300 transition"
          >
            <Network className="w-3.5 h-3.5 mr-1.5 text-[#0067C5]" />
            Trace in Knowledge Graph
          </Link>
        </div>
      </div>
    </div>
  );
};
