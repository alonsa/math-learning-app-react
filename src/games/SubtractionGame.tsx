// Subtraction Game Component - Disney/Astro Bot Style

import React, { useState, useEffect } from 'react';
import type { GameSettings, GameState } from '../types/index';
import { ProblemGenerator } from '../utils/problemGenerator';
import SoundManager, { SoundType } from '../utils/soundManager';

interface SubtractionGameProps {
  gameSettings: GameSettings;
  onBack: () => void;
  onToggleSound: () => void;
}

const SubtractionGame: React.FC<SubtractionGameProps> = ({
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
  const [answer, setAnswer] = useState<string>('');

  // UI state
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | ''>('');
  const [showNextButton, setShowNextButton] = useState<boolean>(false);

  // Generate first problem on mount
  useEffect(() => {
    generateNewProblem();
  }, []);

  const generateNewProblem = () => {
    const newProblem = ProblemGenerator.generateSubtractionProblem(gameSettings.grade);

    setGameState(prev => ({
      ...prev,
      currentProblem: newProblem,
      attemptCount: 0
    }));

    // Reset input
    setAnswer('');

    // Reset UI
    setFeedback('');
    setFeedbackType('');
    setShowNextButton(false);

    // Focus input
    setTimeout(() => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      input?.focus();
    }, 100);
  };

  const checkAnswer = async () => {
    if (!gameState.currentProblem) return;

    await soundManager.playSound(SoundType.BUTTON_CLICK);

    const playerAnswer = parseInt(answer) || 0;
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
        '🎉 Outstanding! Perfect subtraction!' :
        '🎉 מעולה! חיסור מושלם!'
      );
      setFeedbackType('success');
      setShowNextButton(true);

    } else {
      // Wrong answer
      if (gameState.attemptCount === 0) {
        // First attempt - encouraging feedback
        await soundManager.playSound(SoundType.TRY_AGAIN);

        setFeedback(gameSettings.language === 'en' ?
          `🤔 Not quite. Try again! (You answered ${playerAnswer})` :
          `🤔 לא בדיוק. נסה שוב! (עניت ${playerAnswer})`
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
          `💡 The correct answer is ${correctAnswer}. You answered ${playerAnswer}. Keep practicing!` :
          `💡 התשובה הנכונה היא ${correctAnswer}. ענית ${playerAnswer}. המשך להתאמן!`
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
            {firstNumber} - {secondNumber} = ?
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
          ➖ {gameSettings.language === 'en' ? 'Subtraction Practice' : 'תרגול חיסור'}
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
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="digit-field"
            style={{
              width: '120px',
              height: '80px',
              fontSize: '2rem'
            }}
            placeholder="?"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !showNextButton) {
                checkAnswer();
              }
            }}
          />
        </div>

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

        {/* Grade 3 Note */}
        {gameSettings.grade === 3 && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{
              color: 'white',
              margin: 0,
              fontSize: '0.875rem'
            }}>
              {gameSettings.language === 'en' ?
                '🚀 Grade 3 - Digit-by-digit input coming soon for subtraction!' :
                '🚀 כיתה ג - הזנת ספרה אחר ספרה בקרוב גם לחיסור!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtractionGame;