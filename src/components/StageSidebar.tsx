/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Eye, Map, Plus, Minus, 
  HelpCircle, ChevronRight, Award, Clock, RotateCw, AlertTriangle
} from 'lucide-react';
import { Team } from '../types/game';
import { soundEngine } from '../utils/sound';
import { ScoreBoard } from './ScoreBoard';

interface StageSidebarProps {
  teams: Team[];
  activeTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
  onAdjustPoints: (teamId: string, delta: number) => void;
  onResetAllScores?: () => void;
  initialTimeSeconds?: number;
  onTimeout?: () => void;
  onToggleShowSolution?: () => void;
  isSolutionShown?: boolean;
  onToggleShowHint?: () => void;
  isHintShown?: boolean;
  onBackToMap: () => void;
  onNextQuestion?: () => void;
  nextButtonLabel?: string;
  showNextButton?: boolean;
}

export const StageSidebar: React.FC<StageSidebarProps> = ({
  teams,
  activeTeamId,
  onSelectTeam,
  onAdjustPoints,
  onResetAllScores,
  initialTimeSeconds = 60,
  onTimeout,
  onToggleShowSolution,
  isSolutionShown = false,
  onToggleShowHint,
  isHintShown = false,
  onBackToMap,
  onNextQuestion,
  nextButtonLabel = 'Câu tiếp',
  showNextButton = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTimeSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync timer when initialTimeSeconds changes
  useEffect(() => {
    setTimeLeft(initialTimeSeconds);
    setIsTimerRunning(true);
  }, [initialTimeSeconds]);

  // Countdown timer
  useEffect(() => {
    if (!isTimerRunning) return;
    if (timeLeft <= 0) {
      soundEngine.playTimeoutAlarm();
      onTimeout?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          soundEngine.playTimeoutAlarm();
          onTimeout?.();
          return 0;
        }
        if (prev <= 6) {
          soundEngine.playTimerTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, onTimeout]);

  const toggleTimer = () => {
    soundEngine.playClick();
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    soundEngine.playClick();
    setTimeLeft(initialTimeSeconds);
    setIsTimerRunning(true);
  };

  const addTime = (sec: number) => {
    soundEngine.playClick();
    setTimeLeft(prev => prev + sec);
  };

  const activeTeam = teams.find(t => t.id === activeTeamId);

  // Format time mm:ss
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft <= 10;

  return (
    <aside className="w-72 xl:w-80 shrink-0 flex flex-col gap-3 h-full">
      {/* 1. Timer Panel */}
      <div className={`panel-cosmic p-3 rounded-2xl border transition-all ${
        isLowTime 
          ? 'border-red-500 bg-red-950/40 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse' 
          : 'border-cyan-500/40 bg-slate-950/80 shadow-lg'
      }`}>
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            ĐỒNG HỒ TÁC CHIẾN
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => addTime(15)}
              className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/60 text-cyan-200 border border-cyan-500/40 hover:bg-blue-800"
              title="Cộng 15 giây"
            >
              +15s
            </button>
            <button
              onClick={() => addTime(30)}
              className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/60 text-cyan-200 border border-cyan-500/40 hover:bg-blue-800"
              title="Cộng 30 giây"
            >
              +30s
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* Big Digital Display */}
          <div className={`font-mono text-2xl xl:text-3xl font-black tabular-nums tracking-widest px-3 py-1 rounded-xl border bg-black/60 shadow-inner ${
            isLowTime ? 'text-red-400 border-red-500' : 'text-amber-300 border-cyan-500/40'
          }`}>
            {formatTime(timeLeft)}
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTimer}
              className={`p-2 rounded-xl font-black text-xs transition-all btn-3d shadow flex items-center justify-center ${
                isTimerRunning 
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-400/30' 
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-400/30'
              }`}
              title={isTimerRunning ? 'Tạm dừng' : 'Bắt đầu'}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-all btn-3d shadow"
              title="Đặt lại giờ"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Vertical Scoreboard with Quick Points */}
      <div className="flex-1 min-h-0 flex flex-col panel-cosmic p-3 rounded-2xl border border-cyan-500/30 shadow-xl overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <ScoreBoard 
            teams={teams} 
            activeTeamId={activeTeamId} 
            onSelectTeam={onSelectTeam} 
            layout="vertical" 
          />
        </div>

        {/* Quick Point Adjustments for Active Team */}
        {activeTeam && (
          <div className="mt-2.5 pt-2 border-t border-slate-700/80">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1.5">
              <span className="truncate">Cộng điểm: <strong className="text-amber-300 font-black">{activeTeam.name}</strong></span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => onAdjustPoints(activeTeam.id, 5)}
                className="py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono font-black text-xs hover:bg-emerald-900 transition-all"
              >
                +5đ
              </button>
              <button
                onClick={() => onAdjustPoints(activeTeam.id, 10)}
                className="py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono font-black text-xs hover:bg-emerald-900 transition-all"
              >
                +10đ
              </button>
              <button
                onClick={() => onAdjustPoints(activeTeam.id, 20)}
                className="py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-mono font-black text-xs hover:bg-cyan-900 transition-all"
              >
                +20đ
              </button>
              <button
                onClick={() => onAdjustPoints(activeTeam.id, -5)}
                className="py-1 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 font-mono font-black text-xs hover:bg-red-900 transition-all"
              >
                -5đ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Action Tools: Solution, Hint, Map, Next */}
      <div className="panel-cosmic p-2.5 rounded-2xl border border-cyan-500/30 flex flex-col gap-2 shrink-0">
        <div className="grid grid-cols-2 gap-2">
          {onToggleShowHint && (
            <button
              onClick={onToggleShowHint}
              className={`p-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all btn-3d ${
                isHintShown
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_#facc15]'
                  : 'bg-slate-900/90 text-amber-300 border border-amber-500/40 hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Gợi ý</span>
            </button>
          )}

          {onToggleShowSolution && (
            <button
              onClick={onToggleShowSolution}
              className={`p-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all btn-3d ${
                isSolutionShown
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_#22d3ee]'
                  : 'bg-slate-900/90 text-cyan-300 border border-cyan-500/40 hover:bg-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isSolutionShown ? 'Ẩn giải' : 'Xem giải'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToMap}
            className="flex-1 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-black flex items-center justify-center gap-1.5 transition-all btn-3d"
          >
            <Map className="w-3.5 h-3.5 text-cyan-300" />
            <span>Bản đồ</span>
          </button>

          {showNextButton && onNextQuestion && (
            <button
              onClick={onNextQuestion}
              className="flex-1 p-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1 shadow-md hover:shadow-amber-400/40 transition-all btn-3d"
            >
              <span>{nextButtonLabel}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
