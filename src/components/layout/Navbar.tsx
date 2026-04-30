import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Education', path: '/education' },
  { name: 'Skills', path: '/skills' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-brand-bg/80 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-brand-secondary font-bold text-lg shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform">
                NA
              </div>
              <span className="font-serif text-xl font-bold text-brand-primary tracking-tight hidden sm:block">
                Azhari
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2 bg-brand-accent/30 p-1.5 rounded-[1.25rem] border border-brand-border">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                  location.pathname === link.path 
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" 
                    : "text-brand-primary/60 hover:text-brand-primary hover:bg-white"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
             <Link to="/admin/login" className="p-2.5 text-brand-primary/60 hover:text-brand-primary bg-white rounded-xl border border-brand-border transition-all">
                <User size={18} />
             </Link>
             <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2.5 bg-brand-primary text-white rounded-xl transition-all shadow-lg shadow-brand-primary/20"
                >
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-brand-bg border-b border-brand-border p-4"
        >
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest",
                  location.pathname === link.path ? "bg-brand-primary text-white" : "text-brand-primary/60 hover:bg-brand-accent/50"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
