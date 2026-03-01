import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
    <div className="container flex h-16 items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="rounded-lg bg-primary p-1.5">
          <FileText className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-display text-xl font-bold text-foreground">Forge PDF</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Tools
        </Link>
      </nav>
    </div>
  </header>
);

export default Header;
