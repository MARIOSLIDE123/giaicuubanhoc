/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  KeyRound, Unlock, CheckCircle, HelpCircle, 
  Trophy, Sparkles, Check, X, ShieldAlert
} from 'lucide-react';
import { Question, Team, MultiPartItem } from '../types/game';
import { STAGE_3_QUESTIONS } from '../data/questions';
import { soundEngine } from '../utils/sound';
import { TeacherControlBar } from './TeacherControlBar';
import { ScoreBoard } from './ScoreBoard';
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
  const [evaluatedSubQuestions, setEvaluatedSubQuestions] = useState<{ [subId: string]: boolean }>({});

  const currentCodeQ = STAGE_3_QUESTIONS[activeCodeIdx] || STAGE_3_QUESTIONS[0];

  useEffect(() => {
    setIsSolutionShown(false);
    setIsHintShown(false);
    setEvaluatedSubQuestions({});
  }, [activeCodeIdx]);

  const handleToggleSub = (subItem: MultiPartItem, isCorrect: boolean) => {
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
        // Grand victory! Both students rescued!
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

  const activeTeam = teams.find(t => t.id === activeTeamId);

  return (
    <div className="relative min-h-[calc(100vh-68px)] flex flex-col justify-between py-4 px-4 sm:px-8 xl:px-12 w-full max-w-[1780px] mx-auto z-10 space-y-4">
      {/* Top Scoreboard */}
      <ScoreBoard teams={teams} activeTeamId={activeTeamId} onSelectTeam={onSelectTeam} compact />

      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 panel-cosmic p-4 rounded-2xl border border-amber-500/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-400 text-amber-300 flex items-center justify-center shadow">
            <KeyRound className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-amber-300">
              CHẶNG 3: GIẢI CỨU BẠN HỌC · 11 PHÚT CHUNG KẾT
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white text-high-contrast">
              3 MẬT MÃ NĂNG LƯỢNG MỞ BUỒNG CỨU HỘ
            </h2>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-300 bg-slate-950/80 px-4 py-2 rounded-xl border border-amber-500/30">
          Tiến độ mở buồng: <strong className="text-amber-300 font-mono text-base font-black">{unlockedCodes.length}/3 Mật mã kích hoạt</strong>
        </div>
      </div>

      {/* Main Split Screen: Rescue Pod View (Left 4 cols) & Master Code Challenge (Right 8 cols) in 16:9 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-stretch flex-1">
        {/* Left: Rescue Pod Visual & 3 Key Indicators */}
        <div className="lg:col-span-4 panel-cosmic rounded-2xl border border-amber-500/40 p-5 flex flex-col justify-between items-center text-center shadow-2xl">
          <div className="w-full flex items-center justify-between text-xs sm:text-sm text-slate-300 font-bold mb-2">
            <span className="text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              BUỒNG CỨU HỘ KHÔNG GIAN
            </span>
            <span className="text-xs text-slate-400">Trực tiếp từ tàu</span>
          </div>

          {/* UFO Illustration inside Pod */}
          <div className="my-auto py-2">
            <UfoRescueIllustration
              state={unlockedCodes.length === 3 ? 'saved' : 'entering'}
              className="w-56 h-48 sm:w-64 sm:h-56 xl:w-72 xl:h-64 drop-shadow-[0_15px_35px_rgba(255,200,61,0.3)]"
            />
          </div>

          {/* 3 Master Code Buttons */}
          <div className="w-full space-y-2.5">
            {STAGE_3_QUESTIONS.map((codeQ, idx) => {
              const isUnlocked = unlockedCodes.includes(idx);
              const isActive = activeCodeIdx === idx;

              return (
                <button
                  key={codeQ.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveCodeIdx(idx);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 btn-3d shadow-md ${
                    isActive
                      ? 'bg-amber-900/60 border-amber-300 shadow-[0_0_20px_rgba(255,200,61,0.5)] ring-2 ring-amber-400'
                      : isUnlocked
                        ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                        : 'bg-slate-900/80 border-slate-700/80 hover:border-amber-400/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shadow ${
                      isUnlocked ? 'bg-emerald-500 text-slate-950' : isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isUnlocked ? <Unlock className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Mật mã #{idx + 1}</div>
                      <div className="text-xs xl:text-sm font-black text-white truncate max-w-[190px]">
                        {codeQ.signalName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-amber-300 block">
                      +{codeQ.points} đ
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${isUnlocked ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {isUnlocked ? 'KÍCH HOẠT' : 'CHỜ GIẢI MÃ'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Master Puzzle Solver (8 cols) in 16:9 Widescreen */}
        <div className="lg:col-span-8 panel-cosmic rounded-2xl border border-amber-500/40 p-6 xl:p-8 flex flex-col justify-between space-y-5 shadow-2xl">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-400/50 text-amber-300 font-black text-xs uppercase tracking-wider">
                Mật mã cứu hộ {activeCodeIdx + 1} / 3 · {currentCodeQ.signalName}
              </span>
              <span className="text-sm sm:text-base font-black font-mono text-amber-300 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-lg">
                +{currentCodeQ.points} ĐIỂM CHUNG CUỘC
              </span>
            </div>

            <h3 className="text-lg sm:text-xl xl:text-2xl font-black text-white leading-relaxed text-high-contrast mt-2">
              {currentCodeQ.text}
            </h3>
          </div>

          {/* Dataset Box */}
          {currentCodeQ.dataset && (
            <div className="p-4 rounded-xl bg-[#03091c]/90 border border-amber-500/40 shadow-inner space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center justify-between">
                <span>DỮ LIỆU THỰC TẾ CHIẾN DỊCH:</span>
                <span className="text-slate-400 font-normal">Cỡ mẫu: n = {currentCodeQ.dataset.length}</span>
              </div>
              <div className="flex flex-wrap gap-2.5 items-center">
                {currentCodeQ.dataset.map((val, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-300 font-mono font-black text-base xl:text-lg shadow-sm"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Frequency Table if available */}
          {currentCodeQ.frequencyTable && (
            <div className="overflow-x-auto rounded-xl border border-amber-500/40 shadow">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#030a21] text-amber-300 font-black uppercase text-xs">
                  <tr>
                    {currentCodeQ.frequencyTable.headers.map((h, i) => (
                      <th key={i} className="p-3 border-b border-amber-500/30">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-[#050e28]/90 font-mono">
                  {currentCodeQ.frequencyTable.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-amber-950/40">
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

          {/* Sub-items for Multi-Part Evaluation (a, b, c...) */}
          {currentCodeQ.subQuestions && currentCodeQ.subQuestions.length > 0 && (
            <div className="space-y-3 pt-1">
              <div className="text-xs font-black uppercase text-cyan-300 tracking-wider">
                CÁC BƯỚC PHÂN TÍCH & GIẢI TOÁN (BẤM ĐÚNG/SAI ĐỂ CỘNG ĐIỂM TRỰC TIẾP CHO ĐỘI ĐANG CHỌN):
              </div>
              <div className="space-y-2.5">
                {currentCodeQ.subQuestions.map((sub) => {
                  const evalState = evaluatedSubQuestions[sub.id];
                  return (
                    <div
                      key={sub.id}
                      className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-amber-950 border border-amber-500 text-amber-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {sub.label}
                        </span>
                        <div>
                          <p className="text-sm xl:text-base font-bold text-white text-high-contrast">
                            {sub.text}
                          </p>
                          {sub.expectedAnswer && (
                            <p className="text-xs text-amber-300 font-mono mt-0.5 font-semibold">
                              Đáp số chuẩn: {sub.expectedAnswer}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleToggleSub(sub, true)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all btn-3d ${
                            evalState === true
                              ? 'bg-emerald-600 text-white shadow-[0_0_12px_#10b981]'
                              : 'bg-slate-800 text-slate-300 hover:bg-emerald-950 hover:text-emerald-300 border border-slate-700'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>Đúng (+{sub.points}đ)</span>
                        </button>
                        <button
                          onClick={() => handleToggleSub(sub, false)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all btn-3d ${
                            evalState === false
                              ? 'bg-red-600 text-white shadow-[0_0_12px_#ef4444]'
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
                {currentCodeQ.hint}
              </div>
            </div>
          )}

          {/* Solution */}
          {isSolutionShown && (
            <div className="p-4 rounded-xl bg-[#030c24] border border-amber-400/50 text-xs sm:text-sm text-slate-200 space-y-2 shadow-2xl">
              <div className="font-black text-amber-300 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                LỜI GIẢI CHI TIẾT DÀNH CHO GIÁO VIÊN KIỂM CHỨNG:
              </div>
              <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-200 leading-relaxed">
                {currentCodeQ.solution}
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
                onClick={handleUnlockMasterKey}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm sm:text-base shadow-lg hover:shadow-amber-400/50 flex items-center justify-center gap-2 btn-3d"
              >
                <KeyRound className="w-5 h-5" />
                <span>KÍCH HOẠT MẬT MÃ NÀY (+{currentCodeQ.points}Đ)</span>
              </button>

              <button
                onClick={handleNextCode}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-sm sm:text-base transition-colors btn-3d"
              >
                Mật mã tiếp
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
        onNextQuestion={handleNextCode}
        onSkipQuestion={handleNextCode}
        onBackToMap={onBackToMap}
        initialTimeSeconds={currentCodeQ.defaultTimeSeconds}
      />

      {/* Grand Victory Celebration Modal */}
      {isRescueCelebrationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4">
          <div className="panel-cosmic border-2 border-amber-400 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-center shadow-2xl space-y-5 animate-scaleUp">
            <div className="w-24 h-24 rounded-full bg-amber-950 border-2 border-amber-400 text-amber-300 flex items-center justify-center mx-auto shadow-[0_0_45px_#facc15]">
              <Trophy className="w-12 h-12 animate-bounce" />
            </div>

            <div className="text-xs font-black uppercase tracking-widest text-cyan-300">
              SỨ MỆNH HOÀN TẤT XUẤT SẮC!
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-300 drop-shadow">
              GIẢI CỨU BẠN HỌC THÀNH CÔNG!
            </h3>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
              Cả 3 mật mã đã được kích hoạt hoàn toàn! Cửa buồng bảo hộ mở tung, hai bạn học sinh đã an toàn thoát khỏi UFO và quay trở lại phi thuyền cứu hộ Trái Đất trong tiếng hò reo vang dội!
            </p>

            <div className="pt-4 flex items-center justify-center gap-4">
              <button
                onClick={onBackToMap}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-600"
              >
                Xem lại bản đồ
              </button>
              <button
                onClick={() => {
                  soundEngine.playVictoryFanfare();
                  onCompleteStage3();
                }}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 text-slate-950 font-black text-base shadow-[0_0_25px_#facc15] hover:shadow-[0_0_35px_#22d3ee] flex items-center gap-2 btn-3d"
              >
                <Trophy className="w-5 h-5" />
                <span>XEM BẢNG VINH DANH & TRAO GIẢI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
