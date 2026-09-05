import React from 'react';
import { Cpu, CheckCircle2, ArrowRight, Video, FileText, Zap, Shield, Sparkles } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

export const SYSTEM_TERMINALS = [
  {
    id: 'terminal-0',
    code: 'TERMINAL 0',
    title: 'Offline Probability Dossier',
    tagline: 'Asynchronous Diagnostic Vector',
    price: 99,
    priceLabel: '₹99',
    duration: 'Asynchronous // 24–48h Delivery',
    format: 'Written Dossier + High-Res Spread Photography',
    badge: 'ACCESSIBLE ENTRY',
    focus: 'Detailed written deconstruction of your active loop, blind spots, and probability vectors delivered directly to your confidential email inbox.',
    deliverables: [
      'Encrypted PDF Diagnostic Report (4–6 pages)',
      'High-Resolution Photographs of Custom Card Spread',
      'The 4-Part Framework: Loop, Blind Spot, Leverage, Protocol',
      'Zero live call required — complete at your own pace',
      'Confidential email dispatch within 24–48 hours'
    ],
    recommended: false,
    color: 'amber'
  },
  {
    id: 'terminal-a',
    code: 'TERMINAL A',
    title: 'System Rupture Audit',
    tagline: 'Immediate Crisis & Decision Node',
    price: 999,
    priceLabel: '₹999',
    duration: '30 Mins // Live Encrypted Video',
    format: '1-to-1 Live Zoom / Zero-G Interface',
    badge: 'MOST POPULAR',
    focus: 'Single acute crisis or immediate behavioral bottleneck (Career crossroads, negotiation impasse, or relationship loop).',
    deliverables: [
      '30-minute private 1-to-1 video consultation with X',
      'Live card draw on camera with real-time vector analysis',
      'Direct dissection of unexamined assumptions & blind spots',
      'Interactive follow-up inquiries as new vectors emerge',
      'Private Zoom link & calendar confirmation upon checkout'
    ],
    recommended: true,
    color: 'cyan'
  },
  {
    id: 'terminal-b',
    code: 'TERMINAL B',
    title: 'Full Pattern Mapping',
    tagline: 'Life Architecture & Macro Vectors',
    price: 1499,
    priceLabel: '₹1,499',
    duration: '60 Mins // Live Encrypted Video',
    format: '1-to-1 Live Zoom / Zero-G Interface',
    badge: 'COMPREHENSIVE',
    focus: 'Comprehensive evaluation of life architecture, multi-domain recurring negative loops, and 12-month probability vectors.',
    deliverables: [
      '60-minute in-depth private consultation with X',
      'Exhaustive 12-card cross-topology behavioral spread',
      'Analysis across Career, Financial, and Relational vectors',
      'Identification of 12-month recurring failure patterns',
      'Complete action protocol & structural roadmap'
    ],
    recommended: false,
    color: 'cyan'
  },
  {
    id: 'terminal-c',
    code: 'TERMINAL C',
    title: 'Deep Architecture Recalibration',
    tagline: 'Extreme Overhaul & Strategic Synthesis',
    price: 2499,
    priceLabel: '₹2,499',
    duration: '90 Mins // Live + PDF Blueprint',
    format: '1-to-1 Live Video + Written Architecture Report',
    badge: 'ADVANCED AUDIT',
    focus: 'Extreme scenario analysis, multi-variable strategic overhaul, and brutal behavioral reconstruction for founders & executives.',
    deliverables: [
      '90-minute intensive diagnostic session with X',
      'Exhaustive multi-tier spread deconstructing entire system',
      'Custom 10+ page PDF Architectural Recalibration Report',
      'Follow-up email review of initial protocol execution',
      'Maximum strategic clarity for high-stakes decisions'
    ],
    recommended: false,
    color: 'amber'
  }
];

export default function Zone3Terminals({ onSelectTerminal, selectedTerminalId }) {
  return (
    <section className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 relative z-10 py-24 select-none">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-cyan-vector font-mono text-xs tracking-[0.25em] uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>ZONE 3 // Z: -3000 TO -4500 PX</span>
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl font-bold text-bone tracking-tight">
            DIAGNOSTIC TERMINALS (SESSION TIERS)
          </h2>
          <p className="text-xs sm:text-sm text-smoke/80 font-sans max-w-2xl mx-auto">
            Three live 3D monolithic metal terminals + asynchronous offline dossier floating in zero gravity. Choose the depth of diagnosis required for your current decision surface.
          </p>
        </div>

        {/* 4 Terminals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SYSTEM_TERMINALS.map((term) => {
            const isSelected = selectedTerminalId === term.id;
            const isCyan = term.color === 'cyan';
            
            return (
              <div
                key={term.id}
                onMouseEnter={() => audioEngine.playMechanicalClick()}
                className={`monolith-panel rounded-2xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden ${
                  isSelected
                    ? 'border-cyan-vector shadow-[0_0_40px_rgba(102,252,241,0.3)] bg-steel/90 ring-1 ring-cyan-vector'
                    : term.recommended
                    ? 'border-cyan-vector/60 shadow-[0_0_25px_rgba(102,252,241,0.15)] hover:border-cyan-vector'
                    : 'border-steel-light hover:border-steel'
                }`}
              >
                {/* Accent Badge */}
                <div className="flex items-center justify-between font-mono text-xs border-b border-steel/60 pb-3">
                  <span className="text-cyan-vector font-bold tracking-wider">{term.code}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                    term.recommended ? 'bg-cyan-vector text-void font-bold' : 'bg-steel text-smoke'
                  }`}>
                    {term.badge}
                  </span>
                </div>

                {/* Title & Pricing */}
                <div className="space-y-3">
                  <h3 className="font-mono text-lg font-bold text-bone tracking-tight leading-snug">
                    {term.title}
                  </h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="font-mono text-3xl font-extrabold text-bone tracking-tight">
                      {term.priceLabel}
                    </span>
                    <span className="text-[11px] font-mono text-smoke/60">INR (ALL-INCL)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-void/80 border border-steel text-xs font-mono text-cyan-vector/90 flex items-center space-x-2">
                    <Video className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{term.duration}</span>
                  </div>
                  <p className="text-xs text-smoke/80 font-sans leading-relaxed pt-1">
                    {term.focus}
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-2 pt-2 border-t border-steel/60 font-sans text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-smoke/60">Included Protocols:</span>
                  <ul className="space-y-2 text-smoke">
                    {term.deliverables.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-vector shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Action Button */}
                <button
                  onClick={() => {
                    audioEngine.playPneumaticLock();
                    onSelectTerminal(term);
                  }}
                  className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center space-x-2 transition-all ${
                    isSelected
                      ? 'bg-cyan-vector text-void shadow-[0_0_20px_rgba(102,252,241,0.5)]'
                      : 'cyan-wireframe-button'
                  }`}
                >
                  <span>{isSelected ? 'TERMINAL SELECTED' : 'SELECT DIAGNOSTIC'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
