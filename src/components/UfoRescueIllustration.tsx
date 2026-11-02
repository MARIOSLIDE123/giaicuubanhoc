/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface UfoRescueProps {
  state?: 'trapped' | 'infiltrating' | 'rescued';
  className?: string;
}

export const UfoRescueIllustration: React.FC<UfoRescueProps> = ({
  state = 'trapped',
  className = 'w-72 h-52',
}) => {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <svg viewBox="0 0 400 280" className="w-full h-full drop-shadow-2xl" fill="none">
        <defs>
          {/* Metallic Silver Saucer Gradient */}
          <linearGradient id="saucerBody" x1="50" y1="90" x2="350" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#E2E8F0" />
            <stop offset="60%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Saucer Rim Rimlight */}
          <linearGradient id="saucerRim" x1="30" y1="160" x2="370" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="20%" stopColor="#27DFFF" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="80%" stopColor="#27DFFF" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Glass Cockpit Dome Gradient */}
          <radialGradient id="cockpitGlass" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="35%" stopColor="rgba(39, 223, 255, 0.65)" />
            <stop offset="75%" stopColor="rgba(23, 105, 210, 0.75)" />
            <stop offset="100%" stopColor="rgba(7, 27, 73, 0.95)" />
          </radialGradient>

          {/* Tractor Beam / Thruster Glow */}
          <linearGradient id="beamGrad" x1="200" y1="190" x2="200" y2="275" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#27DFFF" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FFC83D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Energy Beam Below UFO */}
        <polygon points="150,195 250,195 320,275 80,275" fill="url(#beamGrad)" />

        {/* Thruster Rings */}
        <ellipse cx="200" cy="195" rx="55" ry="12" fill="#1769D2" />
        <ellipse cx="200" cy="195" rx="42" ry="8" fill="#27DFFF" className="animate-pulse" />
        <ellipse cx="200" cy="195" rx="25" ry="4" fill="#FFFFFF" />

        {/* Cockpit Back Interior */}
        <ellipse cx="200" cy="115" rx="80" ry="60" fill="#071B49" />

        {/* Two Trapped Vietnamese Students inside Cockpit */}
        {state !== 'rescued' ? (
          <g className="animate-pulse">
            {/* Student 1 (Boy on left - Nam sinh áo trắng quần xanh) */}
            <g transform="translate(145, 82)">
              {/* Hair */}
              <circle cx="22" cy="18" r="14" fill="#0F172A" />
              {/* Face */}
              <circle cx="22" cy="22" r="11" fill="#FCD34D" />
              {/* Trapped worried/hopeful eyes */}
              <ellipse cx="18" cy="21" rx="2" ry="3" fill="#0F172A" />
              <ellipse cx="26" cy="21" rx="2" ry="3" fill="#0F172A" />
              {/* Open waving mouth */}
              <path d="M 19 28 Q 22 31 25 28" stroke="#DC2626" strokeWidth="1.5" fill="none" />
              {/* White school shirt with navy collar */}
              <path d="M 10 33 Q 22 32 34 33 L 37 56 L 7 56 Z" fill="#FFFFFF" />
              <polygon points="18,33 26,33 24,42 20,42" fill="#1769D2" />
              {/* Waving left arm against glass */}
              <path d="M 8 36 Q -2 24 5 16" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
              <circle cx="6" cy="14" r="3.5" fill="#FCD34D" />
            </g>

            {/* Student 2 (Girl on right - Nữ sinh áo trắng váy xanh) */}
            <g transform="translate(205, 82)">
              {/* Ponytail / hair */}
              <circle cx="22" cy="18" r="15" fill="#1E293B" />
              <path d="M 34 18 Q 42 26 38 34" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" fill="none" />
              {/* Face */}
              <circle cx="22" cy="22" r="11" fill="#FDE68A" />
              {/* Eyes */}
              <ellipse cx="18" cy="21" rx="2" ry="3" fill="#0F172A" />
              <ellipse cx="26" cy="21" rx="2" ry="3" fill="#0F172A" />
              <path d="M 19 28 Q 22 32 25 28" stroke="#DC2626" strokeWidth="1.5" fill="none" />
              {/* White shirt with red scarf / blue tie */}
              <path d="M 10 33 Q 22 32 34 33 L 37 56 L 7 56 Z" fill="#FFFFFF" />
              <polygon points="19,33 25,33 23,43 21,43" fill="#DC2626" />
              {/* Waving right arm pressing glass */}
              <path d="M 34 36 Q 44 25 39 16" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
              <circle cx="40" cy="14" r="3.5" fill="#FDE68A" />
            </g>
          </g>
        ) : (
          // Joyful Rescued Badge in Cockpit
          <g>
            <circle cx="200" cy="115" r="30" fill="#22C55E" opacity="0.3" className="animate-ping" />
            <circle cx="200" cy="115" r="26" fill="#10B981" />
            <path d="M 188 115 L 196 123 L 214 105" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}

        {/* Glass Dome Overlay */}
        <path
          d="M 120 135 C 120 75 280 75 280 135 Z"
          fill="url(#cockpitGlass)"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2.5"
        />
        {/* Glass Curvature Reflection */}
        <path
          d="M 135 125 C 145 92 230 85 265 105"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.65"
          fill="none"
        />

        {/* Saucer Lower Hull */}
        <ellipse cx="200" cy="172" rx="160" ry="38" fill="url(#saucerBody)" stroke="#64748B" strokeWidth="3" />

        {/* Saucer Glowing Circumference Rim */}
        <path
          d="M 40 172 C 40 188 360 188 360 172 C 360 156 40 156 40 172 Z"
          fill="url(#saucerRim)"
        />

        {/* Flashing Saucer Indicator Lights */}
        {[70, 115, 160, 200, 240, 285, 330].map((cx, idx) => (
          <circle
            key={idx}
            cx={cx}
            cy="172"
            r="4.5"
            fill={idx % 2 === 0 ? '#27DFFF' : '#FFC83D'}
            className="animate-pulse"
            style={{ animationDelay: `${idx * 0.25}s` }}
          />
        ))}

        {/* Top Antenna / Sensor */}
        <line x1="200" y1="48" x2="200" y2="78" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="200" cy="46" r="7" fill="#FFC83D" />
        <circle cx="200" cy="46" r="12" fill="#FFC83D" opacity="0.4" className="animate-ping" />
      </svg>
    </div>
  );
};
