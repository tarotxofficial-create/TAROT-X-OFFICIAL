import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  User, 
  Mail, 
  MessageSquare, 
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { bookConsultation } from '../lib/supabase';
import { soundEngine } from '../lib/soundEngine';

export default function BookingSection() {
  const [selectedTier, setSelectedTier] = useState('celtic_cross'); // celestial | celtic_cross | twin_flame
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    timeSlot: '18:00 UTC',
    notes: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const TIERS = [
    {
      id: 'celestial',
      title: 'Celestial Pulse Reading',
      duration: '30 Minutes',
      price: '$49',
      description: 'Focused live reading addressing one burning crossroads query, elemental advice, and immediate spiritual trajectory.',
      features: [
        'Live 1-on-1 Video Session',
        '3-Card or 5-Card Spread',
        'Session Audio Recording',
        'Email Summary & Affirmations'
      ]
    },
    {
      id: 'celtic_cross',
      title: 'Grand Celtic Cross & Karmic Blueprint',
      duration: '60 Minutes',
      price: '$99',
      popular: true,
      description: 'The master comprehensive deep dive covering your 10-card Celtic Cross, subconscious patterns, astrological transits, and destiny roadmap.',
      features: [
        'Full 10-Card Celtic Cross Analysis',
        'Astrological Transits Alignment',
        'Shadow Work & Karmic Lessons',
        'Custom PDF Spiritual Dossier',
        '1-Week Direct Q&A Follow-up'
      ]
    },
    {
      id: 'twin_flame',
      title: 'Soul Path & Karmic Immersion',
      duration: '90 Minutes',
      price: '$149',
      description: 'Exhaustive multi-deck immersion analyzing soul contracts, relationship mirror dynamics, past life impressions, and high-frequency manifestation.',
      features: [
        'Multi-Deck Arcane Synthesis (Tarot + Oracle)',
        'Soul Contract & Twin Flame Diagnosis',
        'Guided 432Hz Sound Meditation',
        'Lifetime Video Recording & Dossier',
        'Personalized Gemstone / Herb Prescription'
      ]
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.date) return;

    setIsSubmitting(true);
    soundEngine.playOracleChime();

    const selectedTierObj = TIERS.find(t => t.id === selectedTier);
    const bookingPayload = {
      tier_id: selectedTier,
      tier_title: selectedTierObj?.title,
      price: selectedTierObj?.price,
      ...formData
    };

    const res = await bookConsultation(bookingPayload);
    setIsSubmitting(false);
    setConfirmedBooking(res.booking || bookingPayload);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
      
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-cinzel uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>Private Spiritual Sanctuary Consultations</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-5xl font-black gold-gradient-text">
          Book a Master Live Consultation
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Experience private 1-on-1 spiritual readings with our master esoteric readers. Receive compassionate clarity, astrological synthesis, and strategic divine guidance.
        </p>
      </div>

      {/* Tier Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`relative glass-panel p-6 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-gold-400 bg-obsidian-900/90 shadow-xl shadow-gold-500/15 scale-[1.02]'
                  : 'border-slate-800/80 hover:border-slate-700 bg-obsidian-950/60'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-cinzel font-bold text-[10px] uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gold-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{tier.duration}</span>
                  </span>
                  <div className="font-cinzel text-2xl font-black text-slate-100">{tier.price}</div>
                </div>

                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-100">{tier.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tier.description}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800">
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 shadow-md shadow-gold-500/20'
                      : 'bg-obsidian-900 text-slate-300 border border-slate-800 hover:border-gold-500/40'
                  }`}
                >
                  {isSelected ? '✓ Selected Tier' : 'Choose Package'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── INTERACTIVE BOOKING FORM ───────────────────────────────────── */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-gold-500/25 max-w-3xl mx-auto space-y-6">
        
        <div className="border-b border-slate-800 pb-4">
          <h3 className="font-cinzel text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gold-400" />
            <span>Schedule Your Sacred Appointment</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Package: <strong className="text-gold-300">{TIERS.find(t => t.id === selectedTier)?.title}</strong> ({TIERS.find(t => t.id === selectedTier)?.price})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">Your Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Sravan Mentalist"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@domain.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">Preferred Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 focus:border-gold-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">Preferred Time Slot *</label>
              <select
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 focus:border-gold-400 outline-none"
              >
                <option value="10:00 UTC">10:00 AM UTC (Morning Sun)</option>
                <option value="14:00 UTC">02:00 PM UTC (Solar Noon)</option>
                <option value="18:00 UTC">06:00 PM UTC (Twilight Dusk)</option>
                <option value="21:00 UTC">09:00 PM UTC (Midnight Mystery)</option>
              </select>
            </div>

          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">
              Areas of Focus / Questions for Reader (Optional)
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Share any specific context or question you would like illuminated during your session..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-400 via-amber-500 to-yellow-600 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-lg shadow-gold-500/20 hover:scale-[1.01] active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Confirming with Sanctuary...' : 'Confirm Consultation Booking'}</span>
            </button>
          </div>
        </form>

      </div>

      {/* ── CONFIRMATION MODAL ────────────────────────────────────────── */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl border-2 border-gold-500 p-6 sm:p-8 text-center space-y-5 shadow-2xl shadow-gold-500/20">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-cinzel uppercase tracking-widest text-gold-400">
                ✦ Booking Confirmed ✦
              </span>
              <h3 className="font-cinzel text-2xl font-bold text-slate-100 mt-1">
                Your Temple is Reserved
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                A calendar invitation and sacred preparation guidelines have been dispatched to <strong>{confirmedBooking.email}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-900/80 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Session Tier:</span>
                <span className="font-semibold text-slate-200">{confirmedBooking.tier_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Slot:</span>
                <span className="font-semibold text-gold-300">{confirmedBooking.date} • {confirmedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Booking ID:</span>
                <span className="font-mono text-slate-400">{confirmedBooking.id}</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmedBooking(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider"
            >
              Return to Sanctuary
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
