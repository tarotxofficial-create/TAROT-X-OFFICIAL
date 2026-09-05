import React from 'react';
import { Sparkles, Calendar, ArrowDown, Shield, Star, Award, HeartHandshake } from 'lucide-react';

export default function Hero({ onBookClick, onExploreServices }) {
  return (
    <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-gold-500/10 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        {/* Prestige Tag */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-obsidian-900 border border-gold-500/30 text-gold-300 text-xs tracking-wider uppercase font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>Professional Tarot Readings & Spiritual Guidance</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-cinzel text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]">
          Clarity, Direction & Insight for <br />
          <span className="gold-gradient-text">
            Life's Pivotal Crossroads
          </span>
        </h1>

        {/* Narrative Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
          Welcome to Tarot X Official. Choose between an in-depth offline report delivered directly to your email for <strong className="text-gold-300 font-semibold">₹99</strong>, or an interactive 30-minute 1-to-1 live video reading on Zoom for <strong className="text-gold-300 font-semibold">₹999</strong>.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onBookClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-gold-400 via-amber-500 to-yellow-600 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-xl shadow-gold-500/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center space-x-2.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Your Reading</span>
          </button>

          <button
            onClick={onExploreServices}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-obsidian-900/80 hover:bg-obsidian-850 text-slate-200 border border-gold-500/30 hover:border-gold-400/60 font-cinzel font-semibold text-xs tracking-wider transition-all flex items-center justify-center space-x-2"
          >
            <span>View 2 Services & Pricing</span>
            <ArrowDown className="w-3.5 h-3.5 text-gold-400" />
          </button>
        </div>

        {/* Credentials / Trust Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-slate-800/80 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2.5 text-xs text-slate-300">
            <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
            <span>1,200+ Confirmed Readings</span>
          </div>
          <div className="flex items-center justify-center space-x-2.5 text-xs text-slate-300">
            <Shield className="w-4 h-4 text-gold-400" />
            <span>100% Confidential Guidance</span>
          </div>
          <div className="flex items-center justify-center space-x-2.5 text-xs text-slate-300">
            <HeartHandshake className="w-4 h-4 text-gold-400" />
            <span>₹99 Email Report · ₹999 Live Zoom</span>
          </div>
        </div>

      </div>
    </section>
  );
}
