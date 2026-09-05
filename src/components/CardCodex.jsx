import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Sparkles, 
  X, 
  Flame, 
  Droplets, 
  Wind, 
  Coins,
  Star,
  ExternalLink
} from 'lucide-react';
import { TAROT_DECK } from '../data/tarotDeckData';
import { soundEngine } from '../lib/soundEngine';

export default function CardCodex() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all | Major | Wands | Cups | Swords | Pentacles
  const [selectedCard, setSelectedCard] = useState(null);

  // Filter & Search Logic
  const filteredCards = useMemo(() => {
    return TAROT_DECK.filter(card => {
      // Filter by category
      if (activeFilter === 'Major' && card.arcana !== 'Major') return false;
      if (activeFilter === 'Wands' && card.suit !== 'Wands') return false;
      if (activeFilter === 'Cups' && card.suit !== 'Cups') return false;
      if (activeFilter === 'Swords' && card.suit !== 'Swords') return false;
      if (activeFilter === 'Pentacles' && card.suit !== 'Pentacles') return false;

      // Search by query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesElement = card.element?.toLowerCase().includes(q);
        const matchesKeywords = [...card.uprightKeywords, ...card.reversedKeywords].some(k => k.toLowerCase().includes(q));
        const matchesMeaning = card.uprightMeaning.toLowerCase().includes(q);
        return matchesName || matchesElement || matchesKeywords || matchesMeaning;
      }
      return true;
    });
  }, [searchQuery, activeFilter]);

  const handleCardClick = (card) => {
    soundEngine.playCardFlipSound();
    setSelectedCard(card);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold-500/20 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 text-gold-400">
              <BookOpen className="w-6 h-6" />
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wide gold-gradient-text">
                The Arcana Codex (78 Cards)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore the timeless esoteric symbolism, upright and reversed meanings, astrological rulers, and secret lore.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, element, meaning..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-900 border border-slate-700 focus:border-gold-400 text-xs text-slate-200 placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          {[
            { id: 'all', label: 'All Arcana' },
            { id: 'Major', label: 'Major Arcana (22)' },
            { id: 'Wands', label: 'Wands (Fire)' },
            { id: 'Cups', label: 'Cups (Water)' },
            { id: 'Swords', label: 'Swords (Air)' },
            { id: 'Pentacles', label: 'Pentacles (Earth)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all ${
                activeFilter === tab.id
                  ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-bold shadow-md shadow-gold-500/20'
                  : 'bg-obsidian-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Catalog Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className="group glass-panel p-3 rounded-2xl border border-slate-800 hover:border-gold-400/60 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-[1.03] hover:shadow-xl hover:shadow-gold-500/10"
          >
            {/* Image Thumbnail */}
            <div className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden border border-slate-800 group-hover:border-gold-500/40">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-cover brightness-85 contrast-125 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-obsidian-950/80 border border-gold-500/30 text-[9px] font-mono text-gold-300">
                {card.arcana}
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/60 to-transparent p-2 text-center">
                <span className="text-[10px] font-mono text-slate-300">{card.element} • {card.astrology}</span>
              </div>
            </div>

            {/* Title & Keywords */}
            <div className="pt-2 text-center space-y-1">
              <h3 className="font-cinzel text-xs sm:text-sm font-bold text-slate-100 group-hover:text-gold-300 transition-colors truncate">
                {card.name}
              </h3>
              <div className="flex flex-wrap justify-center gap-1">
                {card.uprightKeywords.slice(0, 2).map((k, idx) => (
                  <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-300">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CARD DETAIL MODAL ────────────────────────────────────────────── */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border-2 border-gold-500/40 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl shadow-gold-500/20">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-obsidian-900 border border-slate-700 text-slate-400 hover:text-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content Header */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="w-40 sm:w-48 h-64 rounded-2xl overflow-hidden border-2 border-gold-400 shadow-xl shrink-0 card-hologram">
                <img src={selectedCard.image} alt={selectedCard.name} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-3 text-center sm:text-left">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-mono">
                  <span>{selectedCard.arcana} Arcana</span>
                  <span>•</span>
                  <span>{selectedCard.element} Element</span>
                  <span>•</span>
                  <span>{selectedCard.astrology}</span>
                </div>

                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold gold-gradient-text">
                  {selectedCard.name}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedCard.uprightMeaning}
                </p>

                <div className="p-3 rounded-xl bg-obsidian-900/80 border border-gold-500/20">
                  <span className="text-[11px] uppercase tracking-wider text-gold-400 font-cinzel font-bold block mb-1">
                    Divine Advice
                  </span>
                  <p className="text-xs text-slate-300 italic">
                    "{selectedCard.advice}"
                  </p>
                </div>
              </div>
            </div>

            {/* Upright vs Reversed Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-xl bg-obsidian-900/60 border border-emerald-500/30 space-y-2">
                <span className="text-xs font-cinzel font-bold uppercase text-emerald-400">
                  ✦ Upright Manifestation
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedCard.uprightMeaning}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedCard.uprightKeywords.map((k, i) => (
                    <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-obsidian-900/60 border border-rose-500/30 space-y-2">
                <span className="text-xs font-cinzel font-bold uppercase text-rose-400">
                  ✦ Reversed Inversion
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedCard.reversedMeaning}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedCard.reversedKeywords.map((k, i) => (
                    <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Soul Affirmation Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-gold-500/10 to-mystic-purple/10 border border-gold-500/30 text-center">
              <span className="text-[10px] font-cinzel uppercase tracking-widest text-gold-400 block mb-1">
                Sacred Affirmation
              </span>
              <p className="font-serif italic text-sm text-gold-200">
                "{selectedCard.affirmation}"
              </p>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
