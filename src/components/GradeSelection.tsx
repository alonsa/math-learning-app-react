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
    <div className="main-background app-screen" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundImage: 'url(/assets/rocket/rocket_b.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Overlay for better button visibility */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(102, 126, 234, 0.4)',
        zIndex: 0
      }} />
      
      {/* Content with higher z-index */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
      {/* Main Content */}
      <div className="app-screen-content" style={{
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        {/* Title */}
        <h1 className="welcome-title" style={{ marginBottom: '1.5rem' }}>
          {gameSettings.language === 'en' ?
            'Choose Your Learning Path' :
            'בחר את מסלול הלמידה שלך'
          }
        </h1>

        {/* Language Selection - same glass style as rest of app */}
        <div style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '2rem'
        }}>
          <span style={{
            color: 'white',
            fontSize: '1rem',
            fontWeight: '700',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            {gameSettings.language === 'en' ? 'Language:' : 'שפה:'}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`glass-header-btn ${gameSettings.language === 'en' ? 'glass-header-btn--active' : ''}`}
            >
              🇺🇸 EN
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('he')}
              className={`glass-header-btn ${gameSettings.language === 'he' ? 'glass-header-btn--active' : ''}`}
            >
              🇮🇱 עברית
            </button>
          </div>
        </div>

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
        textAlign: 'center',
        zIndex: 1
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
    </div>
  );
};

export default GradeSelection;