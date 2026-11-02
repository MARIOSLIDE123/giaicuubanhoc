/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Radar, Shield, KeyRound, Lock, CheckCircle, 
  Sparkles, Navigation, Play, Activity
} from 'lucide-react';
import { GameProgress, ScreenState, Team } from '../types/game';
import { soundEngine } from '../utils/sound';
import missionBannerImg from '../assets/mission-banner-wide.png';

interface MissionMapProps {
  progress: GameProgress;
  teams: Team[];
  activeTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
  onSelectStage: (stage: 1 | 2 | 3) => void;
  onNavigate: (screen: ScreenState) => void;
}

export const MissionMap: React.FC<MissionMapProps> = ({
  progress,
  onSelectStage,
}) => {
  const stages = [
    {
      id: 1,
      title: 'CHẶNG 1: TRUY VẾT TÀU UFO',
      subtitle: 'UFO TRACKING MISSION',
      desc: 'Giải mã 7 tín hiệu tọa độ không gian để xác định vị trí tàu UFO đang bay.',
      time: '9 phút',
      tasksCount: 7,
      completedCount: progress.stage1CompletedTasks.length,
      isUnlocked: true,
      isDone: progress.stage1Done,
      icon: <Radar className="w-9 h-9" />,
      color: '#1769D2',
      accentColor: '#27DFFF',
      borderGlow: 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.35)]',
    },
    {
      id: 2,
      title: 'CHẶNG 2: ĐỘT NHẬP UFO',
      subtitle: 'UFO INFILTRATION MISSION',
      desc: 'Vượt qua 5 lớp khóa bảo mật áp suất để tiếp cận khoang hành khách tàu UFO.',
      time: '12 phút',
      tasksCount: 5,
      completedCount: progress.stage2UnlockedLocks,
      isUnlocked: progress.stage1Done || progress.activeStage >= 2,
      isDone: progress.stage2Done,
      icon: <Shield className="w-9 h-9" />,
      color: '#7139B9',
      accentColor: '#D946EF',
      borderGlow: 'border-purple-400 shadow-[0_0_30px_rgba(217,70,239,0.35)]',
    },
    {
      id: 3,
      title: 'CHẶNG 3: GIẢI CỨU BẠN HỌC',
      subtitle: 'FINAL RESCUE MISSION',
      desc: 'Xác thực 3 mật mã vận dụng cao để mở buồng cứu hộ, đón hai bạn học sinh an toàn trở về.',
      time: '11 phút',
      tasksCount: 3,
      completedCount: progress.stage3MasterKeys,
      isUnlocked: progress.stage2Done || progress.activeStage >= 3,
      isDone: progress.stage3Done,
      icon: <KeyRound className="w-9 h-9" />,
      color: '#D97706',
      accentColor: '#FFC83D',
      borderGlow: 'border-amber-400 shadow-[0_0_30px_rgba(255,200,61,0.35)]',
    },
  ];

  const handleStageClick = (stageId: 1 | 2 | 3, isUnlocked: boolean) => {
    if (!isUnlocked) {
      soundEngine.playWrong();
      return;
    }
    soundEngine.playUnlock();
    onSelectStage(stageId);
  };

  return (
    <div className="relative min-h-[calc(100vh-68px)] flex flex-col justify-between py-4 px-4 sm:px-8 xl:px-12 w-full max-w-[1780px] mx-auto z-10 space-y-4">
      {/* 1. Big Mission Banner Provided by User (Replaces Scoreboard) */}
      <div className="relative w-full rounded-3xl overflow-hidden panel-cosmic border-2 border-cyan-400/50 shadow-[0_12px_45px_rgba(0,0,0,0.8),0_0_30px_rgba(34,211,238,0.25)] select-none">
        <img
          src={missionBannerImg}
          alt="Bản đồ chiến dịch giải cứu bạn học"
          className="w-full h-auto max-h-[380px] xl:max-h-[420px] object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03091c]/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. Sub-header: LỘ TRÌNH TÁC CHIẾN KHÔNG GIAN (Removed Duplicate Title) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 panel-cosmic px-6 py-3.5 rounded-2xl border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center shadow">
            <Navigation className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-cyan-300">
              HÀNH TRÌNH KHÔNG GIAN
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white text-high-contrast">
              LỘ TRÌNH TÁC CHIẾN KHÔNG GIAN
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 px-5 py-2 rounded-xl border border-cyan-500/40 shadow-inner">
          <Activity className="w-5 h-5 text-cyan-300 animate-pulse" />
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-semibold uppercase">Tiến độ vượt chặng</span>
            <strong className="text-base sm:text-lg font-black text-amber-300 font-mono">
              {(progress.stage1Done ? 1 : 0) + (progress.stage2Done ? 1 : 0) + (progress.stage3Done ? 1 : 0)} / 3 Chặng Hoàn Thành
            </strong>
          </div>
        </div>
      </div>

      {/* 3 Stages Roadmap Cards in Full 16:9 Horizontal Layout */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5 xl:gap-7 my-auto py-1">
        {/* Glowing flight trajectory connector line (desktop) */}
        <div className="hidden md:block absolute top-1/2 left-20 right-20 h-1.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 -translate-y-1/2 z-0 opacity-50 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />

        {stages.map((stage) => {
          return (
            <div
              key={stage.id}
              className={`relative z-10 rounded-3xl border-2 p-5 xl:p-7 flex flex-col justify-between transition-all ${
                stage.isDone
                  ? 'panel-cosmic border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                  : stage.isUnlocked
                    ? `panel-cosmic ${stage.borderGlow}`
                    : 'bg-slate-950/90 border-slate-800 opacity-65'
              }`}
            >
              {/* Header inside card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-14 h-14 xl:w-16 xl:h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl border border-white/20"
                    style={{ backgroundColor: stage.color }}
                  >
                    {stage.icon}
                  </div>

                  {stage.isDone ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-black text-xs shadow">
                      <CheckCircle className="w-3.5 h-3.5" />
                      HOÀN THÀNH
                    </span>
                  ) : stage.isUnlocked ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-300 font-black text-xs animate-pulse shadow">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      SẴN SÀNG
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 font-bold text-xs">
                      <Lock className="w-3.5 h-3.5" />
                      ĐANG KHÓA
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-xs font-black tracking-widest text-cyan-300 uppercase mb-0.5">
                    {stage.subtitle}
                  </div>
                  <h3 className="text-lg xl:text-xl font-black text-white text-high-contrast">
                    {stage.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {stage.desc}
                </p>
              </div>

              {/* Progress & Launch Button */}
              <div className="space-y-3 pt-4 mt-4 border-t border-slate-700/80">
                <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                  <span>Thời lượng: <strong className="text-white font-bold">{stage.time}</strong></span>
                  <span>
                    Nhiệm vụ: <strong className="text-amber-300 font-mono text-sm font-black">{stage.completedCount}/{stage.tasksCount}</strong>
                  </span>
                </div>

                <button
                  onClick={() => handleStageClick(stage.id as 1 | 2 | 3, stage.isUnlocked)}
                  className={`w-full py-3.5 rounded-xl font-black text-sm xl:text-base flex items-center justify-center gap-2 transition-all btn-3d shadow-xl ${
                    stage.isDone
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50'
                      : stage.isUnlocked
                        ? 'bg-gradient-to-r from-blue-600 via-cyan-400 to-amber-400 text-slate-950 shadow-cyan-500/40 animate-shimmer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{stage.isDone ? 'CHƠI LẠI CHẶNG NÀY' : 'VÀO THỰC THI CHIẾN DỊCH'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Mission Summary Bar */}
      <div className="w-full panel-cosmic px-5 py-2.5 rounded-xl border border-cyan-500/30 flex flex-wrap items-center justify-between text-xs text-slate-300 font-medium">
        <div className="flex items-center gap-2 text-cyan-300 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Chiến dịch tương tác: Giáo viên nhấp chọn từng chặng để điều khiển lớp học.</span>
        </div>
        <div className="text-slate-400">
          Tối ưu hiển thị máy chiếu 16:9
        </div>
      </div>
    </div>
  );
};
