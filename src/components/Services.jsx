import React, { useState } from 'react';
import { Clock, CheckCircle2, ArrowRight, Video, Mail, Layers, Compass, ArrowUpRight } from 'lucide-react';

export const READING_SERVICES = [
  {
    id: 'offline_report',
    type: 'offline',
    title: 'The Pattern Reading (Offline Dossier)',
    duration: 'Asynchronous // Sent to Email within 24–48 Hrs',
    price: '₹99',
    inrAmount: 99,
    badge: 'ACCESSIBLE ENTRY',
    tagline: 'Written diagnostic dossier sent directly to your inbox.',
    description: 'One focused situation: relationship confusion, career crossroads, or an uninspected behavioral cycle. You submit your questions and facts; X draws the spread and delivers an exhaustive written pattern dossier with high-resolution card photographs.',
    deliverables: [
      'Comprehensive Written Pattern Analysis Dossier',
      'High-Resolution Photographs of Your Physical Card Spread',
      'Diagnosis of Primary Behavioral Loop & Hidden Drivers',
      'Identification of Key Leverage Variable to Alter Outcomes',
      'Delivered to Your Email within 24–48 Hours'
    ]
  },
  {
    id: 'live_zoom_30min',
    type: 'live_zoom',
    title: '1-to-1 Live Dialogue Room (Zoom)',
    duration: '30 Minutes // Live Private Video Call',
    price: '₹999',
    inrAmount: 999,
    popular: true,
    badge: 'MOST REQUESTED // LIVE',
    tagline: 'Private face-to-face consultation with live interactive card draws.',
    description: 'A 30-minute private 1-on-1 dialogue on Zoom. For complex crossroads, competing decisions, or high-stakes dilemmas. Real-time probing, multi-layered spreads, and immediate probability mapping with no false comforting.',
    deliverables: [
      '30-Minute Live 1-on-1 Private Consultation via Zoom',
      'Real-Time Interactive Card Draws & Probing Inquiries',
      'Direct Dissection of Competing Decisions & Blind Spots',
      'Post-Session High-Definition Photos of Spreads',
      'Direct Calendar Invite & Private Zoom Link Sent to Mail'
    ]
  }
];

export default function Services({ onSelectService }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section id="sessions" className="py-24 border-t border-brass/20 bg-ink/40 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center space-x-2 text-brass text-[11px] font-mono uppercase tracking-[0.25em]">
            <Layers className="w-3.5 h-3.5" />
            <span>Productized Booking // Sessions</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-bone leading-tight">
            Choose the room you need.
          </h2>
          <p className="text-xs sm:text-sm text-smoke leading-relaxed font-sans">
            The UI makes duration and purpose obvious before price. Whether you need a quick, thorough written dossier or an intensive 30-minute live dialogue, choose your format below.
          </p>
        </div>

        {/* 2 Primary Active Booking Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          {READING_SERVICES.map((srv) => {
            const isLive = srv.type === 'live_zoom';
            return (
              <div
                key={srv.id}
                onMouseEnter={() => setHoveredCard(srv.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`archive-panel rounded-sm p-7 sm:p-9 flex flex-col justify-between border transition-all duration-300 relative ${
                  srv.popular 
                    ? 'border-brass bg-charcoal/80 shadow-2xl ring-1 ring-brass/60' 
                    : 'border-brass/25 bg-ink hover:border-brass/50'
                }`}
                style={{
                  transform: hoveredCard === srv.id ? 'translateY(-6px)' : 'none'
                }}
              >
                {/* Badge */}
                {srv.badge && (
                  <div className={`absolute -top-3 left-6 px-3 py-0.5 rounded-sm font-mono text-[9px] uppercase tracking-[0.2em] shadow-md border ${
                    srv.popular
                      ? 'bg-brass text-void border-brass font-bold'
                      : 'bg-void text-brass border-brass/40'
                  }`}>
                    {srv.badge}
                  </div>
                )}

                <div className="space-y-6">
                  
                  {/* Top Meta: Duration & Price */}
                  <div className="flex items-start justify-between border-b border-brass/20 pb-4">
                    <div className="flex items-center space-x-2 text-xs font-mono text-smoke">
                      {isLive ? <Video className="w-3.5 h-3.5 text-brass" /> : <Mail className="w-3.5 h-3.5 text-brass" />}
                      <span>{srv.duration}</span>
                    </div>
                    <span className="font-cinzel text-3xl font-black text-bone">
                      {srv.price}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-bone">
                      {srv.title}
                    </h3>
                    <p className="text-xs font-serif italic text-smoke">
                      {srv.tagline}
                    </p>
                    <p className="text-xs text-smoke leading-relaxed font-sans pt-1">
                      {srv.description}
                    </p>
                  </div>

                  {/* Deliverables List */}
                  <div className="space-y-2.5 pt-4 border-t border-charcoal">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brass block">
                      ARCHIVAL DELIVERABLES:
                    </span>
                    {srv.deliverables.map((item, i) => (
                      <div key={i} className="flex items-start space-x-2.5 text-xs text-bone/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brass shrink-0 mt-0.5" />
                        <span className="leading-normal font-sans">{item}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Booking Button */}
                <div className="pt-8">
                  <button
                    onClick={() => onSelectService(srv)}
                    className={`w-full py-3.5 rounded-sm font-cinzel text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 ${
                      srv.popular
                        ? 'bg-brass text-void shadow-xl shadow-brass/10 hover:bg-brass-light active:scale-98'
                        : 'bg-void border border-brass/50 text-brass hover:bg-brass hover:text-void'
                    }`}
                  >
                    <span>SELECT & RESERVE FOR {srv.price}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Extended Methodology Architecture Previews (from Section 8) */}
        <div className="p-6 rounded-sm bg-void border border-brass/20 max-w-5xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal pb-3">
            <span className="text-[10px] font-mono text-smoke uppercase tracking-widest">
              DIAGNOSTIC FRAMEWORK REFERENCE // ALL SESSIONS
            </span>
            <span className="text-[10px] font-mono text-brass">
              NO PROPHECY • NO MAGIC
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono text-smoke">
            <div className="border border-charcoal p-3 space-y-1">
              <span className="text-brass text-[10px] block">01 // THE PATTERN READING</span>
              <p className="text-[11px] text-bone">One focused situation; career, relationship, or decision.</p>
            </div>
            <div className="border border-charcoal p-3 space-y-1">
              <span className="text-brass text-[10px] block">02 // THE DECISION ROOM</span>
              <p className="text-[11px] text-bone">Competing paths dissected; probability trees mapped.</p>
            </div>
            <div className="border border-charcoal p-3 space-y-1">
              <span className="text-brass text-[10px] block">03 // THE DEEP READING</span>
              <p className="text-[11px] text-bone">Multiple connected loops during large life transitions.</p>
            </div>
            <div className="border border-charcoal p-3 space-y-1">
              <span className="text-brass text-[10px] block">04 // THE FOLLOW-UP</span>
              <p className="text-[11px] text-bone">Revisiting an active pattern after a meaningful pivot.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}


