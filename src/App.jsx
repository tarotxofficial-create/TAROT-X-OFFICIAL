import React, { useState, useEffect } from 'react';
import AntigravityCanvas from './components/3d/AntigravityCanvas';
import HUDNavigation from './components/HUDNavigation';
import Zone0Horizon from './components/zones/Zone0Horizon';
import Zone1Deconstruct from './components/zones/Zone1Deconstruct';
import Zone2Manifesto from './components/zones/Zone2Manifesto';
import Zone3Terminals, { SYSTEM_TERMINALS } from './components/zones/Zone3Terminals';
import Zone4Execution from './components/zones/Zone4Execution';
import { audioEngine } from './utils/audioEngine';
import { ChevronUp, ChevronDown, Terminal, Shield } from 'lucide-react';

export default function App() {
  const [activeZone, setActiveZone] = useState(0);
  const [selectedTerminal, setSelectedTerminal] = useState(SYSTEM_TERMINALS[1]); // Terminal A

  // Handle keyboard arrow navigation between orbital zones
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        setActiveZone((prev) => Math.min(prev + 1, 4));
        audioEngine.playMechanicalClick();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        setActiveZone((prev) => Math.max(prev - 1, 0));
        audioEngine.playMechanicalClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTerminal = (term) => {
    setSelectedTerminal(term);
    setActiveZone(4); // Advance to Zone 4 Execution Node
    audioEngine.playPneumaticLock();
  };

  const handleAuditCard = (card) => {
    setActiveZone(3); // Advance to Terminals
    audioEngine.playMechanicalClick();
  };

  return (
    <div className="relative min-h-screen bg-void text-bone font-sans overflow-x-hidden selection:bg-cyan-vector selection:text-void">
      
      {/* 1. WebGL 3D Spatial Canvas (Zero-G Physics, 78 Cards, Laser Vectors, Particles) */}
      <AntigravityCanvas 
        activeZone={activeZone}
        onCardSelect={(card) => {
          console.log('Selected 3D Card:', card);
        }}
      />

      {/* Subtle CRT Scanline overlay */}
      <div className="fixed inset-0 scanline-overlay pointer-events-none z-10 opacity-40" />

      {/* 2. Top HUD Navigation Telemetry & Audio Synthesizer Controls */}
      <HUDNavigation 
        activeZone={activeZone} 
        setActiveZone={setActiveZone} 
      />

      {/* 3. Main 5 Orbital Zones View */}
      <main className="relative z-20 transition-all duration-700">
        {activeZone === 0 && (
          <Zone0Horizon 
            onNextZone={() => setActiveZone(1)} 
            onDirectBook={() => setActiveZone(4)} 
          />
        )}

        {activeZone === 1 && (
          <Zone1Deconstruct 
            onSelectCardForAudit={handleAuditCard} 
          />
        )}

        {activeZone === 2 && (
          <Zone2Manifesto 
            onNextZone={() => setActiveZone(3)} 
          />
        )}

        {activeZone === 3 && (
          <Zone3Terminals 
            onSelectTerminal={handleSelectTerminal}
            selectedTerminalId={selectedTerminal.id}
          />
        )}

        {activeZone === 4 && (
          <Zone4Execution 
            selectedTerminal={selectedTerminal}
            onSelectTerminal={setSelectedTerminal}
          />
        )}
      </main>

      {/* Bottom Floating Orbital Stepper Controls */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 font-mono text-xs select-none">
        <button
          onClick={() => {
            if (activeZone > 0) {
              audioEngine.playMechanicalClick();
              setActiveZone(activeZone - 1);
            }
          }}
          disabled={activeZone === 0}
          className="p-3 rounded-xl bg-void/85 border border-steel text-smoke hover:text-cyan-vector hover:border-cyan-vector/50 backdrop-blur-md transition-all disabled:opacity-30 disabled:pointer-events-none shadow-xl"
          title="Ascend Orbit"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        <div className="px-3 py-2.5 rounded-xl bg-void/85 border border-steel text-cyan-vector text-[11px] font-bold backdrop-blur-md">
          ORBIT {activeZone} / 4
        </div>

        <button
          onClick={() => {
            if (activeZone < 4) {
              audioEngine.playMechanicalClick();
              setActiveZone(activeZone + 1);
            }
          }}
          disabled={activeZone === 4}
          className="p-3 rounded-xl bg-void/85 border border-steel text-smoke hover:text-cyan-vector hover:border-cyan-vector/50 backdrop-blur-md transition-all disabled:opacity-30 disabled:pointer-events-none shadow-xl"
          title="Descend Orbit"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Cyber-Rationalist Archival Footer Notice */}
      <footer className="relative z-20 border-t border-steel/60 bg-void/90 py-8 px-4 sm:px-8 text-xs font-mono text-smoke/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-vector font-bold">SYSTEM X // ANTIGRAVITY ENGINE</span>
            <span>•</span>
            <span>28.6139° N, 77.2090° E</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-smoke/50">
            <Shield className="w-3.5 h-3.5 text-amber-warning/70" />
            <span>CONFIDENTIAL COGNITIVE MIRROR. NOT MEDICAL, FINANCIAL, OR LEGAL ADVICE.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
