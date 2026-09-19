import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { StandardDetail } from '../types';
import { StandardMetadata } from '../components/standards/StandardMetadata';
import {
  ArrowLeft,
  FileText,
  Network,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const StandardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [standard, setStandard] = useState<StandardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getStandardDetail(Number(id))
      .then((data) => {
        setStandard(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch standard detail:', err);
        setError('Failed to load standard specification from database.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-xs font-medium">Loading standard specification...</span>
        </div>
      </div>
    );
  }

  if (error || !standard) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-slate-800 mb-1">Standard Not Found</h2>
          <p className="text-xs text-slate-500 mb-4">{error || 'The requested standard does not exist.'}</p>
          <Link
            to="/standards"
            className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600 text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Standards Library
          </Link>
        </div>
      </div>
    );
  }

  const isSuperseded = standard.status.toLowerCase() === 'superseded';

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Previous View
        </button>

        {/* Standard Main Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-900">
                {standard.standard_number}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isSuperseded
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {standard.status}
              </span>
            </div>

            <Link
              to="/graph"
              className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
            >
              <Network className="w-3.5 h-3.5 mr-1.5" />
              Visualize in Knowledge Graph
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
              {standard.standard_type}
            </span>
            <span className="font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
              {standard.classification}
            </span>
            <span className="font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
              Year {standard.year}
            </span>
            <span className="font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
              Certification: <strong>{standard.certification_status}</strong>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {standard.title}
          </h1>

          {isSuperseded && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>
                <strong>Superseded Standard:</strong> This edition has been superseded by a newer revised standard published by BIS. Consult the relationships section below for the active edition.
              </span>
            </div>
          )}
        </div>

        {/* Technical Scope Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
            <FileText className="w-4 h-4 mr-2 text-blue-600" />
            Standard Scope & Technical Domain
          </h2>
          <div className="text-slate-700 text-xs sm:text-sm leading-relaxed p-4 rounded-xl bg-slate-50 border border-slate-100">
            {standard.scope}
          </div>
        </div>

        {/* Metadata Grid */}
        <StandardMetadata standard={standard} />

        {/* Traced Knowledge Graph Relationships */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
                <Network className="w-4 h-4 mr-2 text-indigo-600" />
                Traced Standards Network & Relationships ({standard.relationships.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic normative references, referenced-by lineages, and superseding relationships.
              </p>
            </div>
          </div>

          {standard.relationships.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">
              No direct relationships configured in the current knowledge core.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {standard.relationships.map((rel) => (
                <div
                  key={rel.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition shadow-sm space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase ${
                          rel.relationship_type.includes('SUPERSEDES') || rel.relationship_type.includes('SUPERSEDED')
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {rel.relationship_type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {rel.direction === 'outgoing' ? 'Outgoing Edge' : 'Incoming Edge'}
                      </span>
                    </div>

                    <h4 className="font-mono text-sm font-bold text-slate-900">
                      {rel.related_standard_number}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1">
                      {rel.related_standard_title}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      to={`/standards/${rel.related_standard_id}`}
                      className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View Related Specification <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
