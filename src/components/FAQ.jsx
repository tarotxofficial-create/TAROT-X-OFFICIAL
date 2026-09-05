import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How does the ₹99 Offline Email Reading Report work?',
      a: 'When ordering the ₹99 service, you submit your questions and details through the booking form. No live call is required. We draw your cards with sacred focus and deliver a comprehensive written reading dossier along with high-definition photographs of your card spread directly to your email within 24–48 hours.'
    },
    {
      q: 'How does the ₹999 1-to-1 Live Zoom Reading work?',
      a: 'You select your preferred date and time slot via our integrated Calendly scheduler right in the booking form. Calendly automatically generates your private Zoom meeting link, passcode, and calendar invite. During the 30-minute video session, we explore your patterns interactively with real-time card draws.'
    },
    {
      q: 'What details do I need to provide for the ₹99 Offline Report?',
      a: 'You simply provide your name, the email address where you want the report sent, your primary area of focus (Love, Career, Life Path, etc.), and 1 to 3 specific questions or situation details. You can also optionally include your date of birth or zodiac sign to help align energies.'
    },
    {
      q: 'Can I ask follow-up questions during the 30-minute Live Zoom session?',
      a: 'Yes, absolutely! The live 30-minute Zoom session is completely interactive. You can converse freely, ask follow-up questions as new cards are drawn, and explore multiple dimensions of your life.'
    },
    {
      q: 'Will you tell me bad news or predictive doom?',
      a: 'Never. We practice ethical, empowering intuitive guidance. The cards highlight underlying energy currents, psychological patterns, and potential trajectories so you can make empowered decisions, never fear-based predictions.'
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
