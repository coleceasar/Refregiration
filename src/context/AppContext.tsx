import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

type AppContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  session: Session | null;
  setSession: (s: Session | null) => void;
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
  const [session, setSession] = useState<Session | null>(null);
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });

    const onHashChange = () => setRoute(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', onHashChange);

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener('hashchange', onHashChange);
    };
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
        session,
        setSession,
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
