// Confetti/Fireworks Component for Milestone Celebrations

import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger: number; // Trigger confetti when this changes
  duration?: number; // Duration in ms
}

const Confetti: React.FC<ConfettiProps> = ({ trigger, duration = 3000 }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  if (!isActive) return null;

  // Create multiple confetti particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 2,
    color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FF9FF3', '#54A0FF'][
      Math.floor(Math.random() * 6)
    ]
  }));

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 10000,
        overflow: 'hidden'
      }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.left}%`,
            top: '-10px',
            width: '10px',
            height: '10px',
            backgroundColor: particle.color,
            borderRadius: '50%',
            animation: `confettiFall ${particle.duration}s ease-out ${particle.delay}s forwards`,
            boxShadow: `0 0 6px ${particle.color}`
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Confetti;
