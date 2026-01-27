import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingHearts from './FloatingHearts';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <FloatingHearts />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
