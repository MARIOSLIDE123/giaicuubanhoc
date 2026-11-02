/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ufoTrappedImg from '../assets/ufo-trapped.png';

interface UfoRescueProps {
  state?: 'trapped' | 'infiltrating' | 'rescued' | 'entering' | 'saved';
  className?: string;
}

export const UfoRescueIllustration: React.FC<UfoRescueProps> = ({
  state = 'trapped',
  className = 'w-80 h-64',
}) => {
  return (
    <div className={`relative ${className} flex items-center justify-center animate-float select-none`}>
      {/* Outer Cosmic Light Aura */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-r from-purple-500/30 via-cyan-400/25 to-amber-400/30 blur-2xl pointer-events-none animate-pulse" />
      
      {/* Subtle Thruster Glow underneath */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-cyan-400/30 blur-xl rounded-full pointer-events-none" />

      {/* 3D UFO with Trapped Students Image */}
      <img
        src={ufoTrappedImg}
        alt="UFO Trapped Students"
        className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(217,70,239,0.45)] drop-shadow-[0_0_40px_rgba(34,211,238,0.35)] transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
};
