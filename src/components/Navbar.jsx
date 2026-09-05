import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onBookClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'METHOD', href: '#method' },
    { label: 'SESSIONS', href: '#sessions' },
    { label: 'ABOUT', href: '#about' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-charcoal/95 backdrop-blur-md border-b border-brass/20 shadow-2xl py-3.5' 
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Left: Brand Mark & Title */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-sm bg-ink border border-brass/40 flex items-center justify-center transition-all group-hover:border-brass">
              <span className="font-cinzel text-base font-bold text-bone tracking-widest">X</span>
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-sm font-bold tracking-[0.25em] text-bone group-hover:text-brass transition-colors">
                X / PATTERN READER
              </span>
              <span className="text-[9px] font-mono tracking-widest text-smoke uppercase">
                Rationalist Tarot
              </span>
            </div>
          </a>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-9">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-mono tracking-[0.2em] text-smoke hover:text-bone transition-colors relative py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Primary Brass CTA */}
          <div className="hidden md:flex items-center">
            <button
              onClick={onBookClick}
              className="px-5 py-2.5 rounded-sm bg-brass text-void font-cinzel font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-brass/10 hover:bg-brass-light active:scale-95 transition-all flex items-center space-x-1.5"
            >
              <span>BOOK A READING</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={onBookClick}
              className="px-3 py-1.5 rounded-sm bg-brass text-void font-cinzel font-bold text-[11px] uppercase tracking-widest"
            >
              BOOK
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-sm bg-ink border border-brass/30 text-bone hover:text-brass"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-ink/98 border-b border-brass/25 px-6 pt-4 pb-6 space-y-4 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-xs font-mono tracking-[0.25em] text-bone hover:text-brass border-b border-charcoal/80"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              onBookClick();
            }}
            className="w-full mt-2 py-3 rounded-sm bg-brass text-void font-cinzel font-bold text-xs uppercase tracking-[0.2em] text-center"
          >
            BOOK A READING
          </button>
        </div>
      )}
    </header>
  );
}

