// Division Game Component - Disney/Astro Bot Style
// Grade 3: Division with whole number results

import React, { useState, useEffect, useRef } from 'react';
import type { GameSettings, GameState } from '../types/index';
import { ProblemGenerator } from '../utils/problemGenerator';
import SoundManager, { SoundType } from '../utils/soundManager';
import RocketProgress from '../components/RocketProgress';
import Confetti from '../components/Confetti';

interface DivisionGameProps {
  gameSettings: GameSettings;
  onBack: () => void;
  onToggleSound: () => void;
  onProgressUpdate?: (completed: number) => void;
}

const DivisionGame: React.FC<DivisionGameProps> = ({
  gameSettings,
  onBack,
  onToggleSound,
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

  // Generate first problem on mount
  useEffect(() => {
    generateNewProblem();
  }, []);

  // Enter key submits answer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') checkAnswerRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const generateNewProblem = () => {
    const newProblem = ProblemGenerator.generateDivisionProblem(gameSettings.grade);

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
        '🎉 Excellent! Perfect division!' :
        '🎉 מעולה! חלוקה מושלמת!'
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
          `🤔 לא בדיוק. נסה שוב! (ענית ${playerAnswer})`
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
  checkAnswerRef.current = checkAnswer;

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

    // Vertical format for Grade 3 division
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
  };

  return (
    <div className="main-background" style={{
      minHeight: '100vh',
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
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 20
      }}>
        <button
          onClick={handleBackClick}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50px',
            padding: '10px 20px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: '600'
          }}
        >
          🔙 {gameSettings.language === 'en' ? 'Back' : 'חזור'}
        </button>
        <button
          onClick={handleSoundToggle}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50px',
            padding: '10px 20px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: '600',
            opacity: gameSettings.soundEnabled ? 1 : 0.8
          }}
        >
          {gameSettings.soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
        </button>
      </div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%', textAlign: 'center', padding: '2rem', paddingTop: '5rem', maxWidth: '800px' }}>
        {/* Title */}
        <h1 className="game-title" style={{ marginBottom: '1rem' }}>
          ➗ {gameSettings.language === 'en' ? 'Division Practice' : 'תרגול חלוקה'}
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
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '1rem 2rem',
            border: '2px solid rgba(102, 126, 234, 0.3)',
            minWidth: '200px'
          }}>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#2c3e50'
            }}>
              {gameSettings.language === 'en' ? 'Score:' : 'ניקוד:'} {gameState.score}/{gameState.totalProblems}
            </span>
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
                '🚀 Grade 3 - Practice division with whole number results!' :
                '🚀 כיתה ג - תרגול חלוקה עם תוצאות מספר שלם!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DivisionGame;
