/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, HelpCircle, Settings, ShieldCheck, Sparkles, Compass, Radio } from 'lucide-react';
import { UfoRescueIllustration } from './UfoRescueIllustration';
import { soundEngine } from '../utils/sound';

interface WelcomeScreenProps {
  onStart: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  onOpenHelp,
  onOpenSettings,
}) => {
  const handleStartMission = () => {
    soundEngine.playUfoWhoosh();
    onStart();
  };

  return (
    <div className="relative min-h-[calc(100vh-68px)] flex flex-col justify-between py-6 px-4 sm:px-8 lg:px-12 xl:px-16 w-full max-w-[1780px] mx-auto z-10">
      {/* Top Banner Tag */}
      <div className="flex justify-center items-center">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full panel-cosmic border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-black tracking-widest uppercase shadow-xl animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>TOÁN 10 · CÁC SỐ ĐẶC TRƯNG ĐO XU THẾ TRUNG TÂM</span>
        </div>
      </div>

      {/* Hero Visual Area: UFO Trapped Students & Action Panel in 16:9 Widescreen */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10 xl:gap-14 my-auto py-4">
        {/* Left UFO Illustration: 3D Cute Students Trapped in Cockpit Dome (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center p-2 w-full">
            {/* Hologram cosmic rings around UFO */}
            <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping opacity-25 pointer-events-none" />
            <div className="absolute -inset-8 rounded-full border border-purple-500/30 pointer-events-none" />
            
            <UfoRescueIllustration
              state="trapped"
              className="w-72 sm:w-96 md:w-[460px] lg:w-[420px] xl:w-[480px] 2xl:w-[540px] h-auto drop-shadow-[0_20px_50px_rgba(217,70,239,0.5)]"
            />
          </div>

          <div className="mt-3 text-xs sm:text-sm text-slate-100 font-semibold flex items-center gap-2.5 panel-cosmic px-5 py-2 rounded-full border border-red-500/50 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
            <span className="text-high-contrast">Tín hiệu khẩn cấp: Hai bạn học sinh đang chờ các phi hành đoàn giải mã để thoát khỏi UFO!</span>
          </div>
        </div>

        {/* Right Hero Text & Direct Mission Actions (7 cols to keep title strictly 1 line) */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          {/* Main Title Group - SPACED OUT FOR FULL VIETNAMESE ACCENTS */}
          <div className="w-full">
            {/* Tag Badge: Separated with clear bottom margin */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 text-xs sm:text-sm font-black tracking-widest uppercase shadow-md mb-4 sm:mb-5">
              <Radio className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>CHIẾN DỊCH GIẢI CỨU KHÔNG GIAN</span>
            </div>
            
            {/* Title Guaranteed on 1 Line, fully padded so ALL accents are 100% visible */}
            <div className="py-2 overflow-visible">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)] whitespace-nowrap leading-normal overflow-visible">
                GIẢI CỨU BẠN HỌC
              </h1>
            </div>

            <div className="text-base sm:text-lg font-black tracking-wider text-amber-300 uppercase flex items-center justify-center lg:justify-start gap-3 mt-3">
              <span className="text-high-contrast">🛸 UFO RESCUE MISSION</span>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-600/50 text-cyan-200 border border-cyan-300/50 font-black">
                TOÁN 10 THPT
              </span>
            </div>
          </div>

          {/* Mission summary description with crystal clear contrast */}
          <div className="panel-cosmic rounded-2xl p-5 border border-cyan-500/30 shadow-2xl space-y-3 w-full">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-cyan-300 tracking-wider">
              <Compass className="w-4 h-4 text-amber-400" />
              MỤC TIÊU CHIẾN DỊCH
            </div>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed text-high-contrast">
              Vượt qua 3 chặng không gian: <strong className="text-cyan-300">Truy vết radar</strong>,{' '}
              <strong className="text-purple-300">Đột nhập cửa bảo mật</strong> và{' '}
              <strong className="text-amber-300">Mở buồng cứu hộ</strong> bằng các công cụ toán học:{' '}
              <span className="text-white font-bold underline decoration-cyan-400 decoration-2 underline-offset-4">Số trung bình, Trung vị, Mốt, Tứ phân vị</span>{' '}
              và phát hiện <span className="text-orange-400 font-bold">giá trị bất thường</span>!
            </p>
          </div>

          {/* Action Buttons Row */}
          <div className="w-full flex flex-col sm:flex-row items-stretch lg:items-center gap-4 pt-2">
            {/* Primary SUPER PROMINENT Start Button with Crisp WHITE TEXT */}
            <button
              onClick={handleStartMission}
              className="flex-1 sm:flex-none px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 hover:from-orange-500 hover:via-amber-500 hover:to-yellow-400 text-white font-black text-lg sm:text-xl tracking-wider shadow-[0_0_35px_rgba(245,158,11,0.9),0_0_60px_rgba(234,88,12,0.6)] hover:shadow-[0_0_55px_rgba(253,224,71,1)] hover:scale-105 active:scale-95 border-2 border-white/90 transition-all flex items-center justify-center gap-3.5 btn-3d animate-shimmer whitespace-nowrap cursor-pointer z-20"
            >
              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white shrink-0 drop-shadow-md" />
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] font-black text-white">BẮT ĐẦU NHIỆM VỤ</span>
            </button>

            {/* Help Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenHelp();
              }}
              className="px-6 py-4 rounded-2xl panel-cosmic hover:bg-slate-800/90 border-slate-600/80 hover:border-cyan-400 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 btn-3d shadow-xl whitespace-nowrap"
            >
              <HelpCircle className="w-5 h-5 text-cyan-300" />
              <span>LUẬT CHƠI</span>
            </button>

            {/* Teacher Setup Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenSettings();
              }}
              className="px-6 py-4 rounded-2xl panel-cosmic hover:bg-slate-800/90 border-slate-600/80 hover:border-amber-400 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 btn-3d shadow-xl whitespace-nowrap"
            >
              <Settings className="w-5 h-5 text-amber-300" />
              <span>CÀI ĐẶT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Trust & Feature Indicators in 16:9 layout */}
      <div className="w-full pt-4 border-t border-cyan-500/20 flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-200 gap-4">
        <div className="flex items-center gap-2 panel-cosmic px-4 py-2 rounded-xl border border-slate-700">
          <ShieldCheck className="w-4 h-4 text-cyan-300" />
          <span className="font-semibold text-high-contrast">Chuẩn kiến thức SGK Toán 10 · 3 Chặng thi đua gay cấn · Tự động tính điểm</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300 font-semibold panel-cosmic px-4 py-2 rounded-xl border border-slate-700">
          <span className="text-cyan-300">Tối ưu Full 16:9</span>
          <span>·</span>
          <span className="text-amber-300">Hỗ trợ 2–6 Đội thi đua</span>
          <span>·</span>
          <span className="text-emerald-300">Đồng hồ đếm ngược thông minh</span>
        </div>
      </div>
    </div>
  );
};
