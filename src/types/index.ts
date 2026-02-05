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

export interface ProgressState {
  addition: number; // 0-5 questions completed
  subtraction: number; // 0-5 questions completed
  multiplication: number; // 0-5 questions completed (Grade 3 only)
  division: number; // 0-5 questions completed (Grade 3 only)
  englishLetters: number; // 0-5 questions completed
}

export interface GameTopic {
  id: string;
  name: string;
  nameHe: string;
  icon: string;
  requiredGrade: 1 | 3;
  questionsRequired: number;
}