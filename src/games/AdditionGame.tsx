// Addition Game Component - Disney/Astro Bot Style

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { GameSettings, GameState, DigitInput } from '../types/index';
import { ProblemGenerator } from '../utils/problemGenerator';
import SoundManager, { SoundType } from '../utils/soundManager';
import RocketProgress from '../components/RocketProgress';
import Confetti from '../components/Confetti';
import GameHeaderControls from '../components/GameHeaderControls';

interface AdditionGameProps {
  gameSettings: GameSettings;
  onBack: () => void;
  onToggleSound: () => void;
  onLanguageChange?: (language: 'en' | 'he') => void;
  onProgressUpdate?: (completed: number) => void; // Callback when questions completed
}

const AdditionGame: React.FC<AdditionGameProps> = ({
  gameSettings,
  onBack,
  onToggleSound,
  onLanguageChange,
  onProgressUpdate
}) => {
  const soundManager = SoundManager.getInstance();

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    totalProblems: 0,
    currentProblem: null,
    attemptCount: 0,
    isGameActive: true
  });

  // Input state
  const [singleAnswer, setSingleAnswer] = useState<string>('');
  const [digitInput, setDigitInput] = useState<DigitInput>({
    ones: '',
    tens: '',
    hundreds: '',
    thousands: ''
  });

  // UI state
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | ''>('');
  const [showNextButton, setShowNextButton] = useState<boolean>(false);
  const [confettiTrigger, setConfettiTrigger] = useState<number>(0);

  // Refs for digit inputs
  const onesRef = useRef<HTMLInputElement>(null);
  const tensRef = useRef<HTMLInputElement>(null);
  const hundredsRef = useRef<HTMLInputElement>(null);
  const thousandsRef = useRef<HTMLInputElement>(null);
  const checkAnswerRef = useRef<() => void>(() => {});

  const generateNewProblem = useCallback(() => {
    const newProblem = ProblemGenerator.generateAdditionProblem(gameSettings.grade);

    setGameState(prev => ({
      ...prev,
      currentProblem: newProblem,
      attemptCount: 0
    }));

    // Reset input
    setSingleAnswer('');
    setDigitInput({
      ones: '',
      tens: '',
      hundreds: '',
      thousands: ''
    });

    // Reset UI
    setFeedback('');
    setFeedbackType('');
    setShowNextButton(false);

    // Focus first input
    if (gameSettings.grade === 1) {
      // Focus single input for Grade 1
      setTimeout(() => {
        const singleInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        singleInput?.focus();
      }, 100);
    } else {
      // Focus ones digit for Grade 3 (rightmost)
      setTimeout(() => {
        onesRef.current?.focus();
      }, 100);
    }
  }, [gameSettings.grade]);

  // Generate first problem on mount (defer to satisfy react-hooks/set-state-in-effect)
  useEffect(() => {
    const id = setTimeout(() => generateNewProblem(), 0);
    return () => clearTimeout(id);
  }, [generateNewProblem]);

  // Enter key submits answer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !showNextButton) checkAnswerRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showNextButton]);

  const handleDigitChange = (digit: keyof DigitInput, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    setDigitInput(prev => ({ ...prev, [digit]: value }));

    // Auto-advance to next field (left to right: ones -> tens -> hundreds -> thousands)
    if (value && digit === 'ones') {
      tensRef.current?.focus();
    } else if (value && digit === 'tens') {
      hundredsRef.current?.focus();
    } else if (value && digit === 'hundreds') {
      thousandsRef.current?.focus();
    }
  };

  const handleDigitKeyDown = (digit: keyof DigitInput, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && digitInput[digit] === '') {
      // Move to previous field when backspacing on empty field
      if (digit === 'tens') {
        onesRef.current?.focus();
      } else if (digit === 'hundreds') {
        tensRef.current?.focus();
      } else if (digit === 'thousands') {
        hundredsRef.current?.focus();
      }
    }
  };

  const getPlayerAnswer = (): number => {
    if (gameSettings.grade === 1) {
      return parseInt(singleAnswer) || 0;
    } else {
      // Construct number from digits (right to left)
      const thousands = parseInt(digitInput.thousands) || 0;
      const hundreds = parseInt(digitInput.hundreds) || 0;
      const tens = parseInt(digitInput.tens) || 0;
      const ones = parseInt(digitInput.ones) || 0;

      return thousands * 1000 + hundreds * 100 + tens * 10 + ones;
    }
  };

  const checkAnswer = async () => {
    if (!gameState.currentProblem) return;

    await soundManager.playSound(SoundType.BUTTON_CLICK);

    const playerAnswer = getPlayerAnswer();
    const correctAnswer = gameState.currentProblem.correctAnswer;

    setGameState(prev => ({ ...prev, attemptCount: prev.attemptCount + 1 }));

    if (playerAnswer === correctAnswer) {
      // Correct answer!
      await soundManager.playSound(SoundType.CORRECT_ANSWER);

      const newTotal = gameState.totalProblems + 1;
      setGameState(prev => ({
        ...prev,
        score: prev.score + 1,
        totalProblems: newTotal
      }));

      // Update progress (5 questions per topic)
      if (onProgressUpdate) {
        onProgressUpdate(Math.min(5, newTotal));
      }

      setFeedback(gameSettings.language === 'en' ?
        '🎉 Excellent! That\'s correct!' :
        '🎉 מעולה! זה נכון!'
      );
      setFeedbackType('success');
      
      // Auto-advance to next problem after delay
      setTimeout(() => {
        generateNewProblem();
        setFeedback('');
        setFeedbackType('');
        setShowNextButton(false);
      }, 2000); // 2 second delay

    } else {
      // Wrong answer
      if (gameState.attemptCount === 0) {
        // First attempt - encouraging feedback
        await soundManager.playSound(SoundType.TRY_AGAIN);

        setFeedback(gameSettings.language === 'en' ?
          `🤔 Not quite right. Try again! (You answered ${playerAnswer})` :
          `🤔 לא בדיוק נכון. נסה שוב! (עניت ${playerAnswer})`
        );
        setFeedbackType('error');

      } else {
        // Second attempt - show correct answer
        await soundManager.playSound(SoundType.WRONG_ANSWER);

        setGameState(prev => ({
          ...prev,
          totalProblems: prev.totalProblems + 1
        }));

        setFeedback(gameSettings.language === 'en' ?
          `💡 The correct answer is ${correctAnswer}. You answered ${playerAnswer}. Let's try the next one!` :
          `💡 התשובה הנכונה היא ${correctAnswer}. ענית ${playerAnswer}. בואו ננסה את הבא!`
        );
        setFeedbackType('error');
        
        // Auto-advance to next problem after delay (even for wrong answers)
        setTimeout(() => {
          generateNewProblem();
          setFeedback('');
          setFeedbackType('');
          setShowNextButton(false);
        }, 2500); // 2.5 second delay for wrong answers
      }
    }
  };

  useEffect(() => {
    checkAnswerRef.current = checkAnswer;
  }, [checkAnswer]);

  const renderProblem = () => {
    if (!gameState.currentProblem) return null;

    const { firstNumber, secondNumber } = gameState.currentProblem;

    if (gameSettings.grade === 1) {
      // Horizontal format for Grade 1
      return (
        <div className="problem-container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="vertical-math-problem" style={{ marginBottom: '1rem' }}>
            {firstNumber} + {secondNumber} = ?
          </div>
        </div>
      );
    } else {
      // Vertical format for Grade 3
      const { lines } = ProblemGenerator.formatVerticalProblem(gameState.currentProblem);

      return (
        <div className="problem-container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="vertical-math-problem">
            {lines.map((line, index) => (
              <div key={index}>
                {line}
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  const renderInput = () => {
    if (gameSettings.grade === 1) {
      // Single input for Grade 1
      return (
        <div className="answer-panel" style={{ textAlign: 'center' }}>
          <label style={{
            display: 'block',
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            {gameSettings.language === 'en' ? 'Your answer:' : 'התשובה שלך:'}
          </label>

          <input
            type="text"
            value={singleAnswer}
            onChange={(e) => setSingleAnswer(e.target.value)}
            className="digit-field"
            style={{
              width: '120px',
              height: '80px',
              fontSize: '2rem'
            }}
            placeholder="?"
          />
        </div>
      );
    } else {
      // Digit-by-digit input for Grade 3
      return (
        <div className="answer-panel" style={{ textAlign: 'center' }}>
          <label style={{
            display: 'block',
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            {gameSettings.language === 'en' ?
              '💡 Enter your answer digit by digit (start from the right!)' :
              '💡 הכנס את התשובה שלך ספרה אחר ספרה (התחל מימין!)'
            }
          </label>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            {/* Place value labels */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>1000s</div>
              <input
                ref={thousandsRef}
                type="text"
                value={digitInput.thousands}
                onChange={(e) => handleDigitChange('thousands', e.target.value)}
                onKeyDown={(e) => handleDigitKeyDown('thousands', e)}
                className="digit-field"
                maxLength={1}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>100s</div>
              <input
                ref={hundredsRef}
                type="text"
                value={digitInput.hundreds}
                onChange={(e) => handleDigitChange('hundreds', e.target.value)}
                onKeyDown={(e) => handleDigitKeyDown('hundreds', e)}
                className="digit-field"
                maxLength={1}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>10s</div>
              <input
                ref={tensRef}
                type="text"
                value={digitInput.tens}
                onChange={(e) => handleDigitChange('tens', e.target.value)}
                onKeyDown={(e) => handleDigitKeyDown('tens', e)}
                className="digit-field"
                maxLength={1}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>1s</div>
              <input
                ref={onesRef}
                type="text"
                value={digitInput.ones}
                onChange={(e) => handleDigitChange('ones', e.target.value)}
                onKeyDown={(e) => handleDigitKeyDown('ones', e)}
                className="digit-field"
                maxLength={1}
              />
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="main-background app-screen" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      backgroundImage: 'url(/assets/rocket/rocket_b.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* שכבת טשטוש כחולה למראה Astro-Bot */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(102, 126, 234, 0.4)',
        zIndex: 0
      }} />

      {/* Header Controls - כפתורי זכוכית */}
      <GameHeaderControls
        gameSettings={gameSettings}
        backLabel={gameSettings.language === 'en' ? 'Back' : 'חזור'}
        onBack={onBack}
        onToggleSound={onToggleSound}
        onLanguageChange={onLanguageChange}
        showLanguage={true}
      />

      {/* תוכן השיעור */}
      <div className="app-screen-content" style={{ position: 'relative', zIndex: 1, width: '100%', textAlign: 'center', maxWidth: '800px' }}>
        {/* Title */}
        <h1 className="game-title" style={{ marginBottom: '1rem' }}>
          ➕ {gameSettings.language === 'en' ? 'Addition Practice' : 'תרגול חיבור'}
        </h1>

        {/* Score and Rocket Progress */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '2rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {/* Score Display */}
          <div className="score-display">
            {gameSettings.language === 'en' ? 'Score:' : 'ניקוד:'} {gameState.score}/{gameState.totalProblems}
          </div>

          {/* Rocket Progress - SVG Animation */}
          <RocketProgress 
            score={gameState.score} 
            maxScore={50}
            useSVG={true}
            onMilestone={(milestone) => {
              setConfettiTrigger(milestone);
            }}
          />
        </div>

        {/* Confetti for Milestones */}
        <Confetti trigger={confettiTrigger} />

        {/* Problem */}
        {renderProblem()}

        {/* Input */}
        {renderInput()}

        {/* Feedback */}
        {feedback && (
          <div className={`feedback-${feedbackType}`} style={{
            marginBottom: '2rem',
            animation: 'celebrate 0.6s ease-out'
          }}>
            {feedback}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdditionGame;