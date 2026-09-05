import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Moon, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Compass, 
  Calendar, 
  Bookmark, 
  Hash, 
  Flame,
  Menu,
  X
} from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';

export default function Navbar({ activeTab, setActiveTab, savedCount = 0 }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moonData, setMoonData] = useState({ phase: 'Waxing Gibbous', illumination: '84%', sign: 'Scorpio' });

  // Calculate approximate real-time moon phase
  useEffect(() => {
    const calcMoon = () => {
      const now = new Date();
      // Known reference new moon
      const refNewMoon = new Date(2026, 0, 18, 12, 0, 0).getTime();
      const diffDays = (now.getTime() - refNewMoon) / (1000 * 60 * 60 * 24);
      const cycleDay = (diffDays % 29.53058867 + 29.53058867) % 29.53058867;
      
      let phaseName = 'New Moon';
      let illum = '0%';
      if (cycleDay < 1.8) { phaseName = 'New Moon'; illum = '2%'; }
      else if (cycleDay < 7.38) { phaseName = 'Waxing Crescent'; illum = `${Math.round((cycleDay/14.76)*100)}%`; }
      else if (cycleDay < 9.22) { phaseName = 'First Quarter'; illum = '50%'; }
      else if (cycleDay < 14.76) { phaseName = 'Waxing Gibbous'; illum = `${Math.round((cycleDay/14.76)*100)}%`; }
      else if (cycleDay < 16.6) { phaseName = 'Full Moon'; illum = '100%'; }
      else if (cycleDay < 22.14) { phaseName = 'Waning Gibbous'; illum = `${Math.round(((29.53-cycleDay)/14.76)*100)}%`; }
      else if (cycleDay < 23.99) { phaseName = 'Last Quarter'; illum = '50%'; }
      else { phaseName = 'Waning Crescent'; illum = `${Math.max(4, Math.round(((29.53-cycleDay)/14.76)*100))}%`; }

      setMoonData({ phase: phaseName, illumination: illum, sign: 'Scorpio' });
    };
    calcMoon();
  }, []);

  const handleToggleSound = () => {
    const isNowPlaying = soundEngine.toggleAmbientSound(432);
    setIsPlayingAudio(isNowPlaying);
  };

  const navItems = [
    { id: 'sanctuary', label: 'Oracle Sanctuary', icon: Flame },
    { id: 'codex', label: 'Arcana Codex', icon: BookOpen },
    { id: 'cosmic', label: 'Cosmic Portal', icon: Moon },
    { id: 'numerology', label: 'Soul Archetype', icon: Hash },
    { id: 'booking', label: 'Consultations', icon: Calendar },
    { id: 'journal', label: 'Journal', icon: Bookmark, badge: savedCount }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-obsidian-950/80 border-b border-gold-500/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Crest */}
          <div 
            onClick={() => setActiveTab('sanctuary')} 
            className="flex items-center space-x-3.5 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400/20 via-obsidian-900 to-mystic-purple/30 border border-gold-500/40 p-2 flex items-center justify-center shadow-lg shadow-gold-500/10 group-hover:border-gold-400 group-hover:scale-105 transition-all">
              <Sparkles className="w-6 h-6 text-gold-400 group-hover:rotate-12 transition-transform duration-500" />
              <div className="absolute inset-0 rounded-xl bg-gold-400/10 opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-cinzel text-xl font-bold tracking-wider gold-gradient-text">
                  TAROT X
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-gold-500/10 border border-gold-500/30 text-gold-300">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-serif tracking-widest uppercase">
                Arcane Sanctuary & AI Oracle
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-obsidian-900/60 p-1.5 rounded-2xl border border-gold-500/15">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-gold-500/20 to-mystic-purple/20 text-gold-300 border border-gold-400/40 shadow-sm shadow-gold-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gold-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-gold-500 text-obsidian-950 font-bold text-[10px]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Live Moon Phase Pill */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-obsidian-900/80 border border-slate-700/50 text-xs text-slate-300">
              <Moon className="w-3.5 h-3.5 text-mystic-cyan animate-pulse-slow" />
              <span className="font-serif text-[11px] text-slate-300">{moonData.phase}</span>
              <span className="text-[10px] text-gold-400 font-mono">({moonData.illumination})</span>
            </div>

            {/* Solfeggio 432Hz Soundscape Player Toggle */}
            <button
              onClick={handleToggleSound}
              title={isPlayingAudio ? 'Mute 432Hz Sacred Tone' : 'Play 432Hz Solfeggio Meditation Drone'}
              className={`p-2.5 rounded-xl border transition-all flex items-center space-x-1.5 text-xs ${
                isPlayingAudio 
                  ? 'bg-mystic-purple/20 border-mystic-amethyst text-gold-300 shadow-md shadow-purple-500/20' 
                  : 'bg-obsidian-900 border-slate-800 text-slate-400 hover:text-gold-400 hover:border-gold-500/30'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-4 h-4 text-gold-400 animate-pulse" />
                  <span className="text-[11px] font-mono text-gold-300 hidden md:inline">432Hz Active</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="text-[11px] font-mono hidden md:inline">432Hz Tone</span>
                </>
              )}
            </button>

            {/* Main Action CTA */}
            <button
              onClick={() => setActiveTab('sanctuary')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-gold-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consult Oracle</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-lg bg-obsidian-900 border border-slate-800 text-slate-300"
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4 text-gold-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-obsidian-900 border border-slate-800 text-slate-300 hover:text-gold-400"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-obsidian-950/95 border-b border-gold-500/20 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide ${
                  isActive 
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-400/30' 
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-gold-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
