import React, { useState, useRef } from 'react';
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
  FileCheck,
  X,
  AlertCircle,
} from 'lucide-react';
import { api } from '../../services/api';

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

  // PDF Upload States for the "Upload Document" tab
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfSuccessInfo, setPdfSuccessInfo] = useState<{ filename: string; pages: number; charCount: number } | null>(null);

  const processPdfFile = async (file: File) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setPdfError('Invalid file type. Please upload a PDF document (.pdf).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPdfError('File size exceeds the 10 MB limit. Please select a smaller document.');
      return;
    }

    setPdfUploading(true);
    setPdfError(null);

    try {
      const data = await api.extractPdf(file);
      setRequirementText(data.text);
      setPdfSuccessInfo({
        filename: data.filename || file.name,
        pages: data.pages_count || 1,
        charCount: data.text.length,
      });
    } catch (err: any) {
      console.error('PDF extraction error:', err);
      const detail =
        err.response?.data?.detail ||
        err.message ||
        'Unable to extract text from PDF. Please verify that the PDF is not password-protected and contains selectable text.';
      setPdfError(detail);
      setPdfSuccessInfo(null);
    } finally {
      setPdfUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processPdfFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processPdfFile(file);
    }
  };

  const handleClearPdf = () => {
    setPdfSuccessInfo(null);
    setPdfError(null);
    setRequirementText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
          <FileText className={`w-4 h-4 mr-2 ${activeTab === 'upload' ? 'text-[#0067C5]' : 'text-slate-400'}`} />
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
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Error Alert if any */}
            {pdfError && (
              <div className="flex items-start justify-between bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs text-amber-800">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-semibold">Upload failed: </span>
                    {pdfError}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPdfError(null)}
                  className="text-amber-500 hover:text-amber-800 transition ml-2 p-0.5"
                  title="Dismiss error"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Loading State during PDF extraction */}
            {pdfUploading && (
              <div className="text-center py-8 px-4 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/40">
                <div className="w-8 h-8 border-3 border-[#0067C5] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">
                  Parsing PDF Document...
                </h4>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Extracting technical specifications and procurement requirements using PyPDF engine.
                </p>
              </div>
            )}

            {/* Upload Dropzone (shown when not extracting and either no file or user wants to drop) */}
            {!pdfUploading && !pdfSuccessInfo && (
              <div
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`text-center py-7 px-4 border-2 border-dashed rounded-xl cursor-pointer transition ${
                  isDragging
                    ? 'border-[#0067C5] bg-blue-50/70 scale-[0.99]'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/20'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100/70 text-[#0067C5] flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  Drag and drop procurement tender or specification PDF
                </h4>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto mb-3">
                  Upload PDF document (Max 10 MB). Extracts requirements and tender clauses automatically.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center text-xs font-semibold text-white bg-[#0067C5] hover:bg-[#00529B] px-3.5 py-1.5 rounded-lg shadow-sm transition"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Browse PDF Document
                </button>
              </div>
            )}

            {/* Extracted Requirement Preview & Form (shown when file is successfully parsed) */}
            {!pdfUploading && pdfSuccessInfo && (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Document Info Bar */}
                <div className="flex items-center justify-between bg-blue-50/80 border border-blue-200 rounded-xl px-3 py-2 text-xs">
                  <div className="flex items-center space-x-2 truncate">
                    <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="font-bold text-[#0B192C] truncate">
                      {pdfSuccessInfo.filename}
                    </span>
                    <span className="text-slate-500 text-[11px] font-normal whitespace-nowrap">
                      ({pdfSuccessInfo.pages} {pdfSuccessInfo.pages === 1 ? 'page' : 'pages'})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] font-semibold text-[#0067C5] hover:underline"
                    >
                      Replace PDF
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={handleClearPdf}
                      className="text-slate-400 hover:text-slate-700 p-1"
                      title="Remove document and clear text"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Text Area for Review / Edit */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="pdf-extracted-text" className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Extracted Requirement Text (Review & Edit):
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {requirementText.length} chars
                    </span>
                  </div>
                  <textarea
                    id="pdf-extracted-text"
                    rows={4}
                    value={requirementText}
                    onChange={(e) => setRequirementText(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#0067C5] focus:ring-2 focus:ring-blue-100 outline-none transition resize-none leading-relaxed"
                    placeholder="Extracted requirement text will appear here..."
                  />
                </div>

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  {/* Advanced Options Dropdown */}
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

                  {/* Action buttons */}
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleClearPdf}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !requirementText.trim()}
                      className={`flex-1 sm:flex-initial inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white transition shadow-sm ${
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
                </div>
              </form>
            )}
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
