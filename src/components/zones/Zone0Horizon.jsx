import React from 'react';
import { ArrowDown, Cpu, ShieldAlert, Crosshair, Terminal } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

export default function Zone0Horizon({ onNextZone, onDirectBook }) {
  return (
    <section className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 relative z-10 select-none pt-24 pb-16">
      
      {/* HUD Reticle Overlay */}
      <div className="absolute top-28 left-8 hidden lg:flex flex-col space-y-1 font-mono text-[11px] text-smoke/50">
        <span className="text-cyan-vector/70 flex items-center space-x-1">
          <Crosshair className="w-3 h-3" />
          <span>COORDINATE LOCK: 0.00, 0.00, -120.00</span>
        </span>
        <span>GRAVITY VECTOR: [0.0, 0.0, 0.0] ZERO-G</span>
        <span>PROBABILITY NODES: 78 ACTIVE</span>
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8 flex flex-col items-center">
        
        {/* Contradiction / Identity Badges */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded bg-steel/80 border border-steel-light text-bone flex items-center space-x-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-vector" />
            <span>ATHEIST</span>
          </span>
          <span className="px-3 py-1 rounded bg-steel/80 border border-steel-light text-bone flex items-center space-x-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-warning" />
            <span>RATIONALIST</span>
          </span>
          <span className="px-3 py-1 rounded bg-steel/80 border border-steel-light text-cyan-vector flex items-center space-x-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-vector animate-pulse" />
            <span>ZERO-G TAROT OPERATOR</span>
          </span>
        </div>

        {/* Central Tactical Hooded Figure Graphic Container */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 my-2 flex items-center justify-center">
          {/* Concentric glowing vector rings */}
          <div className="absolute inset-0 rounded-full border border-cyan-vector/20 animate-spin" style={{ animationDuration: '24s' }} />
          <div className="absolute inset-3 rounded-full border border-dashed border-amber-warning/20 animate-spin" style={{ animationDuration: '36s', animationDirection: 'reverse' }} />
          
          {/* Hooded Operator Graphic */}
          <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-b from-steel to-void border border-cyan-vector/40 p-1 shadow-[0_0_40px_rgba(102,252,241,0.2)] flex flex-col items-center justify-center overflow-hidden">
            {/* Minimalist Masked Figure SVG */}
            <svg viewBox="0 0 100 100" className="w-28 h-28 text-smoke/90 drop-shadow-[0_0_10px_rgba(102,252,241,0.4)]">
              {/* Hood Silhouette */}
              <path d="M50 12 C30 12 24 35 22 55 C20 75 35 88 50 88 C65 88 80 75 78 55 C76 35 70 12 50 12 Z" fill="#0B0E14" stroke="#66FCF1" strokeWidth="1.5" />
              {/* Shadow Interior */}
              <path d="M50 20 C36 20 32 38 31 52 C35 55 45 56 50 56 C55 56 65 55 69 52 C68 38 64 20 50 20 Z" fill="#050508" />
              {/* Tactical Covered Mask */}
              <path d="M32 50 C32 68 40 76 50 78 C60 76 68 68 68 50 Z" fill="#1F2833" stroke="#C5A059" strokeWidth="1" />
              {/* Visor / Eye Slit */}
              <line x1="38" y1="46" x2="62" y2="46" stroke="#66FCF1" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" />
            </svg>
            <span className="text-[10px] font-mono text-cyan-vector tracking-widest mt-1">OPERATOR // X</span>
          </div>

          {/* Floating cards debris indicators */}
          <div className="absolute -top-2 -left-4 px-2 py-0.5 rounded bg-void/90 border border-cyan-vector/40 text-[9px] font-mono text-cyan-vector">
            Ψ PROBABILITY_07
          </div>
          <div className="absolute -bottom-2 -right-4 px-2 py-0.5 rounded bg-void/90 border border-amber-warning/40 text-[9px] font-mono text-amber-warning">
            Δ RUPTURE_16
          </div>
        </div>

        {/* Primary Title & Thesis Headline */}
        <div className="space-y-4">
          <div className="font-mono text-xs text-cyan-vector tracking-[0.3em] uppercase">
            X // THE CONNECT ARCHITECTURE
          </div>
          <h1 className="font-mono text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-bone max-w-3xl leading-snug">
            "NO SPIRITS. NO FATE. JUST STATISTICS, PATTERNS, AND UNVARNISHED REALITY."
          </h1>
          <p className="text-sm sm:text-base text-smoke/80 font-sans max-w-xl mx-auto leading-relaxed">
            A zero-gravity diagnostic engine mapping your recurring life loops against 78 mathematical archetypes. You don't need a prophecy. You need to see the mechanism.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <button
            onClick={() => {
              audioEngine.playMechanicalClick();
              onNextZone();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl cyan-wireframe-button font-mono text-sm font-bold tracking-[0.2em] uppercase flex items-center justify-center space-x-3 group"
          >
            <span>INITIALIZE DIAGNOSTIC</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              audioEngine.playMechanicalClick();
              onDirectBook();
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-steel/80 hover:bg-steel border border-steel-light text-bone font-mono text-xs tracking-wider uppercase transition-all"
          >
            WARP TO EXECUTION NODE (BOOKING)
          </button>
        </div>

        {/* Real-time Telemetry strip */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-smoke/50 border-t border-steel/40 w-full max-w-2xl">
          <span className="flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-vector" />
            <span>WebGL 3D Core</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-amber-warning" />
            <span>Zero Comfort Guarantee</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-vector" />
            <span>Confidential Encrypted Pipeline</span>
          </span>
        </div>

      </div>

    </section>
  );
}
