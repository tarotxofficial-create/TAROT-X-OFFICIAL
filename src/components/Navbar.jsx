import React, { useState } from 'react';
import { Sparkles, Menu, X, Calendar, Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export default function Navbar({ onBookClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [audioActive, setAudioActive] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Readings', href: '#services' },
    { label: 'Client Reviews', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleAudioToggle = () => {
    const isNowActive = audioEngine.toggleAudio();
    setAudioActive(isNowActive);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-obsidian-950/85 border-b border-gold-500/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-obsidian-900 border border-gold-500/40 overflow-hidden flex items-center justify-center shadow-lg group-hover:border-gold-400 transition-all">
              <img src="/logo.jpg" alt="Tarot X Logo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-cinzel text-lg font-bold tracking-wider gold-gradient-text">
                TAROT X
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest block text-slate-400">
                Pattern Recognition & Analysis
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => audioEngine.playMechanicalClick()}
                className="text-xs uppercase tracking-widest font-semibold text-slate-300 hover:text-gold-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={handleAudioToggle}
              className={`px-3 py-2 rounded-xl border flex items-center space-x-1.5 text-xs font-mono transition-all ${
                audioActive
                  ? 'border-gold-400 text-gold-300 bg-gold-500/10 shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                  : 'border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle 432Hz Ambient Synthesizer"
            >
              {audioActive ? <Volume2 className="w-3.5 h-3.5 text-gold-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="text-[10px]">{audioActive ? '432Hz ON' : 'AUDIO OFF'}</span>
            </button>

            <button
              onClick={() => {
                audioEngine.playMechanicalClick();
                onBookClick();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg shadow-gold-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book a Reading</span>
            </button>
          </div>

          {/* Mobile Menu & Audio Buttons */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={handleAudioToggle}
              className="p-2 rounded-lg bg-obsidian-900 border border-slate-800 text-slate-300 hover:text-gold-400 text-xs"
            >
              {audioActive ? <Volume2 className="w-4 h-4 text-gold-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg bg-obsidian-900 border border-slate-800 text-slate-300 hover:text-gold-400"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-obsidian-950 border-b border-gold-500/20 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-semibold tracking-wider text-slate-300 hover:text-gold-300"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              onBookClick();
            }}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider text-center"
          >
            Book a Reading
          </button>
        </div>
      )}
    </header>
  );
}
