import { FileText, LogIn, LogOut, LayoutDashboard, Bell, User, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="rounded-lg gradient-primary p-1.5">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold gradient-text">Forge PDF</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/" className="hidden md:inline text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Tools
          </Link>
          <Link to="/about" className="hidden md:inline text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => setNotifOpen(!notifOpen)} className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full gradient-secondary border-2 border-background" />
                </Button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 glass rounded-xl shadow-xl p-4 z-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-display font-semibold text-sm">Notifications</h4>
                      <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setNotifOpen(false)}>Clear all</button>
                    </div>
                    <div className="space-y-2">
                      <div className="rounded-lg bg-muted/50 p-3 text-xs">
                        <p className="font-medium">Welcome to Forge PDF! 🎉</p>
                        <p className="text-muted-foreground mt-0.5">Your account is ready to use</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <Button variant="ghost" size="sm" onClick={() => setDropdownOpen(!dropdownOpen)} className="gap-1.5">
                  <div className="h-6 w-6 rounded-full gradient-primary flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <span className="hidden md:inline text-sm">{profile?.username || 'User'}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl shadow-xl py-2 z-50">
                    <button onClick={() => { navigate('/dashboard'); setDropdownOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 transition-colors">
                      <LayoutDashboard className="h-4 w-4" /> My Files
                    </button>
                    <button onClick={() => { handleLogout(); setDropdownOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted/50 transition-colors">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Button size="sm" className="gradient-primary text-primary-foreground border-0" onClick={() => navigate('/auth')}>
              <LogIn className="h-4 w-4 mr-1" /> Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
