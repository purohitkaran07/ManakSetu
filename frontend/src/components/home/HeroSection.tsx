import React from 'react';
import { AnalyzerTabs } from './AnalyzerTabs';
import { KnowledgeGraphPreview } from './KnowledgeGraphPreview';
import { Link } from 'react-router-dom';
import { Network, ChevronRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-6 sm:pt-8 pb-10 sm:pb-12 bg-[#F8FAFC] text-slate-900 border-b border-slate-200">
      {/* Very Subtle Background Standards Network Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="network-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2.5" fill="#0067C5" />
              <circle cx="60" cy="40" r="2.5" fill="#0067C5" />
              <circle cx="30" cy="70" r="2" fill="#0067C5" />
              <line x1="20" y1="20" x2="60" y2="40" stroke="#0067C5" strokeWidth="0.75" />
              <line x1="60" y1="40" x2="30" y2="70" stroke="#0067C5" strokeWidth="0.75" />
              <line x1="30" y1="70" x2="20" y2="20" stroke="#0067C5" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Branding, Title & White Analyzer Card (~52%) */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-4">
            {/* Small Institutional Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#0067C5] text-[11px] font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#0067C5]"></span>
              <span>AI-POWERED • EVIDENCE-BASED</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1.5">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#062B52] leading-none">
                MANAK<span className="text-[#0067C5]">SETU</span>
              </h1>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B2545] tracking-tight leading-snug">
                From Requirement to the Right Standard
              </h2>
              <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed max-w-xl">
                An AI-powered decision-support platform that helps users identify potentially applicable Indian Standards from procurement requirements, understand their relationships, and review the evidence behind each recommendation.
              </p>
            </div>

            {/* Requirement Analyzer Card */}
            <div className="pt-1">
              <AnalyzerTabs />
            </div>
          </div>

          {/* Right Column: Standards Knowledge Graph Visual (~48%) */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex flex-col justify-between">
            {/* Graph Header Link Card */}
            <div className="flex justify-end mb-2">
              <Link
                to="/graph"
                className="bg-white rounded-xl p-3 shadow-xs border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group flex items-center space-x-3 text-left max-w-[240px]"
              >
                <div className="p-2 rounded-lg bg-blue-50 text-[#0067C5] group-hover:bg-[#0067C5] group-hover:text-white transition">
                  <Network className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    Explore Knowledge Graph
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                    View connected standards network
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>

            {/* Floating Standards Network Canvas */}
            <div className="w-full">
              <KnowledgeGraphPreview />
            </div>

            {/* Clean Subtitle Caption */}
            <div className="text-center sm:text-right pt-2 pr-2 text-xs font-semibold text-slate-500">
              <span>Interactive Standards Network • Normative & Version Relationships</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
