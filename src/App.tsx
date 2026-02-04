// Main App Component - Disney/Astro Bot Math Learning App

import { useState, useEffect } from 'react';
import './styles/disney-ui.css';

// Import components
import GradeSelection from './components/GradeSelection';
import MainMenu from './components/MainMenu';
import AdditionGame from './games/AdditionGame';
import SubtractionGame from './games/SubtractionGame';
import MultiplicationGame from './games/MultiplicationGame';
import DivisionGame from './games/DivisionGame';
import EnglishLetterGame from './games/EnglishLetterGame';

// Import utilities
import SoundManager from './utils/soundManager';
import type {GameSettings} from './types/index';

type AppScreen = 'grade-selection' | 'main-menu' | 'addition' | 'subtraction' | 'multiplication' | 'division' | 'english-letters';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('grade-selection');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    soundEnabled: true,
    grade: 1,
    language: 'en'
  });

  // Initialize sound manager
  useEffect(() => {
    const soundManager = SoundManager.getInstance();
    soundManager.setSoundEnabled(gameSettings.soundEnabled);
  }, [gameSettings.soundEnabled]);

  const handleGradeSelection = (grade: 1 | 3) => {
    setGameSettings(prev => ({ ...prev, grade }));
    setCurrentScreen('main-menu');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('main-menu');
  };

  const handleBackToGradeSelection = () => {
    setCurrentScreen('grade-selection');
  };

  const handleEnglishLettersSelection = () => {
    setCurrentScreen('english-letters');
  };

  const toggleSound = () => {
    const newSoundState = !gameSettings.soundEnabled;
    setGameSettings(prev => ({ ...prev, soundEnabled: newSoundState }));

    const soundManager = SoundManager.getInstance();
    soundManager.setSoundEnabled(newSoundState);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'grade-selection':
        return (
          <GradeSelection
            onGradeSelect={handleGradeSelection}
            onEnglishLettersSelect={handleEnglishLettersSelection}
            gameSettings={gameSettings}
            setGameSettings={setGameSettings}
          />
        );

      case 'main-menu':
        return (
          <MainMenu
            gameSettings={gameSettings}
            onGameSelect={setCurrentScreen}
            onBackToGradeSelection={handleBackToGradeSelection}
            onToggleSound={toggleSound}
          />
        );

      case 'addition':
        return (
          <AdditionGame
            gameSettings={gameSettings}
            onBack={handleBackToMenu}
            onToggleSound={toggleSound}
          />
        );

      case 'subtraction':
        return (
          <SubtractionGame
            gameSettings={gameSettings}
            onBack={handleBackToMenu}
            onToggleSound={toggleSound}
          />
        );

      case 'multiplication':
        return (
          <MultiplicationGame
            gameSettings={gameSettings}
            onBack={handleBackToMenu}
            onToggleSound={toggleSound}
          />
        );

      case 'division':
        return (
          <DivisionGame
            gameSettings={gameSettings}
            onBack={handleBackToMenu}
            onToggleSound={toggleSound}
          />
        );

      case 'english-letters':
        return (
          <EnglishLetterGame
            gameSettings={gameSettings}
            onBack={handleBackToGradeSelection}
            onToggleSound={toggleSound}
          />
        );

      default:
        return <div>Screen not found</div>;
    }
  };

  return (
    <div className="App">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;
