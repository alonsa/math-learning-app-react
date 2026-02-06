// Progress Map Screen - Shows the learning journey map

import React, { useState, useEffect } from 'react';
import type { ProgressState, GameSettings } from '../types/index';
import ProgressMap from './ProgressMap';
import SoundManager, { SoundType } from '../utils/soundManager';

interface ProgressMapScreenProps {
  progress: ProgressState;
  gameSettings: GameSettings;
  onBack: () => void;
  onTopicSelect: (topicId: string) => void;
}

const ProgressMapScreen: React.FC<ProgressMapScreenProps> = ({
  progress,
  gameSettings,
  onBack,
  onTopicSelect
}) => {
  const soundManager = SoundManager.getInstance();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBackClick = async () => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    onBack();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100dvh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0b0e14'
    }}>
      <div
        style={{
          position: 'relative',
          width: isMobile ? '100vw' : 'min(100vw, calc(100vh * (1024 / 944)))',
          height: isMobile ? '100dvh' : 'min(100vh, calc(100vw * (944 / 1024)))',
          backgroundImage: 'url(/assets/journey/map-background.png)',
          backgroundSize: isMobile ? 'cover' : '100% 100%',
          backgroundPosition: 'center'
        }}
      >
        <button
          onClick={handleBackClick}
          style={{
            position: 'absolute',
            top: isMobile ? '1rem' : '1.5rem',
            left: isMobile ? '1rem' : '1.5rem',
            zIndex: 30,
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50px',
            padding: isMobile ? '8px 16px' : '10px 16px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🔙</span>
          <span>{gameSettings.language === 'en' ? 'Back' : 'חזור'}</span>
        </button>

        <h1 className="game-title" style={{
          position: 'absolute',
          top: isMobile ? '1rem' : '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          margin: 0,
          zIndex: 10,
          width: '100%',
          textAlign: 'center',
          fontSize: isMobile ? '1.2rem' : '2rem',
          color: 'white',
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          pointerEvents: 'none'
        }}>
          🗺️ {gameSettings.language === 'en' ? 'My Adventure Journey' : 'מסע ההרפתקה שלי'}
        </h1>

        <p style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          margin: 0,
          zIndex: 10,
          fontSize: isMobile ? '0.8rem' : '0.9rem',
          color: 'rgba(255,255,255,0.95)',
          textShadow: '0 1px 4px rgba(0,0,0,0.6)'
        }}>
          {gameSettings.language === 'en' ?
            'Tap a station to play! Complete 5 questions to advance.' :
            'גע בתחנה כדי לשחק! השלם 5 שאלות כדי להתקדם.'
          }
        </p>

        <ProgressMap
          progress={progress}
          gameSettings={gameSettings}
          onTopicSelect={onTopicSelect}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default ProgressMapScreen;
