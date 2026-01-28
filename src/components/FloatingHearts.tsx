import { Heart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';

interface HeartData {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: number;
  opacity: number;
  animationType: 'float' | 'bounce' | 'rotate' | 'pulse';
  color: string;
}

export default function FloatingHearts() {
  const { theme } = useTheme();
  const [hearts, setHearts] = useState<HeartData[]>([]);

  useEffect(() => {
    if (theme !== 'pink') {
      setHearts([]);
      return;
    }

    // Generate 15-20 hearts với nhiều animation types
    const newHearts: HeartData[] = Array.from({ length: 18 }, (_, i) => {
      const animationTypes: HeartData['animationType'][] = ['float', 'bounce', 'rotate', 'pulse'];
      const colors = [
        'text-pink-200',
        'text-pink-300',
        'text-pink-400',
        'text-rose-300',
        'text-rose-400',
        'text-fuchsia-300',
      ];

      return {
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${4 + Math.random() * 4}s`,
        size: 16 + Math.random() * 24, // 16-40px
        opacity: 0.2 + Math.random() * 0.5, // 0.2-0.7
        animationType: animationTypes[Math.floor(Math.random() * animationTypes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    setHearts(newHearts);

    // Regenerate hearts every 8 seconds for continuous effect
    const interval = setInterval(() => {
      setHearts((prev) => {
        if (prev.length === 0) return newHearts;
        // Add a few new hearts occasionally
        return [...prev.slice(-15), ...newHearts.slice(0, 3)];
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [theme]);

  if (theme !== 'pink' || hearts.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          className={`absolute ${heart.color} heart-${heart.animationType}`}
          style={{
            left: heart.left,
            bottom: '-20px',
            animationDelay: heart.delay,
            animationDuration: heart.duration,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            opacity: heart.opacity,
            filter: 'drop-shadow(0 2px 4px rgba(236, 72, 153, 0.3))',
          }}
        />
      ))}
    </div>
  );
}
