import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { StandardDetail } from '../types';
import { StandardMetadata } from '../components/standards/StandardMetadata';
import {
  ArrowLeft,
  FileText,
  Network,
  ShieldCheck,
  AlertTriangle,
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="w-8 h-8 border-3 border-[#0067C5] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-xs font-medium">Loading standard record...</span>
        </div>
      </div>
    );
  }

  if (error || !standard) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-slate-800 mb-1">Standard Not Found</h2>
          <p className="text-xs text-slate-500 mb-4">{error || 'The requested standard does not exist.'}</p>
          <Link
            to="/standards"
            className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-xl bg-[#0067C5] text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Standards Library
          </Link>
        </div>
      </div>
    );
  }

  const isSuperseded = standard.status.toLowerCase() === 'superseded';

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-[#0067C5] transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/standards" className="hover:text-[#0067C5] transition">Standards Library</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">{standard.standard_number}</span>
          </nav>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-[#0067C5] transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
          </button>
        </div>

        {/* Standard Main Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xl sm:text-2xl font-black text-[#0B192C]">
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
              className="inline-flex items-center text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-blue-50 text-[#0067C5] hover:bg-blue-100 border border-blue-200 transition"
            >
              <Network className="w-3.5 h-3.5 mr-1.5" />
              Visualize in Knowledge Graph
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="font-bold text-[#0067C5] bg-blue-50 px-2.5 py-1 rounded">
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

          <h1 className="text-xl sm:text-2xl font-bold text-[#0B192C] leading-snug">
            {standard.title}
          </h1>

          {isSuperseded && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center space-x-2.5">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
              <span>
                <strong>Superseded Indian Standard:</strong> This edition has been superseded by a revised standard issued by the Bureau of Indian Standards. Review the traced relationships below for the current active edition.
              </span>
            </div>
          )}
        </div>

        {/* Technical Scope Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
          <h2 className="text-xs sm:text-sm font-bold text-[#0B192C] uppercase tracking-wider flex items-center">
            <FileText className="w-4 h-4 mr-2 text-[#0067C5]" />
            Official Standard Scope & Technical Coverage
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
              <h2 className="text-xs sm:text-sm font-bold text-[#0B192C] uppercase tracking-wider flex items-center">
                <Network className="w-4 h-4 mr-2 text-[#0067C5]" />
                Traced Standards Network & Relationships ({standard.relationships.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic normative references, referenced-by linkages, and superseding lineages.
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
                  className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] hover:bg-white hover:border-blue-300 transition shadow-2xs space-y-2 flex flex-col justify-between"
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

                    <h4 className="font-mono text-sm font-bold text-[#0B192C]">
                      {rel.related_standard_number}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1">
                      {rel.related_standard_title}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      to={`/standards/${rel.related_standard_id}`}
                      className="inline-flex items-center text-xs font-bold text-[#0067C5] hover:text-[#004C99]"
                    >
                      View Related Standard <ChevronRight className="w-3.5 h-3.5 ml-1" />
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
