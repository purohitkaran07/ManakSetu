import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Network,
  BookOpen,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  X,
  Info,
} from 'lucide-react';

export const WorkflowAndActions: React.FC = () => {
  const [showHelpModal, setShowHelpModal] = useState(false);

  const steps = [
    {
      num: 1,
      color: 'bg-[#0067C5] text-white',
      title: 'Provide Requirement',
      desc: 'Describe your product, process or service',
    },
    {
      num: 2,
      color: 'bg-emerald-600 text-white',
      title: 'AI Understanding',
      desc: 'Extract key entities and context',
    },
    {
      num: 3,
      color: 'bg-amber-500 text-white',
      title: 'Find Relevant Standards',
      desc: 'Search and rank applicable standards',
    },
    {
      num: 4,
      color: 'bg-purple-600 text-white',
      title: 'Explore Relationships',
      desc: 'See connections in knowledge graph',
    },
    {
      num: 5,
      color: 'bg-[#0B192C] text-white',
      title: 'Get Detailed Insights',
      desc: 'View explanations, references and more',
    },
  ];

  const quickActions = [
    {
      title: 'Browse Standards',
      desc: 'Explore BIS standards library',
      icon: <Search className="w-4 h-4 text-[#0067C5]" />,
      path: '/standards',
    },
    {
      title: 'Open Knowledge Graph',
      desc: 'Visualize standard relationships',
      icon: <Network className="w-4 h-4 text-[#0067C5]" />,
      path: '/graph',
    },
    {
      title: 'View Guidelines',
      desc: 'Learn about using ManakSetu',
      icon: <BookOpen className="w-4 h-4 text-[#0067C5]" />,
      path: '/about',
    },
    {
      title: 'Need Help?',
      desc: 'FAQ and support',
      icon: <HelpCircle className="w-4 h-4 text-[#0067C5]" />,
      action: () => setShowHelpModal(true),
    },
  ];

  return (
    <section className="bg-[#F8FAFC] py-10 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: How It Works (~65%) */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B192C] tracking-tight">
                How It Works
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                From your requirement to a complete standards analysis
              </p>
            </div>

            {/* 5-Step Process Flow with Connecting Arrows */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
              {steps.map((step, idx) => (
                <div key={idx} className="relative flex flex-col justify-start">
                  <div className="flex items-center space-x-2 mb-3">
                    <div
                      className={`w-7 h-7 rounded-full ${step.color} flex items-center justify-center font-black text-xs shadow-xs`}
                    >
                      {step.num}
                    </div>
                    {idx < steps.length - 1 && (
                      <ArrowRight className="hidden sm:block w-3.5 h-3.5 text-slate-300 ml-auto mr-1" />
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-[#0B192C] leading-snug mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Quick Actions (~35%) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0B192C] tracking-tight">
                Quick Actions
              </h3>
            </div>

            {/* 2x2 Clean Action Cards matching Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((act, idx) => {
                const CardContent = (
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all group flex items-center justify-between text-left h-full">
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0067C5] group-hover:text-white transition">
                        {act.icon}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#0B192C] group-hover:text-[#0067C5] transition leading-tight truncate">
                          {act.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight truncate">
                          {act.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition flex-shrink-0" />
                  </div>
                );

                if (act.path) {
                  return (
                    <Link key={idx} to={act.path} className="block h-full">
                      {CardContent}
                    </Link>
                  );
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={act.action}
                    className="w-full text-left cursor-pointer h-full"
                  >
                    {CardContent}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Support & Instructions</h3>
                  <p className="text-xs text-slate-500">ManakSetu SIH 2026 Evaluation</p>
                </div>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                <strong>How to test the prototype:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                <li>Go to the Requirement Analyzer or select a pre-canned test prompt.</li>
                <li>Submit your procurement clause in natural language.</li>
                <li>Inspect the extracted entities, active recommendations, and version alerts.</li>
                <li>Explore the interactive knowledge graph to visualize normative relationships.</li>
              </ol>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHelpModal(false)}
                className="bg-[#0B192C] hover:bg-[#004C99] text-white px-4 py-1.5 rounded-lg text-xs font-semibold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
