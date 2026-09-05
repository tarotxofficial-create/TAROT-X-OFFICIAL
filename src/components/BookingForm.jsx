import React, { useState, useEffect } from 'react';
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
  CreditCard, 
  Lock, 
  AlertCircle,
  FileText,
  ExternalLink,
  CalendarCheck,
  Link2
} from 'lucide-react';
import { submitBooking } from '../lib/supabase';
import { initiateRazorpayCheckout } from '../lib/razorpay';
import { READING_SERVICES } from './Services';
import { DEFAULT_CALENDLY_URL, buildCalendlyUrl, openCalendlyPopup } from '../lib/calendly';

export default function BookingForm({ selectedService, onServiceChange }) {
  const initialService = selectedService || READING_SERVICES[0];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceId: initialService.id,
    
    // Offline Reading specific details
    focusArea: 'Love & Relationships',
    birthDetails: '',
    offlineQuestions: '',
    
    // Live Zoom specific details
    preferredDate: '',
    preferredTime: '',
    zoomNotes: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Calendly + Zoom integration states
  const [calendlyUrl, setCalendlyUrl] = useState(DEFAULT_CALENDLY_URL);
  const [isEditingCalendlyUrl, setIsEditingCalendlyUrl] = useState(false);
  const [calendlyScheduled, setCalendlyScheduled] = useState(false);
  const [calendlyEventData, setCalendlyEventData] = useState(null);

  // Synchronize when parent prop changes
  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({ ...prev, serviceId: selectedService.id }));
    }
  }, [selectedService]);

  // Listen for Calendly postMessage events (e.g. calendly.event_scheduled)
  useEffect(() => {
    const handleCalendlyMessage = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      
      if (e.data.event === 'calendly.event_scheduled') {
        console.log('Calendly Event Scheduled:', e.data.payload);
        setCalendlyScheduled(true);
        setCalendlyEventData(e.data.payload);

        // Auto-extract date & time if available
        if (e.data.payload?.event?.start_time) {
          try {
            const dateObj = new Date(e.data.payload.event.start_time);
            setFormData(prev => ({
              ...prev,
              preferredDate: dateObj.toISOString().split('T')[0],
              preferredTime: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
          } catch (err) {
            console.warn('Could not parse scheduled date:', err);
          }
        }
      }
    };

    window.addEventListener('message', handleCalendlyMessage);
    return () => window.removeEventListener('message', handleCalendlyMessage);
  }, []);

  const activeService = READING_SERVICES.find(s => s.id === formData.serviceId) || READING_SERVICES[0];
  const isOffline = activeService.type === 'offline';

  const handleServiceSelect = (srv) => {
    setFormData(prev => ({ ...prev, serviceId: srv.id }));
    if (onServiceChange) onServiceChange(srv);
  };

  const handlePayAndBook = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMsg('Please provide your Full Name and Email Address.');
      return;
    }

    if (isOffline) {
      if (!formData.offlineQuestions.trim()) {
        setErrorMsg('Please share your questions or situation so the reader has all details needed for your offline report.');
        return;
      }
    }

    setSubmitting(true);

    // Launch Razorpay Live Payment Modal with exact amount (₹99 or ₹999)
    initiateRazorpayCheckout({
      serviceTitle: activeService.title,
      amountInINR: activeService.inrAmount,
      customerName: formData.name.trim(),
      customerEmail: formData.email.trim(),
      customerPhone: formData.phone.trim(),
      onSuccess: async (paymentDetails) => {
        try {
          const notesContent = isOffline 
            ? `[Focus: ${formData.focusArea}] [Birth/Zodiac: ${formData.birthDetails.trim() || 'N/A'}] Questions & Context: ${formData.offlineQuestions.trim()}`
            : `[Zoom Session via Calendly] [Scheduled: ${calendlyScheduled ? 'Yes' : 'Pending'}] [Calendly Event: ${calendlyEventData?.event?.uri || 'N/A'}] Notes: ${formData.zoomNotes.trim() || 'None'}`;

          const payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            service_title: activeService.title,
            price: activeService.price,
            format: isOffline ? 'Offline Email Report' : 'Live Zoom Video (30 Min) - Calendly',
            preferred_date: isOffline 
              ? new Date().toISOString().split('T')[0] 
              : (formData.preferredDate || 'Scheduled via Calendly'),
            preferred_time: isOffline 
              ? 'Delivery within 24–48 hrs' 
              : (formData.preferredTime || 'Confirmed on Calendar'),
            timezone: formData.timezone,
            notes: notesContent,
            payment_id: paymentDetails.paymentId,
            order_id: paymentDetails.orderId,
            payment_status: 'paid',
            status: 'confirmed'
          };

          const result = await submitBooking(payload);
          setSubmitting(false);

          if (result.success) {
            setConfirmed({
              ...result.booking,
              paymentId: paymentDetails.paymentId,
              isOffline,
              calendlyScheduled
            });
          } else {
            setErrorMsg('Payment succeeded, but could not save booking. Please contact tarotxofficial@gmail.com with ID: ' + paymentDetails.paymentId);
          }
        } catch (err) {
          setSubmitting(false);
          setErrorMsg(err.message || 'Error finalizing booking after payment.');
        }
      },
      onFailure: (err) => {
        setSubmitting(false);
        setErrorMsg(err?.message || 'Payment was cancelled or unsuccessful. You can try again anytime.');
      },
      onDismiss: () => {
        setSubmitting(false);
      }
    });
  };

  const embeddedCalendlyUrl = buildCalendlyUrl(calendlyUrl, {
    name: formData.name.trim(),
    email: formData.email.trim(),
    notes: formData.zoomNotes.trim()
  });

  return (
    <section id="booking" className="py-20 border-t border-slate-800/80 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-gold-400 text-xs font-cinzel uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consultation Scheduler & Checkout</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold gold-gradient-text">
            Book Your Reading
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Choose your preferred service, schedule your session with automatic Zoom integration, and complete secure checkout.
          </p>
        </div>

        {/* Booking Card Container */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-gold-500/30 shadow-2xl space-y-8">
          
          {/* Service Selector Tabs */}
          <div className="space-y-3">
            <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300 block">
              1. Select Service Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {READING_SERVICES.map((srv) => {
                const isSel = srv.id === activeService.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => handleServiceSelect(srv)}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSel 
                        ? 'border-gold-400 bg-obsidian-900 shadow-lg shadow-gold-500/10 ring-1 ring-gold-400/60' 
                        : 'border-slate-800 bg-obsidian-950/60 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        {srv.type === 'offline' ? (
                          <Mail className={`w-4 h-4 ${isSel ? 'text-gold-400' : 'text-slate-500'}`} />
                        ) : (
                          <Video className={`w-4 h-4 ${isSel ? 'text-cyan-400' : 'text-slate-500'}`} />
                        )}
                        <span className={`font-cinzel text-sm font-bold ${isSel ? 'text-slate-100' : 'text-slate-300'}`}>
                          {srv.title}
                        </span>
                      </div>
                      <span className={`font-cinzel text-lg font-black ${isSel ? 'text-gold-400' : 'text-slate-400'}`}>
                        {srv.price}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      {srv.duration}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Specific Notice Banner */}
          <div className="p-4 rounded-2xl bg-obsidian-900/90 border border-gold-500/30 flex items-start space-x-3 text-xs">
            {isOffline ? (
              <>
                <Mail className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-cinzel text-gold-300 font-bold uppercase tracking-wider block">
                    Offline Reading Report — ₹99
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    No live call needed. Share your questions and details below. The reader will draw your spread with sacred focus, and your detailed written report with card photos will be sent directly to your email within <strong>24–48 hours</strong>.
                  </p>
                </div>
              </>
            ) : (
              <>
                <Video className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-cinzel text-gold-300 font-bold uppercase tracking-wider">
                      1-to-1 Live Video Zoom Reading — ₹999
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                      Calendly + Zoom Integrated
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    A private 30-minute face-to-face video consultation. Pick your preferred date and time slot on the integrated <strong>Calendly scheduler</strong> below. Your private Zoom meeting link, passcode, and calendar invite are generated automatically.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handlePayAndBook} className="space-y-6">
            
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Core Client Info */}
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

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span>Email Address *</span>
                  <span className="text-[10px] text-gold-400 lowercase font-mono">
                    {isOffline ? '(report sent here)' : '(zoom invite sent here)'}
                  </span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">
                  Phone / WhatsApp (Recommended for meeting reminders)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none"
                  />
                </div>
              </div>

            </div>

            {/* ADAPTIVE FIELDS: OFFLINE REPORT (₹99) */}
            {isOffline && (
              <div className="space-y-5 pt-2 border-t border-slate-800">
                <div className="flex items-center space-x-2 text-gold-400 text-xs font-cinzel uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  <span>2. Details Needed for Your Reading</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Primary Focus Area */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">
                      Primary Area of Focus *
                    </label>
                    <select
                      value={formData.focusArea}
                      onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 focus:border-gold-400 outline-none"
                    >
                      <option value="Love & Relationships">Love & Relationships</option>
                      <option value="Career & Financial Growth">Career & Financial Growth</option>
                      <option value="Life Path & Soul Purpose">Life Path & Soul Purpose</option>
                      <option value="Urgent Decision / Crossroads">Urgent Decision / Crossroads</option>
                      <option value="General Intuitive Overview">General Intuitive Overview</option>
                    </select>
                  </div>

                  {/* Birth Details / Sun Sign */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">
                      Date of Birth / Zodiac (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.birthDetails}
                      onChange={(e) => setFormData({ ...formData, birthDetails: e.target.value })}
                      placeholder="e.g. 14 Aug 1995 or Leo (helps tune into energies)"
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none"
                    />
                  </div>
                </div>

                {/* Specific Questions for Reading */}
                <div className="space-y-1.5">
                  <label className="text-xs font-cinzel uppercase tracking-wider text-gold-400 font-bold flex items-center justify-between">
                    <span>Questions & Situation Context for the Reading *</span>
                    <span className="text-[10px] text-slate-400 font-normal">1 to 3 core questions</span>
                  </label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      required
                      value={formData.offlineQuestions}
                      onChange={(e) => setFormData({ ...formData, offlineQuestions: e.target.value })}
                      placeholder="Please share 1–3 specific questions or describe your situation in detail. Include names or contexts if asking about a relationship or career decision..."
                      className="w-full p-4 rounded-xl bg-obsidian-900 border border-gold-500/40 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none leading-relaxed"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    💡 The more context you provide, the deeper and more precise your written tarot report will be.
                  </p>
                </div>
              </div>
            )}

            {/* ADAPTIVE FIELDS: LIVE ZOOM VIA CALENDLY (₹999) */}
            {!isOffline && (
              <div className="space-y-6 pt-2 border-t border-slate-800">
                
                {/* Integration Header & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 text-cyan-300 text-xs font-cinzel uppercase tracking-wider font-bold">
                    <CalendarCheck className="w-4 h-4 text-cyan-400" />
                    <span>2. Select Live Zoom Slot via Calendly</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => openCalendlyPopup({ 
                        url: calendlyUrl, 
                        prefill: { name: formData.name, email: formData.email, notes: formData.zoomNotes } 
                      })}
                      className="text-[11px] font-mono text-gold-400 hover:text-gold-300 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-gold-400/10 border border-gold-400/20"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Open Popup</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingCalendlyUrl(!isEditingCalendlyUrl)}
                      className="text-[11px] font-mono text-slate-400 hover:text-slate-300 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700"
                      title="Configure Calendly Link"
                    >
                      <Link2 className="w-3 h-3" />
                      <span>Custom Link</span>
                    </button>
                  </div>
                </div>

                {/* Optional Custom Calendly URL Editor */}
                {isEditingCalendlyUrl && (
                  <div className="p-3.5 rounded-xl bg-obsidian-900 border border-slate-700 space-y-2 text-xs">
                    <label className="text-[11px] font-mono text-slate-300 block">
                      Calendly Event URL (with Zoom Integration active):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={calendlyUrl}
                        onChange={(e) => setCalendlyUrl(e.target.value)}
                        placeholder="https://calendly.com/your-username/30min"
                        className="flex-1 px-3 py-2 rounded-lg bg-obsidian-950 border border-slate-700 text-slate-200 text-xs outline-none focus:border-gold-400"
                      />
                      <button
                        type="button"
                        onClick={() => setIsEditingCalendlyUrl(false)}
                        className="px-3 py-2 rounded-lg bg-gold-500/20 text-gold-300 text-xs font-mono font-semibold"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}

                {/* Zoom Auto-Generation Status Banner */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  calendlyScheduled 
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' 
                    : 'bg-obsidian-900/90 border-cyan-500/30 text-slate-300'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      calendlyScheduled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      <Video className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-slate-100">
                          {calendlyScheduled ? '✓ Zoom Slot Scheduled!' : 'Direct Zoom Integration Active'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                          AUTO-ZOOM
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {calendlyScheduled ? (
                          <>
                            Your slot has been reserved. Your private Zoom meeting link, passcode, and calendar event have been generated by Calendly and emailed to <strong>{formData.email || 'your email'}</strong>. Click below to complete your checkout.
                          </>
                        ) : (
                          <>
                            Select your date and time directly in the calendar below. Calendly will automatically schedule the session, create a secure Zoom room, and email you the invitation.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Embedded Calendly Inline Scheduler */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0b0e14] shadow-2xl min-h-[640px]">
                  <iframe
                    src={embeddedCalendlyUrl}
                    width="100%"
                    height="660"
                    frameBorder="0"
                    title="Tarot X — Schedule Live Zoom Reading via Calendly"
                    className="w-full bg-[#0b0e14]"
                  />
                </div>

                {/* Topics / Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">
                    Topics or Questions for the Zoom Call (Optional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <textarea
                      rows={3}
                      value={formData.zoomNotes}
                      onChange={(e) => setFormData({ ...formData, zoomNotes: e.target.value })}
                      placeholder="Share what situation, decisions, or crossroads you would like to explore together during our 30-minute live call..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Razorpay Pay & Confirm Button */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-400 via-amber-500 to-yellow-600 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-xl shadow-gold-500/20 hover:scale-[1.01] active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4 text-obsidian-950" />
                <span>
                  {submitting 
                    ? 'Connecting to Secure Gateway...' 
                    : isOffline
                      ? `Pay ₹99 & Order Offline Report`
                      : calendlyScheduled
                        ? `Pay ₹999 & Confirm Scheduled Zoom Session`
                        : `Pay ₹999 & Confirm 30-Min Zoom Session`}
                </span>
              </button>

              {/* Supported payment methods badges */}
              <div className="p-3 rounded-xl bg-obsidian-900/60 border border-slate-800 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-gold-400" />
                  <span>Razorpay 256-Bit SSL Secured</span>
                </span>
                <span>•</span>
                <span>UPI (GPay / PhonePe / Paytm)</span>
                <span>•</span>
                <span>Cards & NetBanking</span>
              </div>
            </div>

          </form>

        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl border-2 border-gold-500 p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-cinzel uppercase tracking-widest text-gold-400 font-bold">
                ✦ Payment Verified & Session Booked ✦
              </span>
              <h3 className="font-cinzel text-xl font-bold text-slate-100">
                Thank You, {confirmed.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {confirmed.isOffline ? (
                  <>
                    Your reading details have been received. Your offline tarot report and spread photographs will be delivered directly to <strong>{confirmed.email}</strong> within <strong>24–48 hours</strong>.
                  </>
                ) : (
                  <>
                    Your 30-minute live Zoom session is confirmed! Calendly has automatically generated your private meeting link and dispatched a calendar invitation to <strong>{confirmed.email}</strong>.
                  </>
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-900/90 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment ID:</span>
                <span className="font-mono text-gold-300 font-semibold">{confirmed.paymentId || 'Verified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Service:</span>
                <span className="font-semibold text-slate-200">{confirmed.service_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Platform:</span>
                <span className="font-semibold text-cyan-300 flex items-center space-x-1">
                  <Video className="w-3 h-3 text-cyan-400" />
                  <span>Zoom Video (via Calendly)</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery / Schedule:</span>
                <span className="font-semibold text-slate-200">
                  {confirmed.isOffline 
                    ? 'Email Delivery within 24–48 hrs' 
                    : (confirmed.preferred_date ? `${confirmed.preferred_date} ${confirmed.preferred_time || ''}` : 'Scheduled via Calendly')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-semibold text-emerald-400">{confirmed.price}</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmed(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider hover:brightness-110"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
