/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, ArrowRight, Map, ExternalLink, X, Film } from 'lucide-react';

interface StageVideoModalProps {
  isOpen: boolean;
  onClose?: () => void;
  badge: string;
  title: string;
  description: string;
  videoUrl: string;
  themeColor?: 'cyan' | 'purple' | 'amber';
  onNextStage: () => void;
  nextStageButtonText: string;
  onBackToMap: () => void;
  icon?: React.ReactNode;
}

export const StageVideoModal: React.FC<StageVideoModalProps> = ({
  isOpen,
  onClose,
  badge,
  title,
  description,
  videoUrl,
  themeColor = 'cyan',
  onNextStage,
  nextStageButtonText,
  onBackToMap,
  icon,
}) => {
  if (!isOpen) return null;

  // Convert Google Drive view URL to preview URL for iframe embedding
  const embedUrl = videoUrl.includes('/preview') 
    ? videoUrl 
    : videoUrl.replace(/\/view(\?.*)?$/, '/preview');

  const themeStyles = {
    cyan: {
      border: 'border-cyan-400',
      badgeBg: 'bg-cyan-950/90 text-cyan-300 border-cyan-400/50',
      shadow: 'shadow-[0_0_40px_rgba(34,211,238,0.35)]',
      glowIcon: 'shadow-[0_0_25px_#22d3ee] bg-cyan-950 text-cyan-300 border-cyan-400',
      btnGradient: 'bg-gradient-to-r from-cyan-400 to-amber-400 text-slate-950 shadow-[0_0_25px_#22d3ee] hover:shadow-[0_0_35px_#facc15]',
      iframeBorder: 'border-cyan-400/60 shadow-[0_0_30px_rgba(34,211,238,0.25)]',
    },
    purple: {
      border: 'border-purple-400',
      badgeBg: 'bg-purple-950/90 text-purple-300 border-purple-400/50',
      shadow: 'shadow-[0_0_40px_rgba(168,85,247,0.35)]',
      glowIcon: 'shadow-[0_0_25px_#c084fc] bg-purple-950 text-purple-300 border-purple-400',
      btnGradient: 'bg-gradient-to-r from-purple-500 to-amber-400 text-slate-950 shadow-[0_0_25px_#c084fc] hover:shadow-[0_0_35px_#facc15]',
      iframeBorder: 'border-purple-400/60 shadow-[0_0_30px_rgba(168,85,247,0.25)]',
    },
    amber: {
      border: 'border-amber-400',
      badgeBg: 'bg-amber-950/90 text-amber-300 border-amber-400/50',
      shadow: 'shadow-[0_0_40px_rgba(245,158,11,0.35)]',
      glowIcon: 'shadow-[0_0_25px_#facc15] bg-amber-950 text-amber-300 border-amber-400',
      btnGradient: 'bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 text-slate-950 shadow-[0_0_25px_#facc15] hover:shadow-[0_0_35px_#34d399]',
      iframeBorder: 'border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.25)]',
    },
  }[themeColor];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className={`relative panel-cosmic border-2 ${themeStyles.border} ${themeStyles.shadow} rounded-3xl max-w-4xl w-full p-4 sm:p-6 text-center space-y-3.5 animate-scaleUp my-auto max-h-[96vh] flex flex-col justify-between overflow-y-auto`}>
        {/* Close icon button if available */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all z-10"
            title="Đóng popup"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header: Badge & Title */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-black uppercase tracking-wider ${themeStyles.badgeBg}`}>
              <Film className="w-3.5 h-3.5" />
              {badge}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl xl:text-3xl font-black text-white text-high-contrast leading-tight">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed">
            {description}
          </p>
        </div>

        {/* 16:9 Video Player (Iframe with Google Drive Preview) */}
        <div className={`relative w-full aspect-video rounded-2xl overflow-hidden border-2 ${themeStyles.iframeBorder} bg-black shadow-2xl`}>
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={title}
          />
        </div>

        {/* Footer controls: Back to map, Open externally, and Next Stage */}
        <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-cyan-300 hover:text-cyan-200 flex items-center gap-1 underline underline-offset-4"
          >
            <span>Mở video toàn màn hình (tab mới)</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onBackToMap}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-all btn-3d"
            >
              <span className="flex items-center gap-1.5">
                <Map className="w-3.5 h-3.5 text-cyan-300" />
                <span>Về bản đồ</span>
              </span>
            </button>

            <button
              onClick={onNextStage}
              className={`px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all btn-3d ${themeStyles.btnGradient}`}
            >
              <span>{nextStageButtonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
