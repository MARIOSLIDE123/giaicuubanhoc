/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenState, Team, GameProgress, GameSettings } from './types/game';
import { CosmicBackground } from './components/CosmicBackground';
import { HeaderNav } from './components/HeaderNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TeamSetupModal } from './components/TeamSetupModal';
import { MissionMap } from './components/MissionMap';
import { Stage1Tracking } from './components/Stage1Tracking';
import { Stage2Infiltration } from './components/Stage2Infiltration';
import { Stage3Rescue } from './components/Stage3Rescue';
import { VictoryPodium } from './components/VictoryPodium';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { HelpRulesModal } from './components/HelpRulesModal';
import { soundEngine } from './utils/sound';

const DEFAULT_TEAMS: Team[] = [
  { id: 't1', name: 'ĐỘI SAO BĂNG', color: '#1769D2', accentColor: '#27DFFF', icon: 'comet', score: 0, correctAnswers: 0, tasksCompleted: 0 },
  { id: 't2', name: 'ĐỘI THIÊN HÀ', color: '#7139B9', accentColor: '#D946EF', icon: 'planet', score: 0, correctAnswers: 0, tasksCompleted: 0 },
  { id: 't3', name: 'ĐỘI NGÂN HÀ', color: '#D97706', accentColor: '#FFC83D', icon: 'star', score: 0, correctAnswers: 0, tasksCompleted: 0 },
  { id: 't4', name: 'ĐỘI SIÊU TÂN TINH', color: '#DC2626', accentColor: '#FF8A32', icon: 'rocket', score: 0, correctAnswers: 0, tasksCompleted: 0 },
];

const DEFAULT_PROGRESS: GameProgress = {
  stage1CompletedTasks: [],
  stage2UnlockedLocks: 0,
  stage3MasterKeys: 0,
  activeStage: 1,
  stage1Done: false,
  stage2Done: false,
  stage3Done: false,
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  voiceEnabled: false,
  soundVolume: 0.7,
  shuffleQuestions: true,
  shuffleOptions: true,
  timerDurations: {
    recognition: 20,
    calculation: 45,
    application: 75,
  },
  pointsConfig: {
    mcq: 10,
    calculation: 20,
    explanation: 10,
    aiErrorDetection: 15,
    stealBonus: 5,
  },
};

export default function App() {
  // Restore from localStorage or defaults
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('WELCOME');
  
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const saved = localStorage.getItem('ufo_rescue_teams');
      return saved ? JSON.parse(saved) : DEFAULT_TEAMS;
    } catch {
      return DEFAULT_TEAMS;
    }
  });

  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);

  const [progress, setProgress] = useState<GameProgress>(() => {
    try {
      const saved = localStorage.getItem('ufo_rescue_progress');
      return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('ufo_rescue_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ufo_rescue_teams', JSON.stringify(teams));
    } catch {}
  }, [teams]);

  useEffect(() => {
    try {
      localStorage.setItem('ufo_rescue_progress', JSON.stringify(progress));
    } catch {}
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem('ufo_rescue_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Sync default team selection
  useEffect(() => {
    if (!activeTeamId && teams.length > 0) {
      setActiveTeamId(teams[0].id);
    }
  }, [teams, activeTeamId]);

  // Points adjustment handlers
  const handleAwardPoints = (teamId: string, pts: number) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          return {
            ...t,
            score: t.score + pts,
            correctAnswers: t.correctAnswers + 1,
            tasksCompleted: t.tasksCompleted + 1,
          };
        }
        return t;
      })
    );
  };

  const handleAdjustPoints = (teamId: string, delta: number) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          return {
            ...t,
            score: Math.max(0, t.score + delta),
          };
        }
        return t;
      })
    );
  };

  const handleResetAllScores = () => {
    setTeams((prev) =>
      prev.map((t) => ({
        ...t,
        score: 0,
        correctAnswers: 0,
        tasksCompleted: 0,
      }))
    );
  };

  const handleFullResetGame = () => {
    setTeams(DEFAULT_TEAMS);
    setProgress(DEFAULT_PROGRESS);
    setActiveTeamId('t1');
    setCurrentScreen('WELCOME');
    try {
      localStorage.removeItem('ufo_rescue_teams');
      localStorage.removeItem('ufo_rescue_progress');
    } catch {}
  };

  // Stage Completion handlers
  const handleCompleteStage1 = () => {
    setProgress((prev) => ({
      ...prev,
      stage1Done: true,
      activeStage: 2,
    }));
    setCurrentScreen('STAGE_2');
  };

  const handleCompleteStage2 = () => {
    setProgress((prev) => ({
      ...prev,
      stage2Done: true,
      activeStage: 3,
    }));
    setCurrentScreen('STAGE_3');
  };

  const handleCompleteStage3 = () => {
    setProgress((prev) => ({
      ...prev,
      stage3Done: true,
    }));
    setCurrentScreen('VICTORY');
  };

  // Keyboard shortcut listener for classroom projector
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Numbers 1-6 select teams
      if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const teamIdx = parseInt(e.key) - 1;
        if (teams[teamIdx]) {
          setActiveTeamId(teams[teamIdx].id);
          soundEngine.playClick();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [teams]);

  return (
    <div className="min-h-screen bg-[#050E26] text-white flex flex-col font-sans relative selection:bg-[#27DFFF] selection:text-slate-950">
      {/* Dynamic Cosmic Background */}
      <CosmicBackground />

      {/* Top Header Navigation */}
      <HeaderNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSoundMuted={!settings.soundEnabled}
        onToggleSound={() => {
          const nextVal = !settings.soundEnabled;
          soundEngine.setMuted(!nextVal);
          setSettings((prev) => ({ ...prev, soundEnabled: nextVal }));
        }}
      />

      {/* Active Screen Router */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'WELCOME' && (
          <WelcomeScreen
            onStart={() => setCurrentScreen('SETUP_TEAMS')}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentScreen === 'SETUP_TEAMS' && (
          <TeamSetupModal
            teams={teams}
            onUpdateTeams={setTeams}
            onConfirm={() => setCurrentScreen('ROADMAP')}
            onBack={() => setCurrentScreen('WELCOME')}
          />
        )}

        {currentScreen === 'ROADMAP' && (
          <MissionMap
            progress={progress}
            teams={teams}
            activeTeamId={activeTeamId}
            onSelectTeam={setActiveTeamId}
            onSelectStage={(stageId) => {
              if (stageId === 1) setCurrentScreen('STAGE_1');
              if (stageId === 2) setCurrentScreen('STAGE_2');
              if (stageId === 3) setCurrentScreen('STAGE_3');
            }}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'STAGE_1' && (
          <Stage1Tracking
            teams={teams}
            activeTeamId={activeTeamId}
            onSelectTeam={setActiveTeamId}
            onAwardPoints={handleAwardPoints}
            onAdjustPoints={handleAdjustPoints}
            onResetAllScores={handleResetAllScores}
            onCompleteStage1={handleCompleteStage1}
            onBackToMap={() => setCurrentScreen('ROADMAP')}
            shuffleQuestions={settings.shuffleQuestions}
            shuffleOptions={settings.shuffleOptions}
          />
        )}

        {currentScreen === 'STAGE_2' && (
          <Stage2Infiltration
            teams={teams}
            activeTeamId={activeTeamId}
            onSelectTeam={setActiveTeamId}
            onAwardPoints={handleAwardPoints}
            onAdjustPoints={handleAdjustPoints}
            onResetAllScores={handleResetAllScores}
            onCompleteStage2={handleCompleteStage2}
            onBackToMap={() => setCurrentScreen('ROADMAP')}
          />
        )}

        {currentScreen === 'STAGE_3' && (
          <Stage3Rescue
            teams={teams}
            activeTeamId={activeTeamId}
            onSelectTeam={setActiveTeamId}
            onAwardPoints={handleAwardPoints}
            onAdjustPoints={handleAdjustPoints}
            onResetAllScores={handleResetAllScores}
            onCompleteStage3={handleCompleteStage3}
            onBackToMap={() => setCurrentScreen('ROADMAP')}
          />
        )}

        {currentScreen === 'VICTORY' && (
          <VictoryPodium
            teams={teams}
            onPlayAgain={() => {
              handleResetAllScores();
              setProgress(DEFAULT_PROGRESS);
              setCurrentScreen('STAGE_1');
            }}
            onNavigate={setCurrentScreen}
          />
        )}
      </main>

      {/* Teacher Settings Modal */}
      {isSettingsOpen && (
        <TeacherSettingsModal
          settings={settings}
          teams={teams}
          onUpdateSettings={setSettings}
          onUpdateTeams={setTeams}
          onResetGame={handleFullResetGame}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Help & Rules Modal */}
      {isHelpOpen && (
        <HelpRulesModal onClose={() => setIsHelpOpen(false)} />
      )}
    </div>
  );
}
