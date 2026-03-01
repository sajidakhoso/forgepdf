import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border py-8 mt-auto">
    <div className="container">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          Developed with <Heart className="h-3.5 w-3.5 fill-accent text-accent mx-0.5" /> by{' '}
          <span className="font-semibold gradient-text">Anglowie</span>
          <span className="ml-2 text-xs">v1.0</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Forge PDF. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
