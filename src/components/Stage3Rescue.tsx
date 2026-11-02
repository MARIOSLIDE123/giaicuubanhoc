/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  KeyRound, Unlock, CheckCircle, HelpCircle, 
  Trophy, Sparkles, Check, X, RotateCcw, AlertTriangle, Send
} from 'lucide-react';
import { Team, MultiPartItem } from '../types/game';
import { STAGE_3_QUESTIONS } from '../data/questions';
import { soundEngine } from '../utils/sound';
import { StageSidebar } from './StageSidebar';
import { UfoRescueIllustration } from './UfoRescueIllustration';

interface Stage3Props {
  teams: Team[];
  activeTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
  onAwardPoints: (teamId: string, pts: number) => void;
  onAdjustPoints: (teamId: string, delta: number) => void;
  onResetAllScores: () => void;
  onCompleteStage3: () => void;
  onBackToMap: () => void;
}

export const Stage3Rescue: React.FC<Stage3Props> = ({
  teams,
  activeTeamId,
  onSelectTeam,
  onAwardPoints,
  onAdjustPoints,
  onResetAllScores,
  onCompleteStage3,
  onBackToMap,
}) => {
  const [activeCodeIdx, setActiveCodeIdx] = useState(0);
  const [unlockedCodes, setUnlockedCodes] = useState<number[]>([]);
  const [isSolutionShown, setIsSolutionShown] = useState(false);
  const [isHintShown, setIsHintShown] = useState(false);
  const [isRescueCelebrationOpen, setIsRescueCelebrationOpen] = useState(false);

  // User input values per sub-question
  const [inputAnswers, setInputAnswers] = useState<{ [subId: string]: string }>({});

  // Sub-question evaluation result:
  // - undefined: not evaluated yet
  // - { status: 'correct', teamName: string, submittedAnswer: string }
  // - { status: 'wrong', teamName: string, submittedAnswer: string }
  const [subResults, setSubResults] = useState<{
    [subId: string]: { status: 'correct' | 'wrong'; teamName: string; submittedAnswer: string };
  }>({});

  const currentCodeQ = STAGE_3_QUESTIONS[activeCodeIdx] || STAGE_3_QUESTIONS[0];

  useEffect(() => {
    setIsSolutionShown(false);
    setIsHintShown(false);
    setInputAnswers({});
    setSubResults({});
  }, [activeCodeIdx]);

  // Helper function to check if input matches expected answer reasonably
  const checkAnswerMatch = (input: string, expected: string): boolean => {
    const cleanIn = input.toLowerCase().replace(/,/g, '.').replace(/\s+/g, ' ').trim();
    const cleanExp = expected.toLowerCase().replace(/,/g, '.').replace(/\s+/g, ' ').trim();

    if (!cleanIn) return false;
    if (cleanIn === cleanExp) return true;

    // Check if input is contained in expected or vice versa
    if (cleanExp.includes(cleanIn) && cleanIn.length >= 2) return true;

    // Extract numbers and check overlap
    const inNums = cleanIn.match(/[-+]?\d*\.?\d+/g) || [];
    const expNums = cleanExp.match(/[-+]?\d*\.?\d+/g) || [];
    if (inNums.length > 0 && expNums.length > 0) {
      // Check if primary number matches
      const numMatch = inNums.some(n => expNums.includes(n));
      if (numMatch) return true;
    }

    return false;
  };

  // Student / Teacher submits input
  const handleConfirmInput = (subItem: MultiPartItem) => {
    if (!activeTeamId) {
      soundEngine.playWrong();
      return;
    }

    const userInput = (inputAnswers[subItem.id] || '').trim();
    if (!userInput) return;

    const activeTeam = teams.find(t => t.id === activeTeamId);
    const teamName = activeTeam ? activeTeam.name : 'Đội';

    const expected = subItem.answer || (subItem as any).expectedAnswer || '';
    const isCorrect = checkAnswerMatch(userInput, expected);

    if (isCorrect) {
      handleMarkCorrect(subItem, userInput, teamName);
    } else {
      handleMarkWrong(subItem, userInput, teamName);
    }
  };

  // Direct Teacher verification: Mark as Correct
  const handleMarkCorrect = (subItem: MultiPartItem, inputOverride?: string, teamOverride?: string) => {
    if (!activeTeamId) {
      soundEngine.playWrong();
      return;
    }

    const activeTeam = teams.find(t => t.id === activeTeamId);
    const teamName = teamOverride || (activeTeam ? activeTeam.name : 'Đội');
    const inputVal = inputOverride || inputAnswers[subItem.id] || 'Đã xác nhận';

    soundEngine.playCorrect();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    onAwardPoints(activeTeamId, subItem.points);
    setSubResults(prev => ({
      ...prev,
      [subItem.id]: { status: 'correct', teamName, submittedAnswer: inputVal }
    }));
  };

  // Direct Teacher verification: Mark as Wrong
  const handleMarkWrong = (subItem: MultiPartItem, inputOverride?: string, teamOverride?: string) => {
    const activeTeam = teams.find(t => t.id === activeTeamId);
    const teamName = teamOverride || (activeTeam ? activeTeam.name : 'Đội');
    const inputVal = inputOverride || inputAnswers[subItem.id] || '';

    soundEngine.playWrong();
    setSubResults(prev => ({
      ...prev,
      [subItem.id]: { status: 'wrong', teamName, submittedAnswer: inputVal }
    }));
  };

  // Replayability: Reset sub-question so another team can try
  const handleRetrySub = (subId: string) => {
    soundEngine.playClick();
    setSubResults(prev => {
      const updated = { ...prev };
      delete updated[subId];
      return updated;
    });
    setInputAnswers(prev => ({ ...prev, [subId]: '' }));
  };

  // Master key unlock for the active code
  const handleUnlockMasterKey = () => {
    soundEngine.playUnlock();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.55 }
    });

    if (activeTeamId) {
      onAwardPoints(activeTeamId, currentCodeQ.points);
    }

    if (!unlockedCodes.includes(activeCodeIdx)) {
      const nextCodes = [...unlockedCodes, activeCodeIdx];
      setUnlockedCodes(nextCodes);

      if (nextCodes.length === STAGE_3_QUESTIONS.length) {
        setTimeout(() => {
          setIsRescueCelebrationOpen(true);
          soundEngine.playVictoryFanfare();
          confetti({
            particleCount: 220,
            spread: 120,
            origin: { y: 0.4 }
          });
        }, 500);
      }
    }
  };

  const handleNextCode = () => {
    soundEngine.playClick();
    if (activeCodeIdx < STAGE_3_QUESTIONS.length - 1) {
      setActiveCodeIdx(prev => prev + 1);
    } else {
      setActiveCodeIdx(0);
    }
  };

  const isCurrentCodeUnlocked = unlockedCodes.includes(activeCodeIdx);
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
        initialTimeSeconds={currentCodeQ.defaultTimeSeconds || 90}
        onToggleShowSolution={() => setIsSolutionShown(!isSolutionShown)}
        isSolutionShown={isSolutionShown}
        onToggleShowHint={() => setIsHintShown(!isHintShown)}
        isHintShown={isHintShown}
        onBackToMap={onBackToMap}
        onNextQuestion={handleNextCode}
        showNextButton={isCurrentCodeUnlocked}
        nextButtonLabel="Mật mã tiếp"
      />

      {/* RIGHT COLUMN: Interactive Rescue Area (No Scroll on 16:9) */}
      <main className="flex-1 min-w-0 flex flex-col justify-between h-full gap-3 overflow-y-auto pr-1">
        {/* Top Header & 3 Master Codes Navigation */}
        <div className="panel-cosmic px-4 py-2.5 rounded-2xl border border-amber-500/40 shadow-xl flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-400 text-amber-300 flex items-center justify-center shadow">
              <KeyRound className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                CHẶNG 3: GIẢI CỨU BẠN HỌC · GIẢI MÃ 3 MẬT MÃ NĂNG LƯỢNG
              </div>
              <h2 className="text-base sm:text-lg font-black text-white text-high-contrast leading-tight">
                {currentCodeQ.signalName || `MẬT MÃ NĂNG LƯỢNG SỐ ${activeCodeIdx + 1}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-300 bg-slate-950/80 px-3 py-1 rounded-xl border border-amber-500/30">
              Đã mở: <strong className="text-amber-300 font-mono text-sm font-black">{unlockedCodes.length}/3 Mật mã</strong>
            </div>

            {/* 3 Code Pills */}
            <div className="flex items-center gap-1.5">
              {STAGE_3_QUESTIONS.map((codeQ, idx) => {
                const isUnlocked = unlockedCodes.includes(idx);
                const isCurrent = idx === activeCodeIdx;
                return (
                  <button
                    key={codeQ.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveCodeIdx(idx);
                    }}
                    className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_#facc15] scale-105 ring-2 ring-amber-300'
                        : isUnlocked
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-white" /> : <KeyRound className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area: Split Pod View (30%) & Master Code Question (70%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 xl:gap-4 items-stretch flex-1 min-h-0">
          {/* Left: Pod Graphic & Unlock Button (4 cols) */}
          <div className="lg:col-span-4 panel-cosmic rounded-2xl border border-amber-500/40 p-3.5 flex flex-col justify-between items-center text-center shadow-xl">
            <div className="w-full flex items-center justify-between text-xs text-slate-300 font-bold mb-1">
              <span className="text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                BUỒNG CỨU HỘ UFO
              </span>
              <span className="text-xs text-cyan-300 font-mono">
                Mật mã {activeCodeIdx + 1}/3
              </span>
            </div>

            {/* Rescue Pod Graphic with Captured Students */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 xl:w-60 xl:h-60 rounded-full border-4 border-amber-500/50 bg-[#160b02] flex items-center justify-center my-auto shadow-[0_0_35px_rgba(245,158,11,0.3)]">
              <div className="absolute inset-3 rounded-full border border-amber-400/20" />
              <div className="absolute inset-8 rounded-full border-2 border-dashed border-amber-400/30 animate-spin" style={{ animationDuration: '40s' }} />

              <div className="text-center z-10 space-y-1">
                {isCurrentCodeUnlocked ? (
                  <div className="w-16 h-16 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto shadow-[0_0_25px_#34d399] animate-bounce">
                    <Unlock className="w-8 h-8" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-amber-950/90 border-2 border-amber-400 text-amber-300 flex items-center justify-center mx-auto shadow-[0_0_25px_#f59e0b]">
                    <KeyRound className="w-8 h-8 animate-pulse" />
                  </div>
                )}
                <div className="text-xs font-black uppercase tracking-wider text-amber-200">
                  {isCurrentCodeUnlocked ? 'ĐÃ KÍCH HOẠT' : `MẬT MÃ ${activeCodeIdx + 1}`}
                </div>
              </div>
            </div>

            {/* Master Key Activation Button */}
            <button
              onClick={handleUnlockMasterKey}
              className={`w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all btn-3d shadow-lg ${
                isCurrentCodeUnlocked
                  ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/40'
              }`}
            >
              {isCurrentCodeUnlocked ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>ĐÃ KÍCH HOẠT MẬT MÃ (+{currentCodeQ.points}Đ)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
                  <span>KÍCH HOẠT MẬT MÃ NÀY (+{currentCodeQ.points}Đ)</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Master Code Challenge with Answer Input Fields (8 cols) */}
          <div className="lg:col-span-8 panel-cosmic rounded-2xl border border-amber-500/40 p-4 xl:p-5 flex flex-col justify-between shadow-xl min-h-0 overflow-y-auto">
            <div className="space-y-3">
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-950/80 border border-amber-400/50 text-amber-300 font-black text-[11px] uppercase tracking-wider">
                  Mật mã {activeCodeIdx + 1} / 3 · {currentCodeQ.signalName || 'Buồng năng lượng'}
                </span>
                <span className="text-sm font-black font-mono text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2.5 py-0.5 rounded-lg">
                  +{currentCodeQ.points} ĐIỂM
                </span>
              </div>

              {/* Context and Question Statement */}
              {currentCodeQ.contextDesc && (
                <p className="text-xs text-amber-200 font-semibold">
                  📌 {currentCodeQ.contextDesc}
                </p>
              )}
              <h3 className="text-sm sm:text-base font-black text-white leading-snug text-high-contrast">
                {currentCodeQ.questionText || currentCodeQ.text}
              </h3>

              {/* Dataset Box (Safe for Array & Key-Value Object e.g. Master Code 3) */}
              {currentCodeQ.dataset && (
                <div className="p-2.5 rounded-xl bg-[#120701]/90 border border-amber-500/40 shadow-inner">
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center justify-between mb-1.5">
                    <span>DỮ LIỆU THỰC TẾ CHIẾN DỊCH:</span>
                    <span className="text-slate-400 font-normal">
                      {Array.isArray(currentCodeQ.dataset) ? `Cỡ mẫu: N = ${currentCodeQ.dataset.length}` : 'So sánh 2 nhóm'}
                    </span>
                  </div>

                  {Array.isArray(currentCodeQ.dataset) ? (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {currentCodeQ.dataset.map((val, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-300 font-mono font-black text-sm shadow-sm"
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {Object.entries(currentCodeQ.dataset).map(([groupName, values]) => (
                        <div key={groupName} className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-950 border border-amber-500/60 text-amber-300 font-black text-xs min-w-[70px] text-center">
                            {groupName}
                          </span>
                          <div className="flex flex-wrap gap-1 items-center">
                            {(values as number[]).map((v, vIdx) => (
                              <span
                                key={vIdx}
                                className="px-2 py-0.5 rounded-md bg-slate-900 border border-amber-500/30 text-amber-300 font-mono font-black text-xs"
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Frequency Table if available */}
              {currentCodeQ.frequencyTable && (
                <div className="overflow-x-auto rounded-xl border border-amber-500/40 shadow">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#030a21] text-amber-300 font-black uppercase text-[10px]">
                      <tr>
                        {currentCodeQ.frequencyTable.headers.map((h, i) => (
                          <th key={i} className="p-2 border-b border-amber-500/30">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-[#050e28]/90 font-mono">
                      {currentCodeQ.frequencyTable.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-amber-950/40">
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

              {/* Sub-items converted to ANSWER INPUT FIELDS (Hiding correct answer until confirmed!) */}
              {currentCodeQ.subQuestions && currentCodeQ.subQuestions.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-black uppercase text-cyan-300 tracking-wider">
                    NHẬP ĐÁP SỐ GIẢI MÃ (KHÔNG LỘ ĐÁP ÁN CHO ĐẾN KHI XÁC NHẬN):
                  </div>
                  <div className="space-y-2">
                    {currentCodeQ.subQuestions.map((sub) => {
                      const res = subResults[sub.id];
                      const promptText = sub.prompt || (sub as any).text || '';
                      const expectedAns = sub.answer || (sub as any).expectedAnswer || '';
                      const currentVal = inputAnswers[sub.id] || '';

                      return (
                        <div
                          key={sub.id}
                          className={`p-2.5 sm:p-3 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-2.5 shadow-md ${
                            res?.status === 'correct'
                              ? 'bg-emerald-950/50 border-emerald-500/80'
                              : res?.status === 'wrong'
                                ? 'bg-red-950/50 border-red-500/80'
                                : 'bg-slate-900/85 border-slate-700/80 hover:border-amber-400/50'
                          }`}
                        >
                          {/* Prompt & Input field */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-amber-950 border border-amber-500/60 text-amber-300 font-black text-xs whitespace-nowrap">
                                {sub.label}
                              </span>
                              {promptText && (
                                <span className="text-xs sm:text-sm font-bold text-white text-high-contrast leading-snug">
                                  {promptText}
                                </span>
                              )}
                            </div>

                            {/* Input Form when not yet correct */}
                            {res?.status !== 'correct' && (
                              <div className="flex items-center gap-2 pt-0.5">
                                <input
                                  type="text"
                                  placeholder="Nhập kết quả (Ví dụ: 3.5 hoặc 3,5 hoặc đáp số)..."
                                  value={currentVal}
                                  onChange={(e) => setInputAnswers(prev => ({ ...prev, [sub.id]: e.target.value }))}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleConfirmInput(sub);
                                  }}
                                  className="flex-1 px-3 py-1.5 rounded-lg bg-black/70 border border-slate-600 focus:border-amber-400 text-white font-mono text-xs sm:text-sm outline-none transition-colors"
                                />
                                <button
                                  onClick={() => handleConfirmInput(sub)}
                                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow btn-3d shrink-0"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>XÁC NHẬN</span>
                                </button>
                              </div>
                            )}

                            {/* Reveal Official Answer ONLY when correctly answered OR teacher toggles 'Xem giải' */}
                            {(res?.status === 'correct' || isSolutionShown) && (
                              <div className="text-xs text-cyan-300 font-mono bg-[#03091c]/80 px-2.5 py-1 rounded-lg border border-cyan-500/30 flex items-center gap-2">
                                <span className="text-emerald-400 font-black">✓ Đáp số chuẩn:</span>
                                <span className="text-amber-300 font-bold">{expectedAns}</span>
                              </div>
                            )}

                            {/* Wrong attempt notice */}
                            {res?.status === 'wrong' && (
                              <div className="text-xs text-red-300 font-bold flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>{res.teamName} nhập "{res.submittedAnswer}" chưa chính xác! Đội khác có quyền giành quyền trả lời.</span>
                              </div>
                            )}
                          </div>

                          {/* Evaluation Status & Teacher Override Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                            {res?.status === 'correct' ? (
                              <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center gap-1.5 shadow">
                                <Check className="w-3.5 h-3.5" />
                                <span>{res.teamName}: +{sub.points}đ</span>
                              </span>
                            ) : res?.status === 'wrong' ? (
                              <button
                                onClick={() => handleRetrySub(sub.id)}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-xs flex items-center gap-1.5 shadow hover:shadow-red-500/50 btn-3d"
                                title="Cho đội khác nhập lại"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Đội khác thử lại</span>
                              </button>
                            ) : (
                              /* Teacher quick override buttons */
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleMarkCorrect(sub)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all"
                                  title="Giáo viên duyệt đúng nhanh"
                                >
                                  Duyệt đúng
                                </button>
                                <button
                                  onClick={() => handleMarkWrong(sub)}
                                  className="px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-800 text-red-300 border border-red-500/40 text-[11px] font-bold transition-all"
                                  title="Giáo viên báo sai nhanh"
                                >
                                  Báo sai
                                </button>
                              </div>
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
                    <strong className="text-amber-300 block mb-0.5 font-black">GỢI Ý TÍNH TOÁN:</strong>
                    {currentCodeQ.hint}
                  </div>
                </div>
              )}

              {/* Detailed Solution */}
              {isSolutionShown && (
                <div className="p-3 rounded-xl bg-[#120802] border border-amber-400/50 text-xs text-slate-200 space-y-1 shadow-xl">
                  <div className="font-black text-amber-300 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    LỜI GIẢI CHI TIẾT TỪNG BƯỚC:
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed">
                    {currentCodeQ.solution}
                  </pre>
                </div>
              )}
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 mt-2 border-t border-slate-700/80">
              <div className="text-xs font-semibold text-slate-300">
                {activeTeam ? (
                  <span>Đội đang giải mã: <strong className="text-amber-300 text-sm font-black px-2 py-0.5 rounded bg-amber-950 border border-amber-500/30">{activeTeam.name}</strong></span>
                ) : (
                  <span className="text-amber-300">⚠️ Chọn một đội ở cột bên trái để trả lời</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNextCode}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-amber-500/40 transition-all flex items-center gap-1.5 btn-3d"
                >
                  <span>MẬT MÃ TIẾP THEO</span>
                  <KeyRound className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rescue Pod Victory Celebration Modal */}
      {isRescueCelebrationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="panel-cosmic border-2 border-amber-400 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-center shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-24 h-24 mx-auto drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]">
              <UfoRescueIllustration size="md" isRescued={true} />
            </div>

            <div className="text-xs font-black uppercase tracking-widest text-emerald-400">
              NHIỆM VỤ GIẢI CỨU ĐẠI THÀNH CÔNG!
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white text-high-contrast">
              HAI BẠN HỌC SINH ĐÃ ĐƯỢC GIẢI THOÁT!
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Cả 3 Mật mã năng lượng tối hậu đã được kích hoạt thành công! Buồng cứu hộ UFO đã mở toang. 
              Hai bạn nhỏ vui mừng tái hợp cùng các phi hành đoàn quả cảm trong sự reo hò của toàn thể vũ trụ!
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
                  soundEngine.playVictoryFanfare();
                  onCompleteStage3();
                }}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 text-slate-950 font-black text-sm shadow-[0_0_25px_#facc15] hover:shadow-[0_0_35px_#34d399] flex items-center gap-2 btn-3d"
              >
                <Trophy className="w-5 h-5" />
                <span>XEM BẢNG VINH DANH CHIẾN HẠM</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
