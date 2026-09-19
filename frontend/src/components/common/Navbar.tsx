import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ArrowRight, Info, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Analyze', path: '/analyze' },
    { name: 'Standards', path: '/standards' },
    { name: 'Knowledge Graph', path: '/graph' },
    { name: 'Resources', path: '/history' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-17 sm:h-[72px]">
            {/* Left: Brand Identity */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-lg bg-[#062B52] flex items-center justify-center text-white font-black text-sm shadow-xs group-hover:bg-[#0067C5] transition">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                  <path d="M4 18L12 6L20 18" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 14H16" stroke="#60A5FA" strokeLinecap="round" />
                </svg>
              </div>
              <div className="leading-tight">
                <div className="text-xl font-black tracking-tight text-[#062B52] flex items-center">
                  MANAK<span className="text-[#0067C5]">SETU</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                  Connecting Requirements to Indian Standards
                </p>
              </div>
            </Link>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-2 text-sm font-semibold transition border-b-2 ${
                      isActive
                        ? 'border-[#0067C5] text-[#0067C5]'
                        : 'border-transparent text-slate-700 hover:text-[#0067C5] hover:border-slate-300'
                    }`
                  }
                >
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Right: Restrained Institutional Action & Subtle Auth */}
            <div className="hidden sm:flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 transition"
              >
                Sign In
              </button>
              <Link
                to="/analyze"
                className="bg-[#0067C5] hover:bg-[#00529B] text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
              >
                <span>Analyze Requirement</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-semibold ${
                    isActive ? 'bg-blue-50 text-[#0067C5]' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowAuthModal(true);
                }}
                className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-lg text-xs font-bold text-center"
              >
                Sign In
              </button>
              <Link
                to="/analyze"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 bg-[#0067C5] text-white py-2 rounded-lg text-xs font-bold text-center flex items-center justify-center space-x-1"
              >
                <span>Analyze</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Non-Deceptive Prototype Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">SIH 2026 Direct Access</h3>
                  <p className="text-xs text-slate-500">Prototype Demonstration Mode</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with evaluation guidelines, user authentication is kept in direct access mode.
              All AI requirement analysis, BIS reference standards, and knowledge graph tools are available immediately without login credentials.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-900 space-y-1">
              <span className="font-bold flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />
                All Capabilities Active:
              </span>
              <ul className="list-disc list-inside text-[11px] text-blue-800 space-y-0.5 pt-1">
                <li>384-d semantic embedding matching</li>
                <li>Version intelligence & superseded edition alerts</li>
                <li>Live database relationships graph</li>
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <Link
                to="/analyze"
                onClick={() => setShowAuthModal(false)}
                className="bg-[#062B52] hover:bg-blue-900 text-white px-5 py-2 rounded-xl text-xs font-bold transition"
              >
                Continue to AI Analyzer →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
