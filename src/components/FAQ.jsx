import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How does the ₹99 Offline Analysis Report work?',
      a: '“Tell me what happened. Not what you think it means.” You submit your situation and specific questions through the form. No live call is required. X maps your situation against archetypal patterns and probabilities, delivering a comprehensive written diagnostic report with high-resolution card spread photos directly to your email within 24–48 hours.'
    },
    {
      q: 'How does the ₹999 1-to-1 Live Zoom Consultation work?',
      a: '“I\'m just making it harder for you to lie to yourself.” You select your preferred time slot on our integrated calendar. During the private 30-minute video session, X uses the cards as a structured prompt to interrogate your assumptions, expose behavioral contradictions, and map probable outcomes in real time.'
    },
    {
      q: 'What details should I provide for the ₹99 Offline Report?',
      a: 'Provide your name, email, primary area of concern, and 1 to 3 concrete questions. Focus on observable behaviors, recurring patterns, and real choices rather than vague wishes. The clearer your facts, the sharper the probability model.'
    },
    {
      q: 'Will you predict my exact future or tell me what to do?',
      a: '“I don\'t predict your future. I show you what your habits are already predicting for you.” Tarot cards do not make decisions—you do. X does not claim supernatural certainty or divine authority. You receive conditional probabilities based on your current trajectory, identifying the single variable that could alter the outcome.'
    },
    {
      q: 'Is this fortune telling or psychic divination?',
      a: '“It isn\'t magic. It\'s a model.” X is an atheist rationalist who views tarot as a compact symbolic interface for human psychology, probability, and decision theory. There is no mystical jargon, no doom prophecies, and no ritual dependency. You come for answers; you leave with perspective.'
    }
  ];

  return (
    <section id="faq" className="py-20 border-t border-slate-800/80 scroll-mt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-gold-400 text-xs font-cinzel uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Inquiries</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold gold-gradient-text">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between space-x-4 hover:text-gold-300 transition-colors"
                >
                  <span className="font-cinzel text-sm sm:text-base font-bold text-slate-100">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gold-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
