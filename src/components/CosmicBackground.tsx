/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import bgSpaceImage from '../assets/bg-space.jpg';

export const CosmicBackground: React.FC = () => {
  // Generate subtle twinkling stars overlay
  const stars = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: (i * 41) % 100,
      y: (i * 67) % 100,
      size: (i % 3) + 1,
      opacity: 0.2 + ((i % 4) * 0.12),
      duration: 3 + (i % 3),
      delay: (i % 5) * 0.8,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#050B20]">
      {/* User Uploaded Cosmic Background Image */}
      <img
        src={bgSpaceImage}
        alt="Cosmic Galaxy Background"
        className="absolute inset-0 w-full h-full object-cover object-center select-none"
      />

      {/* Deep Vignette & Contrast Overlay to make text and cards super readable */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(5, 14, 38, 0.45) 0%, rgba(5, 14, 38, 0.35) 40%, rgba(3, 9, 25, 0.65) 100%), radial-gradient(circle at 50% 45%, transparent 35%, rgba(2, 6, 23, 0.65) 100%)'
        }}
      />

      {/* Subtle fine cosmic grid coordinates */}
      <div 
        className="absolute inset-0 opacity-[0.025]" 
        style={{
          backgroundImage: 'linear-gradient(rgba(39, 223, 255, 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(39, 223, 255, 0.8) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}
      />

      {/* Subtle floating starlight shimmer */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white transition-opacity"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `pulse ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            boxShadow: star.size > 2 ? '0 0 6px rgba(255, 255, 255, 0.8)' : undefined,
          }}
        />
      ))}
    </div>
  );
};
