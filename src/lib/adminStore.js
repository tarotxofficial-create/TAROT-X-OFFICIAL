import { supabase, isSupabaseConfigured } from './supabase';
import { sendNewsletterAlert } from './emailService';

const BOOKINGS_STORAGE_KEY = 'tarotx_official_bookings';
const NEWSLETTER_STORAGE_KEY = 'tarotx_official_newsletter';
const PASSCODE_STORAGE_KEY = 'tarotx_admin_passcode';
const SESSION_AUTH_KEY = 'tarotx_admin_auth_session';

const DEFAULT_MASTER_PIN = 'tarotx2026';

// ----------------------------------------------------
// Initial High-Fidelity Historical Seed Data (Realistic Demo)
// ----------------------------------------------------
const SEED_BOOKINGS = [
  {
    id: 'book_1725619200000_a1f9',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    phone: '+91 98201 44521',
    service_title: '1-to-1 Live Zoom Reading',
    price: '₹999',
    inrAmount: 999,
    format: 'Live Zoom Video',
    preferred_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferred_time: '18:00',
    timezone: 'Asia/Kolkata',
    focusArea: 'Career & High-Stakes Venture',
    notes: 'Exiting a 6-year tech startup to launch an independent fund. Facing intense decision paralysis on timing and equity split.',
    reader_notes: 'Client exhibits repetitive hesitation loops around co-founder conflict. Bring up the 8 of Swords pattern.',
    payment_id: 'pay_P8gX91KdLv2q01',
    payment_status: 'paid',
    status: 'confirmed'
  },
  {
    id: 'book_1725532800000_b2e8',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    name: 'Pooja Ramanathan',
    email: 'pooja.r@example.com',
    phone: '+91 97412 88902',
    service_title: 'Offline Pattern Report',
    price: '₹99',
    inrAmount: 99,
    format: 'Offline Written Report (Email)',
    preferred_date: new Date(Date.now()).toISOString().split('T')[0],
    preferred_time: 'Asynchronous Delivery',
    timezone: 'Asia/Kolkata',
    focusArea: 'Relationship Dynamics & Patterns',
    birthDetails: '14 May 1994, 04:20 AM, Bengaluru',
    notes: 'Recurring relationship cycles where emotional withdrawal triggers overcompensation. Seeking brutal objective breakdown.',
    reader_notes: 'Dossier drafted and spread photographed. Ready to dispatch.',
    payment_id: 'pay_P7mB84NcJv1p99',
    payment_status: 'paid',
    status: 'completed'
  },
  {
    id: 'book_1725446400000_c3d7',
    created_at: new Date(Date.now() - 3600000 * 42).toISOString(),
    name: 'Vikramaditya Sengupta',
    email: 'vikram.sen@example.com',
    phone: '+91 98110 32415',
    service_title: '1-to-1 Live Zoom Reading',
    price: '₹999',
    inrAmount: 999,
    format: 'Live Zoom Video',
    preferred_date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    preferred_time: '20:30',
    timezone: 'Asia/Kolkata',
    focusArea: 'Decision Crossroads & Ethics',
    notes: 'Offered executive role in rival firm overseas vs staying to stabilize family manufacturing enterprise.',
    reader_notes: '',
    payment_id: 'pay_P6kL73MbJw0q88',
    payment_status: 'paid',
    status: 'confirmed'
  },
  {
    id: 'book_1725360000000_d4c6',
    created_at: new Date(Date.now() - 3600000 * 68).toISOString(),
    name: 'Ananya Deshmukh',
    email: 'ananya.d@example.com',
    phone: '+91 99670 19823',
    service_title: 'Offline Pattern Report',
    price: '₹99',
    inrAmount: 99,
    format: 'Offline Written Report (Email)',
    preferred_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    preferred_time: 'Asynchronous Delivery',
    timezone: 'Asia/Kolkata',
    focusArea: 'Unconscious Blind Spots & Habits',
    birthDetails: '29 Oct 1998, 11:15 PM, Pune',
    notes: 'Chronic procrastination masked as perfectionism in creative manuscript submission.',
    reader_notes: 'Sent PDF dossier on Sep 05. Client acknowledged receipt with high praise.',
    payment_id: 'pay_P5jK62LaIv9p77',
    payment_status: 'paid',
    status: 'completed'
  },
  {
    id: 'book_1725273600000_e5b5',
    created_at: new Date(Date.now() - 3600000 * 92).toISOString(),
    name: 'Rohan Kapoor',
    email: 'rohan.k@example.com',
    phone: '+91 98711 77620',
    service_title: '1-to-1 Live Zoom Reading',
    price: '₹999',
    inrAmount: 999,
    format: 'Live Zoom Video',
    preferred_date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    preferred_time: '19:00',
    timezone: 'Asia/Kolkata',
    focusArea: 'Career & High-Stakes Venture',
    notes: 'Navigating investor term sheet negotiations. Need clarity on hidden counterparty motivations.',
    reader_notes: 'Conducted live session. Client unblocked key clause negotiation strategy.',
    payment_id: 'pay_P4iJ51KzHu8o66',
    payment_status: 'paid',
    status: 'completed'
  },
  {
    id: 'book_1725187200000_f6a4',
    created_at: new Date(Date.now() - 3600000 * 120).toISOString(),
    name: 'Meera Nambiar',
    email: 'meera.nambiar@example.com',
    phone: '+91 94470 55142',
    service_title: 'Offline Pattern Report',
    price: '₹99',
    inrAmount: 99,
    format: 'Offline Written Report (Email)',
    preferred_date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    preferred_time: 'Asynchronous Delivery',
    timezone: 'Asia/Kolkata',
    focusArea: 'Relationship Dynamics & Patterns',
    birthDetails: '03 Aug 1991, 09:45 AM, Kochi',
    notes: 'Examine pattern of boundary collapse with business co-signers.',
    reader_notes: 'Completed report delivered.',
    payment_id: 'pay_P3hI40JyGt7n55',
    payment_status: 'paid',
    status: 'completed'
  },
  {
    id: 'book_1725100800000_g7z3',
    created_at: new Date(Date.now() - 3600000 * 144).toISOString(),
    name: 'Devansh Parekh',
    email: 'devansh.parekh@example.com',
    phone: '+91 98250 33491',
    service_title: '1-to-1 Live Zoom Reading',
    price: '₹999',
    inrAmount: 999,
    format: 'Live Zoom Video',
    preferred_date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    preferred_time: '21:00',
    timezone: 'Asia/Kolkata',
    focusArea: 'Decision Crossroads & Ethics',
    notes: 'Pivotal crossroads between continuing family legacy enterprise or migrating to Berlin accelerator.',
    reader_notes: 'Upcoming video consultation.',
    payment_id: 'pay_P2gH39IxFs6m44',
    payment_status: 'paid',
    status: 'confirmed'
  }
];

const SEED_NEWSLETTER = [
  {
    id: 'sub_001',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    email: 'siddharth.sharma@gmail.com',
    source: 'website_footer',
    status: 'subscribed'
  },
  {
    id: 'sub_002',
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    email: 'tanya.verma@outlook.com',
    source: 'probability_dossier_modal',
    status: 'subscribed'
  },
  {
    id: 'sub_003',
    created_at: new Date(Date.now() - 3600000 * 54).toISOString(),
    email: 'karan.johar.analytics@venture.co',
    source: 'website_footer',
    status: 'subscribed'
  },
  {
    id: 'sub_004',
    created_at: new Date(Date.now() - 3600000 * 86).toISOString(),
    email: 'sneha.patel@designstudio.in',
    source: 'reading_completion',
    status: 'subscribed'
  },
  {
    id: 'sub_005',
    created_at: new Date(Date.now() - 3600000 * 130).toISOString(),
    email: 'aditya.chawla@fintech.io',
    source: 'website_footer',
    status: 'subscribed'
  }
];

// ----------------------------------------------------
// Authentication & Security Helpers
// ----------------------------------------------------
export function getAdminPasscode() {
  try {
    return localStorage.getItem(PASSCODE_STORAGE_KEY) || DEFAULT_MASTER_PIN;
  } catch {
    return DEFAULT_MASTER_PIN;
  }
}

export function setCustomPasscode(newPin) {
  if (!newPin || newPin.length < 4) {
    return { success: false, message: 'Passcode must be at least 4 characters long.' };
  }
  try {
    localStorage.setItem(PASSCODE_STORAGE_KEY, newPin);
    return { success: true, message: 'Passcode successfully updated.' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export function isAdminAuthenticated() {
  try {
    return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true' || 
           localStorage.getItem(SESSION_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(remember = false) {
  try {
    sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
    if (remember) {
      localStorage.setItem(SESSION_AUTH_KEY, 'true');
    }
  } catch (e) {
    console.warn('Auth session store error:', e);
  }
}

export function clearAdminSession() {
  try {
    sessionStorage.removeItem(SESSION_AUTH_KEY);
    localStorage.removeItem(SESSION_AUTH_KEY);
  } catch (e) {
    console.warn('Auth session clear error:', e);
  }
}

// ----------------------------------------------------
// Bookings Store Management
// ----------------------------------------------------
export async function fetchAdminBookings() {
  let bookings = [];

  // 1. Fetch from Supabase if active
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('tarot_bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        bookings = data.map(b => ({
          ...b,
          inrAmount: b.price?.includes('999') ? 999 : 99
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch notice:', e);
    }
  }

  // 2. Fetch from LocalStorage
  let localData = [];
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (raw) {
      localData = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('LocalStorage parse error:', e);
  }

  // Merge unique by ID
  const map = new Map();
  [...bookings, ...localData].forEach(item => {
    if (item && item.id) {
      map.set(item.id, {
        ...item,
        inrAmount: item.inrAmount || (item.price?.includes('999') ? 999 : 99)
      });
    }
  });

  let merged = Array.from(map.values());

  // 3. If empty, seed initial high-fidelity historical data
  if (merged.length === 0) {
    merged = SEED_BOOKINGS;
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.warn('Seeding storage error:', e);
    }
  }

  // Sort by created_at descending
  merged.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  return merged;
}

export async function updateBookingStatus(id, newStatus, readerNotes = null) {
  try {
    // 1. Update in LocalStorage
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY) || '[]';
    let list = JSON.parse(raw);
    let updatedItem = null;

    list = list.map(item => {
      if (item.id === id) {
        updatedItem = {
          ...item,
          status: newStatus,
          ...(readerNotes !== null ? { reader_notes: readerNotes } : {})
        };
        return updatedItem;
      }
      return item;
    });

    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list));

    // 2. Sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      const payload = { status: newStatus };
      if (readerNotes !== null) payload.notes = readerNotes;
      await supabase.from('tarot_bookings').update(payload).eq('id', id);
    }

    return { success: true, booking: updatedItem };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function addManualBooking(bookingData) {
  const is999 = bookingData.service_title?.includes('999') || bookingData.price?.includes('999');
  const newBooking = {
    id: `book_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
    name: bookingData.name || 'Anonymous Client',
    email: bookingData.email || 'client@example.com',
    phone: bookingData.phone || '',
    service_title: bookingData.service_title || (is999 ? '1-to-1 Live Zoom Reading' : 'Offline Pattern Report'),
    price: is999 ? '₹999' : '₹99',
    inrAmount: is999 ? 999 : 99,
    format: is999 ? 'Live Zoom Video' : 'Offline Written Report (Email)',
    preferred_date: bookingData.preferred_date || new Date().toISOString().split('T')[0],
    preferred_time: bookingData.preferred_time || (is999 ? '18:00' : 'Asynchronous Delivery'),
    timezone: bookingData.timezone || 'Asia/Kolkata',
    focusArea: bookingData.focusArea || 'General Strategy & Probability',
    notes: bookingData.notes || 'Manually entered booking by Reader.',
    reader_notes: bookingData.reader_notes || '',
    payment_id: bookingData.payment_id || `pay_manual_${Date.now().toString().slice(-6)}`,
    payment_status: 'paid',
    status: bookingData.status || 'confirmed'
  };

  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY) || '[]';
    const list = [newBooking, ...JSON.parse(raw)];
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list));

    if (isSupabaseConfigured && supabase) {
      await supabase.from('tarot_bookings').insert([{
        id: newBooking.id,
        name: newBooking.name,
        email: newBooking.email,
        phone: newBooking.phone,
        service_title: newBooking.service_title,
        price: newBooking.price,
        format: newBooking.format,
        preferred_date: newBooking.preferred_date,
        preferred_time: newBooking.preferred_time,
        timezone: newBooking.timezone,
        notes: newBooking.notes,
        payment_id: newBooking.payment_id,
        payment_status: newBooking.payment_status,
        status: newBooking.status
      }]);
    }

    return { success: true, booking: newBooking };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function deleteBooking(id) {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY) || '[]';
    const list = JSON.parse(raw).filter(b => b.id !== id);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list));

    if (isSupabaseConfigured && supabase) {
      await supabase.from('tarot_bookings').delete().eq('id', id);
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------
// Newsletter Management
// ----------------------------------------------------
export async function fetchNewsletterSubscribers() {
  let subscribers = [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('tarot_newsletter')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        subscribers = data;
      }
    } catch (e) {
      console.warn('Newsletter supabase notice:', e);
    }
  }

  let local = [];
  try {
    const raw = localStorage.getItem(NEWSLETTER_STORAGE_KEY);
    if (raw) local = JSON.parse(raw);
  } catch (e) {
    console.warn('Newsletter storage parse:', e);
  }

  const map = new Map();
  [...subscribers, ...local].forEach(s => {
    if (s && s.email) map.set(s.email.toLowerCase(), s);
  });

  let merged = Array.from(map.values());

  if (merged.length === 0) {
    merged = SEED_NEWSLETTER;
    try {
      localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.warn('Newsletter seed error:', e);
    }
  }

  merged.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  return merged;
}

export async function subscribeNewsletter(email, source = 'website_footer') {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please provide a valid email address.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const newSub = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
    email: cleanEmail,
    source,
    status: 'subscribed'
  };

  try {
    const raw = localStorage.getItem(NEWSLETTER_STORAGE_KEY) || '[]';
    const list = JSON.parse(raw);
    const existing = list.find(s => s.email.toLowerCase() === cleanEmail);
    if (!existing) {
      localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify([newSub, ...list]));
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('tarot_newsletter').insert([{
        email: cleanEmail,
        source,
        status: 'subscribed'
      }]);
    }

    if (!existing) {
      sendNewsletterAlert(newSub).catch(e => console.warn('Newsletter alert email error:', e));
    }

    return { success: true, subscriber: newSub, isNew: !existing };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function deleteSubscriber(emailOrId) {
  try {
    const raw = localStorage.getItem(NEWSLETTER_STORAGE_KEY) || '[]';
    const list = JSON.parse(raw).filter(s => s.id !== emailOrId && s.email !== emailOrId);
    localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(list));

    if (isSupabaseConfigured && supabase) {
      await supabase.from('tarot_newsletter').delete().or(`id.eq.${emailOrId},email.eq.${emailOrId}`);
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------
// Financial & Metrics Engine
// ----------------------------------------------------
export function calculateRevenueMetrics(bookings = []) {
  let totalRevenue = 0;
  let offlineRevenue = 0;
  let offlineCount = 0;
  let liveRevenue = 0;
  let liveCount = 0;
  let confirmedCount = 0;
  let completedCount = 0;
  let pendingCount = 0;

  bookings.forEach(b => {
    const amount = b.inrAmount || (b.price?.includes('999') ? 999 : 99);
    
    // Check if paid or active
    const isPaid = b.payment_status === 'paid' || b.status === 'confirmed' || b.status === 'completed';
    if (isPaid && b.status !== 'cancelled') {
      totalRevenue += amount;
      if (amount >= 500) {
        liveRevenue += amount;
        liveCount += 1;
      } else {
        offlineRevenue += amount;
        offlineCount += 1;
      }
    }

    if (b.status === 'confirmed') confirmedCount += 1;
    else if (b.status === 'completed') completedCount += 1;
    else if (b.status === 'pending' || b.status === 'pending_confirmation') pendingCount += 1;
  });

  const totalBookings = bookings.length;
  const averageOrderValue = totalBookings > 0 ? Math.round(totalRevenue / Math.max(1, (offlineCount + liveCount))) : 0;

  return {
    totalRevenue,
    formattedRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
    totalBookings,
    offlineCount,
    offlineRevenue,
    formattedOfflineRevenue: `₹${offlineRevenue.toLocaleString('en-IN')}`,
    liveCount,
    liveRevenue,
    formattedLiveRevenue: `₹${liveRevenue.toLocaleString('en-IN')}`,
    confirmedCount,
    completedCount,
    pendingCount,
    averageOrderValue: `₹${averageOrderValue.toLocaleString('en-IN')}`,
    ratioLiveVsOffline: totalBookings > 0 ? Math.round((liveCount / (offlineCount + liveCount || 1)) * 100) : 0
  };
}

// ----------------------------------------------------
// CSV Exporters
// ----------------------------------------------------
function downloadCSV(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportBookingsToCSV(bookings = []) {
  const headers = ['Booking ID', 'Created At', 'Client Name', 'Email', 'Phone', 'Service Tier', 'Price', 'Format', 'Scheduled Date', 'Scheduled Time', 'Status', 'Payment ID', 'Notes'];
  const rows = bookings.map(b => [
    `"${b.id || ''}"`,
    `"${b.created_at || ''}"`,
    `"${(b.name || '').replace(/"/g, '""')}"`,
    `"${b.email || ''}"`,
    `"${b.phone || ''}"`,
    `"${(b.service_title || '').replace(/"/g, '""')}"`,
    `"${b.price || ''}"`,
    `"${b.format || ''}"`,
    `"${b.preferred_date || ''}"`,
    `"${b.preferred_time || ''}"`,
    `"${b.status || ''}"`,
    `"${b.payment_id || ''}"`,
    `"${(b.notes || '').replace(/"/g, '""')}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(`tarot_x_bookings_${timestamp}.csv`, csv);
}

export function exportRevenueToCSV(bookings = []) {
  const headers = ['Transaction Date', 'Booking ID', 'Client Name', 'Service', 'Gross Amount (INR)', 'Payment Status', 'Gateway Ref (Razorpay)'];
  const rows = bookings
    .filter(b => b.status !== 'cancelled')
    .map(b => [
      `"${b.created_at ? new Date(b.created_at).toLocaleDateString('en-IN') : ''}"`,
      `"${b.id || ''}"`,
      `"${(b.name || '').replace(/"/g, '""')}"`,
      `"${(b.service_title || '').replace(/"/g, '""')}"`,
      b.inrAmount || (b.price?.includes('999') ? 999 : 99),
      `"${b.payment_status || 'paid'}"`,
      `"${b.payment_id || 'manual'}"`
    ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(`tarot_x_financial_ledger_${timestamp}.csv`, csv);
}

export function exportNewsletterToCSV(subscribers = []) {
  const headers = ['Subscriber ID', 'Subscribed At', 'Email Address', 'Acquisition Channel', 'Subscription Status'];
  const rows = subscribers.map(s => [
    `"${s.id || ''}"`,
    `"${s.created_at || ''}"`,
    `"${s.email || ''}"`,
    `"${s.source || 'website'}"`,
    `"${s.status || 'subscribed'}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(`tarot_x_subscribers_${timestamp}.csv`, csv);
}
