import { FileText, LogIn, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="rounded-lg bg-primary p-1.5">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">Forge PDF</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="hidden md:inline text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Tools
          </Link>
          <Link to="/about" className="hidden md:inline text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate('/auth')}>
              <LogIn className="h-4 w-4 mr-1" /> Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
