import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  ArrowRight,
  Info,
  Sparkles,
  ChevronDown,
  Globe,
  Sliders,
  Check,
} from 'lucide-react';
import { EmblemOfIndia, BISLogo, DigitalIndiaLogo } from './GovLogos';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [contrastMode, setContrastMode] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'sm' | 'md' | 'lg'>('md');

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Analyze', path: '/analyze', hasDropdown: true },
    { name: 'Standards', path: '/standards', hasDropdown: true },
    { name: 'Knowledge Graph', path: '/graph' },
    { name: 'Resources', path: '/history', hasDropdown: true },
    { name: 'About', path: '/about' },
  ];

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headerSearchQuery.trim()) return;
    navigate(`/standards?q=${encodeURIComponent(headerSearchQuery.trim())}`);
  };

  const adjustFontSize = (level: 'sm' | 'md' | 'lg') => {
    setFontSizeLevel(level);
    if (level === 'sm') {
      document.documentElement.style.fontSize = '14px';
    } else if (level === 'md') {
      document.documentElement.style.fontSize = '16px';
    } else {
      document.documentElement.style.fontSize = '18px';
    }
  };

  const toggleContrast = () => {
    setContrastMode(!contrastMode);
    document.documentElement.classList.toggle('high-contrast');
  };

  return (
    <>
      {/* Tier 1: Official Indian Government Top Bar (White) */}
      <div className="bg-white border-b border-slate-200 text-slate-800 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Left: Government of India & Ministry */}
            <div className="flex items-center space-x-3 self-start md:self-center">
              <EmblemOfIndia className="h-10 sm:h-12 w-auto flex-shrink-0" />
              <div className="leading-tight text-left">
                <div className="text-[11px] sm:text-xs font-bold text-slate-900 tracking-tight">
                  Government of India
                </div>
                <div className="text-[10px] text-slate-600 font-medium">
                  Ministry of Consumer Affairs, Food & Public Distribution
                </div>
                <div className="text-[10px] text-slate-600 font-medium">
                  Department of Consumer Affairs
                </div>
              </div>
            </div>

            {/* Center: Bureau of Indian Standards Official Logo */}
            <div className="hidden lg:flex items-center space-x-2.5 px-4 border-x border-slate-200">
              <BISLogo className="h-10 w-auto flex-shrink-0" />
              <div className="leading-tight text-left">
                <div className="text-xs font-extrabold text-[#004C99] tracking-tight">
                  Bureau of Indian Standards
                </div>
                <div className="text-[10px] text-slate-600 font-medium">
                  The National Standards Body of India
                </div>
                <div className="text-[10px] font-bold text-[#004C99]">
                  मानकः पथप्रदर्शकः
                </div>
              </div>
            </div>

            {/* Right: Digital India Logo, Global Search & Accessibility Toolbar */}
            <div className="flex items-center justify-end space-x-3 sm:space-x-4 w-full md:w-auto">
              <div className="hidden sm:block">
                <DigitalIndiaLogo className="h-8 sm:h-9 lg:h-10 w-auto flex-shrink-0" />
              </div>

              {/* Global Standards Quick Search Input */}
              <form onSubmit={handleHeaderSearch} className="relative hidden md:block w-48 lg:w-56">
                <input
                  type="text"
                  value={headerSearchQuery}
                  onChange={(e) => setHeaderSearchQuery(e.target.value)}
                  placeholder="Search standards, products..."
                  className="w-full pl-3 pr-8 py-1.5 text-xs rounded border border-slate-300 bg-white placeholder-slate-400 focus:outline-none focus:border-[#004C99] transition"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-0 top-0 bottom-0 px-2 bg-[#0B1E36] hover:bg-[#004C99] text-white rounded-r flex items-center justify-center transition"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Accessibility Controls */}
              <div className="flex items-center space-x-1.5 text-xs text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                {/* Font Resizing */}
                <div className="flex items-center space-x-1 pr-1.5 border-r border-slate-200 font-semibold text-[11px]">
                  <button
                    onClick={() => adjustFontSize('sm')}
                    className={`px-1 py-0.5 rounded hover:bg-slate-200 transition ${
                      fontSizeLevel === 'sm' ? 'font-black text-[#004C99]' : ''
                    }`}
                    title="Small Font"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => adjustFontSize('md')}
                    className={`px-1 py-0.5 rounded hover:bg-slate-200 transition ${
                      fontSizeLevel === 'md' ? 'font-black text-[#004C99]' : ''
                    }`}
                    title="Normal Font"
                  >
                    A
                  </button>
                  <button
                    onClick={() => adjustFontSize('lg')}
                    className={`px-1 py-0.5 rounded hover:bg-slate-200 transition ${
                      fontSizeLevel === 'lg' ? 'font-black text-[#004C99]' : ''
                    }`}
                    title="Large Font"
                  >
                    A+
                  </button>
                </div>

                {/* High Contrast Toggle */}
                <button
                  onClick={toggleContrast}
                  className="p-0.5 rounded hover:bg-slate-200 text-slate-600 transition"
                  title="Toggle Contrast"
                  aria-label="Toggle Contrast"
                >
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-600 bg-gradient-to-r from-slate-900 to-transparent"></div>
                </button>

                {/* Language Indicator */}
                <div className="flex items-center pl-1 text-[11px] font-semibold text-slate-600">
                  <span>EN</span>
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier 2: Main Institutional Navigation Bar (Deep Navy #0B192C) */}
      <header className="bg-[#0B192C] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left: MANAKSETU Brand */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="leading-tight text-left">
                <div className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
                  MANAK<span className="text-[#38BDF8]">SETU</span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium tracking-wide">
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
                    `px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition flex items-center space-x-1 ${
                      isActive
                        ? 'bg-[#142C4C] text-white font-bold'
                        : 'text-slate-200 hover:text-white hover:bg-[#142C4C]/60'
                    }`
                  }
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && (
                    <ChevronDown className="w-3 h-3 opacity-70 ml-0.5" />
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right: Institutional Actions (Login & Sign Up) */}
            <div className="hidden sm:flex items-center space-x-2.5">
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="bg-[#0067C5] hover:bg-[#0054A3] text-white px-4 py-1.5 rounded-md text-xs font-bold transition shadow-xs"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="border border-white/80 hover:bg-white hover:text-[#0B192C] text-white px-3.5 py-1.5 rounded-md text-xs font-semibold transition"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-white hover:bg-blue-900/60 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0B192C] border-t border-blue-900/50 px-4 pt-3 pb-5 space-y-2 shadow-xl">
            {/* Mobile Search */}
            <form onSubmit={handleHeaderSearch} className="relative pb-2">
              <input
                type="text"
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                placeholder="Search standards, products..."
                className="w-full pl-3 pr-8 py-2 text-xs rounded border border-slate-700 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-0 top-0 bottom-2 px-3 bg-[#0067C5] text-white rounded-r flex items-center justify-center"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-semibold ${
                    isActive ? 'bg-[#142C4C] text-[#38BDF8]' : 'text-slate-200 hover:bg-[#142C4C]/60'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="pt-3 border-t border-slate-800 flex items-center space-x-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowAuthModal(true);
                }}
                className="flex-1 bg-[#0067C5] text-white py-2 rounded-md text-xs font-bold text-center"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowAuthModal(true);
                }}
                className="flex-1 border border-white/60 text-white py-2 rounded-md text-xs font-bold text-center"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Prototype Direct-Access Authentication Modal */}
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
                  <p className="text-xs text-slate-500">Bureau of Indian Standards Prototype</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with evaluation guidelines, user authentication is kept in direct access demonstration mode.
              All AI requirement analysis, BIS reference standards, and knowledge graph tools are available immediately without login credentials.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-900 space-y-1">
              <span className="font-bold flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />
                All Capabilities Active:
              </span>
              <ul className="list-disc list-inside text-[11px] text-blue-800 space-y-0.5 pt-1">
                <li>384-dimensional semantic embedding matching</li>
                <li>Version intelligence & superseded edition alerts</li>
                <li>Live database relationships graph</li>
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <Link
                to="/analyze"
                onClick={() => setShowAuthModal(false)}
                className="bg-[#0B192C] hover:bg-[#004C99] text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
              >
                <span>Continue to AI Analyzer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
