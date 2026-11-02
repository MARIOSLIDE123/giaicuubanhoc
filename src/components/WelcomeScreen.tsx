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
    <div className="relative min-h-[calc(100vh-68px)] flex flex-col justify-between py-6 px-4 sm:px-8 lg:px-12 xl:px-16 w-full max-w-[1750px] mx-auto z-10">
      {/* Top Banner Tag */}
      <div className="flex justify-center items-center">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full panel-cosmic border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-black tracking-widest uppercase shadow-xl animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>TOÁN 10 · CÁC SỐ ĐẶC TRƯNG ĐO XU THẾ TRUNG TÂM</span>
        </div>
      </div>

      {/* Hero Visual Area: UFO Trapped Students & Action Panel in 16:9 Widescreen */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 my-auto py-4">
        {/* Left UFO Illustration: Widescreen Spotlight */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center p-4">
            {/* Hologram radar rings around UFO */}
            <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping opacity-20 pointer-events-none" />
            <div className="absolute -inset-10 rounded-full border border-purple-500/25 pointer-events-none" />
            <div className="absolute -inset-20 rounded-full border border-cyan-400/10 pointer-events-none" />
            
            <UfoRescueIllustration state="trapped" className="w-80 sm:w-96 md:w-[520px] xl:w-[600px] h-64 sm:h-80 xl:h-96 drop-shadow-[0_20px_50px_rgba(34,211,238,0.35)]" />
          </div>

          <div className="mt-4 text-xs sm:text-sm text-slate-100 font-semibold flex items-center gap-2.5 panel-cosmic px-5 py-2.5 rounded-full border border-red-500/50 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
            <span className="text-high-contrast">Tín hiệu khẩn cấp: Hai bạn học sinh đang chờ các phi hành đoàn giải mã để thoát khỏi UFO!</span>
          </div>
        </div>

        {/* Right Hero Text & Direct Mission Actions */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          {/* Main 3D Title */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 text-xs font-black tracking-widest uppercase">
              <Radio className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              CHIẾN DỊCH GIẢI CỨU KHÔNG GIAN
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-300 drop-shadow-[0_6px_24px_rgba(0,0,0,0.9)]">
              GIẢI CỨU BẠN HỌC
            </h1>
            <div className="text-lg sm:text-xl font-black tracking-wider text-amber-300 uppercase flex items-center justify-center lg:justify-start gap-3">
              <span className="text-high-contrast">🛸 UFO RESCUE MISSION</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-blue-600/40 text-cyan-200 border border-cyan-300/40 font-bold">
                TOÁN 10 THPT
              </span>
            </div>
          </div>

          {/* Mission summary description with crystal clear contrast */}
          <div className="panel-cosmic rounded-2xl p-5 border border-cyan-500/30 shadow-2xl space-y-3">
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

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row items-stretch lg:items-center gap-4 pt-2">
            {/* Primary Big Start Button */}
            <button
              onClick={handleStartMission}
              className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-400 to-amber-400 text-slate-950 font-black text-lg xl:text-xl tracking-wide shadow-[0_0_35px_rgba(34,211,238,0.7)] hover:shadow-[0_0_50px_rgba(253,224,71,0.9)] transition-all flex items-center justify-center gap-3 btn-3d animate-shimmer"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>BẮT ĐẦU NHIỆM VỤ</span>
            </button>

            {/* Help Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenHelp();
              }}
              className="px-6 py-4 rounded-2xl panel-cosmic hover:bg-slate-800/90 border-slate-600/80 hover:border-cyan-400 text-white font-bold text-sm xl:text-base transition-all flex items-center justify-center gap-2.5 btn-3d shadow-xl"
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
              className="px-6 py-4 rounded-2xl panel-cosmic hover:bg-slate-800/90 border-slate-600/80 hover:border-amber-400 text-white font-bold text-sm xl:text-base transition-all flex items-center justify-center gap-2.5 btn-3d shadow-xl"
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
