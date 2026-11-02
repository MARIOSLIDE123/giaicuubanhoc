/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Shield, Lock, Unlock, CheckCircle, HelpCircle, 
  ArrowRight, Sparkles, Check, X, RotateCcw
} from 'lucide-react';
import { Team, MultiPartItem } from '../types/game';
import { STAGE_2_QUESTIONS } from '../data/questions';
import { soundEngine } from '../utils/sound';
import { StageSidebar } from './StageSidebar';

interface Stage2Props {
  teams: Team[];
  activeTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
  onAwardPoints: (teamId: string, pts: number) => void;
  onAdjustPoints: (teamId: string, delta: number) => void;
  onResetAllScores: () => void;
  onCompleteStage2: () => void;
  onBackToMap: () => void;
}

export const Stage2Infiltration: React.FC<Stage2Props> = ({
  teams,
  activeTeamId,
  onSelectTeam,
  onAwardPoints,
  onAdjustPoints,
  onResetAllScores,
  onCompleteStage2,
  onBackToMap,
}) => {
  const [activeLockIdx, setActiveLockIdx] = useState(0);
  const [unlockedLocks, setUnlockedLocks] = useState<number[]>([]);
  const [isSolutionShown, setIsSolutionShown] = useState(false);
  const [isHintShown, setIsHintShown] = useState(false);
  const [isDoorOpenModal, setIsDoorOpenModal] = useState(false);

  // Track state of each sub-question:
  // - undefined: not attempted
  // - { status: 'correct', choice: 'ĐÚNG' | 'SAI', teamId: string }
  // - { status: 'wrong', choice: 'ĐÚNG' | 'SAI', teamId: string }
  const [subResults, setSubResults] = useState<{
    [subId: string]: { status: 'correct' | 'wrong'; choice: string; teamName: string };
  }>({});

  const currentLockQ = STAGE_2_QUESTIONS[activeLockIdx] || STAGE_2_QUESTIONS[0];

  useEffect(() => {
    setIsSolutionShown(false);
    setIsHintShown(false);
    setSubResults({});
  }, [activeLockIdx]);

  // Handle active team choosing ĐÚNG or SAI for a sub-question
  const handleSelectChoice = (subItem: MultiPartItem, choice: 'ĐÚNG' | 'SAI') => {
    if (!activeTeamId) {
      soundEngine.playWrong();
      return;
    }

    const activeTeam = teams.find(t => t.id === activeTeamId);
    const teamName = activeTeam ? activeTeam.name : 'Đội';

    const normalizedExpected = (subItem.answer || (subItem as any).expectedAnswer || '').trim().toUpperCase();
    const isCorrect = normalizedExpected === choice;

    if (isCorrect) {
      soundEngine.playCorrect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      onAwardPoints(activeTeamId, subItem.points);
      setSubResults(prev => ({
        ...prev,
        [subItem.id]: { status: 'correct', choice, teamName }
      }));
    } else {
      soundEngine.playWrong();
      setSubResults(prev => ({
        ...prev,
        [subItem.id]: { status: 'wrong', choice, teamName }
      }));
    }
  };

  // Replayability: Reset a failed sub-question so another team can try
  const handleRetrySub = (subId: string) => {
    soundEngine.playClick();
    setSubResults(prev => {
      const updated = { ...prev };
      delete updated[subId];
      return updated;
    });
  };

  const handleUnlockCurrentLock = () => {
    soundEngine.playUnlock();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });

    if (activeTeamId) {
      onAwardPoints(activeTeamId, currentLockQ.points);
    }

    if (!unlockedLocks.includes(activeLockIdx)) {
      const nextUnlocked = [...unlockedLocks, activeLockIdx];
      setUnlockedLocks(nextUnlocked);

      if (nextUnlocked.length === STAGE_2_QUESTIONS.length) {
        setTimeout(() => {
          setIsDoorOpenModal(true);
          soundEngine.playVictoryFanfare();
          confetti({
            particleCount: 180,
            spread: 95,
            origin: { y: 0.45 }
          });
        }, 500);
      }
    }
  };

  const handleNextLock = () => {
    soundEngine.playClick();
    if (activeLockIdx < STAGE_2_QUESTIONS.length - 1) {
      setActiveLockIdx(prev => prev + 1);
    } else {
      setActiveLockIdx(0);
    }
  };

  const isCurrentLockUnlocked = unlockedLocks.includes(activeLockIdx);
  const activeTeam = teams.find(t => t.id === activeTeamId);

  return (
    <div className="relative h-[calc(100vh-68px)] max-w-[1880px] mx-auto p-3 sm:p-4 z-10 flex gap-4 overflow-hidden">
      {/* LEFT COLUMN: Fixed Sidebar with Scoreboard, Team Selector, Timer, Controls */}
      <StageSidebar
        teams={teams}
        activeTeamId={activeTeamId}
        onSelectTeam={onSelectTeam}
        onAdjustPoints={onAdjustPoints}
        onResetAllScores={onResetAllScores}
        initialTimeSeconds={currentLockQ.defaultTimeSeconds || 120}
        onToggleShowSolution={() => setIsSolutionShown(!isSolutionShown)}
        isSolutionShown={isSolutionShown}
        onToggleShowHint={() => setIsHintShown(!isHintShown)}
        isHintShown={isHintShown}
        onBackToMap={onBackToMap}
        onNextQuestion={handleNextLock}
        showNextButton={isCurrentLockUnlocked}
        nextButtonLabel="Ổ khóa tiếp"
      />

      {/* RIGHT COLUMN: Interactive Exercise Area (No Scroll on 16:9) */}
      <main className="flex-1 min-w-0 flex flex-col justify-between h-full gap-3 overflow-y-auto pr-1">
        {/* Top Header & 5 Locks Navigation */}
        <div className="panel-cosmic px-4 py-2.5 rounded-2xl border border-purple-500/40 shadow-xl flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-400 text-purple-300 flex items-center justify-center shadow">
              <Shield className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-purple-300">
                CHẶNG 2: ĐỘT NHẬP TÀU UFO · PHÁ 5 Ổ KHÓA BẢO MẬT
              </div>
              <h2 className="text-base sm:text-lg font-black text-white text-high-contrast leading-tight">
                {currentLockQ.signalName || `Ổ KHÓA BẢO MẬT SỐ ${activeLockIdx + 1}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-300 bg-slate-950/80 px-3 py-1 rounded-xl border border-purple-500/30">
              Đã mở: <strong className="text-amber-300 font-mono text-sm font-black">{unlockedLocks.length}/5 Ổ khóa</strong>
            </div>

            {/* 5 Lock Pills */}
            <div className="flex items-center gap-1.5">
              {STAGE_2_QUESTIONS.map((lockQ, idx) => {
                const isUnlocked = unlockedLocks.includes(idx);
                const isCurrent = idx === activeLockIdx;
                return (
                  <button
                    key={lockQ.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveLockIdx(idx);
                    }}
                    className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-purple-500 text-white shadow-[0_0_15px_#a855f7] scale-105 ring-2 ring-purple-300'
                        : isUnlocked
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-white" /> : <Lock className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area: Split Vault Status (30%) & Questions (70%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 xl:gap-4 items-stretch flex-1 min-h-0">
          {/* Left Door / Vault Hologram (4 cols) */}
          <div className="lg:col-span-4 panel-cosmic rounded-2xl border border-purple-500/40 p-3.5 flex flex-col justify-between items-center text-center shadow-xl">
            <div className="w-full flex items-center justify-between text-xs text-slate-300 font-bold mb-1">
              <span className="text-purple-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                CỬA ÁP SUẤT VŨ TRỤ
              </span>
              <span className="text-xs text-amber-300 font-mono">
                Lớp {activeLockIdx + 1}/5
              </span>
            </div>

            {/* Futuristic Vault Door Graphics */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 xl:w-60 xl:h-60 rounded-full border-4 border-purple-500/50 bg-[#09031c] flex items-center justify-center my-auto shadow-[0_0_35px_rgba(168,85,247,0.3)]">
              <div className="absolute inset-3 rounded-full border border-purple-400/20" />
              <div className="absolute inset-8 rounded-full border-2 border-dashed border-purple-400/30 animate-spin" style={{ animationDuration: '45s' }} />
              <div className="absolute inset-16 rounded-full border border-purple-400/30" />

              <div className="text-center z-10 space-y-1">
                {isCurrentLockUnlocked ? (
                  <div className="w-16 h-16 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto shadow-[0_0_25px_#34d399] animate-bounce">
                    <Unlock className="w-8 h-8" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-purple-950/90 border-2 border-purple-400 text-purple-300 flex items-center justify-center mx-auto shadow-[0_0_25px_#a855f7]">
                    <Lock className="w-8 h-8 animate-pulse" />
                  </div>
                )}
                <div className="text-xs font-black uppercase tracking-wider text-purple-200">
                  {isCurrentLockUnlocked ? 'ĐÃ PHÁ KHÓA' : `KHÓA LỚP ${activeLockIdx + 1}`}
                </div>
              </div>
            </div>

            {/* Master Unlock Trigger Button */}
            <button
              onClick={handleUnlockCurrentLock}
              className={`w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all btn-3d shadow-lg ${
                isCurrentLockUnlocked
                  ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white shadow-purple-500/40'
              }`}
            >
              {isCurrentLockUnlocked ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>ĐÃ MỞ Ổ KHÓA (+{currentLockQ.points}Đ)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>KÍCH HOẠT PHÁ Ổ KHÓA (+{currentLockQ.points}Đ)</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Lock Problem & Alternating True/False Subquestions (8 cols) */}
          <div className="lg:col-span-8 panel-cosmic rounded-2xl border border-purple-500/40 p-4 xl:p-5 flex flex-col justify-between shadow-xl min-h-0 overflow-y-auto">
            <div className="space-y-3">
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-purple-950/80 border border-purple-400/50 text-purple-300 font-black text-[11px] uppercase tracking-wider">
                  Ổ khóa {activeLockIdx + 1} / 5 · {currentLockQ.signalName || 'Hệ thống an ninh'}
                </span>
                <span className="text-sm font-black font-mono text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2.5 py-0.5 rounded-lg">
                  +{currentLockQ.points} ĐIỂM
                </span>
              </div>

              {/* Context and Question Statement */}
              {currentLockQ.contextDesc && (
                <p className="text-xs text-purple-200 font-semibold">
                  📌 {currentLockQ.contextDesc}
                </p>
              )}
              <h3 className="text-sm sm:text-base font-black text-white leading-snug text-high-contrast">
                {currentLockQ.questionText || currentLockQ.text}
              </h3>

              {/* Dataset Display Box */}
              {currentLockQ.dataset && (
                <div className="p-2.5 rounded-xl bg-[#08021c]/90 border border-purple-500/40 shadow-inner">
                  <div className="text-[10px] font-black uppercase tracking-wider text-purple-300 flex items-center justify-between mb-1.5">
                    <span>MẪU SỐ LIỆU ĐỘT NHẬP:</span>
                    <span className="text-slate-400 font-normal">
                      {Array.isArray(currentLockQ.dataset) ? `Cỡ mẫu: n = ${currentLockQ.dataset.length}` : ''}
                    </span>
                  </div>
                  {Array.isArray(currentLockQ.dataset) && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {currentLockQ.dataset.map((val, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-purple-500/40 text-amber-300 font-mono font-black text-sm shadow-sm"
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Frequency Table if available */}
              {currentLockQ.frequencyTable && (
                <div className="overflow-x-auto rounded-xl border border-purple-500/40 shadow">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#030a21] text-purple-300 font-black uppercase text-[10px]">
                      <tr>
                        {currentLockQ.frequencyTable.headers.map((h, i) => (
                          <th key={i} className="p-2 border-b border-purple-500/30">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-[#050e28]/90 font-mono">
                      {currentLockQ.frequencyTable.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-purple-950/40">
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

              {/* Sub-items for Multi-Part Evaluation (a, b, c, d) - NO SCORE SPOILERS, EQUAL ĐÚNG / SAI BUTTONS */}
              {currentLockQ.subQuestions && currentLockQ.subQuestions.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-black uppercase text-cyan-300 tracking-wider">
                    XÉT TÍNH ĐÚNG / SAI CỦA CÁC MỆNH ĐỀ SAU (CHỌN ĐỘI TRƯỚC KHI TRẢ LỜI):
                  </div>
                  <div className="space-y-2">
                    {currentLockQ.subQuestions.map((sub) => {
                      const res = subResults[sub.id];
                      const promptText = sub.prompt || (sub as any).text || '';
                      const expectedAns = sub.answer || (sub as any).expectedAnswer || '';
                      const explanation = (sub as any).explanation || '';

                      return (
                        <div
                          key={sub.id}
                          className={`p-2.5 sm:p-3 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-2.5 shadow-md ${
                            res?.status === 'correct'
                              ? 'bg-emerald-950/50 border-emerald-500/80'
                              : res?.status === 'wrong'
                                ? 'bg-red-950/50 border-red-500/80'
                                : 'bg-slate-900/85 border-slate-700/80 hover:border-purple-400/50'
                          }`}
                        >
                          {/* Proposition text */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-purple-950 border border-purple-500/60 text-purple-300 font-black text-xs whitespace-nowrap">
                                {sub.label}
                              </span>
                              {promptText && (
                                <span className="text-xs sm:text-sm font-bold text-white text-high-contrast leading-snug">
                                  {promptText}
                                </span>
                              )}
                            </div>

                            {/* Show solution explanation ONLY if answered correctly OR teacher clicked 'Xem giải' */}
                            {(res?.status === 'correct' || isSolutionShown) && (
                              <div className="text-xs text-cyan-300 font-mono bg-[#03091c]/80 px-2.5 py-1 rounded-lg border border-cyan-500/30 flex items-center gap-2">
                                <span className="text-amber-300 font-black">Đáp án: {expectedAns}</span>
                                {explanation && <span className="text-slate-300 font-sans">({explanation})</span>}
                              </div>
                            )}

                            {/* Wrong attempt message */}
                            {res?.status === 'wrong' && (
                              <div className="text-xs text-red-300 font-bold flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>{res.teamName} chọn sai! Các đội khác có thể bấm Thử lại để trả lời.</span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons: ĐÚNG / SAI (Clean without score spoiler!) */}
                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            {res?.status === 'correct' ? (
                              <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center gap-1.5 shadow">
                                <Check className="w-3.5 h-3.5" />
                                <span>{res.teamName}: +{sub.points}đ</span>
                              </span>
                            ) : res?.status === 'wrong' ? (
                              <button
                                onClick={() => handleRetrySub(sub.id)}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-xs flex items-center gap-1.5 shadow hover:shadow-red-500/50 btn-3d"
                                title="Cho đội khác thử lại"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Đội khác thử lại</span>
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleSelectChoice(sub, 'ĐÚNG')}
                                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-400 font-black text-xs sm:text-sm transition-all btn-3d"
                                >
                                  ĐÚNG
                                </button>
                                <button
                                  onClick={() => handleSelectChoice(sub, 'SAI')}
                                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white border border-slate-700 hover:border-red-400 font-black text-xs sm:text-sm transition-all btn-3d"
                                >
                                  SAI
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Hint Card */}
              {isHintShown && (
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/60 text-xs text-amber-200 flex items-start gap-2.5 shadow-lg">
                  <HelpCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 block mb-0.5 font-black">GỢI Ý PHÁ KHÓA:</strong>
                    {currentLockQ.hint}
                  </div>
                </div>
              )}

              {/* Detailed Solution */}
              {isSolutionShown && (
                <div className="p-3 rounded-xl bg-[#09021c] border border-purple-400/50 text-xs text-slate-200 space-y-1 shadow-xl">
                  <div className="font-black text-purple-300 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    LỜI GIẢI CHI TIẾT TỪNG MỆNH ĐỀ:
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed">
                    {currentLockQ.solution}
                  </pre>
                </div>
              )}
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 mt-2 border-t border-slate-700/80">
              <div className="text-xs font-semibold text-slate-300">
                {activeTeam ? (
                  <span>Đội đang giải mã: <strong className="text-amber-300 text-sm font-black px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30">{activeTeam.name}</strong></span>
                ) : (
                  <span className="text-amber-300">⚠️ Chọn một đội ở cột bên trái để trả lời</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNextLock}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-amber-500 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-purple-500/40 transition-all flex items-center gap-1.5 btn-3d"
                >
                  <span>Ổ KHÓA TIẾP THEO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Door Open Celebration Modal */}
      {isDoorOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="panel-cosmic border-2 border-purple-400 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-purple-950 border-2 border-purple-400 text-purple-300 flex items-center justify-center mx-auto shadow-[0_0_35px_#c084fc]">
              <Unlock className="w-8 h-8 animate-bounce text-emerald-400" />
            </div>

            <div className="text-xs font-black uppercase tracking-widest text-amber-300">
              CỬA THÉP KHÔNG GIAN ĐÃ MỞ
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white text-high-contrast">
              ĐỘT NHẬP THÀNH CÔNG VÀO TÀU UFO!
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Tuyệt vời! Cả 5 lớp khóa an ninh bảo mật áp suất đã bị các phi hành đoàn hóa giải hoàn toàn! 
              Buồng cứu hộ hai bạn học sinh đã hiện ra trước mắt. Hãy tiến vào giải mã 3 Mật mã năng lượng tối hậu!
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
                  onCompleteStage2();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-amber-400 text-slate-950 font-black text-sm shadow-[0_0_25px_#c084fc] hover:shadow-[0_0_35px_#facc15] flex items-center gap-2 btn-3d"
              >
                <span>TIẾN VÀO CHẶNG 3: GIẢI CỨU</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
