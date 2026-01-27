import { Heart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function FloatingHearts() {
  const { theme } = useTheme();

  if (theme !== 'pink') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <Heart
          key={i}
          className="absolute text-pink-300 opacity-20 heart-animation"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
          size={20 + Math.random() * 30}
        />
      ))}
    </div>
  );
}
