/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, Settings, Volume2, VolumeX, Mic, MicOff, 
  Shuffle, Clock, Award, RotateCcw, AlertTriangle, Check
} from 'lucide-react';
import { GameSettings, Team } from '../types/game';
import { soundEngine } from '../utils/sound';
import { speechHelper } from '../utils/speech';

interface TeacherSettingsModalProps {
  settings: GameSettings;
  teams: Team[];
  onUpdateSettings: (newSettings: GameSettings) => void;
  onUpdateTeams: (newTeams: Team[]) => void;
  onResetGame: () => void;
  onClose: () => void;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  settings,
  teams,
  onUpdateSettings,
  onUpdateTeams,
  onResetGame,
  onClose,
}) => {
  const [localSettings, setLocalSettings] = useState<GameSettings>({ ...settings });
  const [localTeams, setLocalTeams] = useState<Team[]>([...teams]);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSave = () => {
    soundEngine.playUnlock();
    soundEngine.setMuted(!localSettings.soundEnabled);
    soundEngine.setVolume(localSettings.soundVolume);
    speechHelper.setVoiceEnabled(localSettings.voiceEnabled);
    onUpdateSettings(localSettings);
    onUpdateTeams(localTeams);
    onClose();
  };

  const handleScoreChange = (teamId: string, newScore: number) => {
    setLocalTeams(prev => prev.map(t => t.id === teamId ? { ...t, score: Math.max(0, newScore) } : t));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#071B49] border-2 border-[#1769D2] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#1769D2]/30 border border-[#27DFFF]/40 text-[#27DFFF]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">CÀI ĐẶT DÀNH CHO GIÁO VIÊN</h2>
              <p className="text-xs text-slate-400">Điều chỉnh thông số âm thanh, thời gian, điểm và xáo trộn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Sections */}
        <div className="space-y-5 text-sm max-h-[60vh] overflow-y-auto pr-1">
          {/* Audio Settings */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#27DFFF] flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#FFC83D]" />
              ÂM THANH HIỆU ỨNG TRÒ CHƠI
            </h3>

            <div className="grid grid-cols-1 gap-4 pt-1">
              {/* Sound FX Toggle */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700 cursor-pointer">
                <span className="text-slate-200 font-medium">Bật / Tắt hiệu ứng âm thanh (tiếng chuông, đúng/sai, đếm ngược)</span>
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={(e) => setLocalSettings(p => ({ ...p, soundEnabled: e.target.checked }))}
                  className="w-5 h-5 accent-[#27DFFF] rounded"
                />
              </label>
            </div>

            {/* Volume slider */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Âm lượng hiệu ứng</span>
                <span className="font-mono">{Math.round(localSettings.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={localSettings.soundVolume}
                onChange={(e) => setLocalSettings(p => ({ ...p, soundVolume: parseFloat(e.target.value) }))}
                className="w-full accent-[#27DFFF] cursor-pointer"
              />
            </div>
          </div>

          {/* Randomization */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#27DFFF] flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-[#FFC83D]" />
              XÁO TRỘN ĐỀ BÀI VÀ ĐÁP ÁN (BẮT BUỘC THEO QUY CHUẨN)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700 cursor-pointer">
                <span className="text-slate-200">Đảo thứ tự câu hỏi các chặng</span>
                <input
                  type="checkbox"
                  checked={localSettings.shuffleQuestions}
                  onChange={(e) => setLocalSettings(p => ({ ...p, shuffleQuestions: e.target.checked }))}
                  className="w-5 h-5 accent-[#27DFFF] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700 cursor-pointer">
                <span className="text-slate-200">Đảo ngẫu nhiên vị trí A, B, C, D</span>
                <input
                  type="checkbox"
                  checked={localSettings.shuffleOptions}
                  onChange={(e) => setLocalSettings(p => ({ ...p, shuffleOptions: e.target.checked }))}
                  className="w-5 h-5 accent-[#27DFFF] rounded"
                />
              </label>
            </div>
          </div>

          {/* Quick Manual Score Adjustment for all teams */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#27DFFF] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FFC83D]" />
              ĐIỀU CHỈNH ĐIỂM SỐ CÁC ĐỘI TRỰC TIẾP
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {localTeams.map((team) => (
                <div key={team.id} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <div className="text-xs font-bold text-white truncate mb-1.5" style={{ color: team.color }}>
                    {team.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={team.score}
                      onChange={(e) => handleScoreChange(team.id, parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-center font-mono font-bold text-[#FFC83D]"
                    />
                    <span className="text-xs text-slate-400">đ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-700">
          <button
            onClick={() => setShowConfirmReset(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-800 border border-red-700 text-red-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET TOÀN BỘ GAME MỚI</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1769D2] to-[#27DFFF] text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>LƯU CÀI ĐẶT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal to Wipe Everything */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 p-4">
          <div className="bg-[#071B49] border-2 border-red-500 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Xác nhận khởi động lại ván mới?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Thao tác này sẽ xóa toàn bộ tiến trình các chặng, đặt lại điểm số của các đội về 0 và đưa về màn hình chào mừng.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setShowConfirmReset(false);
                  onResetGame();
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                Đồng ý thiết lập lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
