import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type AppContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  route: string;
  navigate: (r: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/');

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const navigate = (r: string) => {
    window.location.hash = r;
    window.scrollTo(0, 0);
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode: () => setDarkMode((d) => !d),
        route,
        navigate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
