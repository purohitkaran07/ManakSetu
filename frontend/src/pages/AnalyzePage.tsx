import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { AnalysisResponse } from '../types';
import { RequirementSummary } from '../components/analyze/RequirementSummary';
import { VersionAlert } from '../components/analyze/VersionAlert';
import { RecommendationCard } from '../components/analyze/RecommendationCard';
import { CandidateCard } from '../components/analyze/CandidateCard';
import {
  Sparkles,
  Search,
  AlertCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  FileQuestion,
  HelpCircle,
} from 'lucide-react';

export const AnalyzePage: React.FC = () => {
  const location = useLocation();
  const [requirementText, setRequirementText] = useState(
    location.state?.requirement || ''
  );
  const [llmProvider, setLlmProvider] = useState(
    location.state?.llmProvider || 'none'
  );

  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const testPrompts = [
    {
      label: 'Full Water Heater Procurement',
      text: 'We need to procure 500 wall-mounted 25 litre electric storage water heaters for government hostels.',
    },
    {
      label: 'Minimal Water Heater',
      text: 'Need water heaters.',
    },
    {
      label: 'Explicit Superseded Reference',
      text: 'We need a water heater according to IS 302 (Part 2/Sec 21):2018.',
    },
    {
      label: 'Unrelated Product (Cement)',
      text: 'We need Portland cement.',
    },
  ];

  const handleAnalyze = async (textToAnalyze: string) => {
    const query = textToAnalyze.trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setResult(null);

    // Realistic multi-stage progress indicators matching actual backend phases
    setLoadingStep('Understanding requirement entities and procurement context...');
    const timer1 = setTimeout(() => {
      setLoadingStep('Encoding requirement into 384-d semantic vectors and retrieving candidates...');
    }, 400);
    const timer2 = setTimeout(() => {
      setLoadingStep('Evaluating technical evidence, classification, and checking version lineage...');
    }, 900);

    try {
      const data = await api.analyzeRequirement(query, llmProvider);
      clearTimeout(timer1);
      clearTimeout(timer2);
      setResult(data);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      console.error('Analysis error:', err);
      setError(
        err.response?.data?.detail || err.message || 'An unexpected error occurred during requirement analysis.'
      );
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  // Trigger analysis if navigated from home page with initial requirement
  useEffect(() => {
    if (location.state?.requirement) {
      handleAnalyze(location.state.requirement);
    }
  }, [location.state?.requirement]);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2.5 py-1 rounded-md w-fit mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            AI Decision Support Analyzer
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Procurement Requirement Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Submit your technical specifications or procurement clauses in natural language. The engine extracts key entities, generates semantic embeddings, evaluates technical evidence, and verifies standard editions.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze(requirementText);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="req-text" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Procurement Requirement Statement
              </label>
              <textarea
                id="req-text"
                rows={4}
                value={requirementText}
                onChange={(e) => setRequirementText(e.target.value)}
                placeholder="Enter procurement clause or technical specification (e.g., We need to procure 500 wall-mounted 25 litre electric storage water heaters for government hostels)..."
                className="w-full rounded-xl border border-slate-300 p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none leading-relaxed"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>Supports natural language, specifications, capacity ratings, or explicit standard numbers</span>
                <span>{requirementText.length} characters</span>
              </div>
            </div>

            {/* Pre-canned Prompts */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Test Authoritative Prototype Scenarios:
              </span>
              <div className="flex flex-wrap gap-2">
                {testPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRequirementText(p.text);
                      handleAnalyze(p.text);
                    }}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition text-left"
                  >
                    ⚡ {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit & Reset Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-500 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Deterministic & Semantic Evaluation Engine
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                {requirementText && (
                  <button
                    type="button"
                    onClick={() => {
                      setRequirementText('');
                      setResult(null);
                      setError(null);
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  >
                    Clear Input
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading || !requirementText.trim()}
                  className={`flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition shadow-md ${
                    loading || !requirementText.trim()
                      ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
                      Execute Standards Analysis
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Loading State with Stage Feedback */}
        {loading && (
          <div className="bg-white rounded-2xl border border-blue-200 p-8 text-center space-y-4 shadow-sm animate-pulse">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Processing Decision Support Pipeline
              </h3>
              <p className="text-xs font-mono text-blue-700 font-semibold mt-1">
                {loadingStep || 'Analyzing procurement parameters...'}
              </p>
            </div>
            <div className="max-w-md mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-[progress_1.5s_ease-in-out_infinite]"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-800 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span>Analysis Encountered an Error</span>
            </div>
            <p className="text-xs text-red-700 leading-relaxed">
              {error}
            </p>
            <button
              onClick={() => handleAnalyze(requirementText)}
              className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 transition flex items-center"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retry Analysis
            </button>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-fadeIn">
            {/* Analysis Results Main Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-200 gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-[#0067C5]" />
                  Analysis Results
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Semantic candidate retrieval, evidence evaluation, and version intelligence
                </p>
              </div>
              <div className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md w-fit">
                Ref ID: {result.id.slice(0, 8)}
              </div>
            </div>

            {/* Version Alert if triggered */}
            <VersionAlert alerts={result.version_alerts} />

            {/* Requirement Summary Entity Breakdown */}
            <RequirementSummary data={result.structured_requirement} />

            {/* Primary Recommendations Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-1">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" />
                    Primary Applicable Recommendations ({result.recommendations.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    High-confidence active Indian Standards with direct technical, product, and scope alignment.
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Analysis ID: {result.id.slice(0, 8)}
                </span>
              </div>

              {result.recommendations.length === 0 ? (
                /* Empty state for zero recommendations (e.g. Portland Cement) */
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                    <FileQuestion className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    No Direct Recommendations Found in Knowledge Base
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    The requirement "{result.original_requirement}" did not match any applicable standards in the current prototype slice with sufficient semantic confidence. The engine will not fabricate non-existent standards.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {result.recommendations.map((item, idx) => (
                    <RecommendationCard key={item.standard.id} item={item} rank={idx + 1} />
                  ))}
                </div>
              )}
            </div>

            {/* Candidate & Related Standards Section */}
            {result.candidate_standards.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Candidate & Related Standards Evaluated ({result.candidate_standards.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Normatively referenced specifications, general safety guidelines, or superseded editions evaluated by the retrieval engine.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.candidate_standards.map((cand) => (
                    <CandidateCard key={cand.standard.id} item={cand} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
