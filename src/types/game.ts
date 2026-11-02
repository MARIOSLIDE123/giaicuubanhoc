/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenState = 
  | 'WELCOME' 
  | 'SETUP_TEAMS' 
  | 'ROADMAP' 
  | 'STAGE_1' 
  | 'STAGE_2' 
  | 'STAGE_3' 
  | 'VICTORY';

export interface Team {
  id: string;
  name: string;
  color: string;       // HEX color
  accentColor: string; // Complementary highlight
  icon: string;        // 'rocket' | 'planet' | 'comet' | 'star' | 'satellite' | 'ufo'
  score: number;
  correctAnswers: number;
  tasksCompleted: number;
}

export type TaskDifficulty = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';

export interface ChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface MultiPartItem {
  id: string;
  label: string;
  prompt: string;
  answer: string | number;
  explanation?: string;
  points: number;
}

export interface Question {
  id: string;
  stage: 1 | 2 | 3;
  taskNumber: number;
  signalName: string;
  dataset: number[] | { [key: string]: number[] };
  unit?: string;
  contextDesc?: string;
  questionText: string;
  difficulty: TaskDifficulty;
  defaultTimeSeconds: number;
  points: number;
  type: 'multiple-choice' | 'multi-stat' | 'stepped-analysis';
  options?: ChoiceOption[]; // For multiple choice questions
  statsBreakdown?: {
    mean?: number;
    median?: number;
    mode?: string | number;
    q1?: number;
    q2?: number;
    q3?: number;
    iqr?: number;
    bestStat?: string;
    outlierNote?: string;
  };
  subQuestions?: MultiPartItem[];
  hint: string;
  solution: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  soundVolume: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  timerDurations: {
    recognition: number; // default 20s
    calculation: number; // default 45s
    application: number; // default 75s
  };
  pointsConfig: {
    mcq: number;         // default 10
    calculation: number; // default 20
    explanation: number; // default 10
    aiErrorDetection: number; // default 15
    stealBonus: number;  // default 5
  };
}

export interface GameProgress {
  stage1CompletedTasks: string[]; // question ids
  stage2UnlockedLocks: number;    // 0 to 5
  stage3MasterKeys: number;       // 0 to 3
  activeStage: 1 | 2 | 3;
  stage1Done: boolean;
  stage2Done: boolean;
  stage3Done: boolean;
}
