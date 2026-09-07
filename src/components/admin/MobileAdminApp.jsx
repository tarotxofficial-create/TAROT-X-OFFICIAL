import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  TrendingUp, 
  Mail, 
  ShieldCheck, 
  Search, 
  Plus, 
  RefreshCw, 
  Phone, 
  MessageCircle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ChevronRight, 
  X, 
  Download, 
  Send, 
  Lock, 
  Key, 
  Database, 
  ExternalLink, 
  Trash2,
  Sparkles,
  User,
  Check,
  AlarmClock,
  Bell,
  Video
} from 'lucide-react';

export default function MobileAdminApp({
  bookings = [],
  subscribers = [],
  metrics,
  loading = false,
  onRefresh,
  onStatusChange,
  onSaveReaderNotes,
  onDeleteBooking,
  onAddManualBooking,
  onDeleteSubscriber,
  onAddSubscriber,
  onExportBookings,
  onExportRevenue,
  onExportNewsletter,
  onSendTestEmail,
  onTestMeetingReminder,
  onTestNewBookingPopup,
  onSyncBookingsWithDevice,
  reminderNotice,
  simulatedPopup,
  setSimulatedPopup,
  onLogout,
  onExit,
  customPasscodeState
}) {
  // Mobile Tab State
  const [activeTab, setActiveTab] = useState('pulse'); // pulse, bookings, revenue, dispatch, settings
  
  // Bookings Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Bottom Sheet Drawer States
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [readerNotesDraft, setReaderNotesDraft] = useState('');
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [newManualEmail, setNewManualEmail] = useState('');
  const [newManualSource, setNewManualSource] = useState('manual');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  // New Booking Form State
  const [newBookingForm, setNewBookingForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    service_id: 'zoom-reading',
    service_name: '1-to-1 Live Zoom Reading',
    service_price: 999,
    scheduled_at: new Date().toISOString().slice(0, 16),
    client_inquiry: 'Direct Consultation (Admin Scheduled)',
    payment_reference: 'CASH / MANUAL'
  });

  // Settings Passcode State
  const [newPinInput, setNewPinInput] = useState('');
  const [pinFeedback, setPinFeedback] = useState('');

  // Resend Email Diagnostic State
  const [emailSending, setEmailSending] = useState(false);
  const [emailNotice, setEmailNotice] = useState(null);

  // Filter Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.client_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.client_phone?.includes(searchQuery) ||
      b.service_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.booking_ref?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Open Booking Details Drawer
  const handleOpenBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setReaderNotesDraft(booking.reader_notes || '');
  };

  // Save Notes
  const handleSaveNotes = async () => {
    if (!selectedBooking) return;
    await onSaveReaderNotes(selectedBooking.id, readerNotesDraft);
    setSelectedBooking(prev => prev ? { ...prev, reader_notes: readerNotesDraft } : null);
  };

  // Submit Manual Booking
  const handleCreateBookingSubmit = async (e) => {
    e.preventDefault();
    await onAddManualBooking(newBookingForm);
    setIsNewBookingOpen(false);
    setNewBookingForm({
      client_name: '',
      client_email: '',
      client_phone: '',
      service_id: 'zoom-reading',
      service_name: '1-to-1 Live Zoom Reading',
      service_price: 999,
      scheduled_at: new Date().toISOString().slice(0, 16),
      client_inquiry: 'Direct Consultation (Admin Scheduled)',
      payment_reference: 'CASH / MANUAL'
    });
  };

  // Submit Subscriber
  const handleAddSubscriberSubmit = async (e) => {
    e.preventDefault();
    if (!newManualEmail.trim()) return;
    setIsSubmittingEmail(true);
    await onAddSubscriber(newManualEmail.trim(), newManualSource);
    setNewManualEmail('');
    setIsSubmittingEmail(false);
  };

  // Test Email
  const handleTriggerTestEmail = async () => {
    setEmailSending(true);
    setEmailNotice(null);
    try {
      const res = await onSendTestEmail();
      if (res && res.ok) {
        setEmailNotice({ success: true, text: `Delivered! ID: ${res.id?.slice(0, 12)}...` });
      } else {
        setEmailNotice({ success: false, text: res?.error || 'Email dispatch failed' });
      }
    } catch (err) {
      setEmailNotice({ success: false, text: err.message });
    } finally {
      setEmailSending(false);
    }
  };

  // Passcode Update
  const handleUpdatePin = (e) => {
    e.preventDefault();
    if (customPasscodeState && customPasscodeState.setPasscode) {
      const res = customPasscodeState.setPasscode(newPinInput);
      setPinFeedback(res.message);
      if (res.success) setNewPinInput('');
    }
  };

  // Helper for Status Badge Color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return { text: 'Confirmed', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'in_progress':
        return { text: 'In Progress', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
      case 'completed':
        return { text: 'Completed', bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
      case 'cancelled':
        return { text: 'Cancelled', bg: 'bg-red-500/15 text-red-400 border-red-500/30' };
      default:
        return { text: status, bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30' };
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 font-sans selection:bg-gold-500 selection:text-obsidian-950 flex flex-col pb-28 select-none">
      
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-72 bg-gradient-to-b from-gold-500/10 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="fixed inset-0 scanline-overlay pointer-events-none opacity-10" />

      {/* ============================================================ */}
      {/* 1. NATIVE MOBILE APP HEADER (STICKY)                         */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-30 bg-obsidian-950/90 backdrop-blur-xl border-b border-gold-500/20 px-4 py-3 flex items-center justify-between shadow-lg shadow-black/40">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold-400/20 to-amber-600/30 border border-gold-500/40 flex items-center justify-center shadow-inner">
            <span className="font-cinzel text-xs font-black gold-gradient-text tracking-tighter">TX</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-cinzel text-sm font-bold tracking-wider gold-gradient-text">TAROT X</span>
              <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20">
                PRO
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Sanctuary</span>
            </div>
          </div>
        </div>

        {/* Quick Actions in Header */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-xl bg-obsidian-900 border border-slate-800 text-slate-300 hover:text-gold-400 active:scale-95 transition-all"
            title="Refresh Registry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-gold-400' : ''}`} />
          </button>
          
          <button
            onClick={() => setIsNewBookingOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-gold-400 to-amber-500 text-obsidian-950 font-cinzel font-bold text-xs flex items-center space-x-1 shadow-md shadow-gold-500/20 active:scale-95 transition-transform"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Book</span>
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. TAB CONTENT VIEWS                                         */}
      {/* ============================================================ */}
      <main className="flex-1 px-4 pt-4 max-w-md mx-auto w-full space-y-5">

        {/* ------------------------------------------------------------ */}
        {/* TAB 1: PULSE (OVERVIEW & EXECUTIVE SUMMARY)                  */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'pulse' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            
            {/* Hero Revenue Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-obsidian-900 via-obsidian-900/90 to-obsidian-950 border border-gold-500/30 p-5 shadow-xl shadow-gold-500/5">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span>Gross Consultations</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                  Real-time
                </span>
              </div>

              <div className="flex items-baseline space-x-2 my-1">
                <span className="font-cinzel text-3xl font-extrabold gold-gradient-text tracking-tight">
                  ₹{metrics?.totalRevenue?.toLocaleString('en-IN') || 0}
                </span>
                <span className="text-xs text-slate-400 font-mono">INR Total</span>
              </div>

              {/* Offerings Proportional Bar */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-gold-400">₹999 Zoom ({metrics?.zoomBookings || 0})</span>
                  <span className="text-amber-300">₹99 Dossier ({metrics?.dossierBookings || 0})</span>
                </div>
                
                {/* Visual Ratio Bar */}
                <div className="w-full h-2 rounded-full bg-obsidian-950 border border-slate-800 overflow-hidden flex">
                  <div 
                    className="h-full bg-gradient-to-r from-gold-400 to-amber-500 transition-all duration-500" 
                    style={{ width: `${metrics?.totalRevenue > 0 ? ((metrics?.zoomRevenue || 0) / metrics?.totalRevenue) * 100 : 50}%` }} 
                  />
                  <div 
                    className="h-full bg-gradient-to-r from-amber-600 to-yellow-600 transition-all duration-500" 
                    style={{ width: `${metrics?.totalRevenue > 0 ? ((metrics?.dossierRevenue || 0) / metrics?.totalRevenue) * 100 : 50}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Quick KPI Stat Tiles */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-obsidian-900/80 border border-slate-800/90 rounded-2xl p-3.5">
                <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-gold-400" />
                  <span>Bookings</span>
                </div>
                <div className="font-cinzel text-xl font-bold text-slate-100">
                  {metrics?.totalBookings || 0}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {metrics?.confirmedBookings || 0} confirmed active
                </div>
              </div>

              <div className="bg-obsidian-900/80 border border-slate-800/90 rounded-2xl p-3.5">
                <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Subscribers</span>
                </div>
                <div className="font-cinzel text-xl font-bold text-slate-100">
                  {subscribers.length || 0}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Probability Dispatch
                </div>
              </div>
            </div>

            {/* Quick Actions Carousel / Row */}
            <div className="bg-obsidian-900/60 border border-slate-800/80 rounded-2xl p-3.5 space-y-2.5">
              <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                Executive Touch Actions
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setIsNewBookingOpen(true)}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-obsidian-950 border border-gold-500/20 hover:border-gold-500/50 text-slate-300 active:scale-95 transition-all text-center space-y-1"
                >
                  <Plus className="w-4 h-4 text-gold-400" />
                  <span className="text-[9px] font-mono">New Book</span>
                </button>

                <button
                  onClick={onExportBookings}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-obsidian-950 border border-gold-500/20 hover:border-gold-500/50 text-slate-300 active:scale-95 transition-all text-center space-y-1"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span className="text-[9px] font-mono">CSV Export</span>
                </button>

                <button
                  onClick={() => onTestMeetingReminder?.(5)}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-obsidian-950 border border-gold-500/40 hover:border-gold-500 text-gold-300 active:scale-95 transition-all text-center space-y-1 shadow-sm shadow-gold-500/10"
                  title="Test 5-Second Meeting Reminder Alarm"
                >
                  <AlarmClock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-[9px] font-mono font-bold text-gold-400">Test Alert</span>
                </button>

                <button
                  onClick={handleTriggerTestEmail}
                  disabled={emailSending}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-obsidian-950 border border-gold-500/20 hover:border-gold-500/50 text-slate-300 active:scale-95 transition-all text-center space-y-1"
                >
                  <Send className={`w-4 h-4 ${emailSending ? 'animate-pulse text-amber-400' : 'text-blue-400'}`} />
                  <span className="text-[9px] font-mono">{emailSending ? 'Sending...' : 'Test Mail'}</span>
                </button>
              </div>
              {emailNotice && (
                <div className={`p-2 rounded-lg text-[11px] font-mono ${emailNotice.success ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'}`}>
                  {emailNotice.text}
                </div>
              )}
            </div>

            {/* Attention Queue: Bookings awaiting reading or completed */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400 px-1">
                <span>Recent Inquiries ({bookings.slice(0, 4).length})</span>
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className="text-gold-400 hover:text-gold-300 flex items-center space-x-0.5 text-[11px]"
                >
                  <span>See All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {bookings.slice(0, 3).map(b => (
                  <div
                    key={b.id}
                    onClick={() => handleOpenBookingDetails(b)}
                    className="bg-obsidian-900/90 border border-slate-800 hover:border-gold-500/40 rounded-2xl p-3.5 flex items-center justify-between active:scale-98 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-obsidian-950 border border-slate-700 flex items-center justify-center shrink-0 text-gold-400 font-bold font-cinzel text-xs">
                        {b.client_name ? b.client_name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-slate-100 truncate">
                          {b.client_name || 'Anonymous Seeker'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {b.service_name} · ₹{b.service_price}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${getStatusBadge(b.status).bg}`}>
                        {getStatusBadge(b.status).text}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB 2: BOOKINGS (MOBILE CARD FEED)                           */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'bookings' && (
          <div className="space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            
            {/* Search Pill */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search seeker, phone, inquiry..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-obsidian-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-400/80 transition-colors font-mono"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Horizontal Filter Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'confirmed', label: 'Confirmed' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'completed', label: 'Completed' },
                { id: 'cancelled', label: 'Cancelled' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-full font-mono text-[11px] whitespace-nowrap transition-all ${
                    statusFilter === f.id
                      ? 'bg-gold-500 text-obsidian-950 font-bold shadow-md shadow-gold-500/20'
                      : 'bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Bookings Count Summary */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
              <span>Showing {filteredBookings.length} consultations</span>
              <button 
                onClick={onExportBookings}
                className="text-gold-400 hover:text-gold-300 flex items-center space-x-1"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Booking Cards Feed */}
            {filteredBookings.length === 0 ? (
              <div className="p-8 text-center bg-obsidian-900/40 rounded-2xl border border-dashed border-slate-800 space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs text-slate-400 font-mono">No consultations matched your search criteria.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBookings.map(b => (
                  <div
                    key={b.id}
                    className="bg-obsidian-900/90 border border-slate-800 hover:border-gold-500/30 rounded-2xl p-4 space-y-3 shadow-md transition-all"
                  >
                    {/* Top Row: Avatar, Name & Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-obsidian-950 border border-gold-500/30 flex items-center justify-center text-gold-400 font-cinzel font-bold text-sm shadow-inner">
                          {b.client_name ? b.client_name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-100">
                            {b.client_name || 'Anonymous Seeker'}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {b.client_email || 'No email provided'}
                          </div>
                        </div>
                      </div>

                      {/* Status Dropdown/Menu */}
                      <select
                        value={b.status}
                        onChange={(e) => onStatusChange(b.id, e.target.value)}
                        className={`text-[10px] font-mono font-semibold py-1 px-2 rounded-full border outline-none cursor-pointer ${getStatusBadge(b.status).bg}`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Service & Time Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                      <span className="px-2.5 py-0.5 rounded-lg bg-obsidian-950 border border-slate-800 text-gold-400 font-semibold">
                        {b.service_name} · ₹{b.service_price}
                      </span>
                      {b.scheduled_at && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-obsidian-950 border border-slate-800 text-slate-400 flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{new Date(b.scheduled_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </span>
                      )}
                    </div>

                    {/* Inquiry Snippet */}
                    {b.client_inquiry && (
                      <p className="text-xs text-slate-300/90 italic bg-obsidian-950/60 p-2.5 rounded-xl border border-slate-800/60 line-clamp-2">
                        "{b.client_inquiry}"
                      </p>
                    )}

                    {/* Reader Notes Snippet if available */}
                    {b.reader_notes && (
                      <div className="flex items-center space-x-1.5 text-[11px] text-amber-400/90 font-mono bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        <FileText className="w-3 h-3 shrink-0" />
                        <span className="truncate">Notes: {b.reader_notes}</span>
                      </div>
                    )}

                    {/* Action Buttons Row */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {b.client_phone && (
                          <>
                            <a
                              href={`https://wa.me/${b.client_phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 active:scale-95 transition-transform"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                            <a
                              href={`tel:${b.client_phone}`}
                              className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 active:scale-95 transition-transform"
                              title="Direct Phone Call"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => handleOpenBookingDetails(b)}
                        className="px-3 py-1.5 rounded-xl bg-obsidian-950 border border-gold-500/30 hover:border-gold-500/60 text-gold-400 text-xs font-mono flex items-center space-x-1 active:scale-95 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Inspect & Notes</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB 3: REVENUE & LEDGER                                      */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'revenue' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            
            {/* Revenue Hero */}
            <div className="rounded-3xl bg-gradient-to-br from-obsidian-900 via-obsidian-900/90 to-obsidian-950 border border-gold-500/30 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Cleared Income</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                  Live Gateway
                </span>
              </div>

              <div>
                <div className="font-cinzel text-3xl font-extrabold gold-gradient-text">
                  ₹{metrics?.totalRevenue?.toLocaleString('en-IN') || 0}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Across {metrics?.totalBookings || 0} scheduled sessions
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div className="bg-obsidian-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">1-on-1 Zoom</div>
                  <div className="font-cinzel text-base font-bold text-gold-400">
                    ₹{(metrics?.zoomRevenue || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="bg-obsidian-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Dossier ₹99</div>
                  <div className="font-cinzel text-base font-bold text-amber-300">
                    ₹{(metrics?.dossierRevenue || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Export CSV Action Bar */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Audit Trail ({bookings.length})
              </span>
              <button
                onClick={onExportRevenue}
                className="px-3 py-1.5 rounded-xl bg-obsidian-900 border border-gold-500/30 text-gold-400 text-xs font-mono flex items-center space-x-1.5 active:scale-95 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger</span>
              </button>
            </div>

            {/* Transactions Feed */}
            <div className="space-y-2.5">
              {bookings.map(item => (
                <div 
                  key={item.id}
                  className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="font-semibold text-xs text-slate-100 truncate">
                      {item.client_name || 'Anonymous Client'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {item.service_name}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">
                      Ref: {item.payment_reference || 'RAZORPAY_PROD'}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-cinzel font-bold text-sm gold-gradient-text">
                      ₹{item.service_price}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      Paid
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB 4: DISPATCH (NEWSLETTER & LEADS)                         */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'dispatch' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            
            {/* Newsletter Overview Card */}
            <div className="rounded-3xl bg-gradient-to-br from-obsidian-900 via-obsidian-900/90 to-obsidian-950 border border-amber-500/30 p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">The Probability Dispatch</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono">
                  Weekly Audience
                </span>
              </div>

              <div>
                <div className="font-cinzel text-3xl font-extrabold gold-gradient-text">
                  {subscribers.length}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Direct client emails registered for analytical briefings
                </div>
              </div>
            </div>

            {/* Quick Add Subscriber Form */}
            <form onSubmit={handleAddSubscriberSubmit} className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
                Register Lead / Client Email
              </div>
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={newManualEmail}
                  onChange={(e) => setNewManualEmail(e.target.value)}
                  placeholder="client@example.com"
                  required
                  className="flex-1 px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-gold-400"
                />
                <button
                  type="submit"
                  disabled={isSubmittingEmail || !newManualEmail}
                  className="px-4 py-2 rounded-xl bg-gold-400 text-obsidian-950 font-cinzel font-bold text-xs active:scale-95 transition-transform disabled:opacity-50"
                >
                  {isSubmittingEmail ? '...' : 'Add'}
                </button>
              </div>
            </form>

            {/* Action Bar */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Subscriber Registry
              </span>
              <button
                onClick={onExportNewsletter}
                className="px-3 py-1.5 rounded-xl bg-obsidian-900 border border-gold-500/30 text-gold-400 text-xs font-mono flex items-center space-x-1.5 active:scale-95 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export List</span>
              </button>
            </div>

            {/* Subscribers List */}
            <div className="space-y-2">
              {subscribers.map(sub => (
                <div 
                  key={sub.id}
                  className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="font-semibold text-xs text-slate-200 truncate">
                      {sub.email}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Source: {sub.source || 'website_footer'} · {new Date(sub.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteSubscriber(sub.id)}
                    className="p-1.5 text-slate-600 hover:text-red-400 transition-colors"
                    title="Remove Subscriber"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB 5: SETTINGS & SECURITY                                   */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            
            {/* Master Security PIN Card */}
            <div className="bg-obsidian-900/90 border border-gold-500/30 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 text-gold-400">
                <Lock className="w-4 h-4" />
                <h3 className="font-cinzel text-sm font-bold tracking-wide">Master Passcode</h3>
              </div>

              <form onSubmit={handleUpdatePin} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Set New Executive PIN
                  </label>
                  <input
                    type="password"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="Enter new PIN..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-gold-400"
                  />
                </div>

                {pinFeedback && (
                  <div className="text-xs font-mono text-gold-400">
                    {pinFeedback}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!newPinInput}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-amber-500 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider active:scale-98 transition-all disabled:opacity-50"
                >
                  Update Passcode
                </button>
              </form>
            </div>

            {/* Resend Email Gateway Diagnostics */}
            <div className="bg-obsidian-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Mail className="w-4 h-4 text-gold-400" />
                  <span className="font-cinzel text-sm font-bold">Email Gateway</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                  Active
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Dispatches consultation dossiers & notifications to <span className="text-gold-400">tarotxofficial@gmail.com</span> via Resend Engine.
              </p>

              <button
                onClick={handleTriggerTestEmail}
                disabled={emailSending}
                className="w-full py-2.5 rounded-xl bg-obsidian-950 border border-gold-500/30 hover:border-gold-500/60 text-gold-400 font-mono text-xs flex items-center justify-center space-x-2 active:scale-98 transition-all"
              >
                <Send className={`w-3.5 h-3.5 ${emailSending ? 'animate-pulse text-amber-400' : ''}`} />
                <span>{emailSending ? 'Dispatching Verification...' : 'Send Live Test Email'}</span>
              </button>

              {emailNotice && (
                <div className={`p-2.5 rounded-xl text-xs font-mono ${emailNotice.success ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'}`}>
                  {emailNotice.text}
                </div>
              )}
            </div>

            {/* Native Android Meeting Reminders & Automatic Popup Card */}
            <div className="bg-obsidian-900/80 border border-gold-500/30 rounded-3xl p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-200">
                  <AlarmClock className="w-4 h-4 text-gold-400" />
                  <span className="font-cinzel text-sm font-bold">5-Min Meeting & Booking Popups</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                  {typeof window !== 'undefined' && window.AndroidReminders?.isNativeAvailable() ? 'Native Engine Active' : 'Emulation Mode'}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Wakes your phone and displays a full-screen consultation alert with instant Zoom/WhatsApp buttons 5 minutes prior to every Live Zoom reading, even if locked.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onTestMeetingReminder?.(5)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-cinzel font-bold text-[11px] uppercase tracking-wider flex items-center justify-center space-x-1.5 active:scale-95 transition-all shadow-md shadow-gold-500/10"
                >
                  <AlarmClock className="w-3.5 h-3.5" />
                  <span>Test 5s Alarm</span>
                </button>

                <button
                  type="button"
                  onClick={() => onTestNewBookingPopup?.()}
                  className="py-2.5 px-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-cinzel font-bold text-[11px] uppercase tracking-wider flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Test Booking</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => onSyncBookingsWithDevice?.()}
                className="w-full py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-slate-400 hover:text-gold-400 text-[11px] font-mono flex items-center justify-center space-x-1.5 transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync {bookings.length} Consultations with Device</span>
              </button>

              {reminderNotice && (
                <div className="p-2.5 rounded-xl bg-gold-500/15 text-gold-300 border border-gold-500/30 text-[11px] font-mono flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                  <span className="leading-tight">{reminderNotice}</span>
                </div>
              )}
            </div>

            {/* System Node Telemetry */}
            <div className="bg-obsidian-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-2.5 text-xs font-mono">
              <div className="text-slate-400 uppercase tracking-widest text-[10px]">Telemetry & Node Info</div>
              <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/60">
                <span>Application Mode</span>
                <span className="text-gold-400">Dedicated Mobile Shell</span>
              </div>
              <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/60">
                <span>Build Version</span>
                <span className="text-slate-400">Tarot X Admin v1.0.0</span>
              </div>
              <div className="flex justify-between text-slate-300 py-1">
                <span>Database Sync</span>
                <span className="text-emerald-400">Cloud Synchronized</span>
              </div>
            </div>

            {/* Exit & Logout Button */}
            <button
              onClick={onLogout}
              className="w-full py-3 rounded-2xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-cinzel font-bold text-xs uppercase tracking-widest active:scale-98 transition-all"
            >
              Lock Console & Log Out
            </button>

          </div>
        )}

      </main>

      {/* ============================================================ */}
      {/* 3. SLIDE-UP BOTTOM SHEET DRAWER: BOOKING DETAILS & NOTES     */}
      {/* ============================================================ */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedBooking(null)}
          />

          {/* Bottom Sheet Drawer */}
          <div className="relative z-10 w-full max-w-md mx-auto bg-obsidian-900 border-t border-gold-500/40 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Drag handle bar */}
            <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto -mt-1 mb-2" />

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400/80">
                  Consultation Dossier
                </span>
                <h3 className="font-cinzel text-lg font-bold text-slate-100">
                  {selectedBooking.client_name || 'Anonymous Seeker'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-full bg-obsidian-950 border border-slate-700 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Details Chips */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-obsidian-950 border border-slate-800">
                <div className="text-[10px] text-slate-500">Service Offering</div>
                <div className="font-semibold text-gold-400 mt-0.5">{selectedBooking.service_name}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-obsidian-950 border border-slate-800">
                <div className="text-[10px] text-slate-500">Scheduled Time</div>
                <div className="font-semibold text-slate-200 mt-0.5">
                  {selectedBooking.scheduled_at ? new Date(selectedBooking.scheduled_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Flexible'}
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-3 rounded-2xl bg-obsidian-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Seeker Contact & Gateways</div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-200 select-all">{selectedBooking.client_email || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="text-slate-200 select-all">{selectedBooking.client_phone || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Ref:</span>
                <span className="text-gold-400 select-all">{selectedBooking.payment_reference || 'MANUAL'}</span>
              </div>
            </div>

            {/* Client Inquiry Statement */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Seeker Inquiry / Pattern Focus
              </label>
              <div className="p-3 rounded-xl bg-obsidian-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
                "{selectedBooking.client_inquiry || 'No specific statement provided.'}"
              </div>
            </div>

            {/* Reader Private Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-gold-400 flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Reader Analytical Observations</span>
                </label>
                <span className="text-[10px] font-mono text-slate-500">Private</span>
              </div>

              <textarea
                value={readerNotesDraft}
                onChange={(e) => setReaderNotesDraft(e.target.value)}
                placeholder="Draft card spread observations, patterns detected, pivotal decisions advise..."
                rows={4}
                className="w-full p-3 rounded-xl bg-obsidian-950 border border-slate-700/80 focus:border-gold-400 focus:outline-none text-xs text-slate-200 font-mono leading-relaxed"
              />

              <button
                onClick={handleSaveNotes}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-amber-500 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider active:scale-98 transition-all flex items-center justify-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Save Reader Observations</span>
              </button>
            </div>

            {/* Danger Delete Action */}
            <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center">
              <button
                onClick={() => {
                  onDeleteBooking(selectedBooking.id);
                  setSelectedBooking(null);
                }}
                className="text-[11px] font-mono text-red-400/80 hover:text-red-400 flex items-center space-x-1 py-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Registry Entry</span>
              </button>
              
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. SLIDE-UP BOTTOM SHEET: NEW MANUAL BOOKING                 */}
      {/* ============================================================ */}
      {isNewBookingOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsNewBookingOpen(false)}
          />

          <form 
            onSubmit={handleCreateBookingSubmit}
            className="relative z-10 w-full max-w-md mx-auto bg-obsidian-900 border-t border-gold-500/40 rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto space-y-3.5 shadow-2xl animate-in slide-in-from-bottom duration-300"
          >
            <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto -mt-1 mb-2" />

            <div className="flex items-center justify-between">
              <h3 className="font-cinzel text-base font-bold gold-gradient-text">
                Schedule New Consultation
              </h3>
              <button
                type="button"
                onClick={() => setIsNewBookingOpen(false)}
                className="p-1 rounded-full bg-obsidian-950 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Seeker Full Name</label>
              <input
                type="text"
                required
                value={newBookingForm.client_name}
                onChange={(e) => setNewBookingForm({ ...newBookingForm, client_name: e.target.value })}
                placeholder="e.g. Maya Lin"
                className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newBookingForm.client_email}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, client_email: e.target.value })}
                  placeholder="seeker@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Phone (WhatsApp)</label>
                <input
                  type="tel"
                  required
                  value={newBookingForm.client_phone}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, client_phone: e.target.value })}
                  placeholder="+91..."
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Service Offering</label>
              <select
                value={newBookingForm.service_id}
                onChange={(e) => {
                  const id = e.target.value;
                  if (id === 'zoom-reading') {
                    setNewBookingForm({
                      ...newBookingForm,
                      service_id: 'zoom-reading',
                      service_name: '1-to-1 Live Zoom Reading',
                      service_price: 999
                    });
                  } else {
                    setNewBookingForm({
                      ...newBookingForm,
                      service_id: 'pattern-reading',
                      service_name: 'Tarot Analysis & Pattern Dossier',
                      service_price: 99
                    });
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-gold-400"
              >
                <option value="zoom-reading">1-to-1 Live Zoom Consultation (₹999)</option>
                <option value="pattern-reading">Offline Pattern Recognition Dossier (₹99)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={newBookingForm.scheduled_at}
                onChange={(e) => setNewBookingForm({ ...newBookingForm, scheduled_at: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Inquiry / Question</label>
              <textarea
                rows={2}
                value={newBookingForm.client_inquiry}
                onChange={(e) => setNewBookingForm({ ...newBookingForm, client_inquiry: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-gold-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-400 to-amber-500 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider active:scale-98 transition-all"
            >
              Add To Active Registry
            </button>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. FIXED GLASSMORPHISM BOTTOM NAVIGATION DOCK                */}
      {/* ============================================================ */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-obsidian-950/95 backdrop-blur-2xl border-t border-gold-500/25 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 px-3 shadow-2xl shadow-black">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          
          {/* Tab 1: Pulse */}
          <button
            onClick={() => setActiveTab('pulse')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all relative ${
              activeTab === 'pulse' 
                ? 'text-gold-400 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 transition-transform ${activeTab === 'pulse' ? 'scale-110 stroke-[2.5]' : 'stroke-1.5'}`} />
            <span className="text-[10px] font-mono mt-1 tracking-tight">Pulse</span>
            {activeTab === 'pulse' && (
              <span className="absolute -bottom-1 w-4 h-0.5 rounded-full bg-gold-400 shadow-sm shadow-gold-400/80" />
            )}
          </button>

          {/* Tab 2: Bookings */}
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all relative ${
              activeTab === 'bookings' 
                ? 'text-gold-400 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Calendar className={`w-5 h-5 transition-transform ${activeTab === 'bookings' ? 'scale-110 stroke-[2.5]' : 'stroke-1.5'}`} />
              {bookings.length > 0 && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-gold-500 text-obsidian-950 text-[8px] font-mono font-bold leading-tight">
                  {bookings.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono mt-1 tracking-tight">Bookings</span>
            {activeTab === 'bookings' && (
              <span className="absolute -bottom-1 w-4 h-0.5 rounded-full bg-gold-400 shadow-sm shadow-gold-400/80" />
            )}
          </button>

          {/* Tab 3: Revenue */}
          <button
            onClick={() => setActiveTab('revenue')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all relative ${
              activeTab === 'revenue' 
                ? 'text-gold-400 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className={`w-5 h-5 transition-transform ${activeTab === 'revenue' ? 'scale-110 stroke-[2.5]' : 'stroke-1.5'}`} />
            <span className="text-[10px] font-mono mt-1 tracking-tight">Revenue</span>
            {activeTab === 'revenue' && (
              <span className="absolute -bottom-1 w-4 h-0.5 rounded-full bg-gold-400 shadow-sm shadow-gold-400/80" />
            )}
          </button>

          {/* Tab 4: Dispatch (Newsletter) */}
          <button
            onClick={() => setActiveTab('dispatch')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all relative ${
              activeTab === 'dispatch' 
                ? 'text-gold-400 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Mail className={`w-5 h-5 transition-transform ${activeTab === 'dispatch' ? 'scale-110 stroke-[2.5]' : 'stroke-1.5'}`} />
              {subscribers.length > 0 && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-amber-500 text-obsidian-950 text-[8px] font-mono font-bold leading-tight">
                  {subscribers.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono mt-1 tracking-tight">Dispatch</span>
            {activeTab === 'dispatch' && (
              <span className="absolute -bottom-1 w-4 h-0.5 rounded-full bg-gold-400 shadow-sm shadow-gold-400/80" />
            )}
          </button>

          {/* Tab 5: Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all relative ${
              activeTab === 'settings' 
                ? 'text-gold-400 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 transition-transform ${activeTab === 'settings' ? 'scale-110 stroke-[2.5]' : 'stroke-1.5'}`} />
            <span className="text-[10px] font-mono mt-1 tracking-tight">Security</span>
            {activeTab === 'settings' && (
              <span className="absolute -bottom-1 w-4 h-0.5 rounded-full bg-gold-400 shadow-sm shadow-gold-400/80" />
            )}
          </button>

        </div>
      </nav>

      {/* Full-Screen Luxury Meeting / Booking Reminder Popup Simulation */}
      {simulatedPopup && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-obsidian-900 border-2 border-gold-500 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl shadow-gold-500/25 relative animate-in zoom-in-95 duration-200">
            {/* Category Pill */}
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-400 text-xs font-mono font-semibold">
              <AlarmClock className="w-3.5 h-3.5 animate-bounce" />
              <span>{simulatedPopup.type === 'MEETING_REMINDER' ? '🔮 5 MINUTES BEFORE MEETING' : '✨ NEW CLIENT BOOKING'}</span>
            </div>

            <div>
              <h3 className="font-cinzel text-xl font-bold text-slate-100">
                {simulatedPopup.type === 'MEETING_REMINDER' ? 'Consultation Alert' : 'Live Booking Confirmed'}
              </h3>
              <p className="text-xs font-mono font-bold text-gold-400 mt-0.5">
                {simulatedPopup.scheduled_time || 'Starting Promptly'}
              </p>
            </div>

            {/* Avatar Circle */}
            <div className="w-14 h-14 rounded-full bg-obsidian-950 border-2 border-gold-500 mx-auto flex items-center justify-center text-gold-400 text-xl font-cinzel font-bold shadow-md shadow-gold-500/10">
              {simulatedPopup.client_name ? simulatedPopup.client_name[0] : 'C'}
            </div>

            <div>
              <h4 className="font-cinzel text-base font-bold text-slate-100">
                {simulatedPopup.client_name}
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {simulatedPopup.service_name} {simulatedPopup.inrAmount ? `· ₹${simulatedPopup.inrAmount}` : ''}
              </p>
            </div>

            {/* Inquiry Box */}
            {simulatedPopup.focusArea && (
              <div className="p-3 rounded-xl bg-obsidian-950 border border-slate-800 text-xs text-slate-300 italic text-left">
                "{simulatedPopup.focusArea}"
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <a
                href="https://zoom.us"
                target="_blank"
                rel="noreferrer"
                onClick={() => setSimulatedPopup?.(null)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-gold-500/20 active:scale-95 transition-all"
              >
                <Video className="w-4 h-4" />
                <span>Start / Join Zoom Meeting</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${simulatedPopup.phone?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${simulatedPopup.phone}`}
                  className="py-2 px-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-mono flex items-center justify-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSimulatedPopup?.(null)}
                className="text-xs text-slate-500 hover:text-slate-300 font-mono pt-1"
              >
                ✕ Dismiss Alert
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
