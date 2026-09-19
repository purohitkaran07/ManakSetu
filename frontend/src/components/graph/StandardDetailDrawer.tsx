import React from 'react';
import { StandardDetail } from '../../types';
import { X, ExternalLink, Network, FileText, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  standard: StandardDetail | null;
  onClose: () => void;
  onSelectRelated: (relatedStandardId: number) => void;
}

export const StandardDetailDrawer: React.FC<Props> = ({ standard, onClose, onSelectRelated }) => {
  if (!standard) return null;

  const isSuperseded = standard.status.toLowerCase() === 'superseded';

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-xl overflow-y-auto">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
            <Network className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Selected Standard Node
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          aria-label="Close drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5 text-xs">
        {/* Standard Identifier */}
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="font-mono text-base font-extrabold text-slate-900">
              {standard.standard_number}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isSuperseded
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {standard.status}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-800 leading-snug">
            {standard.title}
          </h3>
        </div>

        {/* Key Attributes */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Standard Type</span>
            <span className="font-semibold text-slate-800">{standard.standard_type}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Year / Edition</span>
            <span className="font-semibold text-slate-800">{standard.year}</span>
          </div>
          <div className="col-span-2 pt-1 border-t border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Certification Status</span>
            <span className="font-semibold text-slate-800">{standard.certification_status}</span>
          </div>
        </div>

        {/* Scope */}
        <div>
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5 flex items-center">
            <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Standard Scope
          </h4>
          <p className="text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-200 line-clamp-6">
            {standard.scope}
          </p>
        </div>

        {/* Traced Relationships */}
        <div>
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 flex items-center">
            <Network className="w-3.5 h-3.5 mr-1 text-indigo-600" />
            Traced Relationships ({standard.relationships.length})
          </h4>

          {standard.relationships.length === 0 ? (
            <p className="text-slate-400 italic">No direct relationships recorded in current core slice.</p>
          ) : (
            <div className="space-y-2">
              {standard.relationships.map((rel) => (
                <div
                  key={rel.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition shadow-sm space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                        rel.relationship_type.includes('SUPERSEDES')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {rel.relationship_type}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {rel.direction === 'outgoing' ? 'Target' : 'Source'}
                    </span>
                  </div>

                  <p className="font-mono font-bold text-slate-900 text-xs">
                    {rel.related_standard_number}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {rel.related_standard_title}
                  </p>

                  <button
                    type="button"
                    onClick={() => onSelectRelated(rel.related_standard_id)}
                    className="w-full mt-1.5 py-1 px-2 rounded bg-slate-50 hover:bg-blue-50 text-blue-700 font-semibold text-[11px] border border-slate-200 hover:border-blue-200 transition flex items-center justify-center"
                  >
                    Center Graph Here <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View Full Page Link */}
        <div className="pt-2">
          <Link
            to={`/standards/${standard.id}`}
            className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition"
          >
            Open Dedicated Standard Page
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
