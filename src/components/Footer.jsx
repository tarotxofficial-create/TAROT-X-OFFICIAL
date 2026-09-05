import React from 'react';
import { Sparkles, Mail, ShieldCheck, Heart, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-gold-500/20 bg-obsidian-950 py-12 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-8 h-8 rounded-lg bg-obsidian-900 border border-gold-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <span className="font-cinzel text-base font-bold gold-gradient-text tracking-wider">
                TAROT X OFFICIAL
              </span>
              <p className="text-[11px] text-slate-500">
                Intuitive Readings & Spiritual Consulting
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <a href="#about" className="hover:text-gold-300 transition-colors">About</a>
            <a href="#services" className="hover:text-gold-300 transition-colors">Readings</a>
            <a href="#reviews" className="hover:text-gold-300 transition-colors">Reviews</a>
            <a href="#booking" className="hover:text-gold-300 transition-colors">Book Now</a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-obsidian-900 border border-slate-800 hover:border-gold-500/40 text-slate-400 hover:text-gold-300 transition-all flex items-center space-x-1.5 text-xs"
            title="Scroll to Top"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} TAROT X OFFICIAL. All rights reserved.
          </p>
          <p className="text-[11px]">
            Readings are intended for intuitive reflection and self-guidance.
          </p>
        </div>

      </div>
    </footer>
  );
}
