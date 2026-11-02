/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Eye, ChevronRight, FastForward, 
  Map, Plus, Minus, AlertTriangle, HelpCircle, Check, X
} from 'lucide-react';
import { Team } from '../types/game';
import { soundEngine } from '../utils/sound';

interface TeacherControlBarProps {
  teams: Team[];
  activeTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
  onAdjustPoints: (teamId: string, delta: number) => void;
  onResetAllScores: () => void;
  onToggleShowSolution: () => void;
  isSolutionShown: boolean;
  onToggleShowHint: () => void;
  isHintShown: boolean;
  onNextQuestion: () => void;
  onSkipQuestion: () => void;
  onBackToMap: () => void;
  initialTimeSeconds: number;
  onTimeout?: () => void;
}

export const TeacherControlBar: React.FC<TeacherControlBarProps> = ({
  teams,
  activeTeamId,
  onSelectTeam,
  onAdjustPoints,
  onResetAllScores,
  onToggleShowSolution,
  isSolutionShown,
  onToggleShowHint,
  isHintShown,
  onNextQuestion,
  onSkipQuestion,
  onBackToMap,
  initialTimeSeconds,
  onTimeout,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTimeSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync timer when question changes
  useEffect(() => {
    setTimeLeft(initialTimeSeconds);
    setIsTimerRunning(true);
  }, [initialTimeSeconds]);

  // Countdown effect
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

  const addExtraTime = (sec: number) => {
    soundEngine.playClick();
    setTimeLeft((prev) => prev + sec);
  };

  // Timer color indicator
  const timerColor = 
    timeLeft > 15 
      ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40' 
      : timeLeft > 5 
        ? 'text-[#FFC83D] border-[#FFC83D]/40 bg-amber-950/40' 
        : 'text-red-400 border-red-500/50 bg-red-950/50 animate-pulse';

  const activeTeam = teams.find(t => t.id === activeTeamId);

  return (
    <>
      <div className="w-full panel-cosmic rounded-2xl p-3 shadow-2xl border border-cyan-500/40 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Left cluster: Countdown Timer Controls */}
        <div className="flex items-center gap-2">
          {/* Timer Display */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-mono font-black text-lg tabular-nums shadow-lg ${timerColor}`}>
            <span>⏱️</span>
            <span>{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span>
          </div>

          {/* Timer Play/Pause */}
          <button
            onClick={toggleTimer}
            title={isTimerRunning ? 'Tạm dừng đồng hồ' : 'Tiếp tục đếm ngược'}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-amber-400 transition-colors btn-3d"
          >
            {isTimerRunning ? <Pause className="w-4 h-4 text-amber-300" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Reset Timer */}
          <button
            onClick={resetTimer}
            title="Đặt lại thời gian câu hỏi"
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-cyan-400 transition-colors btn-3d"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Add 30s */}
          <button
            onClick={() => addExtraTime(30)}
            title="Cộng thêm 30 giây thảo luận"
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 font-black border border-cyan-500/50 hover:border-cyan-400 transition-colors btn-3d"
          >
            +30s
          </button>
        </div>

        {/* Center cluster: Team points modifier */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800">
          <span className="text-slate-400 font-medium">
            Đội: <strong className="text-white">{activeTeam ? activeTeam.name : 'Chưa chọn'}</strong>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (activeTeamId) {
                  soundEngine.playCorrect();
                  onAdjustPoints(activeTeamId, 5);
                }
              }}
              disabled={!activeTeamId}
              className="px-2 py-1 bg-emerald-600/40 hover:bg-emerald-600 border border-emerald-500/60 rounded font-bold text-emerald-300 hover:text-white transition-all disabled:opacity-40"
            >
              +5
            </button>
            <button
              onClick={() => {
                if (activeTeamId) {
                  soundEngine.playCorrect();
                  onAdjustPoints(activeTeamId, 10);
                }
              }}
              disabled={!activeTeamId}
              className="px-2 py-1 bg-emerald-600/40 hover:bg-emerald-600 border border-emerald-500/60 rounded font-bold text-emerald-300 hover:text-white transition-all disabled:opacity-40"
            >
              +10
            </button>
            <button
              onClick={() => {
                if (activeTeamId) {
                  soundEngine.playCorrect();
                  onAdjustPoints(activeTeamId, 20);
                }
              }}
              disabled={!activeTeamId}
              className="px-2 py-1 bg-[#1769D2]/70 hover:bg-[#1769D2] border border-[#27DFFF]/60 rounded font-bold text-[#27DFFF] hover:text-white transition-all disabled:opacity-40"
            >
              +20
            </button>
            <button
              onClick={() => {
                if (activeTeamId) {
                  soundEngine.playWrong();
                  onAdjustPoints(activeTeamId, -5);
                }
              }}
              disabled={!activeTeamId}
              className="px-2 py-1 bg-rose-950/60 hover:bg-rose-700 border border-rose-500/60 rounded font-bold text-rose-300 hover:text-white transition-all disabled:opacity-40"
            >
              -5
            </button>
          </div>
        </div>

        {/* Right cluster: Task progression & Solution toggles */}
        <div className="flex items-center gap-1.5">
          {/* Toggle Hint */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleShowHint();
            }}
            className={`px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-all ${
              isHintShown 
                ? 'bg-[#FFC83D] text-slate-950 border-[#FFC83D]' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Gợi ý</span>
          </button>

          {/* Toggle Solution */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleShowSolution();
            }}
            className={`px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-all ${
              isSolutionShown 
                ? 'bg-[#27DFFF] text-slate-950 border-[#27DFFF]' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Đáp án</span>
          </button>

          {/* Next Question */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onNextQuestion();
            }}
            className="px-3 py-1.5 bg-[#FF8A32] hover:bg-[#EA580C] text-white font-bold rounded-lg border border-orange-400 shadow-sm flex items-center gap-1 transition-all"
          >
            <span>Câu tiếp</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Skip Question */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onSkipQuestion();
            }}
            title="Bỏ qua câu này"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>

          {/* Back to Map */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onBackToMap();
            }}
            title="Quay lại bản đồ hành trình"
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition-colors"
          >
            <Map className="w-3.5 h-3.5 text-[#27DFFF]" />
            <span className="hidden sm:inline">Bản đồ</span>
          </button>

          {/* Reset All Scores (With Modal Confirmation) */}
          <button
            onClick={() => setShowResetConfirm(true)}
            title="Đặt lại toàn bộ điểm"
            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-800 text-red-300 border border-red-800/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Confirmation Dialog for Score Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#071B49] border-2 border-red-500 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Xác nhận đặt lại điểm số?
            </h3>
            <p className="text-sm text-slate-300 mb-6">
              Toàn bộ điểm số của tất cả các đội sẽ quay về 0. Thao tác này không thể hoàn tác!
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onResetAllScores();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Xác nhận đặt lại
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
