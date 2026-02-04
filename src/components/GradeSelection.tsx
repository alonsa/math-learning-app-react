// Grade Selection Component - Disney/Astro Bot Style

import React from 'react';
import type { GameSettings } from '../types/index';
import SoundManager, { SoundType } from '../utils/soundManager';

interface GradeSelectionProps {
  onGradeSelect: (grade: 1 | 3) => void;
  onEnglishLettersSelect: () => void;
  gameSettings: GameSettings;
  setGameSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
}

const GradeSelection: React.FC<GradeSelectionProps> = ({
  onGradeSelect,
  onEnglishLettersSelect,
  gameSettings,
  setGameSettings
}) => {
  const soundManager = SoundManager.getInstance();

  const handleGradeClick = async (grade: 1 | 3) => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    onGradeSelect(grade);
  };

  const handleLanguageChange = async (language: 'en' | 'he') => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    setGameSettings(prev => ({ ...prev, language }));
  };

  const handleEnglishLettersClick = async () => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    onEnglishLettersSelect();
  };

  return (
    <div className="main-background" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      {/* Language Selection */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.5rem'
      }}>
        <span style={{
          color: 'white',
          fontSize: '1rem',
          fontWeight: '600'
        }}>
          Language:
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => handleLanguageChange('en')}
            className={`language-button ${gameSettings.language === 'en' ? 'active' : ''}`}
            style={{
              background: gameSettings.language === 'en' ?
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >
            🇺🇸 English
          </button>
          <button
            onClick={() => handleLanguageChange('he')}
            className={`language-button ${gameSettings.language === 'he' ? 'active' : ''}`}
            style={{
              background: gameSettings.language === 'he' ?
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >
            🇮🇱 עברית
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        {/* Title */}
        <h1 className="welcome-title" style={{ marginBottom: '2rem' }}>
          {gameSettings.language === 'en' ?
            'Choose Your Learning Path' :
            'בחר את מסלול הלמידה שלך'
          }
        </h1>

        {/* Grade Selection Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          alignItems: 'center'
        }}>
          {/* Grade 1 Button */}
          <button
            onClick={() => handleGradeClick(1)}
            className="menu-button addition-button"
            style={{
              width: '400px',
              height: '80px',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {gameSettings.language === 'en' ?
              '🎯 Grade 1 - Basic Math' :
              'כיתה א - מתמטיקה בסיסית 🎯'
            }
          </button>

          {/* Grade 3 Button */}
          <button
            onClick={() => handleGradeClick(3)}
            className="menu-button word-problems-button"
            style={{
              width: '400px',
              height: '80px',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {gameSettings.language === 'en' ?
              '🚀 Grade 3 - Advanced Math' :
              'כיתה ג - מתמטיקה מתקדמת 🚀'
            }
          </button>

          {/* English Letters Button */}
          <button
            onClick={handleEnglishLettersClick}
            className="menu-button subtraction-button"
            style={{
              width: '400px',
              height: '80px',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {gameSettings.language === 'en' ?
              '🔤 English Letters Learning' :
              'אותיות באנגלית - למידה 🔤'
            }
          </button>
        </div>

        {/* Bottom Message */}
        <div style={{ marginTop: '3rem' }}>
          <p className="subtitle">
            {gameSettings.language === 'en' ?
              '🎓 Select your learning adventure to begin!' :
              '🎓 בחר את הרפתקאת הלמידה שלך כדי להתחיל!'
            }
          </p>
        </div>
      </div>

      {/* Disney Magic Footer */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center'
      }}>
        <p style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.875rem',
          margin: 0
        }}>
          ✨ Disney/Astro Bot Style Math Adventure ✨
        </p>
      </div>
    </div>
  );
};

export default GradeSelection;