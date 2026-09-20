import React, { useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { TricolorBadge } from './GovLogos';

export const Footer: React.FC = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [modalBody, setModalBody] = useState<string | null>(null);

  const openInfo = (title: string, body: string) => {
    setModalTitle(title);
    setModalBody(body);
  };

  return (
    <footer className="bg-[#0B192C] text-slate-300 border-t border-slate-800 text-xs mt-auto">
      {/* Upper Subtle Disclaimer Strip */}
      <div className="border-b border-slate-800/80 py-3 bg-[#081525]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Government Decision Support Notice:</strong> ManakSetu aids in identifying applicable Indian Standards (BIS) from requirements. Verify citations against authoritative BIS publications.
            </span>
          </div>
          <div className="text-[10px] text-slate-400 whitespace-nowrap">
            Smart India Hackathon (SIH) Prototype
          </div>
        </div>
      </div>

      {/* Main Reference-Style Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Policy & Nav Links matching Reference Image */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-300">
            <button
              onClick={() =>
                openInfo(
                  'Privacy Policy',
                  'ManakSetu operates as an open, client-side decision-support prototype. No personal identifiers or sensitive procurement contracts are harvested, tracked, or sold.'
                )
              }
              className="hover:text-white transition cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() =>
                openInfo(
                  'Terms of Use',
                  'ManakSetu provides computational retrieval and version intelligence over verified Indian Standards references for research, tender drafting, and specification support.'
                )
              }
              className="hover:text-white transition cursor-pointer"
            >
              Terms of Use
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() =>
                openInfo(
                  'Accessibility',
                  'Designed in accordance with Government of India digital accessibility guidelines, featuring high-contrast ratios, keyboard navigation, and scalable typography.'
                )
              }
              className="hover:text-white transition cursor-pointer"
            >
              Accessibility
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() =>
                openInfo(
                  'Feedback',
                  'Prototype feedback can be submitted during the SIH 2026 technical evaluation session.'
                )
              }
              className="hover:text-white transition cursor-pointer"
            >
              Feedback
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() =>
                openInfo(
                  'Contact Us',
                  'For technical inquiries regarding the ManakSetu prototype: SIH Bureau of Indian Standards Team.'
                )
              }
              className="hover:text-white transition cursor-pointer"
            >
              Contact Us
            </button>
          </div>

          {/* Right: Copyright Notice & Indian Standards Tricolor Badge */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-center sm:text-right">
            <div className="text-[11px] text-slate-400">
              © 2024 ManakSetu. A BIS Initiative. All rights reserved.
            </div>
            <TricolorBadge />
          </div>
        </div>
      </div>

      {/* Institutional Legal / Info Modal */}
      {modalTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">{modalTitle}</h3>
              <button
                onClick={() => setModalTitle(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{modalBody}</p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setModalTitle(null)}
                className="bg-[#0B192C] hover:bg-[#004C99] text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition"
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
