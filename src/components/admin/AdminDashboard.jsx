import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  DollarSign, 
  Mail, 
  Settings, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  ArrowLeft, 
  Lock, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  FileText, 
  Video, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  Key, 
  Database, 
  Check, 
  Trash2,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Send,
  Smartphone,
  Bell,
  AlarmClock,
  Volume2
} from 'lucide-react';
import { 
  fetchAdminBookings, 
  fetchNewsletterSubscribers, 
  updateBookingStatus, 
  addManualBooking, 
  deleteBooking, 
  subscribeNewsletter, 
  deleteSubscriber, 
  calculateRevenueMetrics, 
  exportBookingsToCSV, 
  exportRevenueToCSV, 
  exportNewsletterToCSV, 
  clearAdminSession, 
  setCustomPasscode,
  syncAdminPasscodeFromCloud
} from '../../lib/adminStore';
import { 
  isSupabaseConfigured,
  dispatchAdminSignal,
  subscribeToAdminSignals,
  subscribeToTarotBookings,
  subscribeToTarotNewsletter,
  subscribeToTarotSettings
} from '../../lib/supabase';
import { sendResendTestEmail } from '../../lib/emailService';
import MobileAdminApp from './MobileAdminApp';

export default function AdminDashboard({ onExit }) {
  const isAppMode = () => {
    if (typeof window === 'undefined') return false;
    return (
      navigator.userAgent.includes('TarotXAdmin') ||
      new URLSearchParams(window.location.search).get('admin_app') === '1'
    );
  };

  const [useMobileLayout, setUseMobileLayout] = useState(() => {
    if (typeof window === 'undefined') return false;
    return isAppMode() || window.innerWidth < 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      if (isAppMode()) {
        setUseMobileLayout(true);
        return;
      }
      setUseMobileLayout(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [activeTab, setActiveTab] = useState('overview'); // overview, bookings, revenue, newsletter, settings
  const [bookings, setBookings] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Modals
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [isManualSubscriberOpen, setIsManualSubscriberOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinNotice, setPinNotice] = useState('');
  const [readerNotesDraft, setReaderNotesDraft] = useState('');

  // Resend Test Email States
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  const handleSendTestEmail = async () => {
    setEmailSending(true);
    setEmailStatus(null);
    try {
      const res = await sendResendTestEmail();
      if (res.ok) {
        setEmailStatus({ 
          success: true, 
          message: `Verification email dispatched to tarotxofficial@gmail.com! (ID: ${res.messageId || 'ok'})` 
        });
      } else {
        setEmailStatus({ 
          success: false, 
          message: res.error?.message || res.error || 'Failed to dispatch test email.' 
        });
      }
    } catch (err) {
      setEmailStatus({ success: false, message: err.message });
    } finally {
      setEmailSending(false);
    }
  };

  // Meeting Reminders & Popup Alerts Facility (Synchronized across Web & Mobile App)
  const [reminderNotice, setReminderNotice] = useState(null);
  const [simulatedPopup, setSimulatedPopup] = useState(null);

  // Trigger test meeting reminder on THIS device AND ALL connected devices (Web & Android App)
  const handleTestMeetingReminder = async (seconds = 5) => {
    const payload = {
      delaySeconds: seconds,
      clientName: 'Aarav Mehta (Cross-Device Test)',
      serviceTitle: '1-to-1 Live Zoom Reading',
      scheduledTime: '18:00 IST (Starting in 5 mins)',
      phone: '+91 98201 44521',
      focusArea: 'Career & High-Stakes Venture Strategy. Hesitation loops around equity split.'
    };

    setReminderNotice(`🔮 Broadcasting meeting reminder alert (${seconds}s) to web & mobile app simultaneously...`);

    // 1. Dispatch over cloud real-time channel
    await dispatchAdminSignal('MEETING_REMINDER_TEST', payload);

    // 2. If running locally on native Android bridge, arm native alarm directly too
    if (typeof window !== 'undefined' && window.AndroidReminders?.testFiveMinuteReminder) {
      window.AndroidReminders.testFiveMinuteReminder(seconds);
    }
  };

  // Trigger test new booking popup on THIS device AND ALL connected devices (Web & Android App)
  const handleTestNewBookingPopup = async () => {
    const sampleBooking = {
      id: `test_${Date.now()}`,
      name: 'Pooja Ramanathan (Cross-Device Alert)',
      service_title: '1-to-1 Live Zoom Reading',
      inrAmount: 999,
      preferred_date: new Date().toISOString().split('T')[0],
      preferred_time: '19:30',
      phone: '+91 97412 88902',
      focusArea: 'Relationship Dynamics & Career Timing'
    };

    setReminderNotice('✨ Broadcasting new booking alert to web & mobile app simultaneously...');

    // 1. Dispatch over cloud real-time channel
    await dispatchAdminSignal('NEW_BOOKING_TEST', { booking: sampleBooking });

    // 2. If running locally on native Android bridge, trigger native popup directly too
    if (typeof window !== 'undefined' && window.AndroidReminders?.testNewBookingAlert) {
      window.AndroidReminders.testNewBookingAlert(JSON.stringify(sampleBooking));
    }
  };

  const handleSyncBookingsWithDevice = (list = bookings) => {
    if (typeof window !== 'undefined' && window.AndroidReminders?.syncAllBookings) {
      try {
        window.AndroidReminders.syncAllBookings(JSON.stringify(list));
        setReminderNotice(`✅ ${list.length} consultations synchronized with device alarm engine!`);
      } catch (e) {
        console.warn('Native reminder sync notice:', e);
      }
    } else {
      setReminderNotice(`ℹ️ ${list.length} consultations ready for device alarm engine.`);
    }
  };

  // Clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load data from live Supabase tables (authoritative source)
  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [fetchedBookings, fetchedSubs] = await Promise.all([
        fetchAdminBookings(),
        fetchNewsletterSubscribers()
      ]);
      setBookings(fetchedBookings);
      setSubscribers(fetchedSubs);

      // Automatically sync upcoming live meetings with native Android alarms
      if (typeof window !== 'undefined' && window.AndroidReminders?.syncAllBookings) {
        try {
          window.AndroidReminders.syncAllBookings(JSON.stringify(fetchedBookings));
        } catch (e) {
          console.warn('Native reminder sync notice:', e);
        }
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Synchronize master passcode from cloud settings
    syncAdminPasscodeFromCloud().catch(() => {});
  }, []);

  // Subscribe to real-time administrative signals & database changes (Web <-> Android App connection)
  useEffect(() => {
    const unsubscribeSignals = subscribeToAdminSignals((signal) => {
      console.log('⚡ Cross-Device Admin Signal Received:', signal);
      if (!signal || !signal.signal_type) return;

      const isNative = typeof window !== 'undefined' && window.AndroidReminders?.isNativeAvailable?.();

      if (signal.signal_type === 'MEETING_REMINDER_TEST') {
        const payload = signal.payload || {};
        const seconds = payload.delaySeconds || 5;

        // If on Android app, trigger native system alarm/countdown
        if (isNative && window.AndroidReminders?.testFiveMinuteReminder) {
          window.AndroidReminders.testFiveMinuteReminder(seconds);
        }

        // Display notice and popup on screen
        const originName = signal.sender === 'android_app' ? 'Mobile App' : 'Web Admin';
        setReminderNotice(`🔮 Alert received live from ${originName}! Arming ${seconds}s countdown...`);
        setTimeout(() => {
          setSimulatedPopup({
            type: 'MEETING_REMINDER',
            client_name: payload.clientName || 'Aarav Mehta (Test)',
            service_name: payload.serviceTitle || '1-to-1 Live Zoom Reading',
            scheduled_time: payload.scheduledTime || '18:00 IST (Starting in 5 mins)',
            phone: payload.phone || '+91 98201 44521',
            focusArea: payload.focusArea || 'Career & High-Stakes Venture Strategy. Hesitation loops around equity split.'
          });
          setReminderNotice(null);
        }, isNative ? seconds * 1000 : 800);
      } 
      else if (signal.signal_type === 'NEW_BOOKING_ALERT' || signal.signal_type === 'NEW_BOOKING_TEST') {
        const booking = signal.payload?.booking || {};

        // If on Android app, wake screen & show native popup!
        if (isNative && window.AndroidReminders?.testNewBookingAlert) {
          window.AndroidReminders.testNewBookingAlert(JSON.stringify(booking));
        }

        // Show popup in UI (Web + App)
        const originName = signal.sender === 'android_app' ? 'Mobile App' : 'Web Admin';
        setSimulatedPopup({
          type: 'NEW_BOOKING',
          client_name: booking.name || 'New Client',
          service_name: booking.service_title || 'Tarot Consultation',
          scheduled_time: `${booking.preferred_date || 'Today'} at ${booking.preferred_time || 'Scheduled Slot'}`,
          phone: booking.phone || '',
          inrAmount: booking.inrAmount || booking.inr_amount || (booking.price?.includes('999') ? 999 : 99),
          focusArea: booking.focusArea || booking.focus_area || 'Tarot Assessment'
        });
        setReminderNotice(`✨ New booking alert received live from ${originName}!`);
        // Refresh data silently
        loadData(true);
      }
    });

    // Realtime Database Sync for tarot_bookings
    const unsubscribeBookings = subscribeToTarotBookings((payload) => {
      console.log('⚡ Tarot bookings database changed. Synchronizing live...', payload);
      loadData(true);
    });

    // Realtime Database Sync for tarot_newsletter
    const unsubscribeNewsletter = subscribeToTarotNewsletter((payload) => {
      console.log('⚡ Newsletter subscribers changed. Synchronizing live...', payload);
      loadData(true);
    });

    // Realtime Database Sync for tarot_settings
    const unsubscribeSettings = subscribeToTarotSettings((payload) => {
      console.log('⚡ Tarot settings changed remotely. Synchronizing config...', payload);
      syncAdminPasscodeFromCloud().catch(() => {});
    });

    // Subtle background sync pulse (every 8s) to ensure absolute consistency across sleep states
    const syncPulseTimer = setInterval(() => {
      loadData(true);
    }, 8000);

    return () => {
      clearInterval(syncPulseTimer);
      if (unsubscribeSignals) unsubscribeSignals();
      if (unsubscribeBookings) unsubscribeBookings();
      if (unsubscribeNewsletter) unsubscribeNewsletter();
      if (unsubscribeSettings) unsubscribeSettings();
    };
  }, []);

  const metrics = calculateRevenueMetrics(bookings);

  // Status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Confirmed</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Completed</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>In Progress</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3 h-3 text-rose-400" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-500/15 text-slate-300 border border-slate-500/30">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.phone || '').includes(searchQuery) ||
      (b.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.notes || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    
    let matchesService = true;
    if (serviceFilter === 'live') {
      matchesService = (b.inrAmount === 999) || (b.price && b.price.includes('999'));
    } else if (serviceFilter === 'offline') {
      matchesService = (b.inrAmount === 99) || (b.price && b.price.includes('99'));
    }

    return matchesSearch && matchesStatus && matchesService;
  });

  // Handle status update
  const handleStatusChange = async (id, newStatus) => {
    const res = await updateBookingStatus(id, newStatus);
    if (res.success) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(prev => ({ ...prev, status: newStatus }));
      }
    }
  };

  // Handle reader notes save
  const handleSaveReaderNotes = async () => {
    if (!selectedBooking) return;
    const res = await updateBookingStatus(selectedBooking.id, selectedBooking.status, readerNotesDraft);
    if (res.success) {
      setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, reader_notes: readerNotesDraft } : b));
      setSelectedBooking(prev => ({ ...prev, reader_notes: readerNotesDraft }));
    }
  };

  // Handle delete booking
  const handleDeleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to remove this booking from the active registry?')) {
      await deleteBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
      if (selectedBooking?.id === id) setSelectedBooking(null);
    }
  };

  // Handle delete subscriber
  const handleDeleteSub = async (id) => {
    if (window.confirm('Remove this email from the newsletter registry?')) {
      await deleteSubscriber(id);
      setSubscribers(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    window.location.reload();
  };

  const handlePasscodeChange = (e) => {
    e.preventDefault();
    const res = setCustomPasscode(newPin);
    setPinNotice(res.message);
    if (res.success) {
      setNewPin('');
    }
  };

  if (useMobileLayout) {
    const mobileCompatibleBookings = bookings.map(b => ({
      ...b,
      client_name: b.name || b.client_name || 'Anonymous Seeker',
      client_email: b.email || b.client_email || '',
      client_phone: b.phone || b.client_phone || '',
      service_name: b.service_title || b.service_name || (b.inrAmount === 999 ? '1-to-1 Live Zoom Reading' : 'Offline Pattern Report'),
      service_price: b.inrAmount || b.service_price || (b.price?.includes('999') ? 999 : 99),
      client_inquiry: b.notes || b.focusArea || b.client_inquiry || '',
      scheduled_at: b.scheduled_at || (b.preferred_date ? `${b.preferred_date} ${b.preferred_time || ''}`.trim() : ''),
      booking_ref: b.id || b.booking_ref || '',
      payment_reference: b.payment_id || b.payment_reference || 'RAZORPAY_PROD'
    }));

    return (
      <MobileAdminApp
        bookings={mobileCompatibleBookings}
        subscribers={subscribers}
        metrics={metrics}
        loading={loading}
        onRefresh={() => loadData(false)}
        onStatusChange={handleStatusChange}
        onSaveReaderNotes={async (id, notes) => {
          const b = bookings.find(item => item.id === id);
          const res = await updateBookingStatus(id, b?.status || 'confirmed', notes);
          if (res.success) {
            setBookings(prev => prev.map(item => item.id === id ? { ...item, reader_notes: notes } : item));
          }
        }}
        onDeleteBooking={handleDeleteBooking}
        onAddManualBooking={async (formData) => {
          const res = await addManualBooking(formData);
          if (res.success) loadData();
        }}
        onDeleteSubscriber={handleDeleteSub}
        onAddSubscriber={async (email, source) => {
          const res = await subscribeNewsletter(email, source);
          if (res.success) loadData();
        }}
        onExportBookings={() => exportBookingsToCSV(bookings)}
        onExportRevenue={() => exportRevenueToCSV(bookings)}
        onExportNewsletter={() => exportNewsletterToCSV(subscribers)}
        onSendTestEmail={sendResendTestEmail}
        onTestMeetingReminder={handleTestMeetingReminder}
        onTestNewBookingPopup={handleTestNewBookingPopup}
        onSyncBookingsWithDevice={() => handleSyncBookingsWithDevice()}
        reminderNotice={reminderNotice}
        simulatedPopup={simulatedPopup}
        setSimulatedPopup={setSimulatedPopup}
        onLogout={handleLogout}
        onExit={onExit}
        customPasscodeState={{
          setPasscode: (pin) => setCustomPasscode(pin)
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 font-sans selection:bg-gold-500 selection:text-obsidian-950 flex flex-col">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-gold-500/5 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="fixed inset-0 scanline-overlay pointer-events-none opacity-10" />

      {/* ============================================================ */}
      {/* 1. TOP EXECUTIVE HEADER */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-obsidian-950/90 border-b border-gold-500/20 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Branding & Clock */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-obsidian-900 border border-gold-500/40 flex items-center justify-center shadow-lg overflow-hidden">
              <img src="/logo.jpg" alt="Tarot X" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-cinzel text-base sm:text-lg font-bold tracking-wider gold-gradient-text">
                  TAROT X
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 font-bold">
                  EXECUTIVE CONSOLE
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Pattern Recognition & Revenue Operations
              </p>
            </div>
          </div>

          <div className="hidden lg:block h-6 w-px bg-slate-800" />

          {/* Real-time Clock */}
          <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-slate-400 bg-obsidian-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            <span>
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} · {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Refresh */}
          <button
            onClick={loadData}
            disabled={loading}
            title="Refresh All Data"
            className="p-2 rounded-xl bg-obsidian-900 border border-slate-800 hover:border-gold-500/40 text-slate-300 hover:text-gold-300 transition-all text-xs flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-gold-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Switch to Mobile App UI */}
          <button
            onClick={() => setUseMobileLayout(true)}
            title="Switch to Mobile App Experience"
            className="p-2 rounded-xl bg-obsidian-900 border border-slate-800 hover:border-gold-500/40 text-slate-300 hover:text-gold-300 transition-all text-xs flex items-center space-x-1.5"
          >
            <Smartphone className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden md:inline">Mobile App View</span>
          </button>

          {/* New Booking */}
          <button
            onClick={() => setIsManualBookingOpen(true)}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-md shadow-gold-500/10 transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Booking</span>
          </button>

          {/* Return to Public Website */}
          <button
            onClick={onExit}
            className="px-3 py-2 rounded-xl bg-obsidian-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-mono text-xs transition-colors flex items-center space-x-1.5"
            title="Exit to Client Website"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">Live Site</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-obsidian-900 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-colors"
            title="Lock Console"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* ============================================================ */}
      {/* 2. SUB-NAVIGATION TABS */}
      {/* ============================================================ */}
      <div className="bg-obsidian-900/60 border-b border-slate-800/80 px-4 sm:px-8 py-2.5 overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-max">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider uppercase transition-all flex items-center space-x-2 ${
              activeTab === 'overview'
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-850'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider uppercase transition-all flex items-center space-x-2 ${
              activeTab === 'bookings'
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-850'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Consultations ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider uppercase transition-all flex items-center space-x-2 ${
              activeTab === 'revenue'
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-850'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Revenue & Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('newsletter')}
            className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider uppercase transition-all flex items-center space-x-2 ${
              activeTab === 'newsletter'
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-850'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Newsletter Subscribers ({subscribers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider uppercase transition-all flex items-center space-x-2 ${
              activeTab === 'settings'
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-850'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>System & Security</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. MAIN DASHBOARD CONTENT */}
      {/* ============================================================ */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Gross Revenue Card */}
              <div className="bg-obsidian-900/80 border border-gold-500/30 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-xl shadow-gold-500/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-cinzel uppercase tracking-wider text-slate-400">Total Gross Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-mono text-3xl font-extrabold gold-gradient-text">
                    {metrics.formattedRevenue}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Confirmed across {metrics.totalBookings} booked sessions
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>AOV: {metrics.averageOrderValue}</span>
                  <span className="text-emerald-400 font-semibold">100% Paid</span>
                </div>
              </div>

              {/* 1-on-1 Live Zoom Consultations */}
              <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-gold-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-cinzel uppercase tracking-wider text-slate-400">Live Zoom (₹999)</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Video className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-mono text-3xl font-extrabold text-slate-100">
                    {metrics.liveCount}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Total Volume: <span className="font-mono text-gold-300 font-semibold">{metrics.formattedLiveRevenue}</span>
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Share: {metrics.ratioLiveVsOffline}% of revenue</span>
                  <span className="text-gold-400">High-Ticket</span>
                </div>
              </div>

              {/* Offline Pattern Reports */}
              <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-gold-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-cinzel uppercase tracking-wider text-slate-400">Offline Reports (₹99)</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-mono text-3xl font-extrabold text-slate-100">
                    {metrics.offlineCount}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Total Volume: <span className="font-mono text-gold-300 font-semibold">{metrics.formattedOfflineRevenue}</span>
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Fast Delivery (24-48h)</span>
                  <span className="text-amber-400">Lead Magnet</span>
                </div>
              </div>

              {/* Newsletter Audience */}
              <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-gold-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-cinzel uppercase tracking-wider text-slate-400">Active Subscribers</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-mono text-3xl font-extrabold text-slate-100">
                    {subscribers.length}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    “The Probability Dispatch” readers
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Organic acquisition</span>
                  <span className="text-purple-400">Ready for Broadcast</span>
                </div>
              </div>

            </div>

            {/* Revenue Velocity & Distribution Bar */}
            <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-slate-200">
                    Service Portfolio Revenue Distribution
                  </h3>
                  <p className="text-xs text-slate-400">
                    Proportional revenue contribution between high-touch live Zoom video consultations and asynchronous pattern dossiers.
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-xs font-mono">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                    <span>Live Zoom (₹999)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span>Offline Report (₹99)</span>
                  </div>
                </div>
              </div>

              {/* Progress split bar */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-obsidian-950 rounded-full overflow-hidden flex border border-slate-800">
                  <div 
                    style={{ width: `${metrics.ratioLiveVsOffline}%` }} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500"
                    title={`Live Zoom: ${metrics.ratioLiveVsOffline}%`}
                  />
                  <div 
                    style={{ width: `${100 - metrics.ratioLiveVsOffline}%` }} 
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500"
                    title={`Offline Dossiers: ${100 - metrics.ratioLiveVsOffline}%`}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Live Consultations: {metrics.formattedLiveRevenue} ({metrics.liveCount} sessions)</span>
                  <span>Offline Dossiers: {metrics.formattedOfflineRevenue} ({metrics.offlineCount} reports)</span>
                </div>
              </div>
            </div>

            {/* Recent Bookings Snapshot */}
            <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-slate-200">
                    Recent Consultation Activity
                  </h3>
                  <p className="text-xs text-slate-400">
                    Latest client bookings needing review, scheduling or delivery.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-cinzel text-gold-400 hover:text-gold-300 transition-colors flex items-center space-x-1"
                >
                  <span>View All Bookings</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 font-cinzel uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-3">Client</th>
                      <th className="py-3 px-3">Service Tier</th>
                      <th className="py-3 px-3">Date / Schedule</th>
                      <th className="py-3 px-3">Payment</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-obsidian-850/50 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-slate-200">{b.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{b.email}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-medium text-slate-300">{b.service_title}</span>
                          <span className="block font-mono text-gold-400 text-[11px] font-bold">{b.price}</span>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-slate-300 text-[11px]">
                          <div>{b.preferred_date || 'Flexible'}</div>
                          <div className="text-slate-500">{b.preferred_time || 'Pending slot'}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center space-x-1 text-emerald-400 font-mono text-[11px]">
                            <Check className="w-3 h-3" />
                            <span>Paid</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          {getStatusBadge(b.status)}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedBooking(b);
                              setReaderNotesDraft(b.reader_notes || '');
                            }}
                            className="p-1.5 rounded-lg bg-obsidian-950 border border-slate-800 hover:border-gold-500/40 text-gold-400 hover:text-gold-300 transition-colors"
                            title="Inspect Booking Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Control Bar: Search & Filters */}
            <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search client, email, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian-950 border border-slate-800 focus:border-gold-400 text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors"
                />
              </div>

              {/* Filters & Export */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                {/* Status Filter */}
                <div className="flex items-center space-x-1.5 text-xs bg-obsidian-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                  <Filter className="w-3.5 h-3.5 text-gold-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-obsidian-900">All Statuses</option>
                    <option value="confirmed" className="bg-obsidian-900">Confirmed</option>
                    <option value="completed" className="bg-obsidian-900">Completed</option>
                    <option value="in_progress" className="bg-obsidian-900">In Progress</option>
                    <option value="cancelled" className="bg-obsidian-900">Cancelled</option>
                  </select>
                </div>

                {/* Service Tier Filter */}
                <div className="flex items-center space-x-1.5 text-xs bg-obsidian-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="bg-transparent text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-obsidian-900">All Services</option>
                    <option value="live" className="bg-obsidian-900">Live Zoom (₹999)</option>
                    <option value="offline" className="bg-obsidian-900">Offline Report (₹99)</option>
                  </select>
                </div>

                {/* CSV Export */}
                <button
                  onClick={() => exportBookingsToCSV(filteredBookings)}
                  className="px-3.5 py-2 rounded-xl bg-obsidian-950 border border-slate-800 hover:border-gold-500/40 text-slate-300 hover:text-gold-300 text-xs transition-colors flex items-center space-x-1.5"
                  title="Export Filtered Bookings to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-gold-400" />
                  <span>Export CSV</span>
                </button>
              </div>

            </div>

            {/* Bookings Table */}
            <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-obsidian-950/80 text-slate-400 font-cinzel uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Booking ID</th>
                      <th className="py-3.5 px-4">Client Contact</th>
                      <th className="py-3.5 px-4">Offering / Tier</th>
                      <th className="py-3.5 px-4">Consultation Time</th>
                      <th className="py-3.5 px-4">Payment</th>
                      <th className="py-3.5 px-4">Status & Action</th>
                      <th className="py-3.5 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-slate-500 text-xs">
                          No consultation bookings found matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-obsidian-850/50 transition-colors">
                          <td className="py-4 px-4 font-mono text-slate-400 text-[11px]">
                            {b.id}
                            <span className="block text-[10px] text-slate-500">
                              {b.created_at ? new Date(b.created_at).toLocaleDateString('en-IN') : ''}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-200">{b.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{b.email}</div>
                            {b.phone && (
                              <div className="text-[10px] text-slate-500 font-mono">{b.phone}</div>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-medium text-slate-200">{b.service_title}</span>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <span className="font-mono text-gold-400 font-bold text-[11px]">{b.price}</span>
                              <span className="text-[10px] text-slate-500">({b.format})</span>
                            </div>
                          </td>

                          <td className="py-4 px-4 font-mono text-[11px] text-slate-300">
                            <div>{b.preferred_date || 'Flexible'}</div>
                            <div className="text-slate-400">{b.preferred_time || 'N/A'}</div>
                            <div className="text-[10px] text-slate-500">{b.timezone || 'Asia/Kolkata'}</div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                              <Check className="w-3 h-3" />
                              <span>Paid ({b.price})</span>
                            </span>
                            {b.payment_id && (
                              <span className="block font-mono text-[9px] text-slate-500 mt-1 truncate max-w-[100px]" title={b.payment_id}>
                                {b.payment_id}
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(b.status)}
                              
                              {/* Quick status cycle button */}
                              <select
                                value={b.status}
                                onChange={(e) => handleStatusChange(b.id, e.target.value)}
                                className="bg-obsidian-950 text-slate-300 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] outline-none cursor-pointer hover:border-gold-500/40"
                              >
                                <option value="confirmed">Set Confirmed</option>
                                <option value="in_progress">Set In Progress</option>
                                <option value="completed">Set Completed</option>
                                <option value="cancelled">Set Cancelled</option>
                              </select>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-right space-x-1">
                            <button
                              onClick={() => {
                                setSelectedBooking(b);
                                setReaderNotesDraft(b.reader_notes || '');
                              }}
                              className="p-1.5 rounded-lg bg-obsidian-950 border border-slate-800 hover:border-gold-500/40 text-gold-400 hover:text-gold-300 transition-colors"
                              title="View Full Booking Dossier"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-1.5 rounded-lg bg-obsidian-950 border border-slate-800 hover:border-rose-500/40 text-slate-500 hover:text-rose-400 transition-colors"
                              title="Delete Booking Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: REVENUE & FINANCE */}
        {/* ============================================================ */}
        {activeTab === 'revenue' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Revenue Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-obsidian-900/80 border border-gold-500/30 rounded-2xl p-6 space-y-2">
                <span className="text-xs font-cinzel uppercase tracking-wider text-slate-400">Total Settled Volume</span>
                <h2 className="font-mono text-4xl font-extrabold gold-gradient-text">
                  {metrics.formattedRevenue}
                </h2>
                <p className="text-xs text-slate-400">
                  {metrics.totalBookings} total orders processed via Razorpay Live Gateway.
                </p>
              </div>

              <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-6 space-y-2">
                <span className="text-xs font-cinzel uppercase tracking-wider text-slate-400">Razorpay Live Gateway</span>
                <div className="flex items-center space-x-2 text-emerald-400 text-sm font-semibold pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Production Live Mode</span>
                </div>
                <p className="text-xs font-mono text-slate-400">
                  Key ID: <code className="text-gold-300">rzp_live_TYDiVdkOMTeB1v</code>
                </p>
              </div>

              <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-6 space-y-2">
                <span className="text-xs font-cinzel uppercase tracking-wider text-slate-400">Financial Reports</span>
                <div className="pt-1">
                  <button
                    onClick={() => exportRevenueToCSV(bookings)}
                    className="w-full py-2.5 rounded-xl bg-gold-500/15 border border-gold-500/40 text-gold-300 hover:bg-gold-500/25 text-xs font-cinzel font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Financial Ledger (CSV)</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 text-center font-mono">
                  Includes transaction timestamps, amounts & gateway IDs
                </p>
              </div>
            </div>

            {/* Financial Ledger Table */}
            <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-slate-200">
                    Comprehensive Financial Ledger
                  </h3>
                  <p className="text-xs text-slate-400">
                    Audit trail of all incoming client consultation receipts.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-obsidian-950/80 text-slate-400 font-cinzel uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Booking Ref</th>
                      <th className="py-3 px-3">Client</th>
                      <th className="py-3 px-3">Offering</th>
                      <th className="py-3 px-3">Razorpay Ref</th>
                      <th className="py-3 px-3 text-right">Gross Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-obsidian-850/50 transition-colors">
                        <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                          {b.created_at ? new Date(b.created_at).toLocaleDateString('en-IN') : 'Recent'}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300 text-[11px]">
                          {b.id}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-200">
                          {b.name}
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {b.service_title}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                          {b.payment_id || 'pay_live_direct'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-gold-300 text-sm">
                          {b.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: NEWSLETTER SUBSCRIBERS */}
        {/* ============================================================ */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span>The Probability Dispatch</span>
                </div>
                <h2 className="font-cinzel text-xl font-bold text-slate-100">
                  Newsletter Subscribers & Lead Registry
                </h2>
                <p className="text-xs text-slate-400 max-w-lg mt-1">
                  Prospective clients who signed up for weekly probability breakdowns, mental model essays, and tarot pattern case studies.
                </p>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button
                  onClick={() => setIsManualSubscriberOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-slate-800 hover:border-gold-500/40 text-slate-200 hover:text-gold-300 text-xs font-cinzel font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-gold-400" />
                  <span>Add Subscriber</span>
                </button>

                <button
                  onClick={() => exportNewsletterToCSV(subscribers)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg shadow-gold-500/10 transition-all flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Mailing List (CSV)</span>
                </button>
              </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-obsidian-950/80 text-slate-400 font-cinzel uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Email Address</th>
                    <th className="py-3.5 px-4">Date Subscribed</th>
                    <th className="py-3.5 px-4">Acquisition Channel</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {subscribers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-slate-500">
                        No subscribers registered yet.
                      </td>
                    </tr>
                  ) : (
                    subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-obsidian-850/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                          {sub.email}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                          {sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-IN') : 'Recent'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-obsidian-950 border border-slate-800">
                            {sub.source || 'website_footer'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            <Check className="w-3 h-3" />
                            <span>Active Subscribed</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteSub(sub.id)}
                            className="p-1.5 rounded-lg bg-obsidian-950 border border-slate-800 hover:border-rose-500/40 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Remove Subscriber"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: SYSTEM & SECURITY */}
        {/* ============================================================ */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl">
            {/* Passcode changer */}
            <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base font-bold text-slate-100">
                    Master Console Passcode
                  </h3>
                  <p className="text-xs text-slate-400">
                    Update the security PIN required to unlock this executive dashboard.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasscodeChange} className="space-y-3 pt-2 max-w-md">
                <div className="flex items-center space-x-3">
                  <input
                    type="password"
                    placeholder="Enter new master passcode (min 4 chars)..."
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-obsidian-950 border border-slate-800 focus:border-gold-400 text-xs font-mono text-slate-100 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Save PIN
                  </button>
                </div>
                {pinNotice && (
                  <p className="text-xs text-gold-400 font-mono flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{pinNotice}</span>
                  </p>
                )}
                <p className="text-[11px] text-slate-500 font-mono">
                  Default passcode if unchanged: <code className="text-slate-400">tarotx2026</code>
                </p>
              </form>
            </div>

            {/* Cloud & Integration Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Supabase Status */}
              <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span className="font-cinzel text-xs uppercase font-bold text-slate-200">Supabase Backend</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    isSupabaseConfigured ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
                  }`}>
                    {isSupabaseConfigured ? 'Connected & Live' : 'LocalStorage Mode'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isSupabaseConfigured 
                    ? 'Cloud synchronization is fully active on tarot-x-official.supabase.co with RLS policies enabled.'
                    : 'Running in resilient offline browser cache mode. All bookings and subscribers persist safely in LocalStorage.'}
                </p>
              </div>

              {/* Razorpay Gateway */}
              <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-gold-400" />
                    <span className="font-cinzel text-xs uppercase font-bold text-slate-200">Payment Gateway</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-300">
                    Live Production
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Razorpay Live Standard Checkout is active for real INR transactions on ₹99 Offline Dossiers and ₹999 Live Video Consultations.
                </p>
              </div>

              {/* Resend Email Gateway */}
              <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-purple-400" />
                      <span className="font-cinzel text-xs uppercase font-bold text-slate-200">Resend Email Gateway</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      Connected
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automated serverless email dispatch via Resend SDK to <strong className="text-slate-200 font-mono">tarotxofficial@gmail.com</strong>.
                  </p>
                  <div className="p-2.5 rounded-xl bg-obsidian-950 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-0.5">
                    <div>Sender: <span className="text-slate-300">onboarding@resend.dev</span></div>
                    <div>Key: <span className="text-slate-500">re_T7hEpa7W...</span></div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    disabled={emailSending}
                    className="w-full py-2 px-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-200 hover:bg-purple-500/30 text-xs font-cinzel font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-purple-400" />
                    <span>{emailSending ? 'Dispatching...' : 'Send Test Email'}</span>
                  </button>

                  {emailStatus && (
                    <div className={`mt-2 p-2 rounded-lg text-[11px] font-mono flex items-start space-x-1.5 ${
                      emailStatus.success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'
                    }`}>
                      {emailStatus.success ? <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" /> : <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />}
                      <span className="leading-tight">{emailStatus.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Native Android Meeting Reminders & Popup Alerts Facility */}
            <div className="bg-obsidian-900/80 border border-gold-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-400">
                    <AlarmClock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-base font-bold text-slate-100 flex items-center space-x-2">
                      <span>Automatic Meeting & Booking Popups</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {typeof window !== 'undefined' && window.AndroidReminders?.isNativeAvailable() ? 'Native Android Engine Active' : 'Web Emulation Ready'}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Wakes the phone screen with audio chime and displays a full-screen consultation alert 5 minutes before scheduled meetings, even if closed or locked.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSyncBookingsWithDevice()}
                  className="px-3 py-1.5 rounded-xl bg-obsidian-950 border border-gold-500/30 hover:border-gold-500/60 text-gold-400 text-xs font-mono flex items-center space-x-1.5 transition-all self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync {bookings.length} Bookings</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Test Run 1: 5-Sec Meeting Reminder */}
                <div className="p-4 rounded-xl bg-obsidian-950/80 border border-slate-800/80 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-cinzel font-bold text-gold-400 flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>5-Minute Pre-Meeting Alarm Test</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">5-Sec Trigger</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Schedules an authoritative wake-up alarm for 5 seconds from now. Lock your phone or exit the app to test the screen wake-up and popup.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTestMeetingReminder(5)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all active:scale-98 shadow-lg shadow-gold-500/10"
                  >
                    <AlarmClock className="w-4 h-4" />
                    <span>Run 5-Sec Meeting Reminder Test</span>
                  </button>
                </div>

                {/* Test Run 2: Instant Booking Alert */}
                <div className="p-4 rounded-xl bg-obsidian-950/80 border border-slate-800/80 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-cinzel font-bold text-emerald-400 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Instant New Booking Alert Test</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Immediate</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Simulates a new incoming consultation booking and immediately triggers the full-screen alert popup with client and inquiry details.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestNewBookingPopup}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 text-emerald-300 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all active:scale-98"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Run New Booking Alert Test</span>
                  </button>
                </div>
              </div>

              {reminderNotice && (
                <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/30 text-xs font-mono text-gold-300 flex items-center space-x-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{reminderNotice}</span>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* ============================================================ */}
      {/* 4. MODALS */}
      {/* ============================================================ */}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-gold-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-cinzel text-xl font-bold text-slate-100">
                    {selectedBooking.name}
                  </h3>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                <p className="text-xs font-mono text-gold-400 mt-0.5">
                  {selectedBooking.service_title} ({selectedBooking.price})
                </p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg bg-obsidian-950 border border-slate-800 hover:border-gold-500/40 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-obsidian-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase text-[10px] font-mono">Email Address</span>
                <p className="font-mono text-slate-200 font-semibold">{selectedBooking.email}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-obsidian-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase text-[10px] font-mono">Phone / WhatsApp</span>
                <p className="font-mono text-slate-200 font-semibold">{selectedBooking.phone || 'Not provided'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-obsidian-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase text-[10px] font-mono">Schedule / Delivery</span>
                <p className="font-mono text-slate-200 font-semibold">
                  {selectedBooking.preferred_date} · {selectedBooking.preferred_time}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-obsidian-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase text-[10px] font-mono">Gateway Reference</span>
                <p className="font-mono text-slate-200 font-semibold truncate">{selectedBooking.payment_id || 'Direct manual'}</p>
              </div>
            </div>

            {/* Client Inquiry / Situation Statement */}
            <div className="p-4 rounded-xl bg-obsidian-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 uppercase text-[10px] font-cinzel tracking-wider font-bold">
                Client Situation / Core Inquiry
              </span>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                “{selectedBooking.notes || 'No specific notes provided.'}”
              </p>
              {selectedBooking.birthDetails && (
                <div className="pt-2 border-t border-slate-800/60 text-[11px] font-mono text-amber-400/90">
                  Birth Coordinates: {selectedBooking.birthDetails}
                </div>
              )}
            </div>

            {/* Reader Internal Notes & Analysis Draft */}
            <div className="space-y-2">
              <label className="block text-xs font-cinzel font-bold text-slate-300 uppercase tracking-wider">
                Reader Private Notes & Analytical Observations
              </label>
              <textarea
                rows="3"
                value={readerNotesDraft}
                onChange={(e) => setReaderNotesDraft(e.target.value)}
                placeholder="Record symbols, card draws, psychological contradictions, or action plans for this client..."
                className="w-full p-3 rounded-xl bg-obsidian-950 border border-slate-800 focus:border-gold-400 text-xs text-slate-200 outline-none leading-relaxed"
              />
              <button
                onClick={handleSaveReaderNotes}
                className="px-3.5 py-1.5 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 hover:bg-gold-500/30 text-xs font-cinzel font-bold uppercase tracking-wider transition-all"
              >
                Save Notes
              </button>
            </div>

            {/* Status Changer Footer */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400 font-cinzel">Update Status:</span>
                <select
                  value={selectedBooking.status}
                  onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value)}
                  className="bg-obsidian-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-gold-400"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Manual Booking Modal */}
      {isManualBookingOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-gold-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-cinzel text-lg font-bold text-slate-100">
                Create Manual Booking
              </h3>
              <button
                onClick={() => setIsManualBookingOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const isLive = formData.get('tier') === '999';
                await addManualBooking({
                  name: formData.get('name'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  service_title: isLive ? '1-to-1 Live Zoom Reading' : 'Offline Pattern Report',
                  price: isLive ? '₹999' : '₹99',
                  notes: formData.get('notes'),
                  preferred_date: formData.get('date'),
                  preferred_time: formData.get('time')
                });
                setIsManualBookingOpen(false);
                loadData();
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">Client Full Name *</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Shreya Saxena"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-slate-100 outline-none focus:border-gold-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="client@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-slate-100 outline-none focus:border-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone / WhatsApp</label>
                  <input
                    name="phone"
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-slate-100 outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Service Offering *</label>
                <select
                  name="tier"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-slate-100 outline-none focus:border-gold-400"
                >
                  <option value="999">1-to-1 Live Zoom Reading — ₹999</option>
                  <option value="99">Offline Pattern Diagnostic Report — ₹99</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Target Date</label>
                  <input
                    name="date"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-slate-100 outline-none focus:border-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Time Slot</label>
                  <input
                    name="time"
                    defaultValue="19:00"
                    placeholder="e.g. 19:00 or Async"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-slate-100 outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Client Questions / Inquiries</label>
                <textarea
                  name="notes"
                  rows="2"
                  placeholder="Summary of life crossroads or questions..."
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-slate-100 outline-none focus:border-gold-400"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsManualBookingOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-cinzel font-bold uppercase tracking-wider shadow-md shadow-gold-500/10"
                >
                  Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Subscriber Modal */}
      {isManualSubscriberOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-gold-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-cinzel text-base font-bold text-slate-100">
                Add Newsletter Subscriber
              </h3>
              <button
                onClick={() => setIsManualSubscriberOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const email = formData.get('email');
                if (email) {
                  await subscribeNewsletter(email, 'manual_admin_entry');
                  setIsManualSubscriberOpen(false);
                  loadData();
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">Subscriber Email *</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="subscriber@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-slate-100 outline-none focus:border-gold-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsManualSubscriberOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-obsidian-950 border border-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-gold-500 text-obsidian-950 font-cinzel font-bold uppercase tracking-wider"
                >
                  Add Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-Screen Luxury Meeting / Booking Reminder Popup Simulation */}
      {simulatedPopup && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-obsidian-900 border-2 border-gold-500 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl shadow-gold-500/20 relative animate-in zoom-in-95 duration-200">
            {/* Category Pill */}
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-400 text-xs font-mono font-semibold">
              <AlarmClock className="w-3.5 h-3.5 animate-bounce" />
              <span>{simulatedPopup.type === 'MEETING_REMINDER' ? '🔮 5 MINUTES BEFORE MEETING' : '✨ NEW CLIENT BOOKING'}</span>
            </div>

            <div>
              <h3 className="font-cinzel text-2xl font-bold text-slate-100">
                {simulatedPopup.type === 'MEETING_REMINDER' ? 'Consultation Alert' : 'Live Booking Confirmed'}
              </h3>
              <p className="text-xs font-mono font-bold text-gold-400 mt-1">
                {simulatedPopup.scheduled_time || 'Starting Promptly'}
              </p>
            </div>

            {/* Avatar Circle */}
            <div className="w-16 h-16 rounded-full bg-obsidian-950 border-2 border-gold-500 mx-auto flex items-center justify-center text-gold-400 text-2xl font-cinzel font-bold shadow-lg shadow-gold-500/10">
              {simulatedPopup.client_name ? simulatedPopup.client_name[0] : 'C'}
            </div>

            <div>
              <h4 className="font-cinzel text-lg font-bold text-slate-100">
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
            <div className="space-y-2.5 pt-2">
              <a
                href="https://zoom.us"
                target="_blank"
                rel="noreferrer"
                onClick={() => setSimulatedPopup(null)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-gold-500/20"
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
                onClick={() => setSimulatedPopup(null)}
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
