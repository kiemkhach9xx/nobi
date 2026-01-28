import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'classic' | 'pink' | 'conan' | 'tet2026';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Load from localStorage or default to 'classic'
    const saved = localStorage.getItem('theme');
    return (
      saved === 'pink' ||
      saved === 'classic' ||
      saved === 'conan' ||
      saved === 'tet2026'
        ? saved
        : 'classic'
    ) as Theme;
  });

  useEffect(() => {
    // Update data-theme attribute on document element
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
