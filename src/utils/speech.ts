/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

type SubtitleListener = (text: string, mood?: 'happy' | 'neutral' | 'alert' | 'celebrate') => void;

class SpeechHelper {
  private isVoiceEnabled: boolean = false; // Disabled Vietnamese TTS as requested
  private listeners: SubtitleListener[] = [];

  constructor() {
    // Audio voice reading is disabled by user request
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  public setVoiceEnabled(_enabled: boolean) {
    this.isVoiceEnabled = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  public subscribe(listener: SubtitleListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public speak(text: string, mood: 'happy' | 'neutral' | 'alert' | 'celebrate' = 'neutral') {
    // Notify subtitle listeners only if needed, but do NOT invoke speech synthesis
    this.listeners.forEach(l => l(text, mood));
    // Voice speech synthesis disabled
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }
}

export const speechHelper = new SpeechHelper();
