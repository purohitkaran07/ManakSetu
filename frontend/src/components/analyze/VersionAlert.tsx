import React from 'react';
import { VersionAlert as VersionAlertType } from '../../types';
import { AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  alerts: VersionAlertType[];
}

export const VersionAlert: React.FC<Props> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          className="rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-amber-50 via-amber-50/80 to-orange-50/40 p-5 sm:p-6 shadow-sm"
        >
          <div className="flex items-start space-x-3.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5 border border-amber-300">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="inline-flex items-center text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded">
                  <ShieldAlert className="w-3.5 h-3.5 mr-1 text-amber-800" />
                  VERSION INTELLIGENCE ALERT • SUPERSEDED EDITION DETECTED
                </span>
                <span className="text-[11px] font-bold text-amber-800">
                  Status: Citation Action Required
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1 mb-2">
                Your requirement explicitly references a superseded edition of an Indian Standard.
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                <div className="p-3 rounded-xl bg-white border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    Referenced (Superseded)
                  </span>
                  <p className="font-mono font-bold text-[#0B192C] text-sm">
                    {alert.explicit_standard}
                  </p>
                  <span className="text-[10px] text-amber-700 font-medium mt-1 inline-block">
                    Superseded by Bureau of Indian Standards revision
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Current Authoritative Edition
                  </span>
                  <p className="font-mono font-bold text-emerald-900 text-sm">
                    {alert.superseding_standard}
                  </p>
                  <span className="text-[10px] text-emerald-700 font-medium mt-1 inline-block">
                    Active specification recommended for public procurement
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {alert.message} In accordance with government procurement norms, tender specifications should cite current active editions unless explicitly procuring components for legacy system maintenance.
              </p>

              <div className="mt-4 pt-3 border-t border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-600">
                  ManakSetu has highlighted the active edition while preserving your original citation.
                </span>
                <Link
                  to="/graph"
                  className="inline-flex items-center font-bold text-amber-900 hover:text-amber-950 bg-amber-200 hover:bg-amber-300 px-3.5 py-1.5 rounded-lg transition"
                >
                  View Supersedes Lineage in Graph
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
