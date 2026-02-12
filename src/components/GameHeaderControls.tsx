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
      <button type="button" onClick={handleBack} className="glass-header-btn">
        <span style={{ fontSize: '1.2rem' }}>🔙</span>
        <span>{backLabel}</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
          className="glass-header-btn"
          style={{ opacity: gameSettings.soundEnabled ? 1 : 0.85 }}
        >
          {gameSettings.soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
        </button>
      </div>
    </div>
  );
};

export default GameHeaderControls;
