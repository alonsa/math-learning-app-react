// Addition Game Component - Disney/Astro Bot Style

import React, { useState, useEffect, useRef } from 'react';
import type { GameSettings, GameState, DigitInput } from '../types/index';
import { ProblemGenerator } from '../utils/problemGenerator';
import SoundManager, { SoundType } from '../utils/soundManager';

interface AdditionGameProps {
  gameSettings: GameSettings;
  onBack: () => void;
  onToggleSound: () => void;
}

const AdditionGame: React.FC<AdditionGameProps> = ({
  gameSettings,
  onBack,
  onToggleSound
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

  // Refs for digit inputs
  const onesRef = useRef<HTMLInputElement>(null);
  const tensRef = useRef<HTMLInputElement>(null);
  const hundredsRef = useRef<HTMLInputElement>(null);
  const thousandsRef = useRef<HTMLInputElement>(null);

  // Generate first problem on mount
  useEffect(() => {
    generateNewProblem();
  }, []);

  const generateNewProblem = () => {
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
  };

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

      setGameState(prev => ({
        ...prev,
        score: prev.score + 1,
        totalProblems: prev.totalProblems + 1
      }));

      setFeedback(gameSettings.language === 'en' ?
        '🎉 Excellent! That\'s correct!' :
        '🎉 מעולה! זה נכון!'
      );
      setFeedbackType('success');
      setShowNextButton(true);

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
        setShowNextButton(true);
      }
    }
  };

  const handleNextProblem = async () => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    generateNewProblem();
  };

  const handleBackClick = async () => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    onBack();
  };

  const handleSoundToggle = async () => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    onToggleSound();
  };

  const renderProblem = () => {
    if (!gameState.currentProblem) return null;

    const { firstNumber, secondNumber } = gameState.currentProblem;

    if (gameSettings.grade === 1) {
      // Horizontal format for Grade 1
      return (
        <div className="problem-container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#2c3e50',
            marginBottom: '1rem'
          }}>
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
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2c3e50',
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
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2c3e50',
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
    <div className="game-background" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      {/* Header Controls */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        right: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={handleBackClick}
          className="back-button"
        >
          🔙 {gameSettings.language === 'en' ? 'Back to Menu' : 'חזור לתפריט'}
        </button>

        <button
          onClick={handleSoundToggle}
          className={`sound-toggle-button ${!gameSettings.soundEnabled ? 'sound-off' : ''}`}
        >
          {gameSettings.soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
        </button>
      </div>

      {/* Game Content */}
      <div style={{
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Title */}
        <h1 className="game-title" style={{ marginBottom: '1rem' }}>
          ➕ {gameSettings.language === 'en' ? 'Addition Practice' : 'תרגול חיבור'}
        </h1>

        {/* Score */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '20px',
          padding: '1rem',
          marginBottom: '2rem',
          border: '2px solid rgba(102, 126, 234, 0.3)'
        }}>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#2c3e50'
          }}>
            {gameSettings.language === 'en' ? 'Score:' : 'ניקוד:'} {gameState.score}/{gameState.totalProblems}
          </span>
        </div>

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

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          {!showNextButton ? (
            <button
              onClick={checkAnswer}
              className="submit-button"
              style={{
                fontSize: '1.25rem',
                padding: '15px 30px'
              }}
            >
              ✓ {gameSettings.language === 'en' ? 'Submit Answer' : 'שלח תשובה'}
            </button>
          ) : (
            <button
              onClick={handleNextProblem}
              className="next-button"
              style={{
                fontSize: '1.25rem',
                padding: '15px 30px'
              }}
            >
              → {gameSettings.language === 'en' ? 'Next Problem' : 'בעיה הבאה'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionGame;