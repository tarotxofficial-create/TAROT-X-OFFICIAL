import React from 'react';
import { Clock, CheckCircle2, Sparkles, ArrowRight, Video, FileText } from 'lucide-react';

export const READING_SERVICES = [
  {
    id: 'clarity_crossroads',
    title: 'Clarity & Crossroads Session',
    duration: '30 Minutes',
    price: '₹2,999 ($49)',
    inrAmount: 2999,
    popular: false,
    tagline: 'Fast, laser-focused guidance on 1–2 specific questions.',
    description: 'Perfect for urgent decisions, career pivots, or navigating an immediate relationship challenge.',
    deliverables: [
      'Live 1-on-1 Zoom or Phone Consultation',
      'Targeted 3 to 5 Card Spread Analysis',
      'High-Resolution Card Layout Photo',
      'Actionable Next-Step Integration Advice'
    ]
  },
  {
    id: 'deep_dive_lifepath',
    title: 'Life Path & Deep Dive Reading',
    duration: '60 Minutes',
    price: '₹5,499 ($89)',
    inrAmount: 5499,
    popular: true,
    tagline: 'Comprehensive exploration of your career, love & soul growth.',
    description: 'Our most sought-after session. Unpacks current blockages, subconscious patterns, and the emerging 6-month horizon.',
    deliverables: [
      'Full 60-Minute Deep Dive Video Session',
      '7 to 9 Card Multi-Layered Spread',
      'Full Audio/Video Recording to Keep',
      'Astrological & Numerological Context',
      'Follow-Up Email Question Support'
    ]
  },
  {
    id: 'master_celtic_cross',
    title: 'The Master Celtic Cross & Blueprint',
    duration: '90 Minutes',
    price: '₹8,499 ($139)',
    inrAmount: 8499,
    popular: false,
    tagline: 'Exhaustive 10-card arcane blueprint and karmic mapping.',
    description: 'An intensive spiritual immersion addressing karmic lessons, shadow integration, relationship mirrors, and ultimate life destiny.',
    deliverables: [
      'Exhaustive 90-Minute Master Consultation',
      'Complete 10-Card Sacred Celtic Cross',
      'Full Recording + Written Summary PDF',
      'Chakra & Elemental Energy Assessment',
      'Personalized Affirmation & Ritual Guide'
    ]
  }
];

export default function Services({ onSelectService }) {
  return (
    <section id="services" className="py-20 border-t border-slate-800/80 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-gold-400 text-xs font-cinzel uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consultation Offerings</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold gold-gradient-text">
            Reading Packages & Pricing
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            All sessions are conducted with complete confidentiality via live Zoom video or delivered as an audio/video recorded dossier.
          </p>
        </div>

        {/* 3 Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {READING_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className={`relative glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-all duration-300 hover:scale-[1.02] ${
                srv.popular 
                  ? 'border-gold-400 bg-obsidian-900/90 shadow-xl shadow-gold-500/10' 
                  : 'border-slate-800 bg-obsidian-950/70 hover:border-slate-700'
              }`}
            >
              {srv.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-cinzel font-bold text-[10px] uppercase tracking-wider shadow-md">
                  Most Requested
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-xs font-mono text-gold-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{srv.duration}</span>
                  </span>
                  <span className="font-cinzel text-2xl sm:text-3xl font-black text-slate-100">
                    {srv.price}
                  </span>
                </div>

                <div>
                  <h3 className="font-cinzel text-xl font-bold text-slate-100">{srv.title}</h3>
                  <p className="text-xs text-gold-300/90 font-serif italic mt-0.5">{srv.tagline}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{srv.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2.5">
                  <span className="text-[10px] uppercase font-cinzel tracking-wider text-slate-400 block font-bold">
                    What Is Included:
                  </span>
                  {srv.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onSelectService(srv)}
                  className={`w-full py-3.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                    srv.popular
                      ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 shadow-lg shadow-gold-500/25 hover:brightness-110'
                      : 'bg-obsidian-900 border border-gold-500/40 text-gold-300 hover:bg-gold-500 hover:text-obsidian-950'
                  }`}
                >
                  <span>Select & Book Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
