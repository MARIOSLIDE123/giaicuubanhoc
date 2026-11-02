/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Shield, Lock, Unlock, CheckCircle, HelpCircle, 
  ArrowRight, Sparkles, Check, X
} from 'lucide-react';
import { Question, Team, MultiPartItem } from '../types/game';
import { STAGE_2_QUESTIONS } from '../data/questions';
import { soundEngine } from '../utils/sound';
import { TeacherControlBar } from './TeacherControlBar';
import { ScoreBoard } from './ScoreBoard';

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

  // Sub-question evaluated items state for currently active lock
  const [evaluatedSubQuestions, setEvaluatedSubQuestions] = useState<{ [subId: string]: boolean }>({});

  const currentLockQ = STAGE_2_QUESTIONS[activeLockIdx] || STAGE_2_QUESTIONS[0];

  useEffect(() => {
    setIsSolutionShown(false);
    setIsHintShown(false);
    setEvaluatedSubQuestions({});
  }, [activeLockIdx]);

  const handleToggleSubQuestion = (subItem: MultiPartItem, isCorrect: boolean) => {
    if (!activeTeamId) {
      soundEngine.playWrong();
      return;
    }

    if (isCorrect) {
      soundEngine.playCorrect();
      onAwardPoints(activeTeamId, subItem.points);
      setEvaluatedSubQuestions(prev => ({ ...prev, [subItem.id]: true }));
    } else {
      soundEngine.playWrong();
      setEvaluatedSubQuestions(prev => ({ ...prev, [subItem.id]: false }));
    }
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
        // All 5 locks opened!
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

  const activeTeam = teams.find(t => t.id === activeTeamId);

  return (
    <div className="relative min-h-[calc(100vh-68px)] flex flex-col justify-between py-4 px-4 sm:px-8 xl:px-12 w-full max-w-[1780px] mx-auto z-10 space-y-4">
      {/* Top Scoreboard */}
      <ScoreBoard teams={teams} activeTeamId={activeTeamId} onSelectTeam={onSelectTeam} compact />

      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 panel-cosmic p-4 rounded-2xl border border-purple-500/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-400 text-purple-300 flex items-center justify-center shadow">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-purple-300">
              CHẶNG 2: ĐỘT NHẬP TÀU UFO · 12 PHÚT THI ĐẤU
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white text-high-contrast">
              CỬA ÁP SUẤT BẢO MẬT 5 LỚP KHÓA TOÁN HỌC
            </h2>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-300 bg-slate-950/80 px-4 py-2 rounded-xl border border-purple-500/30">
          Tiến độ phá khóa: <strong className="text-amber-300 font-mono text-base font-black">{unlockedLocks.length}/5 Ổ khóa đã mở</strong>
        </div>
      </div>

      {/* Main Vault Stage: 5 Locks Door View (Left 4 cols) & Lock Puzzle (Right 8 cols) in 16:9 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-stretch flex-1">
        {/* Left: 5 Cylindrical Locks on Vault Door */}
        <div className="lg:col-span-4 panel-cosmic rounded-2xl border border-purple-500/40 p-5 flex flex-col justify-between shadow-2xl">
          <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-purple-300 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              HỆ THỐNG 5 Ổ KHÓA CỬA UFO
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Nhấp để chuyển ổ khóa</span>
          </div>

          {/* 5 Vault Lock Cylinders */}
          <div className="space-y-3 my-auto py-2">
            {STAGE_2_QUESTIONS.map((lockQ, idx) => {
              const isUnlocked = unlockedLocks.includes(idx);
              const isActive = activeLockIdx === idx;

              return (
                <button
                  key={lockQ.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveLockIdx(idx);
                  }}
                  className={`w-full p-3.5 xl:p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 btn-3d shadow-md ${
                    isActive
                      ? 'bg-purple-900/60 border-purple-400 shadow-[0_0_20px_rgba(217,70,239,0.5)] ring-2 ring-purple-400'
                      : isUnlocked
                        ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                        : 'bg-slate-900/80 border-slate-700/80 hover:border-purple-400/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm shadow ${
                      isUnlocked 
                        ? 'bg-emerald-500 text-slate-950' 
                        : isActive 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Ổ khóa #{idx + 1}</div>
                      <div className="text-sm xl:text-base font-black text-white truncate max-w-[200px] xl:max-w-[240px]">
                        {lockQ.signalName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-amber-300 block">
                      +{lockQ.points} đ
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${isUnlocked ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {isUnlocked ? 'ĐÃ MỞ' : 'CHƯA MỞ'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
            <span className="text-purple-300 font-bold block mb-1">Cơ chế bẻ khóa:</span>
            <span>Mỗi ổ khóa bao gồm dữ liệu số học thực tế. Trả lời đúng các câu hỏi nhánh để ghi điểm và mở chốt bảo mật.</span>
          </div>
        </div>

        {/* Right: Active Lock Math Challenge (8 cols) */}
        <div className="lg:col-span-8 panel-cosmic rounded-2xl border border-purple-500/40 p-6 xl:p-8 flex flex-col justify-between space-y-5 shadow-2xl">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg bg-purple-950/80 border border-purple-400/50 text-purple-300 font-black text-xs uppercase tracking-wider">
                Ổ khóa {activeLockIdx + 1} / 5 · {currentLockQ.signalName}
              </span>
              <span className="text-sm sm:text-base font-black font-mono text-amber-300 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-lg">
                +{currentLockQ.points} ĐIỂM BẺ KHÓA
              </span>
            </div>

            {/* Context & Main Question Text */}
            {currentLockQ.contextDesc && (
              <p className="text-xs sm:text-sm text-purple-200 font-semibold mb-1">
                📌 {currentLockQ.contextDesc}
              </p>
            )}
            <h3 className="text-base sm:text-lg xl:text-xl font-black text-white leading-relaxed text-high-contrast mt-1">
              {currentLockQ.questionText || currentLockQ.text}
            </h3>
          </div>

          {/* Dataset Box */}
          {currentLockQ.dataset && (
            <div className="p-4 rounded-xl bg-[#03091c]/90 border border-purple-500/40 shadow-inner space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center justify-between">
                <span>DỮ LIỆU ĐO ÁP SUẤT & THÔNG SỐ KHÓA:</span>
                <span className="text-slate-400 font-normal">
                  {Array.isArray(currentLockQ.dataset) ? `Cỡ mẫu: n = ${currentLockQ.dataset.length}` : ''}
                </span>
              </div>
              {Array.isArray(currentLockQ.dataset) && (
                <div className="flex flex-wrap gap-2.5 items-center">
                  {currentLockQ.dataset.map((val, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-purple-500/40 text-amber-300 font-mono font-black text-base xl:text-lg shadow-sm"
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
              <table className="w-full text-left text-sm">
                <thead className="bg-[#030a21] text-purple-300 font-black uppercase text-xs">
                  <tr>
                    {currentLockQ.frequencyTable.headers.map((h, i) => (
                      <th key={i} className="p-3 border-b border-purple-500/30">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-[#050e28]/90 font-mono">
                  {currentLockQ.frequencyTable.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-purple-950/40">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 text-white font-bold text-sm xl:text-base">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Sub-items for Multi-Part Evaluation (a, b, c...) - Fully Expanded with NO Text Squishing */}
          {currentLockQ.subQuestions && currentLockQ.subQuestions.length > 0 && (
            <div className="space-y-3 pt-1">
              <div className="text-xs font-black uppercase text-cyan-300 tracking-wider">
                CÁC YÊU CẦU GIẢI MÃ (BẤM ĐÚNG/SAI ĐỂ CHẤM ĐIỂM TỨC THÌ CHO ĐỘI ĐANG CHỌN):
              </div>
              <div className="space-y-2.5">
                {currentLockQ.subQuestions.map((sub) => {
                  const evalState = evaluatedSubQuestions[sub.id];
                  const promptText = sub.prompt || (sub as any).text || '';
                  const expectedAns = sub.answer || (sub as any).expectedAnswer || '';

                  return (
                    <div
                      key={sub.id}
                      className="p-3.5 xl:p-4 rounded-xl bg-slate-900/85 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md hover:border-purple-400/50 transition-colors"
                    >
                      {/* Left: Step label + Prompt + Answer (Takes full width, never squished) */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-purple-950 border border-purple-500/60 text-purple-300 font-black text-xs sm:text-sm whitespace-nowrap shadow-sm">
                            {sub.label}
                          </span>
                          {promptText && (
                            <span className="text-sm sm:text-base font-bold text-white text-high-contrast leading-snug">
                              {promptText}
                            </span>
                          )}
                        </div>

                        {expectedAns && (
                          <div className="text-xs sm:text-sm text-cyan-300 font-mono font-bold bg-[#03091c]/80 px-3 py-1 rounded-lg border border-cyan-500/30 inline-block">
                            💡 Đáp số chuẩn: <span className="text-amber-300">{expectedAns}</span>
                          </div>
                        )}
                      </div>

                      {/* Right: Teacher Correct / Incorrect Evaluation Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => handleToggleSubQuestion(sub, true)}
                          className={`px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all btn-3d whitespace-nowrap ${
                            evalState === true
                              ? 'bg-emerald-600 text-white shadow-[0_0_15px_#10b981]'
                              : 'bg-slate-800 text-slate-300 hover:bg-emerald-950 hover:text-emerald-300 border border-slate-700'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>Đúng (+{sub.points}đ)</span>
                        </button>
                        <button
                          onClick={() => handleToggleSubQuestion(sub, false)}
                          className={`px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all btn-3d whitespace-nowrap ${
                            evalState === false
                              ? 'bg-red-600 text-white shadow-[0_0_15px_#ef4444]'
                              : 'bg-slate-800 text-slate-300 hover:bg-red-950 hover:text-red-300 border border-slate-700'
                          }`}
                        >
                          <X className="w-4 h-4" />
                          <span>Sai</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hint Card */}
          {isHintShown && (
            <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/60 text-xs sm:text-sm text-amber-200 flex items-start gap-3 shadow-lg">
              <HelpCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-1 font-black">GỢI Ý CHIẾN THUẬT:</strong>
                {currentLockQ.hint}
              </div>
            </div>
          )}

          {/* Solution */}
          {isSolutionShown && (
            <div className="p-4 rounded-xl bg-[#030c24] border border-purple-400/50 text-xs sm:text-sm text-slate-200 space-y-2 shadow-2xl">
              <div className="font-black text-purple-300 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                LỜI GIẢI CHI TIẾT DÀNH CHO GIÁO VIÊN KIỂM CHỨNG:
              </div>
              <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-200 leading-relaxed">
                {currentLockQ.solution}
              </pre>
            </div>
          )}

          {/* Bottom Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-700/80">
            <div className="text-xs sm:text-sm font-semibold text-slate-300">
              {activeTeam ? (
                <span>Đội đang giải mã: <strong className="text-amber-300 text-base font-black px-2 py-0.5 rounded bg-blue-950 border border-blue-500/30">{activeTeam.name}</strong></span>
              ) : (
                <span className="text-amber-300">Chưa chọn đội (nhấp chọn ở bảng điểm phía trên)</span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleUnlockCurrentLock}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2 btn-3d"
              >
                <Unlock className="w-5 h-5" />
                <span>MỞ KHÓA Ổ NÀY (+{currentLockQ.points}Đ)</span>
              </button>

              <button
                onClick={handleNextLock}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-sm sm:text-base transition-colors btn-3d"
              >
                Ổ tiếp theo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Control Bar Fixed at Bottom */}
      <TeacherControlBar
        teams={teams}
        activeTeamId={activeTeamId}
        onSelectTeam={onSelectTeam}
        onAdjustPoints={onAdjustPoints}
        onResetAllScores={onResetAllScores}
        onToggleShowSolution={() => setIsSolutionShown(!isSolutionShown)}
        isSolutionShown={isSolutionShown}
        onToggleShowHint={() => setIsHintShown(!isHintShown)}
        isHintShown={isHintShown}
        onNextQuestion={handleNextLock}
        onSkipQuestion={handleNextLock}
        onBackToMap={onBackToMap}
        initialTimeSeconds={currentLockQ.defaultTimeSeconds}
      />

      {/* Door Open Modal (Completed 5 locks) */}
      {isDoorOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="panel-cosmic border-2 border-purple-400 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center shadow-2xl space-y-5 animate-scaleUp">
            <div className="w-20 h-20 rounded-full bg-purple-950 border-2 border-purple-400 text-purple-300 flex items-center justify-center mx-auto shadow-[0_0_35px_#c084fc]">
              <Unlock className="w-10 h-10 animate-bounce" />
            </div>

            <div className="text-xs font-black uppercase tracking-widest text-amber-300">
              CỬA ÁP SUẤT ĐÃ TÁCH RA!
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white text-high-contrast">
              ĐỘT NHẬP TÀU UFO THÀNH CÔNG!
            </h3>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              Cánh cửa bảo mật 5 lớp đã hoàn toàn sụp đổ! Hai bạn học sinh đang ở ngay trước mắt trong khoang bảo hộ trung tâm. 
              Hãy cùng tiến hành bước giải cứu cuối cùng: Kích hoạt 3 mật mã cứu hộ!
            </p>

            <div className="pt-4 flex items-center justify-center gap-4">
              <button
                onClick={onBackToMap}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-600"
              >
                Về bản đồ
              </button>
              <button
                onClick={() => {
                  soundEngine.playUnlock();
                  onCompleteStage2();
                }}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-amber-400 text-slate-950 font-black text-base shadow-[0_0_25px_#c084fc] hover:shadow-[0_0_35px_#facc15] flex items-center gap-2 btn-3d"
              >
                <span>MỞ KHÓA CHẶNG 3: GIẢI CỨU</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
