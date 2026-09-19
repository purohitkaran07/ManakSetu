import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Network, Clock, Info, ArrowRight, Sparkles } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Analyze Requirement',
      desc: 'Evaluate custom natural-language procurement requirement against Indian Standards.',
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
      path: '/analyze',
      badge: 'Interactive AI',
    },
    {
      title: 'Browse Standards',
      desc: 'Explore the reference Indian Standards knowledge base with technical scopes and specifications.',
      icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
      path: '/standards',
      badge: 'Knowledge Base',
    },
    {
      title: 'Knowledge Graph',
      desc: 'Interactive visual workspace mapping normative references and superseding lineages.',
      icon: <Network className="w-5 h-5 text-purple-600" />,
      path: '/graph',
      badge: 'Visual Network',
    },
    {
      title: 'Analysis History',
      desc: 'Review past procurement requirement analyses and historical recommendation records.',
      icon: <Clock className="w-5 h-5 text-emerald-600" />,
      path: '/history',
      badge: 'Auditing',
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Quick Actions
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Direct access to standards intelligence tools and knowledge management.
            </p>
          </div>
          <Link
            to="/about"
            className="mt-3 sm:mt-0 inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition"
          >
            <Info className="w-3.5 h-3.5 mr-1.5" />
            About Decision-Support Model
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {actions.map((act, idx) => (
            <Link
              key={idx}
              to={act.path}
              className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm group-hover:scale-105 transition">
                    {act.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {act.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition mb-1.5">
                  {act.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {act.desc}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                <span>Access Feature</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
