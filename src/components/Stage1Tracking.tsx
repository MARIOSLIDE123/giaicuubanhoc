/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Radar, CheckCircle2, ChevronRight, HelpCircle, 
  Sparkles, AlertCircle, ArrowRight, RotateCcw
} from 'lucide-react';
import { Team } from '../types/game';
import { STAGE_1_QUESTIONS } from '../data/questions';
import { soundEngine } from '../utils/sound';
import { StageSidebar } from './StageSidebar';

interface Stage1Props {
  teams: Team[];
  activeTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
  onAwardPoints: (teamId: string, pts: number) => void;
  onAdjustPoints: (teamId: string, delta: number) => void;
  onResetAllScores: () => void;
  onCompleteStage1: () => void;
  onBackToMap: () => void;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
}

export const Stage1Tracking: React.FC<Stage1Props> = ({
  teams,
  activeTeamId,
  onSelectTeam,
  onAwardPoints,
  onAdjustPoints,
  onResetAllScores,
  onCompleteStage1,
  onBackToMap,
  shuffleQuestions = true,
  shuffleOptions = true,
}) => {
  const questionsList = useMemo(() => {
    const list = [...STAGE_1_QUESTIONS];
    if (shuffleQuestions) {
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }
    return list;
  }, [shuffleQuestions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isSolutionShown, setIsSolutionShown] = useState(false);
  const [isHintShown, setIsHintShown] = useState(false);
  const [isStageFinished, setIsStageFinished] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [wrongOptionIds, setWrongOptionIds] = useState<string[]>([]);

  const currentQ = questionsList[currentIndex] || questionsList[0];

  const currentOptions = useMemo(() => {
    if (!currentQ.options) return [];
    const opts = [...currentQ.options];
    if (shuffleOptions) {
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
    }
    return opts;
  }, [currentQ.options, shuffleOptions]);

  // Reset state on question change
  useEffect(() => {
    setSelectedOptionId(null);
    setIsAnswerChecked(false);
    setIsSolutionShown(false);
    setIsHintShown(false);
    setLastAnswerCorrect(null);
    setWrongOptionIds([]);
  }, [currentQ.id]);

  const handleSelectOption = (optId: string) => {
    if (isAnswerChecked && lastAnswerCorrect) return;
    if (wrongOptionIds.includes(optId)) return;
    soundEngine.playClick();
    setSelectedOptionId(optId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId) return;

    const chosen = currentOptions.find(o => o.id === selectedOptionId);
    if (!chosen) return;

    setIsAnswerChecked(true);

    if (chosen.isCorrect) {
      setLastAnswerCorrect(true);
      soundEngine.playCorrect();
      soundEngine.playRadarSweep();
      confetti({
        particleCount: 85,
        spread: 65,
        origin: { y: 0.65 }
      });

      if (activeTeamId) {
        onAwardPoints(activeTeamId, currentQ.points);
      }

      setCompletedTaskIds(prev => prev.includes(currentQ.id) ? prev : [...prev, currentQ.id]);
    } else {
      setLastAnswerCorrect(false);
      soundEngine.playWrong();
      setWrongOptionIds(prev => prev.includes(chosen.id) ? prev : [...prev, chosen.id]);
    }
  };

  // Allow another team to try when the current answer was incorrect
  const handleRetryOtherTeam = () => {
    soundEngine.playClick();
    setSelectedOptionId(null);
    setIsAnswerChecked(false);
    setLastAnswerCorrect(null);
  };

  const handleNextQuestion = () => {
    soundEngine.playClick();
    if (currentIndex < questionsList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsStageFinished(true);
      soundEngine.playVictoryFanfare();
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 }
      });
    }
  };

  const activeTeam = teams.find(t => t.id === activeTeamId);

  // Radar Signal Coordinates
  const radarSignals = [
    { id: 's1_q1', x: 42, y: 35, label: 'Sig 1' },
    { id: 's1_q2', x: 68, y: 25, label: 'Sig 2' },
    { id: 's1_q3', x: 78, y: 55, label: 'Sig 3' },
    { id: 's1_q4', x: 62, y: 78, label: 'Sig 4' },
    { id: 's1_q5', x: 35, y: 72, label: 'Sig 5' },
    { id: 's1_q6', x: 22, y: 48, label: 'Sig 6' },
    { id: 's1_q7', x: 50, y: 50, label: 'UFO Target' },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-68px)] p-3 sm:p-4 z-10 flex gap-4 overflow-hidden">
      {/* LEFT COLUMN: Fixed Sidebar with Scoreboard, Team Selector, Timer, Controls */}
      <StageSidebar
        teams={teams}
        activeTeamId={activeTeamId}
        onSelectTeam={onSelectTeam}
        onAdjustPoints={onAdjustPoints}
        onResetAllScores={onResetAllScores}
        initialTimeSeconds={currentQ.defaultTimeSeconds || 60}
        onToggleShowSolution={() => setIsSolutionShown(!isSolutionShown)}
        isSolutionShown={isSolutionShown}
        onToggleShowHint={() => setIsHintShown(!isHintShown)}
        isHintShown={isHintShown}
        onBackToMap={onBackToMap}
        onNextQuestion={handleNextQuestion}
        showNextButton={isAnswerChecked && lastAnswerCorrect === true}
        nextButtonLabel="Câu tiếp"
      />

      {/* RIGHT COLUMN: Interactive Exercise Area (No Scroll on 16:9) */}
      <main className="flex-1 min-w-0 flex flex-col justify-between h-full gap-3 overflow-y-auto pr-1">
        {/* Top Header & Task Navigation */}
        <div className="panel-cosmic px-4 py-2.5 rounded-2xl border border-cyan-400/40 shadow-xl flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center shadow">
              <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-cyan-300">
                CHẶNG 1: TRUY VẾT TÀU UFO
              </div>
              <h2 className="text-base sm:text-lg font-black text-white text-high-contrast leading-tight">
                {currentQ.signalName}
              </h2>
            </div>
          </div>

          {/* 7 Task Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {questionsList.map((q, idx) => {
              const isCompleted = completedTaskIds.includes(q.id);
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setCurrentIndex(idx);
                  }}
                  className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_#22d3ee] scale-105'
                      : isCompleted
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-800/90 text-slate-300 border border-slate-700 hover:text-white hover:border-cyan-400'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area: Split Radar (35%) & Question (65%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 xl:gap-4 items-stretch flex-1 min-h-0">
          {/* Radar Screen (4 cols) */}
          <div className="lg:col-span-4 panel-cosmic rounded-2xl border border-cyan-500/30 p-3.5 flex flex-col justify-between items-center text-center shadow-xl">
            <div className="w-full flex items-center justify-between text-xs text-slate-300 font-bold mb-1">
              <span className="text-cyan-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                RADAR KHÔNG GIAN
              </span>
              <span className="bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-slate-700 text-amber-300 font-mono text-xs">
                {completedTaskIds.length}/7 Tín hiệu
              </span>
            </div>

            {/* Circular Radar Screen */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 xl:w-64 xl:h-64 rounded-full border-2 border-cyan-400/50 bg-[#020716] overflow-hidden my-auto shadow-[0_0_30px_rgba(34,211,238,0.25)]">
              <div className="absolute inset-4 rounded-full border border-cyan-400/20" />
              <div className="absolute inset-10 rounded-full border border-cyan-400/25" />
              <div className="absolute inset-18 rounded-full border border-cyan-400/30" />
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyan-400/30" />
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-cyan-400/30" />

              <div 
                className="absolute inset-0 animate-radar origin-center pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg at 50% 50%, rgba(34, 211, 238, 0.45) 0deg, transparent 65deg, transparent 360deg)'
                }}
              />

              {radarSignals.map((sig, idx) => {
                const isDone = completedTaskIds.includes(sig.id);
                const isTargetUfo = sig.id === 's1_q7';
                return (
                  <div
                    key={sig.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125"
                    style={{ left: `${sig.x}%`, top: `${sig.y}%` }}
                    title={sig.label}
                  >
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center font-black ${
                      isDone 
                        ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]' 
                        : isTargetUfo 
                          ? 'bg-orange-500 shadow-[0_0_15px_#f97316] animate-ping'
                          : 'bg-amber-400 shadow-[0_0_10px_#facc15]'
                    }`}>
                      <span className="text-[9px] font-black text-slate-950">{idx + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Radar status */}
            <div className="w-full p-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-left text-[11px] text-slate-300 space-y-0.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Trạng thái:</span>
                <span className="text-emerald-400 font-bold">Khóa sóng ổn định</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vận tốc:</span>
                <span className="text-cyan-300 font-mono font-bold">Mach 12.8</span>
              </div>
            </div>
          </div>

          {/* Question and Choices (8 cols) */}
          <div className="lg:col-span-8 panel-cosmic rounded-2xl border border-cyan-500/40 p-4 xl:p-5 flex flex-col justify-between shadow-xl min-h-0 overflow-y-auto">
            <div className="space-y-3">
              {/* Question Header & Points */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-950/80 border border-cyan-400/50 text-cyan-300 font-black text-[11px] uppercase tracking-wider">
                  Tín hiệu {currentIndex + 1} / {questionsList.length}
                </span>
                <span className="text-sm font-black font-mono text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2.5 py-0.5 rounded-lg">
                  +{currentQ.points} ĐIỂM
                </span>
              </div>

              {/* Question statement */}
              {currentQ.contextDesc && (
                <p className="text-xs text-cyan-200 font-semibold">
                  📌 {currentQ.contextDesc}
                </p>
              )}
              <h3 className="text-sm sm:text-base xl:text-lg font-black text-white leading-snug text-high-contrast">
                {currentQ.questionText || currentQ.text}
              </h3>

              {/* Dataset Box if present */}
              {currentQ.dataset && (
                <div className="p-2.5 rounded-xl bg-[#03091c]/90 border border-cyan-500/40 shadow-inner">
                  <div className="text-[10px] font-black uppercase tracking-wider text-cyan-300 flex items-center justify-between mb-1.5">
                    <span>DỮ LIỆU TỌA ĐỘ GHI NHẬN ĐƯỢC:</span>
                    <span className="text-slate-400 font-normal">Cỡ mẫu: n = {currentQ.dataset.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {currentQ.dataset.map((val, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-500/40 text-amber-300 font-mono font-black text-sm shadow-sm"
                      >
                        {val}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Frequency Table if available */}
              {currentQ.frequencyTable && (
                <div className="overflow-x-auto rounded-xl border border-cyan-500/40 shadow">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#030a21] text-cyan-300 font-black uppercase text-[10px]">
                      <tr>
                        {currentQ.frequencyTable.headers.map((h, i) => (
                          <th key={i} className="p-2 border-b border-cyan-500/30">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-[#050e28]/90 font-mono">
                      {currentQ.frequencyTable.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-cyan-950/40">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2 text-white font-bold text-xs sm:text-sm">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Multiple Choice Options List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {currentOptions.map((opt, idx) => {
                  const letter = ['A', 'B', 'C', 'D'][idx] || String(idx + 1);
                  const isSelected = selectedOptionId === opt.id;
                  const isWrongEliminated = wrongOptionIds.includes(opt.id);
                  const isCorrectOpt = opt.isCorrect;

                  let btnStyle = 'bg-slate-900/85 border-slate-700 text-slate-100 hover:border-cyan-400 hover:bg-slate-800/90';
                  if (isSelected) {
                    btnStyle = 'bg-blue-900/60 border-cyan-300 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)] ring-2 ring-cyan-400';
                  }

                  // Only show green if user actually answered correctly OR teacher toggled solution!
                  if (lastAnswerCorrect === true || isSolutionShown) {
                    if (isCorrectOpt) {
                      btnStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]';
                    }
                  }

                  // If this option was wrong and eliminated, show red
                  if (isWrongEliminated) {
                    btnStyle = 'bg-red-950/60 border-red-500/80 text-red-300 opacity-60 cursor-not-allowed';
                  } else if (isAnswerChecked && lastAnswerCorrect === false && isSelected) {
                    btnStyle = 'bg-red-950/90 border-red-500 text-red-100 ring-2 ring-red-500 animate-pulse';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isWrongEliminated || (isAnswerChecked && lastAnswerCorrect === true)}
                      className={`w-full p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 btn-3d shadow-md ${btnStyle}`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 shadow ${
                        isWrongEliminated
                          ? 'bg-red-900/80 text-red-200 border border-red-500/50'
                          : isSelected 
                            ? 'bg-cyan-400 text-slate-950' 
                            : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}>
                        {isWrongEliminated ? '✕' : letter}
                      </span>
                      <div className="flex-1 text-xs sm:text-sm font-bold leading-relaxed text-high-contrast pt-0.5">
                        {opt.text}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Hint Card */}
              {isHintShown && (
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/60 text-xs text-amber-200 flex items-start gap-2.5 shadow-lg">
                  <HelpCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 block mb-0.5 font-black">GỢI Ý CHIẾN THUẬT:</strong>
                    {currentQ.hint}
                  </div>
                </div>
              )}

              {/* Detailed Solution */}
              {isSolutionShown && (
                <div className="p-3 rounded-xl bg-[#030c24] border border-cyan-400/50 text-xs text-slate-200 space-y-1 shadow-xl">
                  <div className="font-black text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    LỜI GIẢI CHI TIẾT DÀNH CHO GIÁO VIÊN KIỂM CHỨNG:
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed">
                    {currentQ.solution}
                  </pre>
                </div>
              )}
            </div>

            {/* Bottom Confirmation / Retry Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 mt-2 border-t border-slate-700/80">
              <div className="text-xs font-semibold text-slate-300">
                {activeTeam ? (
                  <span>Đội đang trả lời: <strong className="text-amber-300 text-sm font-black px-2 py-0.5 rounded bg-blue-950 border border-blue-500/30">{activeTeam.name}</strong></span>
                ) : (
                  <span className="text-amber-300">⚠️ Chọn một đội ở cột bên trái để trả lời</span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {!isAnswerChecked ? (
                  <button
                    onClick={handleConfirmAnswer}
                    disabled={!selectedOptionId}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-cyan-400/50 disabled:opacity-40 transition-all btn-3d"
                  >
                    XÁC NHẬN ĐÁP ÁN
                  </button>
                ) : lastAnswerCorrect === false ? (
                  /* Replayability on Failure: Allow another team to try! */
                  <button
                    onClick={handleRetryOtherTeam}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-amber-400/50 transition-all flex items-center justify-center gap-2 btn-3d animate-pulse"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>CHƯA ĐÚNG! ĐỘI KHÁC TRẢ LỜI LẠI</span>
                  </button>
                ) : (
                  /* Correct: Proceed to next */
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-amber-400/50 transition-all flex items-center justify-center gap-1.5 btn-3d"
                  >
                    <span>CÂU TIẾP THEO</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Stage 1 Complete Modal */}
      {isStageFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="panel-cosmic border-2 border-cyan-400 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-cyan-950 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center mx-auto shadow-[0_0_35px_#22d3ee]">
              <Radar className="w-8 h-8 animate-pulse" />
            </div>

            <div className="text-xs font-black uppercase tracking-widest text-amber-300">
              CHIẾN CÔNG ĐỢT 1 HOÀN TẤT
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white text-high-contrast">
              TRUY VẾT TỌA ĐỘ THÀNH CÔNG!
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Tất cả 7 tín hiệu sóng radar đã được giải mã chính xác! Vị trí tàu UFO đã được khoanh vùng. 
              Các phi hành đoàn chuẩn bị vũ khí toán học để đột nhập qua các lớp khóa bảo mật áp suất!
            </p>

            <div className="pt-3 flex items-center justify-center gap-3">
              <button
                onClick={onBackToMap}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-600"
              >
                Về bản đồ
              </button>
              <button
                onClick={() => {
                  soundEngine.playUnlock();
                  onCompleteStage1();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-amber-400 text-slate-950 font-black text-sm shadow-[0_0_25px_#22d3ee] hover:shadow-[0_0_35px_#facc15] flex items-center gap-2 btn-3d"
              >
                <span>MỞ KHÓA CHẶNG 2: ĐỘT NHẬP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
