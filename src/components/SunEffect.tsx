import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function SunEffect() {
  const { theme } = useTheme();
  const [sunPosition, setSunPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (theme !== 'classic') {
      return;
    }

    const updateSunPosition = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      
      // Mặt trời mọc lúc 6h, lặn lúc 18h
      const startHour = 6; // 6h sáng
      const endHour = 18; // 6h chiều
      const dayDuration = (endHour - startHour) * 60; // 12 giờ = 720 phút
      
      let angle = 0;
      if (hours >= startHour && hours < endHour) {
        // Ban ngày: từ 6h đến 18h
        const minutesFromStart = totalMinutes - startHour * 60;
        angle = (minutesFromStart / dayDuration) * 180; // 0° (mọc) đến 180° (lặn)
      } else if (hours < startHour) {
        // Trước 6h sáng: mặt trời ở dưới đường chân trời (bên trái)
        const minutesFromMidnight = totalMinutes;
        angle = -90 + (minutesFromMidnight / (startHour * 60)) * 90;
      } else {
        // Sau 18h: mặt trời ở dưới đường chân trời (bên phải)
        const minutesFromEnd = totalMinutes - endHour * 60;
        const nightDuration = (24 - endHour + startHour) * 60;
        angle = 180 + (minutesFromEnd / nightDuration) * 180;
      }
      
      // Chuyển góc thành radians (0° = bên trái, 90° = trên, 180° = bên phải)
      const radians = (angle * Math.PI) / 180;
      
      // Tính vị trí trên màn hình
      // Mặt trời di chuyển theo cung tròn từ trái sang phải
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const radius = Math.max(viewportWidth, viewportHeight) * 0.5;
      const centerX = viewportWidth / 2;
      const centerY = viewportHeight * 0.75; // Đường chân trời ở 75% chiều cao
      
      const x = centerX + radius * Math.cos(radians);
      const y = centerY - radius * Math.sin(radians);
      
      setSunPosition({ x, y });
    };

    // Cập nhật ngay lập tức
    updateSunPosition();
    
    // Cập nhật mỗi phút
    const interval = setInterval(updateSunPosition, 60000);
    
    // Cập nhật khi resize window
    window.addEventListener('resize', updateSunPosition);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateSunPosition);
    };
  }, [theme]);

  if (theme !== 'classic') {
    return null;
  }

  // Đảm bảo có vị trí hợp lệ trước khi render
  if (sunPosition.x === 0 && sunPosition.y === 0) {
    return null;
  }

  return (
    <div
      className="fixed pointer-events-none z-10 transition-all duration-1000 ease-out"
      style={{
        left: `${sunPosition.x}px`,
        top: `${sunPosition.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="relative">
        {/* Glow effect lớn hơn */}
        <div
          className="absolute rounded-full blur-2xl opacity-50"
          style={{
            width: '120px',
            height: '120px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.8), rgba(245, 158, 11, 0.4))',
          }}
        />
        {/* Mặt trời chính */}
        <div
          className="rounded-full relative"
          style={{
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle at 30% 30%, #fef3c7, #fbbf24, #f59e0b)',
            boxShadow: '0 0 60px rgba(251, 191, 36, 0.8), 0 0 120px rgba(245, 158, 11, 0.5)',
          }}
        />
      </div>
    </div>
  );
}
