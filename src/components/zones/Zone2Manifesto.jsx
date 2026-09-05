import React from 'react';
import { ShieldCheck, AlertOctagon, Terminal, Flame, Zap, Scale } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

export default function Zone2Manifesto({ onNextZone }) {
  const operationalCodes = [
    {
      code: 'CODE 01',
      title: 'ATHEIST & RATIONALIST FOUNDATION',
      icon: Scale,
      quote: 'The deck is not a channel to the gods. It is a mirror made of probability matrices. You do not draw cards by destiny; you draw them by chaotic selection, and we map your choices against raw human behavior.',
      annotation: 'Epistemic Rigor: No supernatural entities required to explain cognitive loops.'
    },
    {
      code: 'CODE 02',
      title: 'ZERO COMFORT GUARANTEE',
      icon: AlertOctagon,
      quote: 'If you are seeking emotional validation, false hope, or spiritual comforting, close this portal immediately. I deliver brutal clarity.',
      annotation: 'Boundary: Flattery is malpractice. The reading targets structural flaws in your strategy.'
    },
    {
      code: 'CODE 03',
      title: 'CONNECT MECHANICS',
      icon: Zap,
      quote: 'Life is a system of recurring feedback loops. I simplified classical tarot, numerology, and psychological heuristics into 78 core life vectors. We run your current life variables through the deck to project your statistical outcomes.',
      annotation: 'Mechanism: Archetypes as open-source cognitive taxonomy.'
    }
  ];

  return (
    <section className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 relative z-10 py-24 select-none">
      <div className="max-w-5xl mx-auto w-full space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-amber-warning font-mono text-xs tracking-[0.25em] uppercase">
            <Terminal className="w-3.5 h-3.5" />
            <span>ZONE 2 // Z: -1500 TO -3000 PX</span>
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl font-bold text-bone tracking-tight">
            THE RATIONAL MANIFESTO
          </h2>
          <p className="text-xs sm:text-sm text-smoke/80 font-sans max-w-xl mx-auto">
            X's non-negotiable operational parameters etched into metallic zero-g monolith slabs. Read before entering the diagnostic room.
          </p>
        </div>

        {/* Monolithic Floating Concrete & Steel Slabs */}
        <div className="space-y-6">
          {operationalCodes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onMouseEnter={() => audioEngine.playMechanicalClick()}
                className="monolith-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-steel-light hover:border-cyan-vector/50 transition-all duration-300 relative overflow-hidden group shadow-2xl"
              >
                {/* Accent Hairline Top Border */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-vector/40 to-transparent group-hover:via-cyan-vector transition-all" />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  
                  {/* Left Code & Header */}
                  <div className="space-y-3 md:w-1/3">
                    <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-vector bg-steel/80 px-3 py-1 rounded border border-steel-light">
                      <Icon className="w-3.5 h-3.5 text-cyan-vector" />
                      <span>{item.code}</span>
                    </div>
                    <h3 className="font-mono text-lg sm:text-xl font-bold text-bone tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-mono text-amber-warning/90 tracking-wider uppercase">
                      {item.annotation}
                    </p>
                  </div>

                  {/* Right Quote Block */}
                  <div className="md:w-2/3 border-l-2 border-steel group-hover:border-cyan-vector/60 pl-4 sm:pl-6 transition-colors">
                    <blockquote className="text-sm sm:text-base text-bone font-sans leading-relaxed italic">
                      "{item.quote}"
                    </blockquote>
                    <div className="mt-3 text-right">
                      <span className="font-mono text-xs text-smoke/60 tracking-widest uppercase">— OPERATOR X</span>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Core Axioms Strip */}
        <div className="p-6 rounded-2xl bg-void/90 border border-steel flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-smoke">
          <div className="flex items-center space-x-2 text-amber-warning">
            <ShieldCheck className="w-4 h-4 text-amber-warning shrink-0" />
            <span>ETHICAL PARAMETERS: No medical, psychiatric, legal, or speculative gambling advice.</span>
          </div>
          <button
            onClick={() => {
              audioEngine.playMechanicalClick();
              onNextZone();
            }}
            className="cyan-wireframe-button px-5 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase flex items-center space-x-2 shrink-0"
          >
            <span>PROCEED TO TERMINALS</span>
          </button>
        </div>

      </div>
    </section>
  );
}
