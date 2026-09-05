// TAROT X OFFICIAL — Supabase Client & Bookings Store
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') && 
  !supabaseAnonKey.includes('your-project')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

const BOOKINGS_STORAGE_KEY = 'tarotx_official_bookings';

// Submit a reading consultation booking
export async function submitBooking(bookingData) {
  const booking = {
    id: `book_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
    status: 'pending_confirmation',
    ...bookingData
  };

  // 1. Save to LocalStorage cache
  try {
    const existing = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY) || '[]');
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([booking, ...existing]));
  } catch (err) {
    console.warn('LocalStorage booking error:', err);
  }

  // 2. Sync to Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('tarot_bookings')
        .insert([{
          id: booking.id,
          name: booking.name,
          email: booking.email,
          phone: booking.phone || '',
          service_title: booking.service_title,
          price: booking.price,
          format: booking.format,
          preferred_date: booking.preferred_date,
          preferred_time: booking.preferred_time,
          timezone: booking.timezone || 'UTC',
          notes: booking.notes || '',
          status: booking.status || 'confirmed',
          payment_id: booking.payment_id || '',
          payment_status: booking.payment_status || 'paid'
        }])
        .select();

      if (error) {
        console.warn('Supabase booking notice:', error.message);
      }
      return { success: true, booking, synced: !error };
    } catch (e) {
      console.warn('Supabase request skipped:', e.message);
    }
  }

  return { success: true, booking, synced: false };
}
