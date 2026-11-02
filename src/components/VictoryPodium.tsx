/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, Medal, Award, RotateCcw, Home, 
  Map, Sparkles, Users
} from 'lucide-react';
import { Team, ScreenState } from '../types/game';
import { soundEngine } from '../utils/sound';

interface VictoryPodiumProps {
  teams: Team[];
  onPlayAgain: () => void;
  onNavigate: (screen: ScreenState) => void;
}

export const VictoryPodium: React.FC<VictoryPodiumProps> = ({
  teams,
  onPlayAgain,
  onNavigate,
}) => {
  // Sort teams by score descending
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const champion = sortedTeams[0];
  const second = sortedTeams[1];
  const third = sortedTeams[2];
  const others = sortedTeams.slice(3);

  useEffect(() => {
    soundEngine.playVictoryFanfare();
    confetti({
      particleCount: 160,
      spread: 95,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-68px)] flex flex-col justify-between py-6 px-4 sm:px-8 xl:px-12 w-full max-w-[1750px] mx-auto z-10 text-center space-y-6">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-950/80 border border-amber-400/60 text-amber-300 text-xs sm:text-sm font-black tracking-widest uppercase shadow-lg">
          <Sparkles className="w-4 h-4" />
          LỄ TRAO GIẢI VÀ VINH DANH CHIẾN DỊCH VŨ TRỤ
        </div>
        <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-300 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          CHIẾN DỊCH GIẢI CỨU HOÀN TẤT XUẤT SẮC!
        </h1>
        <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto font-medium text-high-contrast">
          Tuyên dương tinh thần đoàn kết, tư duy logic sắc bén và khả năng xử lý số liệu thống kê chuẩn xác của toàn thể các đội cứu hộ Trái Đất!
        </p>
      </div>

      {/* 3D Award Podium in Widescreen 16:9 Layout */}
      <div className="w-full max-w-5xl mx-auto pt-6 pb-2">
        <div className="flex items-end justify-center gap-4 sm:gap-8">
          {/* 2nd Place (Silver - Left) */}
          {second && (
            <div className="flex-1 max-w-[260px] flex flex-col items-center">
              <div className="mb-3">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white shadow-xl mx-auto mb-2 border-2 border-slate-300"
                  style={{ backgroundColor: second.color }}
                >
                  <Medal className="w-9 h-9 text-slate-200" />
                </div>
                <div className="text-sm sm:text-base font-black text-white truncate max-w-[180px] drop-shadow">
                  {second.name}
                </div>
                <div className="text-lg sm:text-xl font-mono font-black text-cyan-300 tabular-nums">
                  {second.score} <span className="text-xs text-slate-300">điểm</span>
                </div>
              </div>

              {/* Podium Column #2 */}
              <div className="w-full h-40 sm:h-48 rounded-t-3xl bg-gradient-to-b from-slate-400 via-slate-600 to-slate-800 border-t-4 border-slate-300 flex flex-col items-center justify-center text-slate-900 shadow-2xl">
                <span className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg">2</span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-200 mt-1">HẠNG NHÌ</span>
              </div>
            </div>
          )}

          {/* 1st Place Champion (Gold - Center High) */}
          {champion && (
            <div className="flex-1 max-w-[300px] flex flex-col items-center z-10">
              <div className="mb-3 relative">
                {/* Crown glow */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-amber-300 animate-bounce">
                  <Trophy className="w-8 h-8 fill-amber-300" />
                </div>

                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-white shadow-[0_0_35px_rgba(253,224,71,0.7)] mx-auto mb-2 border-4 border-amber-300 ring-4 ring-amber-400/30"
                  style={{ backgroundColor: champion.color }}
                >
                  <Trophy className="w-12 h-12 text-amber-300" />
                </div>

                <div className="text-base sm:text-lg font-black text-white truncate max-w-[200px] drop-shadow">
                  {champion.name}
                </div>
                <div className="text-xl sm:text-2xl font-mono font-black text-amber-300 tabular-nums text-glow-yellow">
                  {champion.score} <span className="text-xs text-amber-200">điểm</span>
                </div>
              </div>

              {/* Podium Column #1 (Highest) */}
              <div className="w-full h-52 sm:h-64 rounded-t-3xl bg-gradient-to-b from-amber-400 via-amber-600 to-amber-900 border-t-4 border-amber-200 flex flex-col items-center justify-center text-slate-950 shadow-[0_0_40px_rgba(253,224,71,0.4)]">
                <span className="text-5xl sm:text-6xl font-black text-slate-950 drop-shadow">1</span>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-100 mt-1">QUÁN QUÂN</span>
              </div>
            </div>
          )}

          {/* 3rd Place (Bronze - Right) */}
          {third && (
            <div className="flex-1 max-w-[260px] flex flex-col items-center">
              <div className="mb-3">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white shadow-xl mx-auto mb-2 border-2 border-amber-700"
                  style={{ backgroundColor: third.color }}
                >
                  <Award className="w-9 h-9 text-amber-600" />
                </div>
                <div className="text-sm sm:text-base font-black text-white truncate max-w-[180px] drop-shadow">
                  {third.name}
                </div>
                <div className="text-lg sm:text-xl font-mono font-black text-amber-400 tabular-nums">
                  {third.score} <span className="text-xs text-slate-300">điểm</span>
                </div>
              </div>

              {/* Podium Column #3 */}
              <div className="w-full h-32 sm:h-40 rounded-t-3xl bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 border-t-4 border-amber-600 flex flex-col items-center justify-center text-amber-100 shadow-2xl">
                <span className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg">3</span>
                <span className="text-xs font-black uppercase tracking-wider text-amber-200 mt-1">HẠNG BA</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Other Teams (4th, 5th, 6th) Horizontal Grid */}
      {others.length > 0 && (
        <div className="max-w-4xl mx-auto w-full panel-cosmic p-4 rounded-2xl border border-cyan-500/30">
          <div className="text-xs font-black uppercase text-cyan-300 mb-3 flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-amber-300" />
            BẢNG XẾP HẠNG CÁC ĐỘI ĐỒNG HÀNH XUẤT SẮC
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {others.map((team, idx) => (
              <div
                key={team.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between shadow"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 text-xs font-black text-slate-300 flex items-center justify-center">
                    {idx + 4}
                  </span>
                  <span className="text-sm font-bold text-white truncate max-w-[130px]">
                    {team.name}
                  </span>
                </div>
                <span className="text-base font-mono font-black text-amber-300">
                  {team.score}đ
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation and Replay Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          onClick={() => {
            soundEngine.playClick();
            onPlayAgain();
          }}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-400 to-amber-400 text-slate-950 font-black text-base xl:text-lg shadow-[0_0_25px_#22d3ee] hover:shadow-[0_0_35px_#facc15] flex items-center gap-2.5 btn-3d animate-shimmer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>CHƠI LẠI TỪ ĐẦU</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onNavigate('ROADMAP');
          }}
          className="px-6 py-4 rounded-2xl panel-cosmic hover:bg-slate-800 text-white font-bold text-sm xl:text-base border border-slate-700 hover:border-cyan-400 flex items-center gap-2 transition-colors btn-3d shadow-xl"
        >
          <Map className="w-5 h-5 text-cyan-300" />
          <span>XEM LẠI BẢN ĐỒ</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onNavigate('WELCOME');
          }}
          className="px-6 py-4 rounded-2xl panel-cosmic hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm xl:text-base border border-slate-700 hover:border-amber-400 flex items-center gap-2 transition-colors btn-3d shadow-xl"
        >
          <Home className="w-5 h-5 text-amber-300" />
          <span>VỀ TRANG CHỦ</span>
        </button>
      </div>
    </div>
  );
};
