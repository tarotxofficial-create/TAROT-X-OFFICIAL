import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  RotateCw, 
  CheckCircle2, 
  Bookmark, 
  Share2, 
  Copy, 
  Eye, 
  Layers, 
  HelpCircle,
  Wand2,
  Compass,
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TAROT_DECK } from '../data/tarotDeckData';
import { SPREADS } from '../data/spreadsData';
import { soundEngine } from '../lib/soundEngine';
import { saveReading } from '../lib/supabase';

export default function TarotTable({ onSaveToJournal }) {
  const [selectedSpread, setSelectedSpread] = useState(SPREADS[1]); // Default 3-Card Timeline
  const [question, setQuestion] = useState('');
  const [isShuffling, setIsShuffling] = useState(false);
  const [isDealt, setIsDealt] = useState(false);
  const [drawnCards, setDrawnCards] = useState([]);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [isSaved, setIsSaved] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Suggested intention queries
  const suggestedQueries = [
    'What energy should I embody today for my highest good?',
    'What hidden opportunities or blind spots exist in my career?',
    'What is the spiritual lesson in my current relationship dynamic?',
    'How can I break through current creative and financial blocks?'
  ];

  // Cast Spread / Deal Cards
  const handleDealSpread = () => {
    setIsShuffling(true);
    setIsDealt(false);
    setRevealedIndices(new Set());
    setIsSaved(false);
    soundEngine.playOracleChime();

    setTimeout(() => {
      // Shuffle 78-card deck & draw required number of cards
      const shuffled = [...TAROT_DECK].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, selectedSpread.cardCount).map((card, idx) => {
        // 25% chance of card appearing reversed for authentic reading
        const isReversed = Math.random() < 0.25;
        const positionMeta = selectedSpread.positions[idx] || { label: `Position ${idx + 1}`, description: 'Active Guidance' };
        return {
          ...card,
          isReversed,
          positionLabel: positionMeta.label,
          positionDesc: positionMeta.description
        };
      });

      setDrawnCards(selected);
      setIsShuffling(false);
      setIsDealt(true);
    }, 1200);
  };

  // Flip an individual card
  const handleFlipCard = (index) => {
    if (revealedIndices.has(index)) return;
    soundEngine.playCardFlipSound();
    const newRevealed = new Set(revealedIndices);
    newRevealed.add(index);
    setRevealedIndices(newRevealed);

    // If all cards revealed, celebrate with celestial gold confetti
    if (newRevealed.size === drawnCards.length) {
      triggerCelestialConfetti();
    }
  };

  // Reveal All Cards
  const handleRevealAll = () => {
    soundEngine.playOracleChime();
    const allIndices = new Set(drawnCards.map((_, i) => i));
    setRevealedIndices(allIndices);
    triggerCelestialConfetti();
  };

  const triggerCelestialConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#eab308', '#9333ea', '#38bdf8']
      });
    } catch {
      // ignore
    }
  };

  // Save to Journal
  const handleSaveReading = async () => {
    if (drawnCards.length === 0 || isSaved) return;
    
    const readingData = {
      spread_id: selectedSpread.id,
      spread_name: selectedSpread.name,
      question: question.trim() || 'General Spiritual Alignment',
      cards: drawnCards.map(c => ({
        id: c.id,
        name: c.name,
        isReversed: c.isReversed,
        positionLabel: c.positionLabel,
        keywords: c.isReversed ? c.reversedKeywords : c.uprightKeywords
      })),
      notes: ''
    };

    await saveReading(readingData);
    setIsSaved(true);
    if (onSaveToJournal) onSaveToJournal();
  };

  // Copy synthesis to clipboard
  const handleCopySummary = () => {
    const textLines = [
      `🔮 TAROT X OFFICIAL READING — ${selectedSpread.name.toUpperCase()}`,
      `Query: "${question || 'General Guidance'}"`,
      `Date: ${new Date().toLocaleDateString()}`,
      '',
      ...drawnCards.map(c => 
        `• ${c.positionLabel}: ${c.name} (${c.isReversed ? 'REVERSED' : 'UPRIGHT'}) — ${c.isReversed ? c.reversedMeaning : c.uprightMeaning}`
      ),
      '',
      `Affirmation: ${drawnCards[0]?.affirmation || 'I align with divine flow.'}`,
      '— Tarot X Official Sacred Oracle'
    ].join('\n');

    navigator.clipboard.writeText(textLines);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  // Calculate elemental balance of current spread
  const calculateElementalBalance = () => {
    if (drawnCards.length === 0) return null;
    const counts = { Fire: 0, Water: 0, Air: 0, Earth: 0 };
    drawnCards.forEach(c => {
      if (c.element && counts[c.element] !== undefined) {
        counts[c.element]++;
      }
    });
    const total = drawnCards.length || 1;
    return {
      fire: Math.round((counts.Fire / total) * 100),
      water: Math.round((counts.Water / total) * 100),
      air: Math.round((counts.Air / total) * 100),
      earth: Math.round((counts.Earth / total) * 100)
    };
  };

  const elements = calculateElementalBalance();
  const allRevealed = isDealt && drawnCards.length > 0 && revealedIndices.size === drawnCards.length;

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Table Header & Sanctuary Controls */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        
        {/* Title & Description */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gold-500/15 pb-6">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30">
                <Flame className="w-5 h-5" />
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wide gold-gradient-text">
                The Sacred Tarot Sanctuary
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Select your spread, focus your intention into the oracle, and cast the 78-card Arcana.
            </p>
          </div>

          {/* Spread Selector Chips */}
          <div className="flex flex-wrap gap-2">
            {SPREADS.map((spread) => (
              <button
                key={spread.id}
                onClick={() => {
                  setSelectedSpread(spread);
                  setIsDealt(false);
                  setDrawnCards([]);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-semibold tracking-wider transition-all ${
                  selectedSpread.id === spread.id
                    ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 shadow-md shadow-gold-500/20 font-bold'
                    : 'bg-obsidian-900/80 text-slate-300 border border-slate-800 hover:border-gold-500/40'
                }`}
              >
                {spread.name} ({spread.cardCount})
              </button>
            ))}
          </div>
        </div>

        {/* Question & Intention Input */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-xs font-cinzel uppercase tracking-widest text-gold-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intention & Soul Query (Optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What guidance does my soul need for this new career path?"
              className="w-full px-4 py-3.5 rounded-2xl bg-obsidian-900/90 border border-gold-500/25 focus:border-gold-400 focus:ring-2 focus:ring-gold-500/20 text-slate-100 placeholder-slate-500 text-sm tracking-wide transition-all outline-none"
            />
          </div>

          {/* Suggested Queries */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-serif">Suggestions:</span>
            {suggestedQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(q)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-obsidian-850 hover:bg-slate-800 border border-slate-800 hover:border-gold-500/30 text-slate-300 transition-colors"
              >
                "{q.slice(0, 38)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Shuffle & Deal Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-gold-400" />
            <span>Spread: <strong className="text-slate-200">{selectedSpread.name}</strong> ({selectedSpread.cardCount} Cards)</span>
          </div>

          <div className="flex items-center space-x-3">
            {isDealt && (
              <button
                onClick={handleRevealAll}
                disabled={allRevealed}
                className="px-4 py-2.5 rounded-xl bg-obsidian-850 border border-gold-500/30 text-gold-300 hover:bg-obsidian-800 text-xs font-semibold uppercase tracking-wider disabled:opacity-50 transition-all flex items-center space-x-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>Reveal All</span>
              </button>
            )}

            <button
              onClick={handleDealSpread}
              disabled={isShuffling}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 via-amber-500 to-yellow-600 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-lg shadow-gold-500/20 hover:scale-[1.02] active:scale-98 disabled:opacity-50 transition-all flex items-center space-x-2"
            >
              <RotateCw className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
              <span>{isShuffling ? 'Invoking Oracle...' : isDealt ? 'Re-Cast Spread' : 'Shuffle & Deal Cards'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* ── CARD DEALING TABLE (3D PERSPECTIVE) ─────────────────────────── */}
      {isDealt && (
        <div className="space-y-10 animate-fade-in">
          
          {/* Active Cards Grid */}
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-gold-500/25 bg-gradient-to-b from-obsidian-900/90 to-obsidian-950">
            
            {/* Table guidance indicator */}
            <div className="text-center pb-8 space-y-1">
              <p className="text-xs uppercase tracking-widest text-gold-400 font-cinzel">
                {allRevealed ? '✨ Sacred Cards Revealed ✨' : 'Click each sacred card to unveil its celestial message'}
              </p>
              <p className="text-xs text-slate-400">
                Revealed {revealedIndices.size} of {drawnCards.length} Cards
              </p>
            </div>

            {/* Responsive Card Layout */}
            <div className={`grid gap-6 sm:gap-8 justify-center ${
              drawnCards.length === 1 
                ? 'grid-cols-1 max-w-xs mx-auto'
                : drawnCards.length === 3 
                ? 'grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto'
                : drawnCards.length === 5
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
            }`}>
              {drawnCards.map((card, idx) => {
                const isRevealed = revealedIndices.has(idx);

                return (
                  <div key={card.id + idx} className="flex flex-col items-center space-y-3">
                    
                    {/* Position Badge */}
                    <div className="text-center">
                      <span className="text-[11px] font-cinzel font-semibold uppercase tracking-wider text-gold-300 block">
                        {card.positionLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 block max-w-[160px] truncate">
                        {card.positionDesc}
                      </span>
                    </div>

                    {/* 3D Flip Card Container */}
                    <div
                      onClick={() => handleFlipCard(idx)}
                      className="w-44 sm:w-48 h-72 sm:h-76 perspective-1000 cursor-pointer group"
                    >
                      <div
                        className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${
                          isRevealed ? 'rotate-y-180' : 'group-hover:scale-105'
                        }`}
                      >
                        {/* CARD BACK (Shimmering Arcane Seal) */}
                        <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-obsidian-900 via-indigo-950 to-obsidian-900 border-2 border-gold-500/40 p-3 shadow-2xl backface-hidden flex flex-col items-center justify-between card-hologram">
                          <div className="w-full flex justify-between text-gold-400/50 text-[10px] font-mono">
                            <span>✦</span><span>TAROT X</span><span>✦</span>
                          </div>

                          <div className="relative w-20 h-20 rounded-full border border-gold-500/40 flex items-center justify-center bg-obsidian-950/70 shadow-inner">
                            <Sparkles className="w-8 h-8 text-gold-400 animate-pulse-slow" />
                            <div className="absolute inset-0 rounded-full border border-gold-400/20 animate-ping opacity-25" />
                          </div>

                          <div className="text-center">
                            <span className="text-[9px] uppercase tracking-widest text-gold-300/80 font-cinzel block">
                              Tap to Reveal
                            </span>
                          </div>
                        </div>

                        {/* CARD FRONT (Unveiled Artwork & Lore) */}
                        <div className="absolute inset-0 w-full h-full rounded-2xl bg-obsidian-900 border-2 border-gold-400/80 p-2 shadow-2xl rotate-y-180 backface-hidden overflow-hidden flex flex-col justify-between">
                          
                          {/* Image Thumbnail & Overlay */}
                          <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gold-500/30">
                            <img
                              src={card.image}
                              alt={card.name}
                              className={`w-full h-full object-cover brightness-90 contrast-125 transition-transform duration-500 ${
                                card.isReversed ? 'rotate-180 scale-105' : ''
                              }`}
                            />
                            {card.isReversed && (
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-900/90 text-rose-200 text-[9px] font-bold uppercase tracking-wider border border-rose-500/40">
                                Reversed
                              </span>
                            )}
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-obsidian-950/80 text-gold-300 text-[9px] font-mono border border-gold-500/30">
                              {card.element}
                            </span>
                          </div>

                          {/* Card Nomenclature & Details */}
                          <div className="p-1 text-center space-y-1">
                            <h4 className="font-cinzel text-xs sm:text-sm font-bold text-gold-200 truncate">
                              {card.name}
                            </h4>
                            <p className="text-[10px] text-slate-300 leading-tight line-clamp-2">
                              {card.isReversed ? card.reversedMeaning : card.uprightMeaning}
                            </p>
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* ── AI ORACLE SYNTHESIS INTERPRETATION ──────────────────────────── */}
          {allRevealed && (
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-gold-500/30 space-y-8 animate-fade-in">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold-500/20 pb-6">
                <div>
                  <div className="flex items-center space-x-2 text-gold-400 text-xs font-cinzel uppercase tracking-widest">
                    <Wand2 className="w-4 h-4" />
                    <span>AI Oracle Synthesis & Sacred Interpretation</span>
                  </div>
                  <h3 className="font-cinzel text-2xl font-bold text-slate-100 mt-1">
                    {selectedSpread.name} Revelation
                  </h3>
                  {question && (
                    <p className="text-xs text-slate-400 italic mt-0.5">
                      Intention: "{question}"
                    </p>
                  )}
                </div>

                {/* Actions: Save to Journal & Copy */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleCopySummary}
                    className="px-4 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-slate-700 text-slate-300 hover:text-gold-300 text-xs font-semibold transition-all flex items-center space-x-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedToast ? 'Copied to Clipboard!' : 'Copy Reading'}</span>
                  </button>

                  <button
                    onClick={handleSaveReading}
                    disabled={isSaved}
                    className={`px-5 py-2 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                      isSaved
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                        : 'bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 shadow-md shadow-gold-500/20 hover:brightness-110'
                    }`}
                  >
                    {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    <span>{isSaved ? 'Saved to Journal' : 'Save to Journal'}</span>
                  </button>
                </div>
              </div>

              {/* Elemental Balance Bar */}
              {elements && (
                <div className="p-4 rounded-2xl bg-obsidian-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-cinzel text-gold-300 font-semibold uppercase tracking-wider">
                      Primordial Elemental Current
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Fire: {elements.fire}% • Water: {elements.water}% • Air: {elements.air}% • Earth: {elements.earth}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden flex bg-obsidian-950">
                    <div style={{ width: `${elements.fire}%` }} className="bg-orange-500" title="Fire (Passion)" />
                    <div style={{ width: `${elements.water}%` }} className="bg-blue-500" title="Water (Emotion)" />
                    <div style={{ width: `${elements.air}%` }} className="bg-cyan-400" title="Air (Intellect)" />
                    <div style={{ width: `${elements.earth}%` }} className="bg-amber-600" title="Earth (Grounded)" />
                  </div>
                </div>
              )}

              {/* Card-by-Card Deep Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drawnCards.map((card, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-obsidian-900/70 border border-slate-800/80 space-y-3 hover:border-gold-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-cinzel font-bold text-gold-400 uppercase tracking-wide">
                        {card.positionLabel}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {card.element} • {card.astrology}
                      </span>
                    </div>

                    <h4 className="font-cinzel text-lg font-bold text-slate-100 flex items-center space-x-2">
                      <span>{card.name}</span>
                      {card.isReversed && (
                        <span className="text-xs text-rose-400 font-sans font-semibold">(Reversed)</span>
                      )}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {card.isReversed ? card.reversedMeaning : card.uprightMeaning}
                    </p>

                    <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                      {(card.isReversed ? card.reversedKeywords : card.uprightKeywords).map((kw, k) => (
                        <span key={k} className="text-[10px] px-2 py-0.5 rounded bg-gold-500/10 text-gold-300 border border-gold-500/20">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actionable Advice & Daily Affirmation Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-gold-500/10 via-obsidian-900 to-mystic-purple/15 border border-gold-500/30 space-y-3">
                <div className="flex items-center space-x-2 text-gold-400 text-xs font-cinzel uppercase tracking-wider font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Oracle Guidance & Soul Affirmation</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  <strong className="text-gold-300">Prescription:</strong> {drawnCards[0]?.advice || 'Trust the unfolding journey and anchor your energy in gratitude.'}
                </p>
                <div className="p-3 rounded-xl bg-obsidian-950/80 border border-gold-500/20 text-center font-serif italic text-gold-200 text-sm">
                  "{drawnCards[0]?.affirmation || 'I walk with divine courage, clarity, and unshakeable inner peace.'}"
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </section>
  );
}
