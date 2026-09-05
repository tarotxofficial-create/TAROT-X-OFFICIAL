import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Terminal, Shield, Activity, Compass } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export default function HUDNavigation({ activeZone, setActiveZone }) {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [systemUptime, setSystemUptime] = useState('99.98%');

  const zones = [
    { id: 0, label: 'HORIZON', depth: 'Z: 0 to -500 PX' },
    { id: 1, label: 'DECONSTRUCT', depth: 'Z: -500 to -1500 PX' },
    { id: 2, label: 'MANIFESTO', depth: 'Z: -1500 to -3000 PX' },
    { id: 3, label: 'TERMINALS', depth: 'Z: -3000 to -4500 PX' },
    { id: 4, label: 'EXECUTION', depth: 'Z: -4500 to -6000 PX' },
  ];

  const toggleSound = () => {
    const isNowActive = audioEngine.toggleAudio();
    setAudioEnabled(isNowActive);
  };

  const handleZoneClick = (idx) => {
    audioEngine.playMechanicalClick();
    setActiveZone(idx);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none p-4 sm:p-6 select-none font-mono">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left Telemetry Box */}
        <div className="flex items-center space-x-3 pointer-events-auto bg-void/85 border border-steel/80 px-4 py-2 rounded-lg backdrop-blur-md shadow-2xl">
          <div className="w-2 h-2 rounded-full bg-cyan-vector animate-ping" />
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-[0.2em] text-bone flex items-center space-x-1.5">
              <span>SYSTEM X</span>
              <span className="text-cyan-vector">//</span>
              <span className="text-smoke/70 text-[10px]">ANTIGRAVITY v2.4</span>
            </span>
            <span className="text-[10px] text-cyan-vector/70 tracking-widest">
              {zones[activeZone]?.depth}
            </span>
          </div>
        </div>

        {/* Center Zone Warp Coordinates (Desktop) */}
        <nav className="hidden md:flex items-center space-x-1 pointer-events-auto bg-void/85 border border-steel/80 p-1.5 rounded-lg backdrop-blur-md">
          {zones.map((z) => {
            const isActive = activeZone === z.id;
            return (
              <button
                key={z.id}
                onClick={() => handleZoneClick(z.id)}
                className={`px-3 py-1.5 rounded text-xs transition-all duration-200 uppercase tracking-widest ${
                  isActive
                    ? 'bg-cyan-vector/20 text-cyan-vector border border-cyan-vector/50 font-bold shadow-[0_0_12px_rgba(102,252,241,0.25)]'
                    : 'text-smoke/70 hover:text-bone hover:bg-steel/50'
                }`}
              >
                0{z.id} // {z.label}
              </button>
            );
          })}
        </nav>

        {/* Right Status Controls */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            className={`px-3 py-2 rounded-lg border backdrop-blur-md flex items-center space-x-2 text-xs transition-all ${
              audioEnabled
                ? 'bg-cyan-vector/15 border-cyan-vector text-cyan-vector shadow-[0_0_15px_rgba(102,252,241,0.3)]'
                : 'bg-void/85 border-steel text-smoke/70 hover:text-bone hover:border-steel-light'
            }`}
            title="Toggle 432Hz Ambient Audio Synthesizer"
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-cyan-vector" />
                <span className="text-[10px] tracking-wider font-bold">432Hz ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-smoke/60" />
                <span className="text-[10px] tracking-wider">AUDIO OFF</span>
              </>
            )}
          </button>

          {/* Quick Jump to Booking */}
          <button
            onClick={() => handleZoneClick(4)}
            className="px-4 py-2 rounded-lg cyan-wireframe-button text-xs font-bold tracking-widest uppercase flex items-center space-x-1.5"
          >
            <Terminal className="w-3 h-3" />
            <span className="hidden sm:inline">INITIALIZE</span>
            <span>DIAGNOSTIC</span>
          </button>
        </div>

      </div>

      {/* Mobile Zone Selector Strip */}
      <div className="md:hidden mt-3 flex items-center justify-center space-x-1 pointer-events-auto bg-void/90 border border-steel/70 p-1 rounded-lg backdrop-blur-md overflow-x-auto">
        {zones.map((z) => (
          <button
            key={z.id}
            onClick={() => handleZoneClick(z.id)}
            className={`px-2.5 py-1 text-[10px] tracking-wider rounded uppercase whitespace-nowrap ${
              activeZone === z.id
                ? 'bg-cyan-vector text-void font-bold'
                : 'text-smoke/70'
            }`}
          >
            0{z.id} {z.label}
          </button>
        ))}
      </div>
    </header>
  );
}
