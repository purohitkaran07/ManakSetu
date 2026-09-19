import React from 'react';
import { Standard } from '../../types';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

interface Props {
  standard: Standard;
}

export const StandardCard: React.FC<Props> = ({ standard }) => {
  const isSuperseded = standard.status.toLowerCase() === 'superseded';

  return (
    <div className={`rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between ${
      isSuperseded
        ? 'bg-amber-50/30 border-amber-200 hover:border-amber-300'
        : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
    }`}>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm sm:text-base font-extrabold text-slate-900">
              {standard.standard_number}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isSuperseded
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {standard.status}
            </span>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Year {standard.year}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase tracking-wide">
            {standard.standard_type}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
            {standard.classification}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded ${
            standard.certification_status.includes('Mandatory')
              ? 'bg-amber-50 text-amber-900 border border-amber-200 font-semibold'
              : 'bg-slate-100 text-slate-600 font-medium'
          }`}>
            Certification: {standard.certification_status}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
          {standard.title}
        </h3>

        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {standard.scope}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 line-clamp-1 max-w-[220px]" title={standard.source_reference || 'BIS Reference Knowledge'}>
          Source: {standard.source_reference ? standard.source_reference.split('/')[0].trim() : 'BIS Reference Knowledge'}
        </span>
        <Link
          to={`/standards/${standard.id}`}
          className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700 group"
        >
          View Full Specification
          <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>
    </div>
  );
};
