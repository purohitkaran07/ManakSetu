import React from 'react';
import { FileText, Network, Zap, ShieldCheck, Users } from 'lucide-react';

export const CapabilityStrip: React.FC = () => {
  const stats = [
    {
      icon: <FileText className="w-5 h-5 text-[#0067C5]" />,
      bg: 'bg-blue-50',
      title: '12,000+',
      subtitle: 'Indian Standards',
    },
    {
      icon: <Network className="w-5 h-5 text-[#0067C5]" />,
      bg: 'bg-blue-50',
      title: '1.2M+',
      subtitle: 'Standard Relationships',
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      bg: 'bg-amber-50',
      title: 'AI-Powered',
      subtitle: 'Semantic Understanding',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#0067C5]" />,
      bg: 'bg-blue-50',
      title: 'Trusted Source',
      subtitle: 'BIS Official Data',
    },
    {
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      title: 'For Everyone',
      subtitle: 'Industry | Government | Academia',
    },
  ];

  return (
    <section className="bg-white border-b border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-2">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-3.5 px-2 sm:px-3 py-1.5"
            >
              <div
                className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0`}
              >
                {item.icon}
              </div>
              <div className="leading-tight text-left">
                <div className="text-base sm:text-lg font-black text-[#0B192C] tracking-tight">
                  {item.title}
                </div>
                <div className="text-xs font-medium text-slate-500 mt-0.5 whitespace-nowrap">
                  {item.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
