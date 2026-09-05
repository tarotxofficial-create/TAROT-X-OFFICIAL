import React, { useState } from 'react';
import { Hash, Sparkles, Wand2, Calendar, User, ArrowRight, Shield } from 'lucide-react';
import { TAROT_DECK } from '../data/tarotDeckData';
import { soundEngine } from '../lib/soundEngine';

export default function NumerologyEngine() {
  const [birthDate, setBirthDate] = useState('');
  const [fullName, setFullName] = useState('');
  const [result, setResult] = useState(null);

  // Map Life Path number (1-9, 11, 22, 33) to Major Arcana Archetypes
  const NUMEROLOGY_MAP = {
    1: { card: TAROT_DECK[1], title: 'The Pioneer & Manifestor', description: 'Born with the power of original creation, focused willpower, and visionary leadership.' },
    2: { card: TAROT_DECK[2], title: 'The Intuitive Diplomat & Seer', description: 'Master of emotional depth, mediation, psychic subtleties, and sacred partnerships.' },
    3: { card: TAROT_DECK[3], title: 'The Creative Catalyst & Joy Bringer', description: 'Radiates creative abundance, joyful self-expression, artistry, and magnetic charisma.' },
    4: { card: TAROT_DECK[4], title: 'The Sovereign Builder & Architect', description: 'Grounded in unshakeable discipline, structure, strategic mastery, and enduring legacy.' },
    5: { card: TAROT_DECK[5], title: 'The Spiritual Alchemist & Free Explorer', description: 'A seeker of truth, rapid transformation, freedom, and higher sacred wisdom.' },
    6: { card: TAROT_DECK[6], title: 'The Sacred Harmonizer & Healer', description: 'Devoted to love, aesthetic beauty, family stewardship, and soul integrity.' },
    7: { card: TAROT_DECK[7], title: 'The Victorious Seeker & Mystic', description: 'Driven by philosophical inquiry, spiritual solitary mastery, and triumphant willpower.' },
    8: { card: TAROT_DECK[8], title: 'The High Adept & Karmic Sovereign', description: 'Commands immense material and spiritual power through gentle endurance and karmic balance.' },
    9: { card: TAROT_DECK[9], title: 'The Universal Sage & Humanitarian', description: 'The old soul holding the lantern of universal compassion, wisdom, and selfless service.' },
    11: { card: TAROT_DECK[11], title: 'The Master Illuminator', description: 'Master number of psychic electricity, divine inspiration, and higher cosmic truth.' },
    22: { card: TAROT_DECK[4], title: 'The Master Builder of Worlds', description: 'Master number capable of translating sublime spiritual ideals into tangible earthly institutions.' },
    33: { card: TAROT_DECK[14], title: 'The Master Teacher of Divine Love', description: 'Master number embodying pure cosmic compassion, selfless healing, and uplifting humanity.' }
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!birthDate) return;

    soundEngine.playOracleChime();

    // Calculate Life Path Number
    const digits = birthDate.replace(/[^0-9]/g, '').split('').map(Number);
    let sum = digits.reduce((a, b) => a + b, 0);

    // Reduce unless master numbers (11, 22, 33)
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0);
    }

    const mapping = NUMEROLOGY_MAP[sum] || NUMEROLOGY_MAP[1];
    setResult({
      number: sum,
      ...mapping,
      name: fullName.trim() || 'Sacred Seeker'
    });
  };

  return (
    <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
      
      {/* Title */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold-500/20 text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-gold-500/15 border border-gold-500/30 text-gold-400">
          <Hash className="w-6 h-6" />
        </div>
        <h2 className="font-cinzel text-2xl sm:text-4xl font-bold gold-gradient-text">
          Numerology & Soul Arcana Archetype
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Your date of birth encodes a sacred cosmic frequency. Calculate your Life Path Number to discover your guardian Major Arcana Tarot archetype and core soul mission.
        </p>

        {/* Input Form */}
        <form onSubmit={handleCalculate} className="pt-6 max-w-xl mx-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">
                Full Name (Optional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-cinzel uppercase tracking-wider text-gold-400 font-bold">
                Date of Birth *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-900 border border-gold-500/40 text-xs text-slate-100 focus:border-gold-400 outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold-400 via-amber-500 to-yellow-600 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-lg shadow-gold-500/20 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Unveil Soul Archetype</span>
          </button>
        </form>
      </div>

      {/* ── CALCULATION RESULT CARD ────────────────────────────────────── */}
      {result && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border-2 border-gold-500/40 bg-gradient-to-br from-obsidian-900 via-obsidian-950 to-obsidian-900 space-y-8 animate-fade-in shadow-2xl shadow-gold-500/15">
          
          <div className="text-center space-y-1">
            <span className="text-xs font-cinzel uppercase tracking-widest text-gold-400">
              ✦ Soul Blueprint Calculation for {result.name} ✦
            </span>
            <div className="font-cinzel text-5xl sm:text-6xl font-black gold-gradient-text">
              Life Path {result.number}
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100">
              {result.title}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4 border-t border-slate-800">
            
            {/* Guardian Arcana Card Image */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-52 h-80 rounded-2xl overflow-hidden border-2 border-gold-400 shadow-2xl card-hologram">
                <img src={result.card.image} alt={result.card.name} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Lore & Soul Blueprint Details */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1">
                <span className="text-xs uppercase font-mono text-gold-400">Your Guardian Arcana</span>
                <h4 className="font-cinzel text-2xl font-bold text-slate-100">{result.card.name}</h4>
                <p className="text-xs text-slate-400">Element: {result.card.element} • Astrology: {result.card.astrology}</p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {result.description}
              </p>

              <div className="p-4 rounded-xl bg-obsidian-950/80 border border-gold-500/20 space-y-2">
                <span className="text-xs font-cinzel font-bold text-gold-400 uppercase tracking-wider block">
                  Core Soul Mission
                </span>
                <p className="text-xs text-slate-300 italic">
                  "{result.card.advice}"
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 text-center font-serif italic text-gold-200 text-sm">
                "{result.card.affirmation}"
              </div>
            </div>

          </div>

        </div>
      )}

    </section>
  );
}
