/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Minus, Check, Users, ArrowRight, RotateCcw } from 'lucide-react';
import { Team } from '../types/game';
import { soundEngine } from '../utils/sound';

interface TeamSetupModalProps {
  teams: Team[];
  onUpdateTeams: (updatedTeams: Team[]) => void;
  onConfirm: () => void;
  onBack: () => void;
}

const DEFAULT_PRESET_TEAMS: Omit<Team, 'id' | 'score' | 'correctAnswers' | 'tasksCompleted'>[] = [
  { name: 'ĐỘI SAO BĂNG', color: '#1769D2', accentColor: '#27DFFF', icon: 'comet' },
  { name: 'ĐỘI THIÊN HÀ', color: '#7139B9', accentColor: '#D946EF', icon: 'planet' },
  { name: 'ĐỘI NGÂN HÀ', color: '#D97706', accentColor: '#FFC83D', icon: 'star' },
  { name: 'ĐỘI SIÊU TÂN TINH', color: '#DC2626', accentColor: '#FF8A32', icon: 'rocket' },
  { name: 'ĐỘI VỆ TINH', color: '#059669', accentColor: '#34D399', icon: 'satellite' },
  { name: 'ĐỘI PHI HÀNH', color: '#0284C7', accentColor: '#38BDF8', icon: 'sparkles' },
];

export const TeamSetupModal: React.FC<TeamSetupModalProps> = ({
  teams,
  onUpdateTeams,
  onConfirm,
  onBack,
}) => {
  const teamCount = teams.length;

  const handleAddTeam = () => {
    if (teamCount >= 6) return;
    soundEngine.playClick();
    const preset = DEFAULT_PRESET_TEAMS[teamCount] || {
      name: `ĐỘI ${teamCount + 1}`,
      color: '#0284C7',
      accentColor: '#38BDF8',
      icon: 'star',
    };
    const newTeam: Team = {
      id: `team_${Date.now()}_${teamCount + 1}`,
      name: preset.name,
      color: preset.color,
      accentColor: preset.accentColor,
      icon: preset.icon,
      score: 0,
      correctAnswers: 0,
      tasksCompleted: 0,
    };
    onUpdateTeams([...teams, newTeam]);
  };

  const handleRemoveTeam = () => {
    if (teamCount <= 2) return;
    soundEngine.playClick();
    onUpdateTeams(teams.slice(0, teamCount - 1));
  };

  const handleNameChange = (index: number, newName: string) => {
    const updated = [...teams];
    updated[index] = { ...updated[index], name: newName };
    onUpdateTeams(updated);
  };

  const handleScoreChange = (index: number, newScore: number) => {
    const updated = [...teams];
    updated[index] = { ...updated[index], score: Math.max(0, newScore) };
    onUpdateTeams(updated);
  };

  const handleResetToDefault = () => {
    soundEngine.playClick();
    const defaultTeams: Team[] = DEFAULT_PRESET_TEAMS.slice(0, 4).map((preset, idx) => ({
      id: `team_default_${idx + 1}`,
      name: preset.name,
      color: preset.color,
      accentColor: preset.accentColor,
      icon: preset.icon,
      score: 0,
      correctAnswers: 0,
      tasksCompleted: 0,
    }));
    onUpdateTeams(defaultTeams);
  };

  const handleConfirmTeams = () => {
    soundEngine.playUnlock();
    onConfirm();
  };

  return (
    <div className="relative min-h-[calc(100vh-68px)] flex flex-col items-center justify-center p-4 sm:p-8 w-full max-w-[1400px] mx-auto z-10">
      <div className="w-full panel-cosmic border-2 border-cyan-400/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-300 mb-1">
              <Users className="w-4 h-4 text-amber-300" />
              THIẾT LẬP PHÒNG CHƠI · MÁY CHIẾU LỚP HỌC 16:9
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white text-high-contrast">
              CÀI ĐẶT CÁC ĐỘI CỨU HỘ THI ĐẤU
            </h2>
          </div>

          {/* Team count stepper */}
          <div className="flex items-center gap-3 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700">
            <span className="text-xs font-semibold text-slate-300 px-3">
              Số đội: <strong className="text-[#FFC83D] text-base">{teamCount}</strong>
            </span>
            <button
              onClick={handleRemoveTeam}
              disabled={teamCount <= 2}
              title="Giảm bớt đội (tối thiểu 2)"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddTeam}
              disabled={teamCount >= 6}
              title="Thêm đội chơi (tối đa 6)"
              className="p-2 rounded-xl bg-[#1769D2] hover:bg-[#1557B0] disabled:opacity-40 text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
          {teams.map((team, idx) => (
            <div
              key={team.id}
              className="p-4 rounded-2xl border bg-slate-900/70 border-slate-700/80 flex items-center gap-4 transition-all hover:border-[#27DFFF]/50"
            >
              {/* Badge Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shrink-0"
                style={{ backgroundColor: team.color }}
              >
                {idx + 1}
              </div>

              {/* Editable Name & Starting Score */}
              <div className="flex-1 space-y-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Tên đội #{idx + 1}
                  </label>
                  <input
                    type="text"
                    value={team.name}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-[#27DFFF]"
                    placeholder="Nhập tên đội..."
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Điểm khởi đầu:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={team.score}
                      onChange={(e) => handleScoreChange(idx, parseInt(e.target.value) || 0)}
                      className="w-16 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-center font-mono font-bold text-[#FFC83D]"
                    />
                    <span>điểm</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700/80">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={handleResetToDefault}
              className="px-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục 4 đội mặc định</span>
            </button>
          </div>

          <button
            onClick={handleConfirmTeams}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#1769D2] via-[#27DFFF] to-[#FFC83D] text-slate-950 font-black text-base shadow-[0_0_25px_rgba(39,223,255,0.5)] hover:shadow-[0_0_35px_rgba(255,200,61,0.8)] transition-all flex items-center justify-center gap-2 btn-3d"
          >
            <span>XÁC NHẬN ĐỘI CHƠI</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
