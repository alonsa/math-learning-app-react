// Arcade (Space Runner) – 4 lanes, grade-based math, move to correct answer
// Grade 1: addition & subtraction. Grade 3: multiplication & division.
// PRD 3.4: keyboard Left/Right or A/D; mobile: on-screen ← → buttons; 2.5D track; subtle shake on wrong.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { GameSettings } from '../types/index';
import type { MathProblem } from '../types/index';
import { ProblemGenerator } from '../utils/problemGenerator';
import SoundManager, { SoundType } from '../utils/soundManager';
import GameHeaderControls from '../components/GameHeaderControls';

const LANES = 4;
const MAX_STRIKES = 5;
const FALL_DURATION_BASE_MS = 3500;
const FALL_DURATION_MIN_MS = 1800;
const SPEED_INCREASE_PER_SCORE = 40;

function getWrongOptions(correct: number, grade: 1 | 3): number[] {
  const wrong: number[] = [];
  const used = new Set([correct]);
  while (wrong.length < 3) {
    const offset = Math.floor(Math.random() * 5) - 2; // -2 to +2
    let candidate = correct + offset;
    if (grade === 1) candidate = Math.max(0, Math.min(18, candidate));
    else candidate = Math.max(1, Math.min(81, candidate));
    if (!used.has(candidate)) {
      used.add(candidate);
      wrong.push(candidate);
    }
  }
  return wrong;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

interface ArcadeGameProps {
  gameSettings: GameSettings;
  onBack: () => void;
  onToggleSound: () => void;
  onLanguageChange?: (language: 'en' | 'he') => void;
}

const ArcadeGame: React.FC<ArcadeGameProps> = ({
  gameSettings,
  onBack,
  onToggleSound,
  onLanguageChange
}) => {
  const soundManager = SoundManager.getInstance();
  const [playerLane, setPlayerLane] = useState(2); // center of 4 lanes (0-3)
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0); // 0–5, game over at 5
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [optionsByLane, setOptionsByLane] = useState<number[]>([0, 0, 0, 0]);
  const [correctLane, setCorrectLane] = useState(0);
  const [fallProgress, setFallProgress] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [gameActive, setGameActive] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const fallStartRef = useRef<number>(0);
  const fallDurationRef = useRef(FALL_DURATION_BASE_MS);
  const rafRef = useRef<number>(0);
  const strikesRef = useRef(0);

  const generateProblem = useCallback((): MathProblem => {
    const grade = gameSettings.grade;
    if (grade === 1) {
      return Math.random() < 0.5
        ? ProblemGenerator.generateAdditionProblem(1)
        : ProblemGenerator.generateSubtractionProblem(1);
    }
    return Math.random() < 0.5
      ? ProblemGenerator.generateMultiplicationProblem(3)
      : ProblemGenerator.generateDivisionProblem(3);
  }, [gameSettings.grade]);

  const startNextProblem = useCallback(() => {
    const p = generateProblem();
    setProblem(p);
    const wrong = getWrongOptions(p.correctAnswer, gameSettings.grade);
    const options = shuffle([p.correctAnswer, wrong[0], wrong[1], wrong[2]]);
    setOptionsByLane(options);
    setCorrectLane(options.indexOf(p.correctAnswer));
    setFallProgress(0);
    fallStartRef.current = performance.now();
    const duration = Math.max(
      FALL_DURATION_MIN_MS,
      FALL_DURATION_BASE_MS - score * SPEED_INCREASE_PER_SCORE
    );
    fallDurationRef.current = duration;
  }, [generateProblem, gameSettings.grade, score]);

  // Initial problem and fall animation
  useEffect(() => {
    if (!gameActive) return;
    startNextProblem();
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive || problem === null) return;

    const tick = (now: number) => {
      const elapsed = now - fallStartRef.current;
      const progress = Math.min(1, elapsed / fallDurationRef.current);
      setFallProgress(progress);

      if (progress >= 1) {
        const isCorrect = playerLane === correctLane;
        if (isCorrect) {
          soundManager.playSound(SoundType.CORRECT_ANSWER);
          setScore((s) => s + 1);
          startNextProblem();
        } else {
          soundManager.playSound(SoundType.WRONG_ANSWER);
          setShaking(true);
          setTimeout(() => setShaking(false), 250);
          const nextStrikes = strikesRef.current + 1;
          strikesRef.current = nextStrikes;
          setStrikes(nextStrikes);
          if (nextStrikes >= MAX_STRIKES) {
            setGameActive(false);
            setGameOver(true);
          } else {
            startNextProblem();
          }
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameActive, problem, correctLane, playerLane, startNextProblem]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!gameActive) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setPlayerLane((l) => Math.max(0, l - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setPlayerLane((l) => Math.min(LANES - 1, l + 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameActive]);

  const touchStartX = useRef(0);
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!gameActive) return;
      const endX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - endX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) setPlayerLane((l) => Math.min(LANES - 1, l + 1));
        else setPlayerLane((l) => Math.max(0, l - 1));
      }
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [gameActive]);

  const moveLeft = () => setPlayerLane((l) => Math.max(0, l - 1));
  const moveRight = () => setPlayerLane((l) => Math.min(LANES - 1, l + 1));

  const opSymbol: Record<string, string> = {
    addition: '+',
    subtraction: '−',
    multiplication: '×',
    division: '÷'
  };

  const resetGame = () => {
    setScore(0);
    setStrikes(0);
    strikesRef.current = 0;
    setGameOver(false);
    setGameActive(true);
    setPlayerLane(2); // center of 4 lanes
  };

  if (gameOver) {
    return (
      <div className="main-background" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(102, 126, 234, 0.4)', zIndex: 0 }} />
        <GameHeaderControls gameSettings={gameSettings} backLabel={gameSettings.language === 'en' ? 'Back' : 'חזור'} onBack={onBack} onToggleSound={onToggleSound} onLanguageChange={onLanguageChange} showLanguage />
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="problem-container" style={{ marginBottom: '1.5rem' }}>
            <div className="vertical-math-problem" style={{ marginBottom: 0 }}>
              {gameSettings.language === 'en' ? 'Game Over!' : 'המשחק נגמר!'}
            </div>
          </div>
          <div className="score-display" style={{ marginBottom: '1.5rem' }}>
            {gameSettings.language === 'en' ? 'Final Score:' : 'ניקוד סופי:'} {score}
          </div>
          <button type="button" className="glass-header-btn" onClick={resetGame} style={{ padding: '1rem 2rem', fontSize: '1.25rem' }}>
            {gameSettings.language === 'en' ? 'Play Again' : 'שחק שוב'}
          </button>
        </div>
      </div>
    );
  }

  if (!gameActive || !problem) {
    return (
      <div className="main-background" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(102, 126, 234, 0.4)', zIndex: 0 }} />
        <GameHeaderControls gameSettings={gameSettings} backLabel={gameSettings.language === 'en' ? 'Back' : 'חזור'} onBack={onBack} onToggleSound={onToggleSound} onLanguageChange={onLanguageChange} showLanguage />
      </div>
    );
  }

  return (
    <div className="main-background" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      backgroundImage: 'url(/assets/rocket/rocket_b.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(102, 126, 234, 0.4)', zIndex: 0 }} />

      <GameHeaderControls
        gameSettings={gameSettings}
        backLabel={gameSettings.language === 'en' ? 'Back' : 'חזור'}
        onBack={onBack}
        onToggleSound={onToggleSound}
        onLanguageChange={onLanguageChange}
        showLanguage
      />

      <div style={{
        position: 'relative',
        zIndex: 1,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '5rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {/* Row: Score + Strikes – no overlap */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '0.75rem',
          flexShrink: 0
        }}>
          <div className="score-display" style={{ margin: 0, flex: 1, maxWidth: '140px' }}>
            {gameSettings.language === 'en' ? 'Score:' : 'ניקוד:'} {score}
          </div>
          <div className="score-display" style={{ margin: 0, flex: 1, maxWidth: '160px' }}>
            {gameSettings.language === 'en' ? 'Lives:' : 'פסילות:'} {MAX_STRIKES - strikes}/{MAX_STRIKES}
          </div>
        </div>

        {/* Problem – fixed height row */}
        <div className={`problem-container ${shaking ? 'arcade-shake' : ''}`} style={{ marginBottom: '0.75rem', flexShrink: 0 }}>
          <div className="vertical-math-problem" style={{ marginBottom: 0 }}>
            {problem.firstNumber} {opSymbol[problem.operation]} {problem.secondNumber} = ?
          </div>
        </div>

        {/* 2.5D track – takes remaining space, doesn't overlap */}
        <div style={{
          perspective: '400px',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            flex: 1,
            minHeight: '200px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: 'rotateX(8deg)',
            overflow: 'hidden',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(80,60,120,0.25) 100%)'
          }}>
            {/* 4 lanes */}
            <div style={{ display: 'flex', height: '100%', position: 'relative' }}>
              {[0, 1, 2, 3].map((lane) => (
                <div
                  key={lane}
                  style={{
                    flex: 1,
                    borderLeft: lane > 0 ? '1px solid rgba(255,255,255,0.2)' : undefined,
                    position: 'relative'
                  }}
                />
              ))}
            </div>

            {/* Falling row */}
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${fallProgress * 100}%`,
              transform: 'translateY(-50%)',
              display: 'flex',
              height: '80px',
              transition: 'none',
              pointerEvents: 'none'
            }}>
              {[0, 1, 2, 3].map((lane) => (
                <div key={lane} style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem'
                }}>
                  <div className="score-display" style={{
                    margin: 0,
                    padding: '0.5rem 0.75rem',
                    fontSize: '1.35rem',
                    minWidth: '50px'
                  }}>
                    {optionsByLane[lane]}
                  </div>
                </div>
              ))}
            </div>

            {/* Player character at bottom */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: 0,
              padding: '0 5%'
            }}>
              {[0, 1, 2, 3].map((lane) => (
                <div key={lane} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  {playerLane === lane ? (
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)',
                      border: '3px solid rgba(255,255,255,0.8)',
                      boxShadow: '0 4px 20px rgba(102,126,234,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      🚀
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: lane buttons – fixed at bottom, no overlap */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginTop: '0.75rem',
          paddingBottom: '1.5rem',
          flexShrink: 0
        }}>
          <button
            type="button"
            className="glass-header-btn"
            onClick={moveLeft}
            style={{ padding: '1rem 2rem', fontSize: '1.5rem' }}
          >
            ←
          </button>
          <button
            type="button"
            className="glass-header-btn"
            onClick={moveRight}
            style={{ padding: '1rem 2rem', fontSize: '1.5rem' }}
          >
            →
          </button>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', textAlign: 'center', marginTop: '-0.5rem' }}>
          {gameSettings.language === 'en' ? 'Arrow keys or A / D' : 'חצים או A / D'}
        </p>
      </div>
    </div>
  );
};

export default ArcadeGame;
