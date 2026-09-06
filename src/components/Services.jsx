import React from 'react';
import { Clock, CheckCircle2, Sparkles, ArrowRight, Video, Mail, FileText } from 'lucide-react';

export const READING_SERVICES = [
  {
    id: 'offline_report',
    type: 'offline',
    title: 'Offline Pattern Report',
    duration: 'Sent via Email (24–48 Hrs)',
    price: '₹99',
    inrAmount: 99,
    popular: false,
    badge: 'Fast & Direct',
    tagline: '“Tell me what happened. Not what you think it means.”',
    description: 'Submit your situation and questions. Receive a written diagnostic dossier exposing the behavioral loops, probabilities, and variables at play.',
    deliverables: [
      'Written Pattern Diagnostic Dossier (Email/PDF)',
      'High-Resolution Photographs of Your Card Spread',
      'Targeted Analysis of 1–3 Core Situations or Decisions',
      'Probability Mapping & Variable Identification (No Fluff)',
      'Delivered Directly to Your Email within 24–48 Hours'
    ]
  },
  {
    id: 'live_zoom_30min',
    type: 'live_zoom',
    title: '1-to-1 Live Zoom Reading',
    duration: '30 Minutes Live Call',
    price: '₹999',
    inrAmount: 999,
    popular: true,
    badge: 'Most Popular · Live Interrogation',
    tagline: '“I\'m just making it harder for you to lie to yourself.”',
    description: 'A private 30-minute face-to-face video interrogation. Deconstruct your situation in real time, test your assumptions, and confront what you are avoiding.',
    deliverables: [
      'Private 30-Minute Live 1-on-1 Zoom Consultation',
      'Real-Time Interactive Spread & Pattern Interrogation',
      'Unfiltered Clarity on Relationships, Career, or Crossroads',
      'Identification of Hidden Costs, Drivers & Blind Spots',
      'Instant Calendar Invite & Secure Zoom Link via Email'
    ]
  }
];

export default function Services({ onSelectService }) {
  return (
    <section id="services" className="py-20 border-t border-slate-800/80 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
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
            “The future is not fixed. But neither is it impressed by your intentions.” Choose the diagnostic tier for your decision:
          </p>
        </div>

        {/* 2 Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {READING_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className={`relative glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-all duration-300 hover:scale-[1.02] ${
                srv.popular 
                  ? 'border-gold-400 bg-obsidian-900/90 shadow-2xl shadow-gold-500/15 ring-1 ring-gold-400/50' 
                  : 'border-slate-800 bg-obsidian-950/70 hover:border-slate-700'
              }`}
            >
              {srv.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full font-cinzel font-bold text-[10px] uppercase tracking-wider shadow-md ${
                  srv.popular
                    ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950'
                    : 'bg-obsidian-800 border border-gold-500/40 text-gold-300'
                }`}>
                  {srv.badge}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-xs font-mono text-gold-400">
                    {srv.type === 'offline' ? (
                      <Mail className="w-3.5 h-3.5 text-gold-400" />
                    ) : (
                      <Video className="w-3.5 h-3.5 text-gold-400" />
                    )}
                    <span>{srv.duration}</span>
                  </span>
                  <span className="font-cinzel text-3xl font-black text-slate-100">
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
                  <span>Select & Book for {srv.price}</span>
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

