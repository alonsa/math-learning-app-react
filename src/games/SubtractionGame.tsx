// Subtraction Game Component - Disney/Astro Bot Style

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { GameSettings, GameState } from '../types/index';
import { ProblemGenerator } from '../utils/problemGenerator';
import SoundManager, { SoundType } from '../utils/soundManager';
import RocketProgress from '../components/RocketProgress';
import Confetti from '../components/Confetti';
import GameHeaderControls from '../components/GameHeaderControls';

interface SubtractionGameProps {
  gameSettings: GameSettings;
  onBack: () => void;
  onToggleSound: () => void;
  onLanguageChange?: (language: 'en' | 'he') => void;
  onProgressUpdate?: (completed: number) => void;
}

const SubtractionGame: React.FC<SubtractionGameProps> = ({
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
  const [answer, setAnswer] = useState<string>('');

  // UI state
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | ''>('');
  const [showNextButton, setShowNextButton] = useState<boolean>(false);
  const [confettiTrigger, setConfettiTrigger] = useState<number>(0);
  const checkAnswerRef = useRef(() => {});

  const generateNewProblem = useCallback(() => {
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
  }, [gameSettings.grade]);

  // Generate first problem on mount (defer to satisfy react-hooks/set-state-in-effect)
  useEffect(() => {
    const id = setTimeout(() => generateNewProblem(), 0);
    return () => clearTimeout(id);
  }, [generateNewProblem]);

  // Enter key submits answer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') checkAnswerRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const checkAnswer = async () => {
    if (!gameState.currentProblem) return;

    await soundManager.playSound(SoundType.BUTTON_CLICK);

    const playerAnswer = parseInt(answer) || 0;
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

      if (onProgressUpdate) {
        onProgressUpdate(Math.min(5, newTotal));
      }

      setFeedback(gameSettings.language === 'en' ?
        '🎉 Outstanding! Perfect subtraction!' :
        '🎉 מעולה! חיסור מושלם!'
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
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(102, 126, 234, 0.4)',
        zIndex: 0
      }} />
      <GameHeaderControls
        gameSettings={gameSettings}
        backLabel={gameSettings.language === 'en' ? 'Back' : 'חזור'}
        onBack={onBack}
        onToggleSound={onToggleSound}
        onLanguageChange={onLanguageChange}
        showLanguage={true}
      />
      <div className="app-screen-content" style={{ position: 'relative', zIndex: 1, width: '100%', textAlign: 'center', maxWidth: '800px' }}>
        {/* Title */}
        <h1 className="game-title" style={{ marginBottom: '1rem' }}>
          ➖ {gameSettings.language === 'en' ? 'Subtraction Practice' : 'תרגול חיסור'}
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

          {/* Rocket Progress */}
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