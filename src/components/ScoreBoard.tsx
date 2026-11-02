/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Team } from '../types/game';
import { Rocket, Sparkles, Orbit, Flame, Radio, Award } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface ScoreBoardProps {
  teams: Team[];
  activeTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
  compact?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  teams,
  activeTeamId,
  onSelectTeam,
  compact = false,
  layout = 'horizontal',
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'rocket': return <Rocket className="w-5 h-5" />;
      case 'planet': return <Orbit className="w-5 h-5" />;
      case 'comet': return <Sparkles className="w-5 h-5" />;
      case 'star': return <Award className="w-5 h-5" />;
      case 'satellite': return <Radio className="w-5 h-5" />;
      default: return <Flame className="w-5 h-5" />;
    }
  };

  if (layout === 'vertical') {
    return (
      <div className="w-full panel-cosmic rounded-2xl p-3.5 shadow-2xl border border-cyan-500/30 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-3 px-1 border-b border-cyan-500/20 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5 text-glow-cyan">
              <Award className="w-4 h-4 text-amber-300" />
              ĐỘI CỨU HỘ
            </span>
            <span className="text-[10px] text-slate-300 font-semibold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30">
              Phím 1-{teams.length}
            </span>
          </div>

          {/* Vertical Stack of Teams */}
          <div className="space-y-2.5">
            {teams.map((team, idx) => {
              const isSelected = team.id === activeTeamId;
              return (
                <button
                  key={team.id}
                  onClick={() => {
                    soundEngine.playClick();
                    onSelectTeam(team.id);
                  }}
                  className={`w-full relative flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all btn-3d ${
                    isSelected
                      ? 'bg-blue-900/70 border-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.55)] ring-2 ring-cyan-400'
                      : 'bg-slate-900/80 border-slate-700/80 hover:border-cyan-500/60 hover:bg-slate-800/80'
                  }`}
                >
                  {/* Hotkey Badge */}
                  <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-slate-950 border border-cyan-400 text-[10px] font-black text-cyan-300 flex items-center justify-center shadow">
                    {idx + 1}
                  </span>

                  {/* Team Icon */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-md text-white font-black"
                    style={{ backgroundColor: team.color }}
                  >
                    {getIcon(team.icon)}
                  </div>

                  {/* Team Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="text-xs font-black text-white truncate max-w-[110px] drop-shadow">
                        {team.name}
                      </div>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-base font-black font-mono tabular-nums text-amber-300 text-glow-yellow">
                        {team.score} <span className="text-[10px] font-normal text-slate-300">đ</span>
                      </span>
                      <span className="text-[11px] text-emerald-300 font-bold bg-emerald-950/70 px-1.5 py-0.2 rounded border border-emerald-500/40">
                        ✓ {team.correctAnswers}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 text-center font-medium">
          Nhấp đội để trao quyền trả lời
        </div>
      </div>
    );
  }

  return (
    <div className="w-full panel-cosmic rounded-2xl p-3 sm:p-4 shadow-2xl border border-cyan-500/30">
      <div className="flex items-center justify-between mb-2.5 px-2">
        <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2 text-glow-cyan">
          <Award className="w-4 h-4 text-amber-300" />
          BẢNG ĐIỂM CÁC ĐỘI CỨU HỘ TRÁI ĐẤT
        </span>
        <span className="text-xs text-slate-300 font-semibold bg-blue-950/70 px-3 py-1 rounded-full border border-blue-500/30">
          Nhấp chọn đội (hoặc bấm phím số 1-{teams.length}) để trao quyền trả lời
        </span>
      </div>

      <div className={`grid grid-cols-2 md:grid-cols-${Math.min(teams.length, 6)} gap-3`}>
        {teams.map((team, idx) => {
          const isSelected = team.id === activeTeamId;
          return (
            <button
              key={team.id}
              onClick={() => {
                soundEngine.playClick();
                onSelectTeam(team.id);
              }}
              className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all btn-3d ${
                isSelected
                  ? 'bg-blue-900/60 border-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.5)] ring-2 ring-cyan-400'
                  : 'bg-slate-900/80 border-slate-700 hover:border-cyan-500/60 hover:bg-slate-800/80'
              }`}
            >
              {/* Team Hotkey number badge */}
              <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-950 border border-cyan-400 text-[10px] font-black text-cyan-300 flex items-center justify-center shadow">
                {idx + 1}
              </span>

              {/* Team Icon avatar */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg text-white font-black"
                style={{ backgroundColor: team.color }}
              >
                {getIcon(team.icon)}
              </div>

              {/* Team Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <div className="text-xs sm:text-sm font-black text-white truncate drop-shadow">
                    {team.name}
                  </div>
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg sm:text-xl font-black font-mono tabular-nums text-amber-300 text-glow-yellow">
                    {team.score} <span className="text-xs font-normal text-slate-300">đ</span>
                  </span>
                  {!compact && (
                    <span className="text-xs text-emerald-300 font-bold bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/40">
                      ✓ {team.correctAnswers}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
