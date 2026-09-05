// TAROT X OFFICIAL — Supabase Client & Sacred Data Store
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') && 
  !supabaseAnonKey.includes('placeholder')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

const STORAGE_KEYS = {
  JOURNAL: 'tarotx_sacred_journal_v1',
  SAVED_DECK: 'tarotx_user_deck_preferences',
  BOOKINGS: 'tarotx_user_bookings'
};

// ── Save a Tarot Reading to Supabase or Local Storage ───────────────────────────
export async function saveReading(readingData) {
  const readingPayload = {
    id: `reading_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
    ...readingData
  };

  // 1. Always save to Local Journal for instantaneous offline access
  try {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL) || '[]');
    const updated = [readingPayload, ...local.filter(r => r.id !== readingPayload.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(updated));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }

  // 2. Sync to Supabase if live credentials configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('tarot_readings')
        .insert([readingPayload])
        .select();

      if (error) {
        console.warn('Supabase reading insert notice (using local cache):', error.message);
      }
      return { success: true, source: 'supabase', data };
    } catch (e) {
      console.warn('Supabase sync skipped:', e.message);
    }
  }

  return { success: true, source: 'local', data: readingPayload };
}

// ── Retrieve User Readings ──────────────────────────────────────────────────
export async function getSavedReadings() {
  // If Supabase configured, attempt remote fetch
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('tarot_readings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Remote fetch fallback to local storage:', e.message);
    }
  }

  // Fallback to local storage journal
  try {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL) || '[]');
    return local;
  } catch {
    return [];
  }
}

// ── Delete a Saved Reading ───────────────────────────────────────────────────
export async function deleteSavedReading(readingId) {
  try {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL) || '[]');
    const updated = local.filter(r => r.id !== readingId);
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(updated));
  } catch (err) {
    console.warn('LocalStorage delete error:', err);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('tarot_readings').delete().eq('id', readingId);
    } catch (e) {
      console.warn('Supabase delete skipped:', e.message);
    }
  }
  return true;
}

// ── Book Spiritual Consultation ─────────────────────────────────────────────
export async function bookConsultation(bookingData) {
  const booking = {
    id: `book_${Date.now()}`,
    created_at: new Date().toISOString(),
    status: 'confirmed',
    ...bookingData
  };

  try {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([booking, ...local]));
  } catch (err) {
    console.warn('Local booking cache error:', err);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('tarot_consultations')
        .insert([booking]);
      if (!error) return { success: true, booking };
    } catch (e) {
      console.warn('Supabase consultation insert notice:', e.message);
    }
  }

  return { success: true, booking };
}
