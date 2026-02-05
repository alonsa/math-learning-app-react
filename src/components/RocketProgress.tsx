// Rocket Progress Component - Shows rocket animation based on score
// Two options: SVG animation or JPEG image

import React, { useState, useEffect } from 'react';
import SoundManager, { SoundType } from '../utils/soundManager';

interface RocketProgressProps {
  score: number;
  maxScore?: number; // Optional max score for progress calculation
  useSVG?: boolean; // true = SVG animation, false = JPEG image
  style?: React.CSSProperties;
  onMilestone?: (milestone: number) => void; // Callback when reaching milestones
}

const RocketProgress: React.FC<RocketProgressProps> = ({
  score,
  maxScore = 100,
  useSVG = true,
  style,
  onMilestone
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [lastMilestone, setLastMilestone] = useState(0);
  const soundManager = SoundManager.getInstance();

  // Check for milestones (every 10 points)
  useEffect(() => {
    const currentMilestone = Math.floor(score / 10) * 10;
    if (currentMilestone > lastMilestone && currentMilestone > 0) {
      setLastMilestone(currentMilestone);
      if (onMilestone) {
        onMilestone(currentMilestone);
      }
      // Play celebration sound
      soundManager.playSound(SoundType.CELEBRATION).catch(() => {});
    }
  }, [score, lastMilestone, onMilestone, soundManager]);

  // Animate score counting up
  useEffect(() => {
    const duration = 500; // 500ms animation
    const steps = 20;
    const increment = (score - displayScore) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setDisplayScore(Math.min(score, Math.floor(displayScore + increment * currentStep)));
      } else {
        setDisplayScore(score);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  // Calculate rocket position (0-100% from bottom)
  const progress = Math.min(100, (displayScore / maxScore) * 100);
  const rocketPosition = progress; // Percentage from bottom

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '200px',
    height: '400px',
    margin: '0 auto',
    ...style
  };

  const rocketStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: `${rocketPosition}%`,
    left: '50%',
    transform: 'translateX(-50%)',
    transition: 'bottom 0.5s ease-out',
    zIndex: 10
  };

  if (useSVG) {
    // Option 1: SVG Animation
    return (
      <div style={containerStyle}>
        {/* Progress track/background */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '4px',
          height: '100%',
          background: 'linear-gradient(to top, #667eea 0%, #764ba2 50%, #ff9a9e 100%)',
          borderRadius: '2px',
          opacity: 0.3
        }} />
        
        {/* Rocket SVG */}
        <div style={rocketStyle}>
          <img 
            src="/assets/rocket/rocket.svg" 
            alt="Rocket" 
            style={{
              width: '200px',
              height: '400px',
              filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))'
            }}
          />
        </div>

        {/* Score display */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#2c3e50',
          textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)'
        }}>
          {displayScore}
        </div>
      </div>
    );
  } else {
    // Option 2: JPEG Image
    return (
      <div style={containerStyle}>
        {/* Progress track/background */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '4px',
          height: '100%',
          background: 'linear-gradient(to top, #667eea 0%, #764ba2 50%, #ff9a9e 100%)',
          borderRadius: '2px',
          opacity: 0.3
        }} />
        
        {/* Rocket JPEG */}
        <div style={rocketStyle}>
          <img 
            src="/assets/rocket/rocket_b.jpeg" 
            alt="Rocket" 
            style={{
              width: '200px',
              height: 'auto',
              maxHeight: '400px',
              filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.6))',
              animation: 'rocketFloat 3s ease-in-out infinite'
            }}
          />
        </div>

        {/* Score display */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#2c3e50',
          textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)'
        }}>
          {displayScore}
        </div>
      </div>
    );
  }
};

export default RocketProgress;
