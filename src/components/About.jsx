import React from 'react';
import { Shield, Eye, Brain, Compass, Terminal, Quote, ArrowRight } from 'lucide-react';

export default function About() {
  const quotes = [
    {
      text: "I'm not here to give you what you want to hear. I'm here to show you what's actually there.",
      context: "On radical clarity over comforting deception"
    },
    {
      text: "You're not cursed. You're just repeating patterns you haven't noticed yet.",
      context: "On breaking unconscious behavioral loops"
    },
    {
      text: "I don't predict your future. I highlight the probabilities based on the patterns I see. What you do with that is still your choice.",
      context: "On preserving client agency and autonomy"
    },
    {
      text: "Same cards. Different people. Different stories. Same patterns.",
      context: "On archetypal human commonalities"
    }
  ];

  const parameters = [
    { label: 'IDENTITY', value: 'X, Anonymous Reader' },
    { label: 'IDEOLOGY', value: 'Atheist. Rationalist. Skeptical.' },
    { label: 'CORE TOOL', value: 'Pattern Recognition & Tarot Symbolism' },
    { label: 'APPEARANCE', value: 'Hooded. Bandana Mask. No Persona.' },
    { label: 'BOUNDARIES', value: 'No Prophecy. No Fear-Selling. No Dependency.' },
    { label: 'OUTPUT', value: 'Perspective & Probability Mapping' }
  ];

  return (
    <section id="about" className="py-24 border-t border-brass/20 bg-void scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center space-x-2 text-brass text-[11px] font-mono uppercase tracking-[0.25em]">
            <Terminal className="w-3.5 h-3.5" />
            <span>Profile // Philosophy & Boundaries</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-bone leading-tight">
            Who is X? <br />
            <span className="brass-gradient-text">A mirror, not a miracle.</span>
          </h2>
          <p className="text-xs sm:text-sm text-smoke leading-relaxed font-sans">
            X is a tarot reader, but not a spiritual guide. Not a guru. Not a believer. Not a mystic. He is an atheist and a rationalist who uses tarot as a tool — not for divine messages, but as a system of pattern recognition.
          </p>
        </div>

        {/* Philosophy & Dossier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Dossier Parameters Table */}
          <div className="lg:col-span-5 archive-panel rounded-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-brass/20 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brass">
                OPERATIONAL PARAMETERS
              </span>
              <span className="text-[9px] font-mono text-smoke">REF: X-ARCHIVE</span>
            </div>

            <div className="space-y-3.5">
              {parameters.map((p) => (
                <div key={p.label} className="border-b border-charcoal/80 pb-2.5 text-xs">
                  <span className="font-mono text-[10px] text-smoke uppercase tracking-wider block">
                    {p.label}
                  </span>
                  <span className="font-cinzel text-xs font-semibold text-bone mt-0.5 block">
                    {p.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 p-3.5 rounded-sm bg-ink/90 border-l-2 border-brass text-xs font-serif italic text-smoke">
              "It's not magic. It's a model. You come for answers. You leave with perspective."
            </div>
          </div>

          {/* Right Column: Quotes & Rational Manifesto */}
          <div className="lg:col-span-7 space-y-5">
            <h3 className="font-cinzel text-lg font-bold text-bone uppercase tracking-wider">
              The Rationalist Manifesto
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-smoke leading-relaxed font-sans">
              <p>
                X believes that human life is an intricate web of recurring patterns — in people, relationships, corporate systems, and emotional compromises. Most suffering stems not from malicious curses or cosmic punishment, but from unobserved loops repeated until catastrophe occurs.
              </p>
              <p>
                Tarot, for X, is a visual framework distilled from centuries of archetypal human psychology, myth, and decision-making systems. It functions as a structured mirror: it surfaces what you know subconsciously but refuse to admit consciously.
              </p>
            </div>

            {/* Archival Quotes Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3">
              {quotes.map((q, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-sm bg-ink border border-brass/20 space-y-2 relative flex flex-col justify-between"
                >
                  <Quote className="w-3.5 h-3.5 text-brass/50" />
                  <p className="font-serif italic text-xs text-bone/90 leading-relaxed">
                    "{q.text}"
                  </p>
                  <span className="text-[9px] font-mono text-smoke uppercase tracking-wider block pt-2 border-t border-charcoal/60">
                    {q.context}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

