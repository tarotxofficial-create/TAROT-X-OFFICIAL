import React, { useState } from 'react';
import { Sparkles, Moon, Mail, Shield, Heart, ArrowUp, Code2 } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-gold-500/20 bg-obsidian-950/90 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400/20 via-obsidian-900 to-mystic-purple/30 border border-gold-500/40 p-1.5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gold-400" />
              </div>
              <span className="font-cinzel text-lg font-bold tracking-wider gold-gradient-text">
                TAROT X OFFICIAL
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier esoteric AI sanctuary blending timeless archetypal wisdom, 78-card Arcana spreads, real-time lunar telemetry, and master spiritual consultations.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://github.com/tarotxofficial-create/TAROT-X-OFFICIAL"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-obsidian-900 border border-slate-800 hover:border-gold-500/40 text-slate-400 hover:text-gold-300 transition-all flex items-center justify-center"
                title="View GitHub Repository"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-xl bg-obsidian-900 border border-slate-800 text-[11px] text-slate-400 hover:text-emerald-400 transition-all font-mono"
              >
                Supabase
              </a>
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-xl bg-obsidian-900 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-100 transition-all font-mono"
              >
                ▲ Vercel
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-widest text-gold-400">
              Sanctuary
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('sanctuary')} className="hover:text-gold-300 transition-colors">
                  Interactive Spreads
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('codex')} className="hover:text-gold-300 transition-colors">
                  78 Arcana Codex
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cosmic')} className="hover:text-gold-300 transition-colors">
                  Moon & Horoscopes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('numerology')} className="hover:text-gold-300 transition-colors">
                  Soul Archetype
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('booking')} className="hover:text-gold-300 transition-colors">
                  Live Consultations
                </button>
              </li>
            </ul>
          </div>

          {/* Esoteric Insights */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-widest text-gold-400">
              Esoterica
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-400">432Hz Solfeggio Waves</span></li>
              <li><span className="text-slate-400">Major Arcana Lore</span></li>
              <li><span className="text-slate-400">Elemental Alchemy</span></li>
              <li><span className="text-slate-400">Lunar Cycles & Eclipses</span></li>
              <li><span className="text-slate-400">Sacred Geometry</span></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-widest text-gold-400">
              Celestial Dispatches
            </h4>
            <p className="text-xs text-slate-400">
              Receive full moon forecasts, planetary retrogrades, and exclusive esoteric transmissions directly to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="oracle@seeker.com"
                  className="w-full px-3.5 py-2 rounded-l-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-r-xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider hover:brightness-110 shrink-0"
                >
                  Join
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 font-mono">
                  ✦ Sacred connection established! Welcome to the circle.
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} TAROT X OFFICIAL. Dedicated to the evolution of human consciousness and spiritual inquiry.
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-[11px]">For spiritual & personal reflection purposes only.</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-gold-300"
              title="Scroll to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
