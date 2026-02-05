// Progress Map Screen - Shows the learning journey map

import React from 'react';
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

  const handleBackClick = async () => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    onBack();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000'
    }}>
      {/* Map container: preserves 1024×944 aspect ratio so stations stay on path at any resolution */}
      <div
        style={{
          position: 'relative',
          width: 'min(100vw, calc(100vh * (1024 / 944)))',
          height: 'min(100vh, calc(100vw * (944 / 1024)))',
          backgroundImage: 'url(/assets/journey/map-background.png)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center'
        }}
      >
        <button
          onClick={handleBackClick}
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: '1.5rem',
            zIndex: 20,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            padding: '10px 16px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🔙</span>
          <span style={{ fontWeight: '600' }}>{gameSettings.language === 'en' ? 'Back' : 'חזור'}</span>
        </button>

        <h1 className="game-title" style={{
          position: 'absolute',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          margin: 0,
          zIndex: 10,
          textShadow: '0 2px 8px rgba(0,0,0,0.5)'
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
          fontSize: '0.9rem',
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
        />
      </div>
    </div>
  );
};

export default ProgressMapScreen;
