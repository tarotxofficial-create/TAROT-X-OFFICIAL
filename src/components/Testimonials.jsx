import React from 'react';
import { Terminal, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Testimonials() {
  const cases = [
    {
      id: 'CASE 084',
      focus: 'Executive Partnership Dilemma',
      session: '1-to-1 Live Zoom (₹999)',
      quote: 'I entered expecting mystical generalities. Instead, X systematically dissected the recurrent conflict loop in my partnership negotiations that I had rationalized away for 14 months. It was not fortune-telling; it was behavioral radiography.',
      author: 'Managing Director, Tech Co.',
      location: 'Mumbai, IN',
      outcome: 'Negotiation restructured within 72 hours'
    },
    {
      id: 'CASE 129',
      focus: 'Product Execution Paralysis',
      session: 'Offline Pattern Report (₹99)',
      quote: 'The ₹99 Offline Dossier was shockingly razor-sharp. No promises of sudden wealth or cosmic destiny—just an uncompromising breakdown of why I stall at the 80% mark and which emotional variable I was pretending not to see.',
      author: 'Systems Architect',
      location: 'Bengaluru, IN',
      outcome: 'Identified root bottleneck in personal workflow'
    },
    {
      id: 'CASE 201',
      focus: 'High-Stakes Career Pivot',
      session: '1-to-1 Live Zoom (₹999)',
      quote: '30 minutes on Zoom. No incense, no bells, zero theatrics. Just the cards treated as archetypal variables laid across a grid. I left with more structural clarity than six months of recursive overthinking had yielded.',
      author: 'Quantitative Researcher',
      location: 'New Delhi, IN',
      outcome: 'Resigned and executed planned enterprise pivot'
    }
  ];

  return (
    <section id="reviews" className="py-24 border-t border-charcoal/80 bg-void scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-brass text-xs font-mono uppercase tracking-[0.25em]">
              <Terminal className="w-3.5 h-3.5" />
              <span>Declassified Observations</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-bone tracking-tight">
              Session Debriefs & Case Records
            </h2>
            <p className="text-xs sm:text-sm text-smoke font-sans max-w-xl">
              Unvarnished reflections from clients who used the pattern reader to dismantle cognitive loops and clarify decisions.
            </p>
          </div>

          <div className="inline-flex items-center space-x-2 text-xs font-mono text-smoke/70 border border-charcoal px-3 py-1.5 rounded-lg bg-ink/60">
            <ShieldCheck className="w-4 h-4 text-brass" />
            <span>Identity redacted for client confidentiality</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((item, idx) => (
            <div
              key={idx}
              className="bg-ink/60 p-6 sm:p-7 rounded-2xl border border-charcoal hover:border-brass/40 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-smoke border-b border-charcoal/60 pb-3">
                  <span className="text-brass tracking-wider font-semibold">{item.id}</span>
                  <span className="text-[11px] bg-charcoal/60 px-2 py-0.5 rounded text-smoke/80">{item.session}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-smoke/60">Focus Field</span>
                  <p className="text-xs font-semibold text-bone">{item.focus}</p>
                </div>

                <blockquote className="text-xs sm:text-[13px] text-smoke leading-relaxed italic border-l-2 border-brass/50 pl-3">
                  "{item.quote}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-charcoal/60 space-y-2 font-mono">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-bone font-sans font-medium">{item.author}</span>
                  <span className="text-smoke/60">{item.location}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] text-brass/90">
                  <CheckCircle2 className="w-3 h-3 text-brass shrink-0" />
                  <span className="truncate">{item.outcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

