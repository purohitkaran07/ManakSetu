import React from 'react';

/**
 * State Emblem of India (Ashoka Lion Capital with Satyameva Jayate)
 * Source: Exact uploaded image (media_1789892963575.png)
 */
export const EmblemOfIndia: React.FC<{ className?: string }> = ({ className = "h-11 w-auto" }) => (
  <img
    src="/logos/emblem-of-india.png"
    alt="State Emblem of India"
    className={`object-contain ${className}`}
  />
);

/**
 * Official Bureau of Indian Standards (BIS) Logo
 * Source: Exact uploaded image (media_1789893057311.png)
 */
export const BISLogo: React.FC<{ className?: string }> = ({ className = "h-11 w-auto" }) => (
  <img
    src="/logos/bis-logo.png"
    alt="Bureau of Indian Standards Logo"
    className={`object-contain ${className}`}
  />
);

/**
 * Official Digital India Logo
 * Source: Exact uploaded image (media_1789893012264.png)
 */
export const DigitalIndiaLogo: React.FC<{ className?: string }> = ({ className = "h-9 w-auto" }) => (
  <img
    src="/logos/digital-india.png"
    alt="Digital India Logo"
    className={`object-contain ${className}`}
  />
);

/**
 * Indian Tricolor Ribbon & "India Standards Inspires Progress" Footer Brand
 */
export const TricolorBadge: React.FC<{ className?: string }> = ({ className = "h-8 w-auto" }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <svg viewBox="0 0 42 30" fill="none" className="w-8 h-6" xmlns="http://www.w3.org/2000/svg">
      {/* Saffron Ribbon Wave */}
      <path
        d="M2 9C10 4 18 14 26 9C34 4 39 8 40 9V14C35 12 30 10 24 14C16 19 8 9 2 14V9Z"
        fill="#FF9933"
      />
      {/* White Middle Wave */}
      <path
        d="M2 14C8 9 16 19 24 14C30 10 35 12 40 14V19C35 17 30 15 24 19C16 24 8 14 2 19V14Z"
        fill="#FFFFFF"
      />
      <circle cx="21" cy="16.5" r="2.2" fill="#000080" />
      {/* Green Ribbon Wave */}
      <path
        d="M2 19C8 14 16 24 24 19C30 15 35 17 40 19V24C35 22 30 20 24 24C16 29 8 19 2 24V19Z"
        fill="#138808"
      />
    </svg>
    <div className="leading-none text-left">
      <div className="text-[10px] font-bold text-slate-200 tracking-wide">
        India Standards
      </div>
      <div className="text-[9px] font-medium text-slate-400">
        Inspires Progress
      </div>
    </div>
  </div>
);

/**
 * Subtle Indian Heritage Dome & Parliament Silhouette Watermark for Hero Background
 */
export const ParliamentWatermark: React.FC<{ className?: string }> = ({
  className = "w-[440px] h-[320px] opacity-[0.06]",
}) => (
  <svg
    viewBox="0 0 500 350"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Central Monumental Dome (Rashtrapati Bhavan / Parliament style) */}
    <path
      d="M250 40C210 40 180 75 175 120H325C320 75 290 40 250 40Z"
      fill="#0B2545"
    />
    {/* Dome Finial / Stupa */}
    <rect x="247" y="15" width="6" height="25" fill="#0B2545" />
    <circle cx="250" cy="15" r="4" fill="#0B2545" />
    {/* Drum of Dome with Colonnade */}
    <rect x="170" y="120" width="160" height="24" fill="#0B2545" />
    {/* Drum pillars */}
    {[185, 205, 225, 245, 265, 285, 305].map((x) => (
      <rect key={x} x={x} y="124" width="4" height="18" fill="#FFFFFF" />
    ))}
    {/* Main Substructure & Portico */}
    <rect x="140" y="144" width="220" height="30" fill="#0B2545" />
    {/* Triangular Pediment */}
    <path d="M250 144L210 174H290L250 144Z" fill="#FFFFFF" opacity="0.3" />
    {/* Portico Columns */}
    {[155, 175, 195, 215, 235, 255, 275, 295, 315, 335].map((x) => (
      <rect key={x} x={x} y="174" width="6" height="85" fill="#0B2545" />
    ))}
    {/* Left Wing Colonnade */}
    <rect x="40" y="185" width="105" height="15" fill="#0B2545" />
    {[55, 75, 95, 115, 135].map((x) => (
      <rect key={x} x={x} y="200" width="5" height="60" fill="#0B2545" />
    ))}
    {/* Right Wing Colonnade */}
    <rect x="355" y="185" width="105" height="15" fill="#0B2545" />
    {[365, 385, 405, 425, 445].map((x) => (
      <rect key={x} x={x} y="200" width="5" height="60" fill="#0B2545" />
    ))}
    {/* Base Steps Plinth */}
    <rect x="20" y="260" width="460" height="12" fill="#0B2545" />
    <rect x="10" y="272" width="480" height="14" fill="#0B2545" />
    <rect x="0" y="286" width="500" height="18" fill="#0B2545" />
  </svg>
);
