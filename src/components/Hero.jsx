import React, { useState } from 'react';
import { ArrowDown, ArrowUpRight, Shield, Compass, Brain, Eye, Sparkles } from 'lucide-react';

export default function Hero({ onBookClick, onExploreMethod }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 15;
    const y = ((clientY - top) / height - 0.5) * 15;
    setMousePos({ x, y });
  };

  const sampleCards = [
    { id: 1, name: 'THE FEEDBACK LOOP', arcana: 'X • WHEEL OF PATTERNS', pattern: 'Repetitive behavioral cycles and emotional loops.' },
    { id: 2, name: 'THE SUDDEN VARIABLE', arcana: 'XVI • STRUCTURAL SHIFT', pattern: 'Unavoidable friction when rigid assumptions meet reality.' },
    { id: 3, name: 'THE DECISION NODE', arcana: 'II • THE OBSERVER', pattern: 'Unspoken contradictions between desire and action.' },
    { id: 4, name: 'THE REVERSED PERSPECTIVE', arcana: 'XII • SUSPENDED STATE', pattern: 'Intentional pause required before choosing a new trajectory.' }
  ];

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-28 pb-20 overflow-hidden flex flex-col justify-between"
    >
      {/* Volumetric Dark Lighting Haze */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-radial from-brass/10 via-brass/3 to-transparent rounded-full blur-3xl pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: `translate(-50%, calc(-20% + ${mousePos.y * 1.5}px))` }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Scene 01 / Blackout Label & Archive Coordinate */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brass/20 pb-3 mb-10 text-[10px] font-mono text-smoke">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-1.5 h-1.5 bg-brass rounded-full animate-pulse" />
            <span className="tracking-[0.25em] uppercase text-bone">X / PRIVATE READING ROOM</span>
          </div>
          <div className="flex items-center space-x-4 tracking-widest text-[9px]">
            <span>COORD: 28.6139° N, 77.2090° E</span>
            <span>•</span>
            <span>SYSTEM: RATIONALIST TAROT</span>
          </div>
        </div>

        {/* Hero Narrative Grid: Hooded Room & Thesis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Thesis, Contradiction, CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* The Contradiction Badges */}
            <div className="inline-flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-sm bg-ink border border-brass/30 text-bone text-[10px] font-mono tracking-widest uppercase">
                ATHEIST
              </span>
              <span className="text-smoke text-xs">•</span>
              <span className="px-2.5 py-1 rounded-sm bg-ink border border-brass/30 text-bone text-[10px] font-mono tracking-widest uppercase">
                RATIONALIST
              </span>
              <span className="text-smoke text-xs">•</span>
              <span className="px-2.5 py-1 rounded-sm bg-ink border border-brass/30 text-brass text-[10px] font-mono tracking-widest uppercase">
                TAROT READER
              </span>
            </div>

            {/* Main Thesis Headline */}
            <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-bone leading-[1.12]">
              You don't need a prophecy. <br />
              <span className="brass-gradient-text">
                You need to see the pattern.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-sm sm:text-base text-smoke leading-relaxed max-w-xl font-sans">
              X reads the structures behind your choices — without gods, guarantees, or comforting lies. Tarot is not a crystal ball. It is a symbolic pattern interface for human behavior, decisions, and probabilities.
            </p>

            {/* Quote Pill */}
            <div className="p-3.5 rounded-sm bg-ink/70 border-l-2 border-brass max-w-lg text-xs italic text-bone/90 font-serif">
              "Don't confuse my honesty with cruelty. I just don't believe in lies — not even the comforting kind." <span className="not-italic font-mono text-[10px] text-smoke block mt-1">— X</span>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onBookClick}
                className="px-7 py-3.5 rounded-sm bg-brass text-void font-cinzel font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-brass/10 hover:bg-brass-light active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <span>BOOK A READING</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreMethod}
                className="px-6 py-3.5 rounded-sm bg-ink/80 hover:bg-charcoal text-bone border border-brass/30 hover:border-brass/70 font-cinzel font-semibold text-xs tracking-[0.15em] transition-all flex items-center justify-center space-x-2"
              >
                <span>SEE THE METHOD</span>
                <ArrowDown className="w-3.5 h-3.5 text-brass" />
              </button>
            </div>

            {/* Trust Line & Offering Highlights */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-brass/15 text-[11px] text-smoke">
              <div className="flex items-center space-x-2">
                <Brain className="w-3.5 h-3.5 text-brass shrink-0" />
                <span>Pattern Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-3.5 h-3.5 text-brass shrink-0" />
                <span>No Superstition</span>
              </div>
              <div className="flex items-center space-x-2 col-span-2 sm:col-span-1">
                <Compass className="w-3.5 h-3.5 text-brass shrink-0" />
                <span>₹99 / ₹999 Options</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Chamber & Table with X and Cards */}
          <div className="lg:col-span-5 flex justify-center">
            <div 
              className="relative w-full max-w-md rounded-sm overflow-hidden border border-brass/35 bg-ink shadow-2xl group"
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 0.4}deg) rotateX(${-mousePos.y * 0.4}deg)`,
                transition: 'transform 0.25s ease-out'
              }}
            >
              {/* Photo of X at Reading Table */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-void">
                <img 
                  src="/images/x_the_pattern_reader.jpg" 
                  alt="X, The Pattern Reader, seated in a dark room with tarot cards on a rustic table"
                  className="w-full h-full object-cover brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-black/30 pointer-events-none" />
                
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-smoke">
                  <span className="px-2 py-0.5 rounded-sm bg-void/80 border border-brass/20 text-bone">
                    ANONYMOUS READER
                  </span>
                  <span>NO FACE • NO DOGMA</span>
                </div>
              </div>

              {/* Interactive Virtual Card Table Strip */}
              <div className="p-4 bg-ink border-t border-brass/20 space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-smoke uppercase tracking-wider">
                  <span>Interactive Card Probes</span>
                  <span className="text-brass">Hover to inspect</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {sampleCards.map((card) => {
                    const isSelected = activeCard?.id === card.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onMouseEnter={() => setActiveCard(card)}
                        onClick={() => setActiveCard(card)}
                        className={`h-16 rounded-sm border p-1 text-left flex flex-col justify-between transition-all ${
                          isSelected 
                            ? 'bg-charcoal border-brass text-bone shadow-md' 
                            : 'bg-void/70 border-brass/20 text-smoke hover:border-brass/50'
                        }`}
                      >
                        <span className="text-[8px] font-mono text-brass">{card.id}</span>
                        <div className="w-full h-0.5 bg-brass/20" />
                        <span className="text-[8px] font-cinzel leading-tight line-clamp-2">{card.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Inspect Drawer */}
                <div className="p-2.5 rounded-sm bg-void/80 border border-brass/20 text-xs min-h-[48px]">
                  {activeCard ? (
                    <div>
                      <span className="text-[9px] font-mono text-brass block uppercase tracking-widest">
                        {activeCard.arcana}
                      </span>
                      <p className="text-[11px] text-bone mt-0.5">{activeCard.pattern}</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-smoke italic">
                      "Same cards. Different people. Different stories. Same patterns."
                    </p>
                  )}
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Subtle Scroll Down Prompt */}
      <div className="w-full text-center pt-8">
        <button 
          onClick={onExploreMethod}
          className="inline-flex items-center space-x-2 text-[10px] font-mono text-smoke hover:text-brass transition-colors tracking-widest uppercase"
        >
          <span>PROCEED INTO THE ARCHIVE</span>
          <ArrowDown className="w-3 h-3 text-brass animate-bounce" />
        </button>
      </div>

    </section>
  );
}

