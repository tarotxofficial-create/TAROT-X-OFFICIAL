import React, { useState, useEffect, useRef } from 'react';
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
  Link2,
  ShieldCheck,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { submitBooking } from '../lib/supabase';
import { initiateRazorpayCheckout, verifyPaymentWithServer } from '../lib/razorpay';
import { READING_SERVICES } from './Services';
import { DEFAULT_CALENDLY_URL, buildCalendlyUrl, openCalendlyPopup, cancelCalendlyBooking } from '../lib/calendly';
import { sendBookingAlert } from '../lib/emailService';

export default function BookingForm({ selectedService, onServiceChange }) {
  const initialService = selectedService || READING_SERVICES[0];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceId: initialService.id,
    
    // Offline Reading specific details
    focusArea: 'Relationship Dynamics & Patterns',
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
  const [cancellationNotice, setCancellationNotice] = useState('');

  // Calendly + Zoom integration states
  const [calendlyUrl, setCalendlyUrl] = useState(DEFAULT_CALENDLY_URL);
  const [isEditingCalendlyUrl, setIsEditingCalendlyUrl] = useState(false);
  const [calendlyScheduled, setCalendlyScheduled] = useState(false);
  const [calendlyEventData, setCalendlyEventData] = useState(null);
  const [paymentVerified, setPaymentVerified] = useState(false);

  // Auto-cancellation timer ref (5-minute hold)
  const autoCancelTimerRef = useRef(null);
  const calendlyEventRef = useRef(null);

  // Keep ref synchronized with state for callbacks
  useEffect(() => {
    calendlyEventRef.current = calendlyEventData;
  }, [calendlyEventData]);

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
        const payload = e.data.payload;
        setCalendlyScheduled(true);
        setCalendlyEventData(payload);
        setCancellationNotice('');
        setErrorMsg('');

        // Auto-extract date & time if available
        if (payload?.event?.start_time) {
          try {
            const dateObj = new Date(payload.event.start_time);
            setFormData(prev => ({
              ...prev,
              preferredDate: dateObj.toISOString().split('T')[0],
              preferredTime: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
          } catch (err) {
            console.warn('Could not parse scheduled date:', err);
          }
        }

        // Set 5-minute auto-cancel timer if payment is not verified within 5 minutes
        if (autoCancelTimerRef.current) clearTimeout(autoCancelTimerRef.current);
        autoCancelTimerRef.current = setTimeout(async () => {
          if (!paymentVerified && payload?.event?.uri) {
            console.warn('Payment timeout reached (5 mins). Auto-deleting Calendly booking...');
            await cancelCalendlyBooking({
              eventUri: payload.event.uri,
              reason: 'Payment timeout (5 mins elapsed without payment confirmation) on Tarot X Official'
            });
            setCalendlyScheduled(false);
            setCalendlyEventData(null);
            setCancellationNotice('Your reserved Calendly slot was automatically cancelled because payment was not completed within 5 minutes.');
          }
        }, 5 * 60 * 1000);
      }
    };

    window.addEventListener('message', handleCalendlyMessage);
    return () => {
      window.removeEventListener('message', handleCalendlyMessage);
      if (autoCancelTimerRef.current) clearTimeout(autoCancelTimerRef.current);
    };
  }, [paymentVerified]);

  const activeService = READING_SERVICES.find(s => s.id === formData.serviceId) || READING_SERVICES[0];
  const isOffline = activeService.type === 'offline';

  const handleServiceSelect = (srv) => {
    setFormData(prev => ({ ...prev, serviceId: srv.id }));
    if (onServiceChange) onServiceChange(srv);
  };

  // Helper to auto-cancel and release Calendly slot
  const handleAutoDeleteCalendlySlot = async (reason) => {
    const currentEvent = calendlyEventRef.current;
    if (currentEvent?.event?.uri) {
      console.log('Triggering auto-delete for Calendly event:', currentEvent.event.uri);
      await cancelCalendlyBooking({
        eventUri: currentEvent.event.uri,
        reason: reason || 'Payment not completed by client on Tarot X Official'
      });
      setCalendlyScheduled(false);
      setCalendlyEventData(null);
      if (autoCancelTimerRef.current) clearTimeout(autoCancelTimerRef.current);
      setCancellationNotice('Payment was not completed. Your preliminary Calendly slot was automatically cancelled and released.');
    }
  };

  const handlePayAndBook = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setCancellationNotice('');

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
    } else {
      // For Live Zoom, encourage picking a slot or require scheduling
      if (!calendlyScheduled) {
        // User can still proceed to pay, or pick slot
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
          // 1. VERIFY PAYMENT CONFIRMATION WITH BACKEND
          const verification = await verifyPaymentWithServer({
            paymentId: paymentDetails.paymentId,
            expectedAmountINR: activeService.inrAmount
          });

          if (!verification.verified) {
            // Payment rejected or verification mismatch -> AUTO-DELETE CALENDLY BOOKING
            await handleAutoDeleteCalendlySlot('Payment verification failed on Tarot X Official');
            setSubmitting(false);
            setErrorMsg(verification.error || 'Payment confirmation could not be verified by gateway. Calendly slot released.');
            return;
          }

          // Payment successfully verified!
          setPaymentVerified(true);
          if (autoCancelTimerRef.current) clearTimeout(autoCancelTimerRef.current);

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
            payment_status: 'verified_paid',
            status: 'confirmed'
          };

          const result = await submitBooking(payload);
          setSubmitting(false);

          if (result.success) {
            // Trigger Resend email notification alert in background
            sendBookingAlert({ ...payload, id: result.booking?.id }).catch(e => console.warn('Email notice:', e));

            setConfirmed({
              ...result.booking,
              paymentId: paymentDetails.paymentId,
              isOffline,
              calendlyScheduled,
              verifiedPayment: true
            });
          } else {
            setErrorMsg('Payment verified, but could not save booking. Please contact tarotxofficial@gmail.com with ID: ' + paymentDetails.paymentId);
          }
        } catch (err) {
          setSubmitting(false);
          // If error finalizing, check if slot needs cancellation
          if (!paymentVerified) {
            await handleAutoDeleteCalendlySlot('Error finalizing booking after payment');
          }
          setErrorMsg(err.message || 'Error verifying booking after payment.');
        }
      },
      onFailure: async (err) => {
        setSubmitting(false);
        // AUTO-DELETE CALENDLY BOOKING ON PAYMENT FAILURE
        await handleAutoDeleteCalendlySlot('Payment failed or transaction declined');
        setErrorMsg(err?.message || 'Payment was unsuccessful. Any preliminary Calendly reservation has been cancelled.');
      },
      onDismiss: async () => {
        setSubmitting(false);
        // AUTO-DELETE CALENDLY BOOKING ON PAYMENT DISMISSAL
        await handleAutoDeleteCalendlySlot('Payment modal dismissed by client without completing payment');
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
            <span>Consultation Scheduler & Verified Checkout</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold gold-gradient-text">
            Book Your Reading
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            “You don't need a sign. You need to make the decision you already know you’re avoiding.” Secure your session below:
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
                    Offline Pattern Report — ₹99
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    No live call needed. Strip away your preferred story and share the facts. X analyzes your spread through pattern recognition, delivering a comprehensive diagnostic dossier to your email within <strong>24–48 hours</strong>.
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
                    A private 30-minute face-to-face video consultation. Pick your slot on the integrated Calendly scheduler below. <strong>Slots are temporarily held and locked only upon payment confirmation</strong>; unpaid reservations are automatically released.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Cancellation Notice (If slot was auto-deleted) */}
          {cancellationNotice && (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs flex items-start space-x-3 animate-fade-in">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold text-amber-300 block">Slot Auto-Cancelled Notice</span>
                <p className="leading-relaxed">{cancellationNotice}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handlePayAndBook} className="space-y-6">
            
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
                  <span>2. Details Needed for Your Analysis</span>
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
                      <option value="Relationship Dynamics & Patterns">Relationship Dynamics & Attachment Patterns</option>
                      <option value="Career, Risk & Decision Dilemmas">Career, Risk & Decision Dilemmas</option>
                      <option value="Repeated Obstacle or Avoidance Loop">Repeated Obstacle or Avoidance Loop</option>
                      <option value="Strategic Crossroads & Probability">Strategic Crossroads & Probability</option>
                      <option value="Comprehensive Pattern Analysis">Comprehensive Pattern Analysis</option>
                    </select>
                  </div>

                  {/* Birth Details / Sun Sign */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-cinzel uppercase tracking-wider text-slate-300">
                      Date of Birth (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.birthDetails}
                      onChange={(e) => setFormData({ ...formData, birthDetails: e.target.value })}
                      placeholder="e.g. 14 Aug 1995 (used strictly for archetypal & numerological indexing)"
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none"
                    />
                  </div>
                </div>

                {/* Specific Questions for Reading */}
                <div className="space-y-1.5">
                  <label className="text-xs font-cinzel uppercase tracking-wider text-gold-400 font-bold flex items-center justify-between">
                    <span>Situation Context & Specific Questions *</span>
                    <span className="text-[10px] text-slate-400 font-normal">1 to 3 core questions</span>
                  </label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      required
                      value={formData.offlineQuestions}
                      onChange={(e) => setFormData({ ...formData, offlineQuestions: e.target.value })}
                      placeholder="“Tell me what happened. Not what you think it means.” Describe the recurring situation, the choices you're facing, or the contradiction you're trying to resolve..."
                      className="w-full p-4 rounded-xl bg-obsidian-900 border border-gold-500/40 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-400 outline-none leading-relaxed"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    💡 “Hope is not evidence.” Concrete facts yield sharper, more actionable probability models.
                  </p>
                </div>
              </div>
            )}

            {/* ADAPTIVE FIELDS: LIVE ZOOM VIA CALENDLY (₹999) */}
            {!isOffline && (
              <div className="space-y-6 pt-2 border-t border-slate-800">
                
                {/* Integration Header & Controls */}
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

                {/* Zoom Auto-Generation & Payment Verification Status Banner */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  calendlyScheduled 
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-200' 
                    : 'bg-obsidian-900/90 border-cyan-500/30 text-slate-300'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        calendlyScheduled ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        <Video className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-slate-100">
                            {calendlyScheduled ? '⚡ Slot Temporarily Reserved' : 'Direct Zoom Integration Active'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                            PAYMENT-VERIFIED LOCK
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {calendlyScheduled ? (
                            <>
                              Slot selected for <strong>{formData.preferredDate} {formData.preferredTime}</strong>. Complete payment confirmation below to finalize your booking. If payment is not completed, this booking will be <strong>auto-deleted from Calendly</strong> to release the slot.
                            </>
                          ) : (
                            <>
                              Select your date and time directly in the calendar below. Calendly will prepare your Zoom room. Payment confirmation is strictly verified before locking the appointment.
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {calendlyScheduled && (
                      <button
                        type="button"
                        onClick={() => handleAutoDeleteCalendlySlot('Cancelled by client before payment')}
                        className="shrink-0 flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/80 text-[11px] font-mono transition-colors"
                        title="Release slot and cancel reservation"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Slot</span>
                      </button>
                    )}
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
                    Topics or Decisions for the Live Zoom Call (Optional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <textarea
                      rows={3}
                      value={formData.zoomNotes}
                      onChange={(e) => setFormData({ ...formData, zoomNotes: e.target.value })}
                      placeholder="Share the pattern, recurring decision, or dilemma you want to interrogate during our 30-minute live call..."
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
                <ShieldCheck className="w-4 h-4 text-obsidian-950" />
                <span>
                  {submitting 
                    ? 'Verifying Payment Confirmation...' 
                    : isOffline
                      ? `Pay ₹99 & Order Analysis Dossier`
                      : calendlyScheduled
                        ? `Verify ₹999 Payment & Lock Live Session`
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
                <span className="text-emerald-400 font-mono text-[10px]">
                  ✓ Verified Payment Confirmation
                </span>
                <span>•</span>
                <span className="text-amber-400 font-mono text-[10px]">
                  ⚡ Auto-Delete on Incomplete Payment
                </span>
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
                ✦ Payment Verified & Analysis Confirmed ✦
              </span>
              <h3 className="font-cinzel text-xl font-bold text-slate-100">
                Thank You, {confirmed.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {confirmed.isOffline ? (
                  <>
                    Your situation details have been received and payment is verified. Your written pattern dossier and card photographs will be delivered directly to <strong>{confirmed.email}</strong> within <strong>24–48 hours</strong>.
                  </>
                ) : (
                  <>
                    Your 30-minute live consultation is locked in. Calendly has generated your private Zoom room and sent your calendar invite to <strong>{confirmed.email}</strong>.
                  </>
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-900/90 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status:</span>
                <span className="font-mono text-emerald-400 font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified & Captured</span>
                </span>
              </div>
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
                <span className="text-slate-400">Schedule:</span>
                <span className="font-semibold text-slate-200">
                  {confirmed.isOffline 
                    ? 'Email Delivery within 24–48 hrs' 
                    : (confirmed.preferred_date ? `${confirmed.preferred_date} ${confirmed.preferred_time || ''}` : 'Confirmed on Calendar')}
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
