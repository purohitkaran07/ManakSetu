import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileEdit,
  FileText,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Upload,
  SlidersHorizontal,
} from 'lucide-react';

interface AnalyzerTabsProps {
  initialRequirement?: string;
  onAnalyze?: (requirement: string, provider: string) => void;
  isLoading?: boolean;
}

export const AnalyzerTabs: React.FC<AnalyzerTabsProps> = ({
  initialRequirement = '',
  onAnalyze,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'describe' | 'upload' | 'product' | 'examples'>('describe');
  const [requirementText, setRequirementText] = useState(initialRequirement);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [llmProvider, setLlmProvider] = useState('none');
  const [productSearch, setProductSearch] = useState('');

  const samplePrompts = [
    {
      title: 'Full Procurement Specification',
      text: 'We need to procure 500 wall-mounted 25 litre electric storage water heaters for government hostels.',
      tag: 'Water Heater',
    },
    {
      title: 'Minimal Requirement',
      text: 'Need water heaters.',
      tag: 'Minimal Input',
    },
    {
      title: 'Explicit Version Reference (Superseded)',
      text: 'We need a water heater according to IS 302 (Part 2/Sec 21):2018.',
      tag: 'Version Test',
    },
    {
      title: 'Unrelated Material (Out of Knowledge Base)',
      text: 'We need Portland cement.',
      tag: 'Cement (Zero Match)',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSubmit = requirementText.trim();
    if (!textToSubmit) return;

    if (onAnalyze) {
      onAnalyze(textToSubmit, llmProvider);
    } else {
      navigate('/analyze', { state: { requirement: textToSubmit, llmProvider } });
    }
  };

  const handleSelectExample = (promptText: string) => {
    setRequirementText(promptText);
    setActiveTab('describe');
  };

  const handleSelectProduct = (product: string) => {
    setRequirementText(`We need to procure commercial grade ${product} with standard specifications.`);
    setActiveTab('describe');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden">
      {/* Top Tabs matching Reference Image */}
      <div className="flex border-b border-slate-200 bg-white overflow-x-auto text-xs font-semibold scrollbar-none px-2 pt-1">
        <button
          type="button"
          onClick={() => setActiveTab('describe')}
          className={`flex items-center px-4 py-3 whitespace-nowrap border-b-2 transition ${
            activeTab === 'describe'
              ? 'border-[#0067C5] text-[#0067C5] font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileEdit className="w-4 h-4 mr-2 text-[#0067C5]" />
          Describe Requirement
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex items-center px-4 py-3 whitespace-nowrap border-b-2 transition ${
            activeTab === 'upload'
              ? 'border-[#0067C5] text-[#0067C5] font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 mr-2 text-slate-400" />
          Upload Document
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('product')}
          className={`flex items-center px-4 py-3 whitespace-nowrap border-b-2 transition ${
            activeTab === 'product'
              ? 'border-[#0067C5] text-[#0067C5] font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4 mr-2 text-slate-400" />
          Search by Product
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('examples')}
          className={`flex items-center px-4 py-3 whitespace-nowrap border-b-2 transition ${
            activeTab === 'examples'
              ? 'border-[#0067C5] text-[#0067C5] font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
          Try Examples
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-5">
        {activeTab === 'describe' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label htmlFor="requirement-input" className="sr-only">
                Describe your requirement
              </label>
              <textarea
                id="requirement-input"
                rows={4}
                value={requirementText}
                onChange={(e) => setRequirementText(e.target.value)}
                maxLength={1000}
                placeholder="Describe your requirement in simple terms...&#10;e.g. 500 wall-mounted 25 litre electric storage water heaters for government hostels"
                className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#0067C5] focus:ring-2 focus:ring-blue-100 outline-none transition resize-none leading-relaxed"
              />
              <div className="flex justify-end text-[11px] text-slate-400 mt-1 px-1 font-medium">
                <span>{requirementText.length}/1000</span>
              </div>
            </div>

            {/* Bottom Bar matching Reference */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              {/* Left: Advanced Options Dropdown */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  Advanced Options
                  {showAdvanced ? (
                    <ChevronUp className="w-3.5 h-3.5 ml-1 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
                  )}
                </button>

                {showAdvanced && (
                  <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-left max-w-sm">
                    <label className="block font-semibold text-slate-700">
                      Requirement Analyzer Engine
                    </label>
                    <select
                      value={llmProvider}
                      onChange={(e) => setLlmProvider(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="none">Deterministic Rule & Pattern Engine (Offline)</option>
                      <option value="gemini">Gemini LLM Analyzer (Cloud)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Right: Primary Action Button */}
              <button
                type="submit"
                disabled={isLoading || !requirementText.trim()}
                className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white transition shadow-sm ${
                  isLoading || !requirementText.trim()
                    ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                    : 'bg-[#0B192C] hover:bg-[#004C99]'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
                    Analyze Requirement
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'upload' && (
          <div className="text-center py-7 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-800 mb-1">Tender Document Parsing</h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto mb-3">
              Upload PDF or DOCX procurement specifications. For the live prototype, use natural-language text.
            </p>
            <button
              onClick={() => setActiveTab('describe')}
              className="inline-flex items-center text-xs font-semibold text-[#0067C5] hover:text-[#004C99] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
            >
              Switch to Describe Requirement
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        )}

        {activeTab === 'product' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products (e.g. Water Heater, Geyser)..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Common Catalog Products:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Electric Storage Water Heater',
                  'Stationary Water Heater',
                  'Water Heating Geyser',
                  'Household Electrical Appliances',
                  'Temperature Sensors',
                ].map((prod) => (
                  <button
                    key={prod}
                    type="button"
                    onClick={() => handleSelectProduct(prod)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0067C5] border border-slate-200 transition"
                  >
                    + {prod}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-slate-700">
              Select an authoritative test requirement:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {samplePrompts.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectExample(sample.text)}
                  className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded">
                        {sample.tag}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 group-hover:text-[#0067C5] mb-0.5">
                      {sample.title}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      "{sample.text}"
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#0067C5] mt-1.5 flex items-center">
                    Load requirement <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
