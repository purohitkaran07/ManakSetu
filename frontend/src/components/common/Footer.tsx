import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [modalBody, setModalBody] = useState<string | null>(null);

  const openInfo = (title: string, body: string) => {
    setModalTitle(title);
    setModalBody(body);
  };

  return (
    <footer className="bg-[#062B52] text-slate-300 border-t border-[#093564] pt-10 pb-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        {/* Main Footer Grid */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 border-b border-blue-900/60 pb-8">
          {/* Brand Column */}
          <div className="space-y-2 max-w-md">
            <div className="text-xl font-black tracking-tight text-white flex items-center">
              MANAK<span className="text-[#60A5FA]">SETU</span>
            </div>
            <p className="text-xs font-semibold text-blue-200/90">
              From Requirement to the Right Standard
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              AI-powered decision support for Indian Standards. Identifies candidate standards, traces normative relationships, and evaluates evidence from natural language procurement requirements.
            </p>
          </div>

          {/* Navigation Links Column */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
            <nav className="flex flex-wrap md:flex-col gap-x-4 gap-y-1.5 text-xs text-slate-300">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <Link to="/analyze" className="hover:text-white transition">Analyze Requirement</Link>
              <Link to="/standards" className="hover:text-white transition">Standards Library</Link>
              <Link to="/graph" className="hover:text-white transition">Knowledge Graph</Link>
              <Link to="/history" className="hover:text-white transition">Resources & History</Link>
              <Link to="/about" className="hover:text-white transition">About ManakSetu</Link>
            </nav>
          </div>

          {/* Quick Legal / Policy */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Information</h4>
            <div className="flex flex-wrap md:flex-col gap-x-4 gap-y-1.5 text-xs text-slate-300">
              <button
                onClick={() =>
                  openInfo(
                    'Privacy Policy',
                    'ManakSetu operates as an open, client-side decision-support prototype. No personal identifiers or sensitive procurement contracts are harvested or sold.'
                  )
                }
                className="hover:text-white transition text-left"
              >
                Privacy Policy
              </button>
              <button
                onClick={() =>
                  openInfo(
                    'Terms of Use',
                    'ManakSetu provides computational retrieval and version intelligence over verified Indian Standards references for research and tender drafting support.'
                  )
                }
                className="hover:text-white transition text-left"
              >
                Terms of Use
              </button>
              <button
                onClick={() =>
                  openInfo(
                    'Accessibility Statement',
                    'Designed following institutional accessibility guidelines with responsive viewports, semantic HTML, and high-contrast color pairings.'
                  )
                }
                className="hover:text-white transition text-left"
              >
                Accessibility
              </button>
              <button
                onClick={() =>
                  openInfo(
                    'Feedback & Bug Reporting',
                    'Prototype feedback can be submitted during the SIH 2026 technical evaluation session.'
                  )
                }
                className="hover:text-white transition text-left"
              >
                Feedback
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer & Notice */}
        <div className="space-y-2 text-[11px] text-slate-400 leading-relaxed">
          <p className="flex items-center text-amber-300 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
            Decision-Support Prototype Disclaimer
          </p>
          <p>
            Reference information is provided for decision-support purposes. Verify applicable requirements with authoritative BIS sources and applicable regulations. ManakSetu is an independent prototype and does not replace official BIS publications, certification processes, or legal compliance mandates.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400 pt-3 border-t border-blue-900/40">
          <div>
            © 2026 ManakSetu • From Requirement to the Right Standard • SIH 2026 Prototype
          </div>
          <div className="text-slate-500">
            Indian Standards Decision Support Platform
          </div>
        </div>
      </div>

      {/* Lightweight Institutional Info Modal */}
      {modalTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">{modalTitle}</h3>
              <button
                onClick={() => setModalTitle(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{modalBody}</p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setModalTitle(null)}
                className="bg-[#062B52] hover:bg-blue-900 text-white px-4 py-1.5 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
