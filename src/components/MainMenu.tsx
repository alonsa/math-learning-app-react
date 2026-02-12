// Main Menu Component - Disney/Astro Bot Style

import React from 'react';
import type { GameSettings } from '../types/index';
import SoundManager, { SoundType } from '../utils/soundManager';
import GameHeaderControls from './GameHeaderControls';

type AppScreen = 'grade-selection' | 'main-menu' | 'addition' | 'subtraction' | 'multiplication' | 'division' | 'arcade';

interface MainMenuProps {
  gameSettings: GameSettings;
  onGameSelect: (screen: AppScreen) => void;
  onBackToGradeSelection: () => void;
  onToggleSound: () => void;
  onLanguageChange?: (language: 'en' | 'he') => void;
  onProgressMap?: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({
  gameSettings,
  onGameSelect,
  onBackToGradeSelection,
  onToggleSound,
  onLanguageChange,
  onProgressMap
}) => {
  const soundManager = SoundManager.getInstance();

  const handleGameClick = async (screen: AppScreen) => {
    await soundManager.playSound(SoundType.BUTTON_CLICK);
    onGameSelect(screen);
  };

  return (
    <div className="main-background" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
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
        {/* Header Controls - same glass style as exercise pages */}
        <GameHeaderControls
          gameSettings={gameSettings}
          backLabel={gameSettings.language === 'en' ? 'Change Grade' : 'החלף כיתה'}
          onBack={onBackToGradeSelection}
          onToggleSound={onToggleSound}
          onLanguageChange={onLanguageChange}
          showLanguage={true}
        />

        {/* Main Content - scrollable so Grade 3 options (Multiplication, Division) are always reachable */}
        <div style={{
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
          paddingTop: '5rem',
          paddingBottom: '2rem',
          maxHeight: 'calc(100vh - 2rem)',
          overflowY: 'auto'
        }}>
          {/* Title */}
          <h1 className="welcome-title" style={{ marginBottom: '1rem' }}>
            {gameSettings.language === 'en' ?
              '🌟 Math Adventure!' :
              '🌟 הרפתקת המתמטיקה!'
            }
          </h1>

          {/* Grade Display */}
          <p className="subtitle" style={{ marginBottom: '3rem' }}>
            {gameSettings.language === 'en' ?
              `Grade ${gameSettings.grade} - Choose your adventure!` :
              `כיתה ${gameSettings.grade === 1 ? 'א' : 'ג'} - בחר את ההרפתקה שלך!`
            }
          </p>

          {/* Game Selection Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
          {/* Addition Game */}
          <button
            onClick={() => handleGameClick('addition')}
            className="menu-button addition-button"
            style={{
              width: '350px',
              height: '70px',
              fontSize: '1.25rem'
            }}
          >
            ➕ {gameSettings.language === 'en' ? 'Addition' : 'חיבור'}
          </button>

          {/* Subtraction Game */}
          <button
            onClick={() => handleGameClick('subtraction')}
            className="menu-button subtraction-button"
            style={{
              width: '350px',
              height: '70px',
              fontSize: '1.25rem'
            }}
          >
            ➖ {gameSettings.language === 'en' ? 'Subtraction' : 'חיסור'}
          </button>

          {/* Multiplication Game - Grade 3 only */}
          {gameSettings.grade === 3 && (
            <button
              onClick={() => handleGameClick('multiplication')}
              className="menu-button multiplication-button"
              style={{
                width: '350px',
                height: '70px',
                fontSize: '1.25rem'
              }}
            >
              ✖️ {gameSettings.language === 'en' ? 'Multiplication' : 'כפל'}
            </button>
          )}

          {/* Division Game - Grade 3 only */}
          {gameSettings.grade === 3 && (
            <button
              onClick={() => handleGameClick('division')}
              className="menu-button division-button"
              style={{
                width: '350px',
                height: '70px',
                fontSize: '1.25rem'
              }}
            >
              ➗ {gameSettings.language === 'en' ? 'Division' : 'חלוקה'}
            </button>
          )}

          {/* Progress Map Button */}
          {onProgressMap && (
            <button
              onClick={async () => {
                await soundManager.playSound(SoundType.BUTTON_CLICK);
                onProgressMap();
              }}
              className="menu-button"
              style={{
                width: '350px',
                height: '70px',
                fontSize: '1.25rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                marginTop: '1rem'
              }}
            >
              🗺️ {gameSettings.language === 'en' ? 'Start My Journey' : 'המסע שלי'}
            </button>
          )}

          {/* Arcade (Space Runner) */}
          <button
            onClick={() => handleGameClick('arcade')}
            className="menu-button division-button"
            style={{
              width: '350px',
              height: '70px',
              fontSize: '1.25rem',
              marginTop: '1rem'
            }}
          >
            🎮 {gameSettings.language === 'en' ? 'Arcade' : 'ארקדה'} (Space Runner)
          </button>

          {/* Coming Soon - More Games */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            border: '2px dashed rgba(255, 255, 255, 0.3)'
          }}>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              ✨ {gameSettings.language === 'en' ?
                'More amazing games coming soon!' :
                'עוד משחקים מדהימים בקרוב!'
              } ✨
            </p>
          </div>

          {/* Grade-specific Info */}
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
              {gameSettings.grade === 1 ? (
                gameSettings.language === 'en' ?
                  '🎯 Perfect for beginners - Simple single-digit problems!' :
                  '🎯 מושלם למתחילים - בעיות פשוטות עם ספרה אחת!'
              ) : (
                gameSettings.language === 'en' ?
                  '🚀 Advanced level - Multi-digit problems with step-by-step input!' :
                  '🚀 רמה מתקדמת - בעיות רב ספרתיות עם הקלדה שלב אחר שלב!'
              )}
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;