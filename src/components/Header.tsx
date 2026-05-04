import { FileText, LogIn, LogOut, LayoutDashboard, Bell, User, ChevronDown, Sun, Moon, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToolsClick = () => {
    if (location.pathname === '/') {
      document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container flex h-14 md:h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-lg gradient-primary p-1.5">
            <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg md:text-xl font-bold gradient-text">Forge PDF</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-3">
          <button onClick={handleToolsClick} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Tools</button>
          <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="shrink-0">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <div className="flex items-center gap-2">
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
              <div className="relative">
                <Button variant="ghost" size="sm" onClick={() => setDropdownOpen(!dropdownOpen)} className="gap-1.5">
                  <div className="h-6 w-6 rounded-full gradient-primary flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <span className="hidden md:inline text-sm">{profile?.full_name?.split(' ')[0] || profile?.username || 'User'}</span>
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

        {/* Mobile Nav Controls */}
        <div className="flex md:hidden items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user && (
            <Button variant="ghost" size="icon" onClick={() => setNotifOpen(!notifOpen)} className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full gradient-secondary border-2 border-background" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="h-9 w-9">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border glass px-4 py-4 space-y-2">
          <button onClick={() => { handleToolsClick(); setMobileMenuOpen(false); }} className="w-full text-left block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
            Tools
          </button>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
            About
          </Link>
          {user ? (
            <>
              <button onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                <LayoutDashboard className="h-4 w-4" /> My Files
              </button>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-muted/50 transition-colors">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <Button size="sm" className="w-full gradient-primary text-primary-foreground border-0 mt-1" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}>
              <LogIn className="h-4 w-4 mr-1" /> Login
            </Button>
          )}
        </div>
      )}

      {/* Mobile Notification Dropdown */}
      {notifOpen && (
        <div className="md:hidden border-t border-border glass px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-display font-semibold text-sm">Notifications</h4>
            <button className="text-xs text-muted-foreground" onClick={() => setNotifOpen(false)}>Clear all</button>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-xs">
            <p className="font-medium">Welcome to Forge PDF! 🎉</p>
            <p className="text-muted-foreground mt-0.5">Your account is ready to use</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
