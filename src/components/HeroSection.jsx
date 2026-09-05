import React from 'react';
import { Sparkles, Flame, BookOpen, Compass, Shield, Star, Moon, ArrowRight } from 'lucide-react';
import { TAROT_DECK } from '../data/tarotDeckData';

export default function HeroSection({ onStartReading, onExploreCodex, onCalculateSoul }) {
  // Highlight cards for 3D floating carousel
  const featuredCards = [
    TAROT_DECK[0],  // The Fool
    TAROT_DECK[1],  // The Magician
    TAROT_DECK[2],  // The High Priestess
    TAROT_DECK[19], // The Sun
  ];

  return (
    <section className="relative pt-12 pb-24 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-gold-500/10 via-mystic-purple/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-mystic-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Narrative */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Esoteric Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-gold-500/15 via-obsidian-900 to-mystic-purple/20 border border-gold-500/30 text-gold-300 text-xs tracking-wider uppercase font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-spin-slow" />
              <span>The Sacred AI Oracle & Arcane Sanctuary</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
            </div>

            {/* Main Headline */}
            <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              Unveil the Cosmic Veil With <br />
              <span className="gold-gradient-text drop-shadow-[0_0_25px_rgba(212,175,55,0.3)]">
                TAROT X OFFICIAL
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Enter a sacred digital temple where timeless esoteric archetypes converge with cutting-edge AI oracle synthesis. Explore 78-card Major and Minor Arcana spreads, real-time lunar telemetry, and tailored spiritual revelations.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartReading}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-gold-400 via-amber-500 to-yellow-600 text-obsidian-950 font-cinzel font-bold text-sm uppercase tracking-widest shadow-xl shadow-gold-500/25 hover:shadow-gold-400/40 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center space-x-2.5 group"
              >
                <Flame className="w-4 h-4 text-obsidian-950 group-hover:scale-110 transition-transform" />
                <span>Cast Oracle Spread</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreCodex}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-obsidian-900/80 hover:bg-obsidian-850 text-slate-200 border border-gold-500/30 hover:border-gold-400/60 font-cinzel font-semibold text-sm tracking-wider shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-4 h-4 text-gold-400" />
                <span>Explore 78 Arcana Codex</span>
              </button>
            </div>

            {/* Key Feature Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
              <div className="p-3.5 rounded-xl bg-obsidian-900/50 border border-slate-800/60">
                <div className="font-cinzel text-xl font-bold text-gold-300">78 Cards</div>
                <div className="text-[11px] text-slate-400">Complete Major & Minor</div>
              </div>
              <div className="p-3.5 rounded-xl bg-obsidian-900/50 border border-slate-800/60">
                <div className="font-cinzel text-xl font-bold text-mystic-cyan">AI Oracle</div>
                <div className="text-[11px] text-slate-400">Contextual Synthesis</div>
              </div>
              <div className="p-3.5 rounded-xl bg-obsidian-900/50 border border-slate-800/60">
                <div className="font-cinzel text-xl font-bold text-amber-400">3D Hologram</div>
                <div className="text-[11px] text-slate-400">Fluid Realistic Flips</div>
              </div>
              <div className="p-3.5 rounded-xl bg-obsidian-900/50 border border-slate-800/60">
                <div className="font-cinzel text-xl font-bold text-purple-400">432Hz Audio</div>
                <div className="text-[11px] text-slate-400">Solfeggio Frequencies</div>
              </div>
            </div>

          </div>

          {/* Right Floating 3D Arcana Showpiece */}
          <div className="lg:col-span-5 relative flex items-center justify-center py-8">
            
            {/* Celestial Astrological Orbit Ring */}
            <div className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full border border-gold-500/20 animate-rotate-slow pointer-events-none flex items-center justify-center">
              <div className="absolute top-0 text-[10px] font-mono text-gold-400/60">ARIES ♈</div>
              <div className="absolute right-0 text-[10px] font-mono text-gold-400/60">CANCER ♋</div>
              <div className="absolute bottom-0 text-[10px] font-mono text-gold-400/60">LIBRA ♎</div>
              <div className="absolute left-0 text-[10px] font-mono text-gold-400/60">CAPRICORN ♑</div>
            </div>

            {/* Floating Holographic Cards Spread */}
            <div className="relative w-72 sm:w-80 h-96 perspective-1000 flex items-center justify-center">
              
              {/* Card 1: The High Priestess (Left Tilt) */}
              <div className="absolute -left-6 top-8 w-44 h-72 rounded-2xl bg-obsidian-900 border border-purple-500/40 p-2 shadow-2xl shadow-purple-900/40 -rotate-12 animate-float-slow card-hologram">
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-purple-500/30">
                  <img 
                    src={featuredCards[2].image} 
                    alt="The High Priestess" 
                    className="w-full h-full object-cover brightness-75 contrast-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-[10px] font-mono text-purple-300">II • HIGH PRIESTESS</span>
                    <span className="text-[9px] text-slate-300">Divine Intuition</span>
                  </div>
                </div>
              </div>

              {/* Card 2: The Magician (Right Tilt) */}
              <div className="absolute -right-6 top-8 w-44 h-72 rounded-2xl bg-obsidian-900 border border-amber-500/40 p-2 shadow-2xl shadow-amber-900/40 rotate-12 animate-float-delayed card-hologram">
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-amber-500/30">
                  <img 
                    src={featuredCards[1].image} 
                    alt="The Magician" 
                    className="w-full h-full object-cover brightness-75 contrast-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-[10px] font-mono text-amber-300">I • THE MAGICIAN</span>
                    <span className="text-[9px] text-slate-300">Manifestation</span>
                  </div>
                </div>
              </div>

              {/* Card 3: The Sun (Centerpiece Master Card) */}
              <div className="relative z-20 w-48 h-80 rounded-2xl bg-obsidian-900 border-2 border-gold-400 p-2 shadow-2xl shadow-gold-500/30 card-hologram hover:scale-105 transition-transform duration-500">
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-gold-400/50">
                  <img 
                    src={featuredCards[3].image} 
                    alt="The Sun" 
                    className="w-full h-full object-cover brightness-90 contrast-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/30 to-transparent flex flex-col justify-end p-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                      <span className="text-xs font-cinzel font-bold text-gold-300">XIX • THE SUN</span>
                    </div>
                    <p className="text-[10px] text-slate-200 mt-0.5">Joy • Triumph • Vitality</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
