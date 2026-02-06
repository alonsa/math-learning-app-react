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
import ProgressMapScreen from './components/ProgressMapScreen';

// Import utilities
import SoundManager from './utils/soundManager';
import type {GameSettings, ProgressState} from './types/index';

type AppScreen = 'grade-selection' | 'main-menu' | 'addition' | 'subtraction' | 'multiplication' | 'division' | 'english-letters' | 'progress-map';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('grade-selection');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    soundEnabled: true,
    grade: 1,
    language: 'en'
  });
  
  // Progress tracking - 5 questions per topic
  const [progress, setProgress] = useState<ProgressState>({
    addition: 0,
    subtraction: 0,
    multiplication: 0,
    division: 0,
    englishLetters: 0
  });

  // When user entered a game from the progress map (journey mode), return to map on back/completion
  const [cameFromProgressMap, setCameFromProgressMap] = useState(false);
  // When opening English from map: which mode to start with (english_1 → case, english_2 → sound)
  const [englishInitialMode, setEnglishInitialMode] = useState<'case' | 'sound' | null>(null);

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
            onLanguageChange={(language) => setGameSettings(prev => ({ ...prev, language }))}
            onProgressMap={() => setCurrentScreen('progress-map')}
          />
        );

      case 'addition':
        return (
          <AdditionGame
            gameSettings={gameSettings}
            onBack={cameFromProgressMap ? () => setCurrentScreen('progress-map') : handleBackToMenu}
            onToggleSound={toggleSound}
            onProgressUpdate={(completed) => {
              setProgress(prev => ({ ...prev, addition: completed }));
              if (completed >= 5) {
                setTimeout(() => {
                  setCurrentScreen(cameFromProgressMap ? 'progress-map' : 'main-menu');
                }, 2000);
              }
            }}
          />
        );

      case 'subtraction':
        return (
          <SubtractionGame
            gameSettings={gameSettings}
            onBack={cameFromProgressMap ? () => setCurrentScreen('progress-map') : handleBackToMenu}
            onToggleSound={toggleSound}
            onProgressUpdate={(completed) => {
              setProgress(prev => ({ ...prev, subtraction: completed }));
              if (completed >= 5) {
                setTimeout(() => {
                  setCurrentScreen(cameFromProgressMap ? 'progress-map' : 'main-menu');
                }, 2000);
              }
            }}
          />
        );

      case 'multiplication':
        return (
          <MultiplicationGame
            gameSettings={gameSettings}
            onBack={cameFromProgressMap ? () => setCurrentScreen('progress-map') : handleBackToMenu}
            onToggleSound={toggleSound}
            onProgressUpdate={(completed) => {
              setProgress(prev => ({ ...prev, multiplication: completed }));
              if (completed >= 5) {
                setTimeout(() => {
                  setCurrentScreen(cameFromProgressMap ? 'progress-map' : 'main-menu');
                }, 2000);
              }
            }}
          />
        );

      case 'division':
        return (
          <DivisionGame
            gameSettings={gameSettings}
            onBack={cameFromProgressMap ? () => setCurrentScreen('progress-map') : handleBackToMenu}
            onToggleSound={toggleSound}
            onProgressUpdate={(completed) => {
              setProgress(prev => ({ ...prev, division: completed }));
              if (completed >= 5) {
                setTimeout(() => {
                  setCurrentScreen(cameFromProgressMap ? 'progress-map' : 'main-menu');
                }, 2000);
              }
            }}
          />
        );

      case 'english-letters':
        return (
          <EnglishLetterGame
            gameSettings={gameSettings}
            initialMode={englishInitialMode}
            onBack={() => {
              setEnglishInitialMode(null);
              setCurrentScreen(cameFromProgressMap ? 'progress-map' : 'grade-selection');
            }}
            onToggleSound={toggleSound}
            onProgressUpdate={(completed) => {
              setProgress(prev => ({ ...prev, englishLetters: completed }));
              if (completed >= 5) {
                setTimeout(() => {
                  setEnglishInitialMode(null);
                  setCurrentScreen(cameFromProgressMap ? 'progress-map' : 'grade-selection');
                }, 2000);
              }
            }}
          />
        );

      case 'progress-map':
        return (
          <ProgressMapScreen
            progress={progress}
            gameSettings={gameSettings}
            onBack={() => {
              setCameFromProgressMap(false);
              setCurrentScreen('main-menu');
            }}
            onTopicSelect={(topicId) => {
              const topicMap: Record<string, AppScreen> = {
                'addition': 'addition',
                'subtraction': 'subtraction',
                'multiplication': 'multiplication',
                'division': 'division',
                'englishLetters': 'english-letters',
                'english_1': 'english-letters',
                'english_2': 'english-letters'
              };
              const screen = topicMap[topicId];
              if (screen) {
                setCameFromProgressMap(true);
                if (topicId === 'english_1') setEnglishInitialMode('case');
                else if (topicId === 'english_2') setEnglishInitialMode('sound');
                else setEnglishInitialMode(null);
                setCurrentScreen(screen);
              }
            }}
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
