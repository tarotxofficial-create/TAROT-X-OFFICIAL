import React from 'react';
import { ArrowUp, Terminal, ShieldAlert } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-charcoal/80 bg-void text-smoke py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="font-cinzel text-xl font-bold tracking-[0.2em] text-bone">
                X <span className="text-brass">/</span> PATTERN READER
              </span>
              <span className="text-[10px] font-mono text-brass/70 border border-charcoal px-2 py-0.5 rounded">
                28.6139° N, 77.2090° E
              </span>
            </div>
            <p className="text-xs text-smoke/70 max-w-sm font-sans">
              An anonymous rationalist tarot practice. You don't need a prophecy. You need to see the pattern.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono tracking-wider">
            <a href="#method" className="hover:text-brass transition-colors">METHOD</a>
            <a href="#sessions" className="hover:text-brass transition-colors">SESSIONS</a>
            <a href="#about" className="hover:text-brass transition-colors">ABOUT</a>
            <a href="#reviews" className="hover:text-brass transition-colors">CASE LOGS</a>
            <a href="#booking" className="hover:text-brass transition-colors">BOOKING</a>
            <a href="#faq" className="hover:text-brass transition-colors">FAQ</a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-3 rounded-xl bg-ink border border-charcoal hover:border-brass/50 text-smoke hover:text-brass transition-all flex items-center space-x-2 text-xs font-mono"
            title="Return to top"
          >
            <span>TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-brass" />
          </button>

        </div>

        {/* Archival Manifesto Quote Banner */}
        <div className="py-8 px-6 sm:px-8 rounded-2xl bg-ink/70 border border-charcoal relative overflow-hidden text-center space-y-2">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brass/40 to-transparent" />
          <p className="font-cinzel text-base sm:text-lg text-bone/90 italic tracking-wide">
            "Your future is not fixed. Your patterns are not innocent either."
          </p>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-brass">
            — X
          </p>
        </div>

        {/* Legal and boundary protocol */}
        <div className="pt-8 border-t border-charcoal/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-smoke/60 text-center sm:text-left font-mono">
          <p>
            © {new Date().getFullYear()} X / PATTERN READER. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center space-x-2 text-[11px] text-smoke/50">
            <ShieldAlert className="w-3.5 h-3.5 text-brass/70 shrink-0" />
            <span>Strict analytical boundaries. Not medical, psychiatric, or legal counsel.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

