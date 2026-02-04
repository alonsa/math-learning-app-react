// English Letter Game Component - Disney/Astro Bot Style

import React, { useState, useEffect } from 'react';
import type { GameSettings, GameState } from '../types/index';
import SoundManager, { SoundType } from '../utils/soundManager';

interface EnglishLetterGameProps {
  gameSettings: GameSettings;
  onBack: () => void;
  onToggleSound: () => void;
}

interface LetterProblem {
  letter: string;
  options: string[];
  correctAnswer: string;
  type: 'uppercase' | 'lowercase' | 'sound';
}

const EnglishLetterGame: React.FC<EnglishLetterGameProps> = ({
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

  // Letter game specific state
  const [currentLetterProblem, setCurrentLetterProblem] = useState<LetterProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [testMode, setTestMode] = useState<'case' | 'sound' | null>(null); // null = mode selection screen

  // Reset test mode when component mounts (when entering the game)
  useEffect(() => {
    setTestMode(null);
    setCurrentLetterProblem(null);
    setSelectedAnswer('');
    setFeedback('');
    setFeedbackType('');
    setShowNextButton(false);
    setGameState({
      score: 0,
      totalProblems: 0,
      currentProblem: null,
      attemptCount: 0,
      isGameActive: true
    });
  }, []);

  // UI state
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | ''>('');
  const [showNextButton, setShowNextButton] = useState<boolean>(false);

  // Letter sets for different grade levels
  const getLetterSet = () => {
    if (gameSettings.grade === 1) {
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    } else {
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    }
  };

  const generateLetterProblem = (): LetterProblem => {
    const letters = getLetterSet();
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];

    let problem: LetterProblem;
    
    // Determine problem type based on selected test mode
    let problemType: LetterProblem['type'];
    if (testMode === 'case') {
      // Case matching: randomly choose uppercase or lowercase
      problemType = Math.random() < 0.5 ? 'uppercase' : 'lowercase';
    } else if (testMode === 'sound') {
      // Sound identification
      problemType = 'sound';
    } else {
      // Fallback (shouldn't happen)
      problemType = 'uppercase';
    }

    if (problemType === 'uppercase') {
      // Show lowercase, find uppercase
      const correctAnswer = randomLetter.toUpperCase();
      const wrongOptions = letters
        .filter(l => l !== randomLetter)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(l => l.toUpperCase());

      const allOptions = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);

      problem = {
        letter: randomLetter.toLowerCase(),
        options: allOptions,
        correctAnswer,
        type: 'uppercase'
      };
    } else if (problemType === 'lowercase') {
      // Show uppercase, find lowercase
      const correctAnswer = randomLetter.toLowerCase();
      const wrongOptions = letters
        .filter(l => l !== randomLetter)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(l => l.toLowerCase());

      const allOptions = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);

      problem = {
        letter: randomLetter.toUpperCase(),
        options: allOptions,
        correctAnswer,
        type: 'lowercase'
      };
    } else {
      // Sound test - hear letter, pick correct letter
      const correctAnswer = randomLetter.toUpperCase();
      const wrongOptions = letters
        .filter(l => l !== randomLetter)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(l => l.toUpperCase());

      const allOptions = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);

      problem = {
        letter: randomLetter.toUpperCase(),
        options: allOptions,
        correctAnswer,
        type: 'sound'
      };
    }

    return problem;
  };

  // Generate first problem when test mode is selected
  useEffect(() => {
    if (testMode !== null) {
      generateNewProblem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testMode]);

  const generateNewProblem = async () => {
    if (testMode === null) return;
    
    const newProblem = generateLetterProblem();
    setCurrentLetterProblem(newProblem);

    setGameState(prev => ({
      ...prev,
      attemptCount: 0
    }));

    // Reset input
    setSelectedAnswer('');

    // Reset UI
    setFeedback('');
    setFeedbackType('');
    setShowNextButton(false);

    // No automatic sound playing on page load - user controls when to hear sounds
  };

  const checkAnswer = async () => {
    if (!currentLetterProblem || !selectedAnswer) return;

    await soundManager.playSound(SoundType.BUTTON_CLICK);

    const correctAnswer = currentLetterProblem.correctAnswer;

    setGameState(prev => ({ ...prev, attemptCount: prev.attemptCount + 1 }));

    if (selectedAnswer === correctAnswer) {
      // Correct answer!
      await soundManager.playSound(SoundType.CORRECT_ANSWER);

      setGameState(prev => ({
        ...prev,
        score: prev.score + 1,
        totalProblems: prev.totalProblems + 1
      }));

      setFeedback(gameSettings.language === 'en' ?
        '🎉 Amazing! Perfect match!' :
        '🎉 מדהים! התאמה מושלמת!'
      );
      setFeedbackType('success');
      setShowNextButton(true);

    } else {
      // Wrong answer
      if (gameState.attemptCount === 0) {
        // First attempt - encouraging feedback
        await soundManager.playSound(SoundType.TRY_AGAIN);

        setFeedback(gameSettings.language === 'en' ?
          `🤔 Not quite right. Try again! (You chose ${selectedAnswer})` :
          `🤔 לא בדיוק נכון. נסה שוב! (בחרת ${selectedAnswer})`
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
          `💡 The correct answer is ${correctAnswer}. You chose ${selectedAnswer}. Keep practicing!` :
          `💡 התשובה הנכונה היא ${correctAnswer}. בחרת ${selectedAnswer}. המשך להתאמן!`
        );
        setFeedbackType('error');
        setShowNextButton(true);
      }
    }
  };

  const handleOptionClick = async (option: string) => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    setSelectedAnswer(option);

    // Play letter sound ONLY for case conversion tests (upper/lowercase) in answer boxes
    // NOT for sound identification tests
    if (currentLetterProblem && (currentLetterProblem.type === 'uppercase' || currentLetterProblem.type === 'lowercase')) {
      soundManager.playLetterSound(option);
      console.log(`🔊 Playing answer letter sound: ${option}`);
    }
    // For 'sound' type, do NOT play sound when clicking answer boxes
  };

  const handleNextProblem = async () => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    await generateNewProblem();
  };

  const handleBackClick = async () => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    if (testMode !== null) {
      // Go back to mode selection
      setTestMode(null);
      setCurrentLetterProblem(null);
      setGameState({
        score: 0,
        totalProblems: 0,
        currentProblem: null,
        attemptCount: 0,
        isGameActive: true
      });
    } else {
      // Go back to main menu
      onBack();
    }
  };

  const handleSoundToggle = async () => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    onToggleSound();
  };

  const renderProblem = () => {
    if (!currentLetterProblem) return null;

    const questionText = currentLetterProblem.type === 'uppercase' ?
      (gameSettings.language === 'en' ?
        `Find the UPPERCASE letter for: (Click answer boxes to hear sounds)` :
        `מצא את האות הגדולה עבור: (לחץ על תיבות התשובה כדי לשמוע צלילים)`) :
      currentLetterProblem.type === 'lowercase' ?
      (gameSettings.language === 'en' ?
        `Find the lowercase letter for: (Click answer boxes to hear sounds)` :
        `מצא את האות הקטנה עבור: (לחץ על תיבות התשובה כדי לשמוע צלילים)`) :
      (gameSettings.language === 'en' ?
        `Listen to the sound and pick the correct letter: (Click 🔊 to hear the sound)` :
        `הקשב לצליל ובחר את האות הנכונה: (לחץ על 🔊 כדי לשמוע את הצליל)`);

    return (
      <div className="problem-container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#2c3e50',
          marginBottom: '1rem'
        }}>
          {questionText}
        </div>

        {currentLetterProblem.type !== 'sound' ? (
          // Uppercase/Lowercase test: Show letter, NO sound on click, NO sound on page load
          <div className="letter-question-display" style={{
            fontSize: '4rem',
            fontWeight: '800',
            color: '#2c3e50',
            marginBottom: '2rem',
            fontFamily: 'Nunito, sans-serif',
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            borderRadius: '20px',
            padding: '1rem',
            border: '3px solid rgba(255, 255, 255, 0.8)',
            display: 'inline-block',
            minWidth: '100px',
            minHeight: '100px',
            cursor: 'default',
            userSelect: 'none'
          }}>
            {currentLetterProblem.letter}
          </div>
        ) : (
          // Sound test: Show sound button (NO letter), play sound on click, NO sound on page load
          <div
            className="letter-question-display sound-button"
            onClick={() => soundManager.playLetterSound(currentLetterProblem.letter)}
            style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: '#2c3e50',
              marginBottom: '2rem',
              fontFamily: 'Nunito, sans-serif',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              padding: '2rem',
              border: '3px solid rgba(255, 255, 255, 0.8)',
              display: 'inline-block',
              minWidth: '120px',
              minHeight: '120px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              userSelect: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            🔊
          </div>
        )}
      </div>
    );
  };

  const renderOptions = () => {
    if (!currentLetterProblem) return null;

    return (
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          {currentLetterProblem.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`letter-option-button ${selectedAnswer === option ? 'selected' : ''}`}
              style={{
                background: selectedAnswer === option ?
                  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' :
                  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                border: selectedAnswer === option ?
                  '4px solid #ff6b6b' :
                  '3px solid rgba(255, 255, 255, 0.8)',
                transform: selectedAnswer === option ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
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
          🔙 {testMode === null ? 
            (gameSettings.language === 'en' ? 'Back to Menu' : 'חזור לתפריט') :
            (gameSettings.language === 'en' ? 'Back to Test Modes' : 'חזור למצבי בדיקה')
          }
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
          🔤 {gameSettings.language === 'en' ? 'English Letters' : 'אותיות באנגלית'}
        </h1>

        {/* Score - Only show when in a test mode */}
        {testMode !== null && (
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
        )}

        {/* Mode Selection Screen */}
        {testMode === null ? (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#2c3e50',
              marginBottom: '2rem'
            }}>
              {gameSettings.language === 'en' ? 'Choose a Test Mode' : 'בחר מצב בדיקה'}
            </h2>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              {/* Case Matching Mode */}
              <button
                onClick={async () => {
                  await soundManager.playSound(SoundType.BUTTON_CLICK);
                  setTestMode('case');
                }}
                className="menu-button"
                style={{
                  width: '100%',
                  height: '100px',
                  fontSize: '1.25rem',
                  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <div style={{ fontSize: '2rem' }}>🔤</div>
                <div style={{ fontWeight: '700' }}>
                  {gameSettings.language === 'en' ? 'Find Upper/Lower Case' : 'מצא אות גדולה/קטנה'}
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  {gameSettings.language === 'en' ? 
                    'Sound in answer boxes, not main letter' : 
                    'צליל בתיבות התשובה, לא באות הראשית'}
                </div>
              </button>

              {/* Sound Identification Mode */}
              <button
                onClick={async () => {
                  await soundManager.playSound(SoundType.BUTTON_CLICK);
                  setTestMode('sound');
                }}
                className="menu-button"
                style={{
                  width: '100%',
                  height: '100px',
                  fontSize: '1.25rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <div style={{ fontSize: '2rem' }}>🔊</div>
                <div style={{ fontWeight: '700' }}>
                  {gameSettings.language === 'en' ? 'Find the Right Letter' : 'מצא את האות הנכונה'}
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  {gameSettings.language === 'en' ? 
                    'Sound on question box, not in answers' : 
                    'צליל בתיבת השאלה, לא בתשובות'}
                </div>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Problem */}
            {renderProblem()}

            {/* Options */}
            {renderOptions()}
          </>
        )}

        {/* Feedback - Only show when in a test mode */}
        {testMode !== null && feedback && (
          <div className={`feedback-${feedbackType}`} style={{
            marginBottom: '2rem',
            animation: 'celebrate 0.6s ease-out'
          }}>
            {feedback}
          </div>
        )}

        {/* Action Buttons - Only show when in a test mode */}
        {testMode !== null && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem'
          }}>
            {!showNextButton ? (
              <button
                onClick={checkAnswer}
                className="submit-button"
                disabled={!selectedAnswer}
                style={{
                  fontSize: '1.25rem',
                  padding: '15px 30px',
                  opacity: selectedAnswer ? 1 : 0.5
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
                → {gameSettings.language === 'en' ? 'Next Letter' : 'אות הבאה'}
              </button>
            )}
          </div>
        )}

        {/* Game Info */}
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
              '🎯 Match uppercase and lowercase letters!' :
              '🎯 התאם אותיות גדולות וקטנות!'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnglishLetterGame;