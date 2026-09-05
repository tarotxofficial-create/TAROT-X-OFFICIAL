import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Video, 
  CreditCard, 
  Lock, 
  AlertCircle,
  FileText,
  ShieldAlert,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { submitBooking } from '../lib/supabase';
import { initiateRazorpayCheckout } from '../lib/razorpay';
import { READING_SERVICES } from './Services';

export default function BookingForm({ selectedService, onServiceChange }) {
  const initialService = selectedService || READING_SERVICES[0];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceId: initialService.id,
    
    // Intake Questions from Section 9
    clarityTopic: '',
    factsContext: '',
    hopedOutcome: '',
    avoidedDecision: '',
    additionalNotes: '',
    
    // Scheduling (for live Zoom)
    preferredDate: '',
    preferredTime: '18:00',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    
    // Boundary Agreement
    boundaryAgreed: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync when parent prop changes
  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({ ...prev, serviceId: selectedService.id }));
    }
  }, [selectedService]);

  const activeService = READING_SERVICES.find(s => s.id === formData.serviceId) || READING_SERVICES[0];
  const isLive = activeService.type === 'live_zoom';

  const handleServiceSelect = (srv) => {
    setFormData(prev => ({ ...prev, serviceId: srv.id }));
    if (onServiceChange) onServiceChange(srv);
  };

  const handlePayAndConfirm = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMsg('Full Name and Email Address are required.');
      return;
    }

    if (!formData.clarityTopic.trim()) {
      setErrorMsg('Please tell X what you would like clarity about.');
      return;
    }

    if (!formData.boundaryAgreed) {
      setErrorMsg('You must agree to the rationalist boundary guidelines before proceeding.');
      return;
    }

    if (isLive && !formData.preferredDate) {
      setErrorMsg('Please select your preferred date for the 30-minute Zoom session.');
      return;
    }

    setSubmitting(true);

    // Launch Razorpay Live Gateway (₹99 or ₹999)
    initiateRazorpayCheckout({
      serviceTitle: activeService.title,
      amountInINR: activeService.inrAmount,
      customerName: formData.name.trim(),
      customerEmail: formData.email.trim(),
      customerPhone: formData.phone.trim(),
      onSuccess: async (paymentDetails) => {
        try {
          const formattedIntake = [
            `[CLARITY TOPIC]: ${formData.clarityTopic.trim()}`,
            `[FACTS CONTEXT]: ${formData.factsContext.trim() || 'N/A'}`,
            `[HOPED OUTCOME]: ${formData.hopedOutcome.trim() || 'N/A'}`,
            `[AVOIDED DECISION]: ${formData.avoidedDecision.trim() || 'N/A'}`,
            `[ADDITIONAL NOTES]: ${formData.additionalNotes.trim() || 'N/A'}`
          ].join('\n\n');

          const payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            service_title: activeService.title,
            price: activeService.price,
            format: isLive ? 'Live Zoom Video (30 Min)' : 'Offline Pattern Dossier (Email)',
            preferred_date: isLive ? formData.preferredDate : new Date().toISOString().split('T')[0],
            preferred_time: isLive ? formData.preferredTime : 'Sent within 24–48 Hours',
            timezone: formData.timezone,
            notes: formattedIntake,
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
              isLive
            });
          } else {
            setErrorMsg('Payment succeeded, but reservation record could not be saved. Contact tarotxofficial@gmail.com with ID: ' + paymentDetails.paymentId);
          }
        } catch (err) {
          setSubmitting(false);
          setErrorMsg(err.message || 'Error finalizing booking.');
        }
      },
      onFailure: (err) => {
        setSubmitting(false);
        setErrorMsg(err?.message || 'Payment transaction was cancelled or unsuccessful.');
      },
      onDismiss: () => {
        setSubmitting(false);
      }
    });
  };

  return (
    <section id="booking" className="py-24 border-t border-brass/20 bg-void scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center space-x-2 text-brass text-[11px] font-mono uppercase tracking-[0.25em]">
            <Calendar className="w-3.5 h-3.5" />
            <span>The Booking Chamber</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-bone">
            Bring the question you keep avoiding.
          </h2>
          <p className="text-xs sm:text-sm text-smoke max-w-lg mx-auto leading-relaxed font-sans">
            Calm, confidential, and ordinary. Select your session, outline the facts, and reserve your time directly.
          </p>
        </div>

        {/* Booking Container */}
        <div className="archive-panel p-6 sm:p-10 rounded-sm border border-brass/30 space-y-8">
          
          {/* Step 01: Choose Session Selector */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brass block">
              STEP 01 // SELECT SESSION
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {READING_SERVICES.map((srv) => {
                const isSel = srv.id === activeService.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => handleServiceSelect(srv)}
                    className={`p-4 rounded-sm border text-left transition-all ${
                      isSel 
                        ? 'border-brass bg-charcoal text-bone shadow-md ring-1 ring-brass/40' 
                        : 'border-brass/20 bg-void text-smoke hover:border-brass/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-cinzel text-xs font-bold uppercase tracking-wider">{srv.title}</span>
                      <span className="font-cinzel text-base font-bold text-brass">{srv.price}</span>
                    </div>
                    <span className="text-[10px] font-mono text-smoke block mt-1.5">{srv.duration}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); handlePayAndConfirm(); }} className="space-y-8">
            
            {errorMsg && (
              <div className="p-3.5 rounded-sm bg-blood-ink/30 border border-blood-ink text-bone text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-blood-ink shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 02: Scheduling / Delivery Timeframe */}
            {isLive ? (
              <div className="space-y-4 pt-4 border-t border-brass/15">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brass block">
                  STEP 02 // SCHEDULE 30-MINUTE ZOOM SESSION
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-smoke uppercase tracking-wider block">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-sm bg-void border border-brass/30 text-xs text-bone focus:border-brass outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-smoke uppercase tracking-wider block">
                      Preferred Time Slot (30 Mins) *
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-sm bg-void border border-brass/30 text-xs text-bone focus:border-brass outline-none font-mono"
                    >
                      <option value="10:00 AM">10:00 AM (Morning Slot)</option>
                      <option value="02:00 PM">02:00 PM (Afternoon Slot)</option>
                      <option value="06:00 PM">06:00 PM (Evening Slot)</option>
                      <option value="08:30 PM">08:30 PM (Night Slot)</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-sm bg-void border border-brass/25 flex items-start space-x-3 text-xs">
                <Mail className="w-4 h-4 text-brass shrink-0 mt-0.5" />
                <div className="space-y-1 font-sans">
                  <span className="font-mono text-brass text-[10px] uppercase tracking-widest block">
                    STEP 02 // ASYNCHRONOUS EMAIL DELIVERY
                  </span>
                  <p className="text-smoke text-xs leading-relaxed">
                    No live call required. X will draw your spread with dedicated focus. Your written pattern dossier and high-definition card spread photographs will be dispatched to your email within <strong>24–48 hours</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Step 03: The Intake Questions */}
            <div className="space-y-5 pt-4 border-t border-brass/15">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brass block">
                STEP 03 // CLIENT INTAKE & FACTS
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name / Preferred Alias */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-smoke uppercase tracking-wider block">
                    Full Name or Preferred Alias *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="How X should address you"
                    className="w-full px-3.5 py-3 rounded-sm bg-void border border-brass/30 text-xs text-bone placeholder-smoke/50 focus:border-brass outline-none"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-smoke uppercase tracking-wider block">
                    Email Address * (for report / zoom invite)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yourname@domain.com"
                    className="w-full px-3.5 py-3 rounded-sm bg-void border border-brass/30 text-xs text-bone placeholder-smoke/50 focus:border-brass outline-none"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-mono text-smoke uppercase tracking-wider block">
                    Phone / WhatsApp (Optional // for appointment reminders)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-3 rounded-sm bg-void border border-brass/30 text-xs text-bone placeholder-smoke/50 focus:border-brass outline-none font-mono"
                  />
                </div>
              </div>

              {/* Brief Intake Q1 */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-cinzel font-bold text-bone block">
                  1. What would you like clarity about? *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clarityTopic}
                  onChange={(e) => setFormData({ ...formData, clarityTopic: e.target.value })}
                  placeholder="e.g. A career transition, relationship impasse, or unexplainable plateau..."
                  className="w-full px-3.5 py-3 rounded-sm bg-void border border-brass/30 text-xs text-bone placeholder-smoke/50 focus:border-brass outline-none"
                />
              </div>

              {/* Brief Intake Q2 */}
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel font-bold text-bone block">
                  2. What has already happened? (Please describe facts before interpretations)
                </label>
                <textarea
                  rows={3}
                  value={formData.factsContext}
                  onChange={(e) => setFormData({ ...formData, factsContext: e.target.value })}
                  placeholder="State the timeline, tangible actions taken, and who is involved. Concrete reality over emotional theories..."
                  className="w-full p-3.5 rounded-sm bg-void border border-brass/30 text-xs text-bone placeholder-smoke/50 focus:border-brass outline-none leading-relaxed"
                />
              </div>

              {/* Brief Intake Q3 & Q4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-cinzel font-bold text-bone block">
                    3. What outcome are you hoping for?
                  </label>
                  <input
                    type="text"
                    value={formData.hopedOutcome}
                    onChange={(e) => setFormData({ ...formData, hopedOutcome: e.target.value })}
                    placeholder="Your ideal realistic resolution"
                    className="w-full px-3.5 py-3 rounded-sm bg-void border border-brass/30 text-xs text-bone placeholder-smoke/50 focus:border-brass outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-cinzel font-bold text-bone block">
                    4. Is there a decision you are currently avoiding?
                  </label>
                  <input
                    type="text"
                    value={formData.avoidedDecision}
                    onChange={(e) => setFormData({ ...formData, avoidedDecision: e.target.value })}
                    placeholder="The conversation, boundary, or exit you delay"
                    className="w-full px-3.5 py-3 rounded-sm bg-void border border-brass/30 text-xs text-bone placeholder-smoke/50 focus:border-brass outline-none"
                  />
                </div>
              </div>

              {/* Brief Intake Q5 */}
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel font-bold text-bone block">
                  5. Anything X should know before the session? (Optional)
                </label>
                <input
                  type="text"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  placeholder="Date of birth, zodiac context, or sensitivities..."
                  className="w-full px-3.5 py-3 rounded-sm bg-void border border-brass/30 text-xs text-bone placeholder-smoke/50 focus:border-brass outline-none"
                />
              </div>

            </div>

            {/* Boundary Copy from Section 9 */}
            <div className="p-4 rounded-sm bg-charcoal/60 border border-brass/30 space-y-3">
              <div className="flex items-start space-x-2 text-brass text-xs font-mono uppercase tracking-widest">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>EXPLICIT BOUNDARY PROTOCOL</span>
              </div>
              <p className="text-xs text-smoke leading-relaxed font-sans">
                "X does not claim supernatural certainty. A reading is a reflective pattern-analysis experience, not medical, legal, financial, psychological, or emergency advice."
              </p>
              <label className="flex items-center space-x-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.boundaryAgreed}
                  onChange={(e) => setFormData({ ...formData, boundaryAgreed: e.target.checked })}
                  className="w-4 h-4 rounded-sm accent-[#A98C5B]"
                />
                <span className="text-xs text-bone font-mono">
                  I understand and accept the rationalist boundaries of this practice.
                </span>
              </label>
            </div>

            {/* Step 05: Payment Button */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-sm bg-brass text-void font-cinzel font-bold text-xs uppercase tracking-[0.25em] shadow-xl shadow-brass/10 hover:bg-brass-light active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4 text-void" />
                <span>
                  {submitting 
                    ? 'Connecting to Secure Gateway...' 
                    : isLive
                      ? `CONFIRM & PAY ₹999 FOR 30-MIN ZOOM`
                      : `CONFIRM & PAY ₹99 FOR OFFLINE DOSSIER`}
                </span>
              </button>

              <div className="p-3 rounded-sm bg-void border border-brass/15 flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-smoke">
                <span className="flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-brass" />
                  <span>Razorpay 256-Bit SSL PCI-Compliant</span>
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

      {/* Confirmation Scene (Section 10 from brief) */}
      {confirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/90 backdrop-blur-md animate-fade-in">
          <div className="archive-panel w-full max-w-lg rounded-sm border border-brass p-7 sm:p-10 space-y-6 shadow-2xl">
            
            <div className="w-12 h-12 rounded-sm bg-ink border border-brass flex items-center justify-center mx-auto text-brass">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-2 text-center">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brass">
                CONFIRMATION // ARCHIVE REF: {confirmed.paymentId?.substring(0, 10) || 'CONFIRMED'}
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-bone">
                The room is reserved.
              </h3>
              <p className="text-xs font-serif italic text-smoke leading-relaxed">
                "Bring the question you keep avoiding. Bring the facts. Leave the performance outside."
              </p>
            </div>

            <div className="p-4 rounded-sm bg-void border border-brass/25 space-y-2.5 text-xs font-mono text-smoke">
              <div className="flex justify-between">
                <span>Session:</span>
                <span className="text-bone font-semibold">{confirmed.service_title}</span>
              </div>
              <div className="flex justify-between">
                <span>Destination / Time:</span>
                <span className="text-brass">
                  {confirmed.isLive 
                    ? `${confirmed.preferred_date} at ${confirmed.preferred_time}` 
                    : 'Dispatched to email within 24–48 hrs'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Client Mail:</span>
                <span className="text-bone">{confirmed.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="text-brass font-bold">{confirmed.price}</span>
              </div>
            </div>

            {/* Preparation Points (Section 10) */}
            <div className="space-y-1.5 text-xs text-smoke font-sans border-t border-charcoal pt-3">
              <span className="font-mono text-[9px] text-brass uppercase tracking-widest block">
                PREPARATION PROTOCOL:
              </span>
              <p className="text-[11px]">• Clarify the exact decision or loop you want dissected.</p>
              <p className="text-[11px]">• Write down facts, dates, and names before the session begins.</p>
              <p className="text-[11px]">• Check your email inbox for your receipt and calendar access link.</p>
            </div>

            <button
              onClick={() => setConfirmed(null)}
              className="w-full py-3 rounded-sm bg-brass text-void font-cinzel font-bold text-xs uppercase tracking-[0.2em] hover:bg-brass-light transition-all"
            >
              CLOSE & RETURN TO ARCHIVE
            </button>

          </div>
        </div>
      )}

    </section>
  );
}


