/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Settings, Maximize2, Minimize2, Music } from 'lucide-react';
import { ScreenState } from '../types/game';
import { soundEngine } from '../utils/sound';

interface HeaderNavProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
  onOpenSettings: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenSettings,
  isSoundMuted,
  onToggleSound,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAmbientOn, setIsAmbientOn] = useState(false);

  const toggleFullscreen = () => {
    soundEngine.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const toggleAmbientMusic = () => {
    soundEngine.playClick();
    soundEngine.toggleAmbient();
    setIsAmbientOn(soundEngine.isAmbientActive());
  };

  const navItems: { label: string; screen: ScreenState }[] = [
    { label: 'Trang chủ', screen: 'WELCOME' },
    { label: 'Bản đồ', screen: 'ROADMAP' },
    { label: 'Chặng 1: Truy vết', screen: 'STAGE_1' },
    { label: 'Chặng 2: Đột nhập', screen: 'STAGE_2' },
    { label: 'Chặng 3: Giải cứu', screen: 'STAGE_3' },
    { label: 'Vinh danh', screen: 'VICTORY' },
  ];

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 lg:px-12 xl:px-16 py-3.5 panel-cosmic border-b border-cyan-500/30">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => {
          soundEngine.playClick();
          onNavigate('WELCOME');
        }}
        className="text-lg md:text-xl font-black tracking-tight text-white hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5"
      >
        <span className="text-2xl text-amber-300">🛸</span>
        <span className="text-high-contrast">GIẢI CỨU BẠN HỌC</span>
        <span className="hidden sm:inline text-xs font-black px-2.5 py-0.5 rounded-md bg-blue-950/80 text-cyan-300 border border-cyan-400/40">
          UFO RESCUE
        </span>
      </button>

      {/* Zone 2: 4-5 single-line clean nav links */}
      <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-slate-200">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => {
                soundEngine.playClick();
                onNavigate(item.screen);
              }}
              className={`hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                isActive ? 'text-cyan-300 font-black' : 'text-slate-200'
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Action & Teacher Utility Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Ambient Cosmic Music Toggle */}
        <button
          onClick={toggleAmbientMusic}
          title={isAmbientOn ? 'Tắt nhạc nền vũ trụ' : 'Bật nhạc nền vũ trụ nhẹ'}
          className={`p-2.5 rounded-xl border transition-all whitespace-nowrap ${
            isAmbientOn 
              ? 'bg-purple-900/60 border-purple-400 text-amber-300 shadow-[0_0_15px_rgba(217,70,239,0.5)]' 
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400'
          }`}
        >
          <Music className="w-4 h-4" />
        </button>

        {/* Master Sound Effects Toggle */}
        <button
          onClick={onToggleSound}
          title={isSoundMuted ? 'Bật âm thanh hiệu ứng' : 'Tắt âm thanh hiệu ứng'}
          className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 transition-all whitespace-nowrap"
        >
          {isSoundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
        </button>

        {/* Fullscreen for Classroom Projector */}
        <button
          onClick={toggleFullscreen}
          title="Toàn màn hình (Tối ưu máy chiếu)"
          className="hidden sm:flex p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 transition-all whitespace-nowrap"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Teacher Settings Modal Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenSettings();
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-amber-300 hover:brightness-110 border border-cyan-300 rounded-xl shadow-lg transition-all whitespace-nowrap shrink-0 btn-3d"
        >
          <Settings className="w-4 h-4" />
          <span>CÀI ĐẶT</span>
        </button>
      </div>
    </header>
  );
};
