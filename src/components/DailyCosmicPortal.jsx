import React, { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Sparkles, 
  Compass, 
  Orbit, 
  Star, 
  Flame, 
  Calendar,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { ZODIAC_SIGNS } from '../data/zodiacData';
import { soundEngine } from '../lib/soundEngine';

export default function DailyCosmicPortal() {
  const [selectedZodiac, setSelectedZodiac] = useState(ZODIAC_SIGNS[0]); // Aries default

  const handleSelectZodiac = (sign) => {
    soundEngine.playCardFlipSound();
    setSelectedZodiac(sign);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold-500/20 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 text-mystic-cyan">
              <Moon className="w-6 h-6 animate-pulse-slow" />
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wide gold-gradient-text">
                Daily Cosmic Portal & Lunar Telemetry
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Synchronize your spirit with celestial transits, real-time lunar phases, and daily zodiac Tarot alignments.
            </p>
          </div>

          <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-obsidian-900 border border-gold-500/30 text-xs text-gold-300">
            <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
            <span>Planetary Day: <strong className="text-slate-100">Saturn / Jupiter Alignment</strong></span>
          </div>
        </div>

        {/* 3 Telemetry Widget Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          
          {/* Moon Telemetry */}
          <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-cinzel uppercase tracking-wider text-slate-400">Lunar Phase</span>
              <Moon className="w-4 h-4 text-mystic-cyan" />
            </div>
            <div className="font-cinzel text-2xl font-bold text-slate-100">Waxing Gibbous</div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Illumination: <strong className="text-gold-300">84%</strong></span>
              <span>Constellation: <strong className="text-slate-200">Scorpio ♏</strong></span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full w-[84%]" />
            </div>
          </div>

          {/* Solar Frequency */}
          <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-cinzel uppercase tracking-wider text-slate-400">Solar Energy</span>
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-cinzel text-2xl font-bold text-amber-300">Radiant Expansion</div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Solar Index: <strong className="text-amber-400">High Resonance</strong></span>
              <span>Chakra: <strong className="text-slate-200">Solar Plexus</strong></span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full w-[92%]" />
            </div>
          </div>

          {/* Elemental Atmosphere */}
          <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-cinzel uppercase tracking-wider text-slate-400">Occult Transit</span>
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div className="font-cinzel text-2xl font-bold text-purple-300">Mercury Trine Uranus</div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Aura: <strong className="text-purple-300">Breakthrough Intuition</strong></span>
              <span>Focus: <strong className="text-slate-200">Epiphanies</strong></span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-[88%]" />
            </div>
          </div>

        </div>
      </div>

      {/* ── 12 ZODIAC TAROT GUIDANCE ───────────────────────────────────── */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold-500/20 space-y-6">
        
        <div>
          <h3 className="font-cinzel text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>12 Zodiac Horoscopes & Sacred Tarot Alignments</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select your celestial sun, moon, or rising sign to unveil today's bespoke Tarot guidance.
          </p>
        </div>

        {/* Zodiac Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {ZODIAC_SIGNS.map((sign) => {
            const isSelected = selectedZodiac.id === sign.id;
            return (
              <button
                key={sign.id}
                onClick={() => handleSelectZodiac(sign)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center space-y-1 ${
                  isSelected
                    ? 'bg-gold-500/20 border-gold-400 text-gold-300 shadow-md shadow-gold-500/20 scale-105'
                    : 'bg-obsidian-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="text-xl">{sign.symbol}</span>
                <span className="font-cinzel text-xs font-bold">{sign.name}</span>
                <span className="text-[9px] text-slate-500">{sign.element}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Zodiac Spotlight Card */}
        {selectedZodiac && (
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-obsidian-900 via-obsidian-950 to-obsidian-900 border border-gold-500/30 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-3 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6">
              <span className="text-4xl">{selectedZodiac.symbol}</span>
              <h4 className="font-cinzel text-2xl font-bold text-slate-100">{selectedZodiac.name}</h4>
              <p className="text-xs text-slate-400 font-mono">{selectedZodiac.dates}</p>
              <div className="inline-block px-2.5 py-1 rounded-full bg-slate-800 text-gold-300 text-[10px] font-mono">
                Ruler: {selectedZodiac.ruler}
              </div>
            </div>

            <div className="md:col-span-9 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-cinzel">Tarot Guardian:</span>
                  <span className="text-xs font-cinzel font-bold text-gold-400">{selectedZodiac.tarotCard}</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {selectedZodiac.dailyEnergy}
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedZodiac.guidance}
              </p>

              <div className="p-3 rounded-xl bg-obsidian-950/80 border border-slate-800 flex items-center space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                <span>
                  <strong>Daily Ritual Focus:</strong> Cleanse your workspace with sage or sound, set one definitive boundary, and honor your inner compass.
                </span>
              </div>
            </div>

          </div>
        )}

      </div>

    </section>
  );
}
