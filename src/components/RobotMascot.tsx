/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface RobotMascotProps {
  dialogueText?: string;
  mood?: 'happy' | 'neutral' | 'alert' | 'celebrate';
  size?: 'sm' | 'md' | 'lg';
  showSpeechBubble?: boolean;
}

// Robot mascot removed by user request
export const RobotMascot: React.FC<RobotMascotProps> = () => {
  return null;
};
