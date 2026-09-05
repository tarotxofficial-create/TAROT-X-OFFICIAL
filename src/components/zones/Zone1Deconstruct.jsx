import React, { useState } from 'react';
import { RotateCw, Shield, Layers, HelpCircle, X, ChevronRight, Activity } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

export default function Zone1Deconstruct({ onSelectCardForAudit }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [flipped, setFlipped] = useState(false);

  const probabilityNodes = [
    {
      id: 'NODE #07',
      name: 'Sunk-Cost Trajectory',
      replaces: 'The Hanged Man',
      symbol: 'Ψ',
      heuristic: 'Emotional stagnation due to past resource investment.',
      formula: 'P(Stagnation) = ∫ (Historical_Cost / Projected_Yield) dt',
      diagnosis: 'The subject remains paralyzed in an obsolete contract or emotional partnership solely because 3+ years have already been burned. Continuing to invest does not alter the historical ledger; it merely guarantees future insolvency.',
      prescription: 'Write down the capital and emotional loss immediately. Treat current coordinates as Day Zero.',
      category: 'RESOURCE TRAP'
    },
    {
      id: 'NODE #16',
      name: 'Structural Rupture',
      replaces: 'The Tower',
      symbol: 'Δ',
      heuristic: 'Deterministic failure of unmaintained systems.',
      formula: 'Stress(t) > Structural_Yield_Strength',
      diagnosis: 'The collapse is not an arbitrary act of God. It is the predictable mechanical failure of foundations built on unaddressed compromises, concealed debt, or unspoken resentments.',
      prescription: 'Cease attempts to hold up the ceiling. Evacuate the structure, inventory the rubble, and re-engineer the load-bearing parameters.',
      category: 'SYSTEM BREAK'
    },
    {
      id: 'NODE #21',
      name: 'Deterministic Equilibrium',
      replaces: 'The World',
      symbol: '∞',
      heuristic: 'Complete behavioral feedback loops & structural autonomy.',
      formula: 'Feedback_Delay ≈ 0 | Error_Variance → min',
      diagnosis: 'The variables in your decision ecosystem have reached full coherence. Inputs reliably produce expected outputs without dramatic friction or emotional leak.',
      prescription: 'Do not introduce chaotic variables out of boredom. Cement the operational protocol.',
      category: 'STABLE VECTOR'
    },
    {
      id: 'NODE #04',
      name: 'The Escalation Trap',
      replaces: 'The Emperor',
      symbol: 'Ω',
      heuristic: 'Rigid defense of declining authority.',
      formula: 'Centralization ↑ => Fragility(t) ↑',
      diagnosis: 'Increasing enforcement mechanisms to hide an inability to adapt. You are micromanaging symptoms while the systemic macro-trend shifts against you.',
      prescription: 'Decentralize control. Allow localized failure to preserve systemic integrity.',
      category: 'AUTHORITY FAULT'
    },
    {
      id: 'NODE #18',
      name: 'Cognitive Blindspot',
      replaces: 'The Moon',
      symbol: 'Ø',
      heuristic: 'Projection of internal fear onto ambiguous external data.',
      formula: 'Noise_Interpretation = Bias(Fear) * Signal_Ambiguity',
      diagnosis: 'Paranoia masquerading as intuition. You are constructing elaborate conspiracy narratives around peers or partners because the truth is too mundane.',
      prescription: 'Demand verifiable metrics. Refuse to act on impressions unbacked by timestamped facts.',
      category: 'PERCEPTION ERROR'
    },
    {
      id: 'NODE #09',
      name: 'Isolationist Drift',
      replaces: 'The Hermit',
      symbol: '∑',
      heuristic: 'Withdrawal disguised as intellectual superiority.',
      formula: 'Information_Exchange → 0 | Echo_Amplification → max',
      diagnosis: 'You tell yourself you are independent, but isolation is merely an armor against critique and rejection.',
      prescription: 'Open an encrypted channel with a trusted adversary. Test your models in public debate.',
      category: 'FEEDBACK DEFICIT'
    }
  ];

  const handleCardClick = (node) => {
    audioEngine.playMechanicalClick();
    setSelectedCard(node);
    setFlipped(false);
  };

  const handleFlip = () => {
    audioEngine.playMechanicalClick();
    setFlipped(!flipped);
  };

  return (
    <section className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 relative z-10 py-24 select-none">
      <div className="max-w-6xl mx-auto w-full space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-cyan-vector font-mono text-xs tracking-[0.25em] uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>ZONE 1 // Z: -500 TO -1500 PX</span>
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl font-bold text-bone tracking-tight">
            THE CONNECT DECONSTRUCTION
          </h2>
          <p className="text-xs sm:text-sm text-smoke/80 font-sans max-w-xl mx-auto">
            78 Probability Cards suspended in zero gravity, connected by live vector lines. Click any node to rotate 180° and expose its mathematical behavioral heuristic.
          </p>
        </div>

        {/* 3D Interactive Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {probabilityNodes.map((node) => (
            <div
              key={node.id}
              onClick={() => handleCardClick(node)}
              className="group relative cursor-pointer monolith-panel rounded-2xl p-6 border border-steel-light hover:border-cyan-vector/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(102,252,241,0.2)] flex flex-col justify-between space-y-5"
            >
              {/* Card Header Telemetry */}
              <div className="flex items-center justify-between font-mono text-xs border-b border-steel/60 pb-3">
                <span className="text-cyan-vector font-bold tracking-wider">{node.id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-steel text-amber-warning font-semibold">
                  {node.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-steel/80 border border-steel-light flex items-center justify-center font-mono text-xl text-amber-warning group-hover:text-cyan-vector transition-colors">
                    {node.symbol}
                  </div>
                  <div>
                    <h3 className="font-mono text-base font-bold text-bone group-hover:text-cyan-vector transition-colors">
                      {node.name}
                    </h3>
                    <span className="text-[11px] font-mono text-smoke/60">
                      Replaces: <span className="italic">{node.replaces}</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-smoke leading-relaxed font-sans line-clamp-2">
                  {node.heuristic}
                </p>
              </div>

              {/* Card Footer Metric */}
              <div className="pt-3 border-t border-steel/60 flex items-center justify-between font-mono text-[11px] text-smoke/70">
                <span className="text-cyan-vector/80 flex items-center space-x-1">
                  <Activity className="w-3 h-3" />
                  <span>CLICK TO INSPECT</span>
                </span>
                <ChevronRight className="w-4 h-4 text-cyan-vector group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* 180° Card Inspection Modal */}
        {selectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg perspective-1000">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-steel text-bone hover:text-cyan-vector border border-steel-light transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Flip Card Container */}
              <div 
                className={`relative w-full transition-transform duration-700 transform-style-3d ${
                  flipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* FRONT FACE: Vector Archetype */}
                <div className="w-full monolith-panel rounded-3xl p-8 border border-cyan-vector/50 shadow-[0_0_50px_rgba(102,252,241,0.25)] space-y-6 backface-hidden">
                  <div className="flex items-center justify-between font-mono text-xs border-b border-steel pb-3">
                    <span className="text-cyan-vector font-bold tracking-widest">{selectedCard.id} // DECONSTRUCTED</span>
                    <span className="text-amber-warning font-semibold">{selectedCard.category}</span>
                  </div>

                  <div className="text-center space-y-3 py-4">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-void border-2 border-cyan-vector flex items-center justify-center text-3xl font-mono text-cyan-vector shadow-[0_0_20px_rgba(102,252,241,0.4)]">
                      {selectedCard.symbol}
                    </div>
                    <h3 className="font-mono text-2xl font-bold text-bone tracking-tight">
                      {selectedCard.name}
                    </h3>
                    <p className="text-xs font-mono text-smoke/70">
                      Classical Predecessor: {selectedCard.replaces}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-void/70 border border-steel space-y-1 font-mono text-xs">
                    <span className="text-[10px] text-cyan-vector tracking-widest uppercase">Mathematical Formula</span>
                    <p className="text-bone font-mono font-semibold">{selectedCard.formula}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-smoke font-sans leading-relaxed">
                    {selectedCard.heuristic}
                  </p>

                  <button
                    onClick={handleFlip}
                    className="w-full py-3.5 rounded-xl bg-cyan-vector text-void font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center space-x-2 hover:bg-cyan-glow transition-all"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>ROTATE 180° TO REVEAL DIAGNOSIS</span>
                  </button>
                </div>

                {/* BACK FACE: Cold Psychological Diagnosis */}
                <div className="absolute inset-0 w-full monolith-panel rounded-3xl p-8 border border-amber-warning/50 shadow-[0_0_50px_rgba(197,160,89,0.25)] space-y-6 backface-hidden rotate-y-180 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between font-mono text-xs border-b border-steel pb-3">
                      <span className="text-amber-warning font-bold tracking-widest">COLD BEHAVIORAL DIAGNOSIS</span>
                      <span className="text-smoke/60">NODE SPEC</span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-cyan-vector uppercase tracking-widest">Behavioral Bottleneck</span>
                      <p className="text-xs sm:text-sm text-bone font-sans leading-relaxed">
                        {selectedCard.diagnosis}
                      </p>
                    </div>

                    <div className="space-y-2 p-4 rounded-xl bg-void/90 border border-amber-warning/30">
                      <span className="text-[10px] font-mono text-amber-warning uppercase tracking-widest">Operational Protocol</span>
                      <p className="text-xs text-smoke font-sans leading-relaxed font-medium">
                        {selectedCard.prescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4 border-t border-steel">
                    <button
                      onClick={handleFlip}
                      className="flex-1 py-3 rounded-xl bg-steel hover:bg-steel-light text-bone font-mono text-xs tracking-wider"
                    >
                      FLIP TO FRONT
                    </button>
                    {onSelectCardForAudit && (
                      <button
                        onClick={() => {
                          audioEngine.playPneumaticLock();
                          onSelectCardForAudit(selectedCard);
                        }}
                        className="flex-1 py-3 rounded-xl cyan-wireframe-button font-mono text-xs font-bold tracking-wider"
                      >
                        AUDIT THIS NODE
                      </button>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
