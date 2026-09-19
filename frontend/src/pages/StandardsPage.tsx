import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Standard } from '../types';
import { StandardCard } from '../components/standards/StandardCard';
import { Search, Filter, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

export const StandardsPage: React.FC = () => {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('');

  const fetchStandards = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getStandards({
        q: searchQuery || undefined,
        status: statusFilter || undefined,
        classification: classificationFilter || undefined,
      });
      setStandards(data);
    } catch (err: any) {
      console.error('Failed to fetch standards:', err);
      setError('Failed to load standards knowledge base from backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchStandards();
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery, statusFilter, classificationFilter]);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2.5 py-1 rounded-md w-fit mb-2">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            Standards Knowledge Base
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Indian Standards Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse standards available in the ManakSetu reference knowledge base.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by IS number (e.g. IS 2082), title, or keyword..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-40 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Superseded">Superseded</option>
            </select>

            {/* Classification Filter */}
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
              className="w-full md:w-52 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Classifications</option>
              <option value="Electrical & Electronics">Electrical & Electronics</option>
              <option value="Instruments & Sensors">Instruments & Sensors</option>
            </select>

            {(searchQuery || statusFilter || classificationFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('');
                  setClassificationFilter('');
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span className="text-xs font-medium">Loading standards catalog...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-800 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h3 className="text-sm font-bold">{error}</h3>
            <button
              onClick={fetchStandards}
              className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 text-red-900"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </button>
          </div>
        ) : standards.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <p className="text-sm font-semibold text-slate-800 mb-1">No standards found</p>
            <p className="text-xs text-slate-400">
              Try adjusting your search terms or clearing the status/classification filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {standards.map((standard) => (
              <StandardCard key={standard.id} standard={standard} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
