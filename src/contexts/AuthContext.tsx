import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  username: string;
  full_name: string | null;
  email: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isGuest: boolean;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('guest_mode') === 'true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsGuest(false);
        localStorage.removeItem('guest_mode');
        // Set immediate fallback from user metadata
        const meta = session.user.user_metadata;
        const fallbackName = meta?.full_name || meta?.username || session.user.email?.split('@')[0] || 'User';
        setProfile(prev => prev ?? { username: fallbackName, full_name: meta?.full_name || null, email: session.user.email ?? null });
        // Then fetch real profile
        setTimeout(() => fetchProfile(session.user.id, fallbackName), 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const meta = session.user.user_metadata;
        const fallback = meta?.full_name || meta?.username || session.user.email?.split('@')[0] || 'User';
        setProfile({ username: fallback, full_name: meta?.full_name || null, email: session.user.email ?? null });
        fetchProfile(session.user.id, fallback);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, fallbackName?: string) => {
    const { data } = await supabase.from('profiles').select('username, email, full_name').eq('user_id', userId).single();
    if (data) {
      setProfile(data);
    } else if (fallbackName) {
      setProfile(prev => prev ?? { username: fallbackName, full_name: null, email: null });
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, username: fullName },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('guest_mode', 'true');
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, isGuest, loading, signUp, signIn, signOut, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
