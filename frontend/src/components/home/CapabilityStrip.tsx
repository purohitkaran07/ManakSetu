import React from 'react';
import { BookOpen, Network, Sparkles, ShieldCheck, Share2 } from 'lucide-react';

export const CapabilityStrip: React.FC = () => {
  const items = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#0067C5]" />,
      bg: 'bg-blue-50',
      title: 'AI Requirement Analysis',
      subtitle: 'Entity & Specification Extraction',
    },
    {
      icon: <Network className="w-5 h-5 text-sky-600" />,
      bg: 'bg-sky-50',
      title: 'Semantic Standard Retrieval',
      subtitle: 'Contextual Vector Similarity',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      title: 'Evidence-Based Recommendations',
      subtitle: 'Traceable Scope & Technical Fit',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
      title: 'Version & Amendment Awareness',
      subtitle: 'Strict Lineage & Deprecation Alerts',
    },
    {
      icon: <Share2 className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50',
      title: 'Standards Relationship Graph',
      subtitle: 'Normative Cross-Reference Mapping',
    },
  ];

  return (
    <section className="bg-white border-b border-slate-200 py-6 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center space-x-3.5 ${
                idx === 0 ? 'sm:pr-4' : 'sm:px-4'
              } py-3 sm:py-0`}
            >
              <div className={`w-11 h-11 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100`}>
                {item.icon}
              </div>
              <div className="leading-tight">
                <span className="block text-sm font-extrabold text-[#062B52] tracking-tight">
                  {item.title}
                </span>
                <span className="block text-xs font-medium text-slate-500 mt-0.5">
                  {item.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
