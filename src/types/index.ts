// TypeScript types for Math Learning App

export interface MathProblem {
  firstNumber: number;
  secondNumber: number;
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  correctAnswer: number;
}

export interface GameState {
  score: number;
  totalProblems: number;
  currentProblem: MathProblem | null;
  attemptCount: number;
  isGameActive: boolean;
}

export type SoundType =
  | 'correct'
  | 'wrong'
  | 'try-again'
  | 'button-click'
  | 'celebration';

export interface LetterSounds {
  [key: string]: string; // letter -> sound file path
}

export interface GameSettings {
  soundEnabled: boolean;
  grade: 1 | 3;
  language: 'en' | 'he';
}

export interface GeometryQuestion {
  question: string;
  correctAnswer: string;
  options: string[];
  shapes: string[];
}

export interface DigitInput {
  ones: string;
  tens: string;
  hundreds: string;
  thousands: string;
}