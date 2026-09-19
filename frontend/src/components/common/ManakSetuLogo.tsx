import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const ManakSetuLogo: React.FC<LogoProps> = ({ size = 'md', showTagline = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link to="/" className="flex items-center space-x-3 group text-left">
      <div className={`relative ${iconSizes[size]} rounded-lg bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 p-0.5 shadow-md flex items-center justify-center border border-blue-400/30 group-hover:border-blue-400/60 transition`}>
        <svg viewBox="0 0 40 40" className="w-full h-full p-1 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 28L20 12L30 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 22H26" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="20" cy="12" r="2.5" fill="#38BDF8"/>
          <circle cx="10" cy="28" r="2" fill="#60A5FA"/>
          <circle cx="30" cy="28" r="2" fill="#60A5FA"/>
        </svg>
      </div>
      <div>
        <div className="flex items-baseline space-x-1">
          <span className={`font-extrabold tracking-tight text-white ${textSizes[size]}`}>
            MANAK<span className="text-blue-400">SETU</span>
          </span>
        </div>
        {showTagline && (
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">
            Connecting Requirements to Indian Standards
          </p>
        )}
      </div>
    </Link>
  );
};
