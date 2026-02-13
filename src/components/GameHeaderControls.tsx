// Shared header: Back (left) | Language EN/HE + Sound (right) – same glass style everywhere

import React from 'react';
import type { GameSettings } from '../types/index';
import SoundManager, { SoundType } from '../utils/soundManager';

interface GameHeaderControlsProps {
  gameSettings: GameSettings;
  backLabel: string;
  onBack: () => void;
  onToggleSound: () => void;
  onLanguageChange?: (language: 'en' | 'he') => void;
  showLanguage?: boolean;
}

const GameHeaderControls: React.FC<GameHeaderControlsProps> = ({
  gameSettings,
  backLabel,
  onBack,
  onToggleSound,
  onLanguageChange,
  showLanguage = true
}) => {
  const soundManager = SoundManager.getInstance();

  const handleBack = async () => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    onBack();
  };

  const handleSound = async () => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    onToggleSound();
  };

  const handleLanguage = async (lang: 'en' | 'he') => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    onLanguageChange?.(lang);
  };

  return (
    <div className="game-header-controls" style={{
      position: 'absolute',
      top: '1.5rem',
      left: '1.5rem',
      right: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '0.5rem',
      zIndex: 20,
      minWidth: 0,
      maxWidth: '100%'
    }}>
      <button type="button" onClick={handleBack} className="glass-header-btn" style={{ flexShrink: 0 }}>
        <span style={{ fontSize: '1.2rem' }}>🔙</span>
        <span>{backLabel}</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flexShrink: 1 }}>
        {showLanguage && onLanguageChange && (
          <>
            <button
              type="button"
              onClick={() => handleLanguage('en')}
              className={`glass-header-btn ${gameSettings.language === 'en' ? 'glass-header-btn--active' : ''}`}
              style={{ padding: '10px 16px', fontSize: '0.95rem' }}
            >
              🇺🇸 EN
            </button>
            <button
              type="button"
              onClick={() => handleLanguage('he')}
              className={`glass-header-btn ${gameSettings.language === 'he' ? 'glass-header-btn--active' : ''}`}
              style={{ padding: '10px 16px', fontSize: '0.95rem' }}
            >
              🇮🇱 עברית
            </button>
          </>
        )}
        <button
          type="button"
          onClick={handleSound}
          className="glass-header-btn glass-header-sound"
          style={{ opacity: gameSettings.soundEnabled ? 1 : 0.85 }}
        >
          <span className="glass-header-sound-icon">{gameSettings.soundEnabled ? '🔊' : '🔇'}</span>
          <span className="glass-header-sound-label">{gameSettings.soundEnabled ? 'Sound ON' : 'Sound OFF'}</span>
        </button>
      </div>
    </div>
  );
};

export default GameHeaderControls;
