import React from 'react';
import type { ProgressState, GameSettings } from '../types/index';

interface ProgressMapProps {
  progress: ProgressState;
  gameSettings: GameSettings;
  onTopicSelect?: (topicId: string) => void;
  isMobile?: boolean;
}

const ProgressMap: React.FC<ProgressMapProps> = ({
  progress,
  gameSettings,
  onTopicSelect,
  isMobile = false
}) => {
  const stationSize = isMobile ? 65 : 90;
  const badgeSize = isMobile ? 22 : 30;
  const iconFontSize = isMobile ? '1.4rem' : '2rem';
  // הקואורדינטות הסופיות והמדויקות כפי שחילצת מהלוג
  const PATH_NODES = [
    { x: 19, y: 80 }, { x: 38, y: 88 }, { x: 62, y: 88 }, { x: 84, y: 77 }, { x: 47, y: 59 },
    { x: 19, y: 54 }, { x: 48, y: 47 }, { x: 83, y: 44 }, { x: 55, y: 37 }, { x: 42, y: 28 }
  ];

  // הגדרת נושאים לפי כיתה - כולל הסדר המבוקש לכיתה ג'
  const getTopicsByGrade = () => {
    if (gameSettings.grade === 3) {
      return [
        { id: 'addition', icon: '➕' },
        { id: 'subtraction', icon: '➖' },
        { id: 'multiplication', icon: '✖️' },
        { id: 'division', icon: '➗' },
        { id: 'english_1', icon: 'abc', originalId: 'englishLetters' },
        { id: 'english_2', icon: '🔠', originalId: 'englishLetters' }
      ];
    }
    // כיתה א'
    return [
      { id: 'addition', icon: '➕' },
      { id: 'subtraction', icon: '➖' },
      { id: 'englishLetters', icon: 'abc' }
    ];
  };

  const selectedTopics = getTopicsByGrade();

  // פריסה דינמית על פני 10 הנקודות המדויקות
  const displayTopics = selectedTopics.map((topic, index) => {
    const totalStations = selectedTopics.length;
    const nodeIdx = totalStations > 1
      ? Math.round((index / (totalStations - 1)) * (PATH_NODES.length - 1))
      : 0;

    return {
      ...topic,
      originalId: (topic as { originalId?: string }).originalId ?? topic.id,
      position: PATH_NODES[nodeIdx]
    };
  });

  const getTopicProgress = (topicId: string): number => {
    const p = progress as unknown as Record<string, number>;
    return p[topicId] ?? 0;
  };

  // מציאת התחנה הפעילה
  const activeIdx = displayTopics.findIndex(t => getTopicProgress(t.originalId) < 5);
  const currentIdx = activeIdx === -1 ? displayTopics.length - 1 : activeIdx;
  const robotPos = displayTopics[currentIdx].position;

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

      {/* דמות הרובוט */}
      <div style={{
        position: 'absolute',
        left: `${robotPos.x}%`, top: `${robotPos.y - 8}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10, width: '80px',
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        animation: 'robotBounce 2s infinite ease-in-out',
        pointerEvents: 'none'
      }}>
        <img src="/assets/journey/character.png" style={{ width: '100%' }} alt="robot" />
      </div>

      {displayTopics.map((topic, index) => {
        const isCompleted = getTopicProgress(topic.originalId) >= 5;
        const isLocked = index > currentIdx;
        const isActive = index === currentIdx;

        return (
          <div
            key={topic.id}
            onClick={() => !isLocked && onTopicSelect?.(topic.id)}
            style={{
              position: 'absolute',
              left: `${topic.position.x}%`, top: `${topic.position.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 5,
              cursor: isLocked ? 'not-allowed' : 'pointer',
              pointerEvents: isLocked ? 'none' : 'auto',
              animation: isActive ? 'pulseActive 2s infinite' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ position: 'relative', width: `${stationSize}px`, height: `${stationSize}px` }}>
              <img
                src="/assets/journey/station.png"
                style={{ width: '100%', opacity: isLocked ? 0.7 : 1 }}
                alt=""
              />

              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: iconFontSize,
                color: '#1a4a4a',
                fontWeight: '900',
                opacity: isLocked ? 0.5 : 1,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {topic.icon}
              </span>
              {isLocked && (
                <span style={{
                  position: 'absolute', top: '40%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: isMobile ? '1.1rem' : '1.5rem',
                  zIndex: 6
                }}>
                  🔒
                </span>
              )}

              <div style={{
                position: 'absolute', top: '0', right: '0',
                width: `${badgeSize}px`, height: `${badgeSize}px`, borderRadius: '50%',
                background: isCompleted ? '#FFD700' : isLocked ? '#555' : '#4CAF50',
                border: '2px solid white', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'white', fontWeight: 'bold'
              }}>
                {index + 1}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressMap;
