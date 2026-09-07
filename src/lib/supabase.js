// TAROT X OFFICIAL — Supabase Client & Bookings Store
import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://qngzfcpnjpabaornddau.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuZ3pmY3BuanBhYmFvcm5kZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1Mzc2MDQsImV4cCI6MjEwMjExMzYwNH0.Uhdbtgi0uJRD2suYX67gIApvxT0o1OvNiy5RD6t6geY';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') && 
  !supabaseAnonKey.includes('placeholder')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;

const BOOKINGS_STORAGE_KEY = 'tarotx_official_bookings';

// Submit a reading consultation booking
export async function submitBooking(bookingData) {
  const is999 = bookingData.service_title?.includes('999') || bookingData.price?.includes('999');
  const booking = {
    id: `book_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
    status: 'confirmed',
    format: is999 ? 'Live Zoom Video' : 'Offline Written Report (Email)',
    inr_amount: is999 ? 999 : 99,
    timezone: 'Asia/Kolkata',
    ...bookingData
  };

  // 1. Save to LocalStorage cache
  try {
    const existing = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY) || '[]');
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([booking, ...existing]));
  } catch (err) {
    console.warn('LocalStorage booking error:', err);
  }

  // 2. Sync to Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('tarot_bookings')
        .insert([{
          id: booking.id,
          name: booking.name,
          email: booking.email,
          phone: booking.phone || '',
          service_title: booking.service_title,
          price: booking.price,
          inr_amount: booking.inr_amount || (is999 ? 999 : 99),
          format: booking.format,
          preferred_date: booking.preferred_date,
          preferred_time: booking.preferred_time,
          timezone: booking.timezone || 'Asia/Kolkata',
          focus_area: booking.focusArea || booking.focus_area || '',
          notes: booking.notes || '',
          reader_notes: booking.reader_notes || '',
          status: booking.status || 'confirmed',
          payment_id: booking.payment_id || '',
          payment_status: booking.payment_status || 'paid'
        }]);

      if (error) {
        console.warn('Supabase booking insert notice:', error.message);
      } else {
        // Dispatch real-time booking alert signal to all connected devices/apps
        dispatchAdminSignal('NEW_BOOKING_ALERT', { booking });
      }
      return { success: true, booking, synced: !error };
    } catch (e) {
      console.warn('Supabase request skipped:', e.message);
    }
  }

  return { success: true, booking, synced: false };
}

// ----------------------------------------------------
// Realtime Inter-Device Administrative Signal Hub
// ----------------------------------------------------

/**
 * Broadcasts an administrative signal (e.g. Test Meeting Reminder, New Booking Alert)
 * to all connected instances (Web browser, Mobile browser, Android App).
 */
export async function dispatchAdminSignal(signalType, payload = {}) {
  const signal = {
    id: `sig_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    signal_type: signalType,
    payload,
    sender: typeof window !== 'undefined' && window.AndroidReminders?.isNativeAvailable?.() ? 'android_app' : 'web_admin',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Send via Supabase Realtime Broadcast Channel (Instantaneous ~50ms)
      const channel = supabase.channel('tarotx_admin_signals');
      channel.send({
        type: 'broadcast',
        event: 'admin_signal',
        payload: signal
      }).catch(() => {});

      // 2. Persist in database table for guaranteed delivery & fallback polling
      await supabase.from('tarot_admin_signals').insert([{
        id: signal.id,
        signal_type: signal.signal_type,
        payload: signal.payload,
        sender: signal.sender
      }]);
    } catch (err) {
      console.warn('Error dispatching admin signal:', err);
    }
  }

  return signal;
}

/**
 * Subscribes to Realtime Admin Signals.
 * Calls `onSignal(signal)` whenever a signal is broadcast from either Web or App.
 */
export function subscribeToAdminSignals(onSignal) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const handledSignalIds = new Set();
  let pollTimer = null;

  const handleSignal = (signal) => {
    if (!signal || !signal.id || handledSignalIds.has(signal.id)) return;
    handledSignalIds.add(signal.id);
    // Keep set bounded
    if (handledSignalIds.size > 200) {
      const first = handledSignalIds.values().next().value;
      handledSignalIds.delete(first);
    }
    onSignal(signal);
  };

  // 1. Supabase Realtime Broadcast Channel
  const channel = supabase.channel('tarotx_admin_signals', {
    config: { broadcast: { self: true } }
  })
    .on('broadcast', { event: 'admin_signal' }, ({ payload }) => {
      handleSignal(payload);
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tarot_admin_signals' }, (payload) => {
      if (payload.new) {
        handleSignal(payload.new);
      }
    })
    .subscribe();

  // 2. Fallback Active Poller (Every 4s) to guarantee signal delivery even if socket pauses
  const startTime = new Date(Date.now() - 10000).toISOString();
  pollTimer = setInterval(async () => {
    try {
      const { data } = await supabase
        .from('tarot_admin_signals')
        .select('*')
        .gt('created_at', startTime)
        .order('created_at', { ascending: false })
        .limit(10);

      if (data && data.length > 0) {
        data.forEach(item => handleSignal(item));
      }
    } catch (_) {}
  }, 4000);

  return () => {
    if (pollTimer) clearInterval(pollTimer);
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribes to real-time changes on tarot_bookings table.
 */
export function subscribeToTarotBookings(onUpdate) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase.channel('tarotx_bookings_realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tarot_bookings' }, (payload) => {
      onUpdate(payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribes to real-time changes on tarot_newsletter table.
 */
export function subscribeToTarotNewsletter(onUpdate) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase.channel('tarotx_newsletter_realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tarot_newsletter' }, (payload) => {
      onUpdate(payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
