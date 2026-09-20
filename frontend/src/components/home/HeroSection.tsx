import React from 'react';
import { AnalyzerTabs } from './AnalyzerTabs';
import { KnowledgeGraphPreview } from './KnowledgeGraphPreview';
import { Link } from 'react-router-dom';
import { Network, ChevronRight } from 'lucide-react';
import { ParliamentWatermark } from '../common/GovLogos';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-6 sm:pt-8 pb-10 sm:pb-12 bg-gradient-to-b from-[#EBF3FA] via-[#F0F5FA] to-[#F8FAFC] text-slate-900 border-b border-slate-200">
      {/* Background Architectural Watermark behind Right Column */}
      <div className="absolute right-0 top-6 pointer-events-none hidden lg:block select-none">
        <ParliamentWatermark className="w-[520px] h-[360px] opacity-[0.05]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          {/* Left Column: Branding, Title & White Analyzer Card (~50%) */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-3.5">
            {/* Pill Badge matching Reference */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#E1EFFE] border border-blue-200 text-[#0067C5] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
              <span>AI POWERED • EVIDENCE BASED • TRUSTED</span>
            </div>

            {/* Main Headline matching Reference */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-[#0B192C] leading-none">
                MANAK<span className="text-[#0067C5]">SETU</span>
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-[#0B192C] tracking-tight leading-snug">
                From Requirement to the Right Standard&rsquo;
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl pt-0.5">
                An AI-powered platform to help you discover, understand and explore applicable Indian Standards (BIS) for your products, processes or services.
              </p>
            </div>

            {/* Requirement Analyzer Card */}
            <div className="pt-2">
              <AnalyzerTabs />
            </div>
          </div>

          {/* Right Column: Standards Knowledge Graph Visual & Institutional Quote (~50%) */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex flex-col justify-between pt-1">
            {/* Top Right Link Card matching Reference */}
            <div className="flex justify-end mb-1">
              <Link
                to="/graph"
                className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/90 hover:border-blue-300 hover:shadow-sm transition-all group flex items-center space-x-3 text-left max-w-[260px]"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0067C5] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0067C5] group-hover:text-white transition">
                  <Network className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">
                    Explore the Standards Network
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                    See how standards are connected, related and referenced.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>

            {/* Circular Standards Network Canvas */}
            <div className="w-full">
              <KnowledgeGraphPreview />
            </div>

            {/* Bottom Pillars & Institutional Quote matching Reference */}
            <div className="pt-2 space-y-2 text-right">
              {/* Pillar Badges */}
              <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>QUALITY</span>
                <span>SAFETY</span>
                <span>SUSTAINABILITY</span>
                <span>ATMANIRBHAR BHARAT</span>
              </div>

              {/* Famous Quote */}
              <div className="inline-block text-right">
                <p className="text-xs sm:text-[13px] font-bold text-slate-700 leading-tight">
                  &ldquo;Standards build trust.
                  <br />
                  Trust builds a stronger India.&rdquo;
                </p>
                {/* Indian Tricolor Accent Line */}
                <div className="flex items-center justify-end space-x-0.5 mt-1.5 ml-auto w-24">
                  <div className="h-1 flex-1 bg-[#FF9933] rounded-l-full"></div>
                  <div className="h-1 flex-1 bg-white border border-slate-200"></div>
                  <div className="h-1 flex-1 bg-[#138808] rounded-r-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
