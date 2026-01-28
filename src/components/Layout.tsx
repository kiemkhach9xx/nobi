import { ReactNode, useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingHearts from './FloatingHearts';
import SunEffect from './SunEffect';
import { useTheme } from '@/contexts/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

function TetCountdownInlineBanner() {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const tetDate = new Date(2026, 1, 16, 0, 0, 0); // 16/02/2026
  const diffMs = tetDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  const formattedNow = now.toLocaleString('vi-VN', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const message = `Còn ${daysRemaining} ngày đến Tết Âm 2026 (16/02/2026 - Năm con Ngựa). Bây giờ là: ${formattedNow}`;

  return (
    <div className="bg-gradient-to-r from-red-700 via-amber-500 to-red-700 text-[11px] sm:text-sm text-yellow-50 border-b border-amber-300/70 overflow-hidden">
      <div className="tet-marquee px-4 py-1 flex items-center gap-2">
        <span role="img" aria-label="phaophong">
          🎆
        </span>
        <span className="font-medium whitespace-nowrap">{message}</span>
        <span role="img" aria-label="phaophong">
          🎇
        </span>
      </div>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <FloatingHearts />
      <SunEffect />
      <Header />
      <TetCountdownInlineBanner />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
