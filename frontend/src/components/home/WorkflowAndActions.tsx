import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Network, BookOpen, HelpCircle, ChevronRight, ArrowRight, FileText, Clock } from 'lucide-react';

export const WorkflowAndActions: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Understand Requirement',
      desc: 'Interpret procurement clause context in natural language.',
    },
    {
      num: '02',
      title: 'Extract Key Specifications',
      desc: 'Identify product entities, capacities, and ratings.',
    },
    {
      num: '03',
      title: 'Retrieve Candidate Standards',
      desc: 'Search 384-d semantic vectors and index candidates.',
    },
    {
      num: '04',
      title: 'Evaluate Evidence & Relationships',
      desc: 'Verify title, scope, and normative reference graph.',
    },
    {
      num: '05',
      title: 'Explain Applicable Standards',
      desc: 'Deliver ranked recommendations with grounded evidence.',
    },
  ];

  const quickActions = [
    {
      title: 'Analyze a Requirement',
      desc: 'Submit specifications for AI standards matching',
      icon: <FileText className="w-4 h-4 text-[#0067C5]" />,
      path: '/analyze',
    },
    {
      title: 'Explore Standards',
      desc: 'Browse indexed Indian Standards in knowledge base',
      icon: <Search className="w-4 h-4 text-[#0067C5]" />,
      path: '/standards',
    },
    {
      title: 'View Knowledge Graph',
      desc: 'Interactive visualization of normative relationships',
      icon: <Network className="w-4 h-4 text-[#0067C5]" />,
      path: '/graph',
    },
    {
      title: 'Review Analysis History',
      desc: 'Review past requirement analyses and audit records',
      icon: <Clock className="w-4 h-4 text-[#0067C5]" />,
      path: '/history',
    },
  ];

  return (
    <section className="bg-white py-12 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: How ManakSetu Works (~65%) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#062B52] tracking-tight">
                How ManakSetu Works
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                Five-stage decision-support pipeline from procurement statement to grounded recommendation
              </p>
            </div>

            {/* Connected Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-2 relative">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-white transition group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-black text-xs text-[#0067C5] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {step.num}
                      </span>
                      {idx < steps.length - 1 && (
                        <ArrowRight className="hidden sm:block w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400 transition" />
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-[#062B52] leading-snug mb-1">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Explore ManakSetu (~35%) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#062B52] tracking-tight">
                Explore ManakSetu
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Direct access to core system capabilities
              </p>
            </div>

            {/* 2x2 Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((act, idx) => (
                <Link
                  key={idx}
                  to={act.path}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-2 text-[#0067C5] group-hover:bg-[#0067C5] group-hover:text-white transition">
                      {act.icon}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#062B52] group-hover:text-[#0067C5] transition leading-tight">
                      {act.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      {act.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
