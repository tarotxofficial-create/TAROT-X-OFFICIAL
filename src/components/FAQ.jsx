import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldAlert, Cpu } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'Is this fortune-telling or psychic prediction?',
      a: 'No. X is an atheist and a rationalist. We do not channel spirits, predict lottery numbers, or claim supernatural powers. The 78 cards of the tarot represent an exhaustive, 600-year-old taxonomy of human archetypes, behavioral loops, and psychological states. We use them as an external cognitive mirror to diagnose the patterns governing your choices.'
    },
    {
      q: 'How does the ₹99 Offline Pattern Report work?',
      a: 'You submit your situation and answer the 5 intake questions through our encrypted form. No live call is required. Within 24–48 hours, X conducts your spread in the studio and emails you a structured, written diagnostic dossier (PDF format) complete with high-resolution photography of the spread and precise pattern analysis.'
    },
    {
      q: 'How does the ₹999 1-to-1 Live Zoom Reading work?',
      a: 'A dedicated 30-minute private video consultation on Zoom with X. After selecting your slot and completing intake, you receive a direct calendar invitation. During the session, the card layout is built live on camera, dissecting your blind spots, risk variables, and decision architecture in real time.'
    },
    {
      q: 'What questions will X refuse to answer? (Boundary Protocol)',
      a: 'Strict boundaries apply: We refuse queries requesting medical diagnoses, legal dispute outcomes, gambling advice, or third-party surveillance ("What is my ex thinking right now?"). The reading is strictly anchored to YOUR agency, YOUR psychology, and YOUR decision surface.'
    },
    {
      q: 'Do I need to believe in tarot, spirituality, or mysticism for this to work?',
      a: 'Not at all. In fact, healthy skepticism is welcomed. Think of the spread not as magic, but as a projective diagnostic tool—similar to a structured Rorschach or decision tree. If you can think critically and confront your own habits honestly, the system will yield immense clarity.'
    },
    {
      q: 'Is my intake and reading confidential?',
      a: 'Strictly confidential. Your intake data, questions, and reading dossiers are never shared, published, or repurposed. All communications are private between you and X.'
    }
  ];

  return (
    <section id="faq" className="py-24 border-t border-charcoal/80 bg-ink/50 scroll-mt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-brass text-xs font-mono uppercase tracking-[0.25em]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Operational Clarity</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-bone tracking-tight">
            Frequently Examined Questions
          </h2>
          <p className="text-xs sm:text-sm text-smoke font-sans max-w-lg mx-auto">
            Everything you need to understand regarding method, boundaries, and session formats.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-void/80 rounded-xl border border-charcoal hover:border-brass/30 transition-all duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between space-x-4 hover:text-brass transition-colors"
                >
                  <span className="font-cinzel text-sm sm:text-base font-semibold text-bone/90">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-brass shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brass' : 'text-smoke/60'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-smoke leading-relaxed border-t border-charcoal/50 pt-4 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Boundary assurance strip */}
        <div className="p-4 rounded-xl border border-charcoal bg-void/60 flex items-start space-x-3 text-xs text-smoke">
          <ShieldAlert className="w-4 h-4 text-brass shrink-0 mt-0.5" />
          <p>
            <strong className="text-bone font-mono text-[11px] uppercase tracking-wider">Boundary Note:</strong> Every session is governed by strict analytical boundaries. If you require medical or psychiatric care, please contact certified clinical professionals immediately.
          </p>
        </div>

      </div>
    </section>
  );
}

