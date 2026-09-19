import React from 'react';
import { ArrowRight, FileSearch, Sparkles, Filter, CheckCircle2, FileCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Provide Requirement',
      desc: 'Describe procurement, product, specifications, quantity, or application in natural language.',
      icon: <FileSearch className="w-5 h-5 text-blue-600" />,
    },
    {
      num: '02',
      title: 'AI Understanding',
      desc: 'Extracts entities and distinguishes explicit parameters from inferred product domains.',
      icon: <Sparkles className="w-5 h-5 text-indigo-600" />,
    },
    {
      num: '03',
      title: 'Retrieve Candidates',
      desc: 'Generates 384-d semantic embedding vectors and scores candidate standards via cosine similarity.',
      icon: <Filter className="w-5 h-5 text-purple-600" />,
    },
    {
      num: '04',
      title: 'Evaluate & Verify',
      desc: 'Grounds recommendations on title/scope alignment and checks for superseded standard versions.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    },
    {
      num: '05',
      title: 'Explain Recommendations',
      desc: 'Presents primary recommendations, candidate standards, evidence lists, and graph linkages.',
      icon: <FileCheck className="w-5 h-5 text-sky-600" />,
    },
  ];

  return (
    <section className="py-14 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-full">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            How It Works
          </h2>
          <p className="text-sm text-slate-500 mt-1.5">
            From your procurement requirement to an explainable Indian Standards recommendation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-blue-600 tracking-wider">
                    {step.num}
                  </span>
                  <div className="p-2 rounded-lg bg-blue-50">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
