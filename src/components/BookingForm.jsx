import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  Video, 
  PhoneCall, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { submitBooking } from '../lib/supabase';
import { READING_SERVICES } from './Services';

export default function BookingForm({ selectedService, onServiceChange }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceId: selectedService ? selectedService.id : READING_SERVICES[1].id,
    format: 'Live Zoom Video',
    preferredDate: '',
    preferredTime: '18:00',
    notes: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize when parent prop changes
  React.useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({ ...prev, serviceId: selectedService.id }));
    }
  }, [selectedService]);

  const activeService = READING_SERVICES.find(s => s.id === formData.serviceId) || READING_SERVICES[1];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.preferredDate) {
      setErrorMsg('Please complete all required fields (Name, Email, and Preferred Date).');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service_title: activeService.title,
        price: activeService.price,
        format: formData.format,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        timezone: formData.timezone,
        notes: formData.notes.trim()
      };

      const result = await submitBooking(payload);
      setSubmitting(false);

      if (result.success) {
        setConfirmed(result.booking);
      } else {
        setErrorMsg('Could not submit booking. Please try again.');
      }
    } catch (err) {
      setSubmitting(false);
      setErrorMsg(err.message || 'An error occurred during submission.');
    }
  };

  return (
    <section id="booking" className="py-20 border-t border-slate-800/80 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-gold-400 text-xs font-cinzel uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5" />
            <span>Consultation Scheduler</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold gold-gradient-text">
            Schedule Your Reading
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Reserve your private consultation container. Once scheduled, you will receive session access details and preparation guidance.
          </p>
        </div>

        {/* Booking Card Container */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-gold-500/30 shadow-2xl space-y-8">
          
          {/* Active Package Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-900/80 border border-gold-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block">
                Selected Reading Package
              </span>
              <h3 className="font-cinzel text-lg font-bold text-slate-100">
                {activeService.title} ({activeService.duration})
              </h3>
            </div>
            <div className="text-right sm:text-right">
              <span className="font-cinzel text-2xl font-black gold-gradient-text block">
                {activeService.price}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Full Name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yourname@domain.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">
                  Phone / WhatsApp (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none"
                  />
                </div>
              </div>

              {/* Reading Package Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">
                  Choose Service *
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    setFormData({ ...formData, serviceId: nextId });
                    const match = READING_SERVICES.find(s => s.id === nextId);
                    if (match && onServiceChange) onServiceChange(match);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 focus:border-gold-400 outline-none"
                >
                  {READING_SERVICES.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.duration} — {s.price})
                    </option>
                  ))}
                </select>
              </div>

              {/* Consultation Format */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">
                  Consultation Format *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Live Zoom Video', icon: Video },
                    { label: 'WhatsApp / Phone Audio', icon: PhoneCall },
                    { label: 'Recorded Video Dossier', icon: FileText }
                  ].map((fmt) => {
                    const Icon = fmt.icon;
                    const isSel = formData.format === fmt.label;
                    return (
                      <button
                        type="button"
                        key={fmt.label}
                        onClick={() => setFormData({ ...formData, format: fmt.label })}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition-all ${
                          isSel
                            ? 'bg-gold-500/20 border-gold-400 text-gold-300'
                            : 'bg-obsidian-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-gold-400" />
                        <span>{fmt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel uppercase tracking-wider text-gold-400 font-bold">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-gold-500/40 text-xs text-slate-100 focus:border-gold-400 outline-none"
                />
              </div>

              {/* Preferred Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">
                  Preferred Time Slot *
                </label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 focus:border-gold-400 outline-none"
                >
                  <option value="10:00 AM">10:00 AM (Morning Slot)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon Slot)</option>
                  <option value="06:00 PM">06:00 PM (Evening Slot)</option>
                  <option value="08:30 PM">08:30 PM (Night Slot)</option>
                </select>
              </div>

            </div>

            {/* Notes / Questions */}
            <div className="space-y-1.5">
              <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">
                Core Topic or Question (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Share any specific situation, career decision, or question you would like to explore in your reading..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-400 via-amber-500 to-yellow-600 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-xl shadow-gold-500/20 hover:scale-[1.01] active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-obsidian-950" />
              <span>{submitting ? 'Reserving Your Container...' : 'Confirm Reading Reservation'}</span>
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>No spam. Absolute confidentiality guaranteed.</span>
            </div>

          </form>

        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl border-2 border-gold-500 p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-cinzel uppercase tracking-widest text-gold-400">
                ✦ Appointment Reserved ✦
              </span>
              <h3 className="font-cinzel text-xl font-bold text-slate-100">
                Thank You, {confirmed.name}
              </h3>
              <p className="text-xs text-slate-300">
                Your reading request for <strong>{confirmed.service_title}</strong> has been logged. An email confirmation has been queued for <strong>{confirmed.email}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-900/90 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Format:</span>
                <span className="font-semibold text-slate-200">{confirmed.format}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-semibold text-gold-300">{confirmed.preferred_date} at {confirmed.preferred_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Price:</span>
                <span className="font-semibold text-slate-200">{confirmed.price}</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmed(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
