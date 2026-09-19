import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { HistoryItem } from '../types';
import {
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch (err: any) {
      console.error('Failed to load history:', err);
      setError('Failed to load analysis history from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleRerun = (requirement: string) => {
    navigate('/analyze', { state: { requirement } });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2.5 py-1 rounded-md w-fit mb-2">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Historical Auditing
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review past natural-language requirement analyses, recommended standards, and version alerts.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span className="text-xs font-medium">Loading analysis records...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-800 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h3 className="text-sm font-bold">{error}</h3>
            <button
              onClick={fetchHistory}
              className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 text-red-900"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retry
            </button>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0067C5] flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No analyses yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Submit your first procurement requirement in the analyzer to build your decision-support history.
            </p>
            <button
              onClick={() => navigate('/analyze')}
              className="mt-2 inline-flex items-center text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600 text-white shadow"
            >
              Analyze a Requirement <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Original Requirement</th>
                    <th className="py-3 px-4">Detected Product</th>
                    <th className="py-3 px-4 text-center">Standards Found</th>
                    <th className="py-3 px-4">Status & Alerts</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((item) => {
                    const formattedDate = item.created_at
                      ? new Date(item.created_at).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'Recently';

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-medium">
                          {formattedDate}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs truncate">
                          "{item.original_requirement}"
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {item.product || 'Unspecified'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 text-xs">
                            {item.recommendations_count} standards
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {item.has_version_alerts ? (
                            <span className="inline-flex items-center text-[10px] font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                              <ShieldAlert className="w-3 h-3 mr-1" />
                              NEWER VERSION ALERT
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                              Standard
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleRerun(item.original_requirement)}
                            className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 transition"
                          >
                            Re-analyze
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
