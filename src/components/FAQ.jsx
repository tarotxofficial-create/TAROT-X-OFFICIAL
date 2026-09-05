import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How do remote video or audio readings work?',
      a: 'All sessions take place via private Zoom video, phone/WhatsApp audio, or as a recorded video report depending on your preference. We begin by centering, discussing your core focus, and diving into the spreads with live interactive interpretation.'
    },
    {
      q: 'What if I have never had a Tarot reading before?',
      a: 'No prior experience is necessary. Our approach is grounded, empathetic, and explanatory. You do not need to memorize card meanings or hold any specific belief system; we walk through every card together clearly.'
    },
    {
      q: 'Will you tell me bad news or predictive doom?',
      a: 'Never. We practice ethical, empowering intuitive guidance. The cards highlight underlying energy currents, psychological patterns, and potential trajectories so you can make empowered decisions, never fear-based predictions.'
    },
    {
      q: 'Can I record the session or receive a copy?',
      a: 'Yes. All video consultations are recorded and shared privately with you along with high-definition photos of your spreads for future reflection.'
    },
    {
      q: 'How should I prepare for my reading?',
      a: 'Simply choose a quiet, undisturbed space for the duration of the call. Spend a few minutes before our session reflecting on the key life areas or questions you would like clarity on.'
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
