-- ==============================================================================
-- TAROT X OFFICIAL — Production Database Schema & Seed Data
-- Target Project: https://chpozujmnfuykwhfpfdf.supabase.co
-- Run this script in the Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/chpozujmnfuykwhfpfdf/sql/new
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. TABLE: tarot_bookings (Consultation & Reading Bookings)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tarot_bookings (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  service_title TEXT NOT NULL,
  price TEXT NOT NULL,
  inr_amount NUMERIC DEFAULT 99,
  format TEXT DEFAULT 'Live Zoom Video',
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  focus_area TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  reader_notes TEXT DEFAULT '',
  payment_id TEXT DEFAULT '',
  payment_status TEXT DEFAULT 'paid',
  status TEXT DEFAULT 'confirmed'
);

-- ------------------------------------------------------------------------------
-- 3. TABLE: tarot_newsletter (Newsletter Subscribers)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tarot_newsletter (
  id TEXT PRIMARY KEY DEFAULT ('sub_' || floor(extract(epoch from now()))::text || '_' || substr(md5(random()::text), 1, 4)),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'website_footer',
  status TEXT DEFAULT 'subscribed'
);

-- ------------------------------------------------------------------------------
-- 4. TABLE: tarot_inquiries (Contact Messages & Inquiries)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tarot_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. TABLE: tarot_admin_signals (Inter-Device Realtime & Push Notification Hub)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tarot_admin_signals (
  id TEXT PRIMARY KEY,
  signal_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  sender TEXT DEFAULT 'web_admin',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 6. TABLE: tarot_settings (Dynamic Configuration & Passcode Sync)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tarot_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB DEFAULT '{}'::jsonb NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 7. Enable Row Level Security (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.tarot_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarot_newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarot_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarot_admin_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarot_settings ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if re-running
DROP POLICY IF EXISTS "Public can insert bookings" ON public.tarot_bookings;
DROP POLICY IF EXISTS "Public can view bookings" ON public.tarot_bookings;
DROP POLICY IF EXISTS "Public can update bookings" ON public.tarot_bookings;
DROP POLICY IF EXISTS "Public can delete bookings" ON public.tarot_bookings;

DROP POLICY IF EXISTS "Public can insert newsletter" ON public.tarot_newsletter;
DROP POLICY IF EXISTS "Public can view newsletter" ON public.tarot_newsletter;
DROP POLICY IF EXISTS "Public can delete newsletter" ON public.tarot_newsletter;

DROP POLICY IF EXISTS "Public can insert inquiries" ON public.tarot_inquiries;
DROP POLICY IF EXISTS "Public can view inquiries" ON public.tarot_inquiries;

DROP POLICY IF EXISTS "Allow all for admin signals" ON public.tarot_admin_signals;
DROP POLICY IF EXISTS "Allow all for tarot settings" ON public.tarot_settings;

-- Public Access Policies
CREATE POLICY "Public can insert bookings" ON public.tarot_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view bookings" ON public.tarot_bookings FOR SELECT USING (true);
CREATE POLICY "Public can update bookings" ON public.tarot_bookings FOR UPDATE USING (true);
CREATE POLICY "Public can delete bookings" ON public.tarot_bookings FOR DELETE USING (true);

CREATE POLICY "Public can insert newsletter" ON public.tarot_newsletter FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view newsletter" ON public.tarot_newsletter FOR SELECT USING (true);
CREATE POLICY "Public can delete newsletter" ON public.tarot_newsletter FOR DELETE USING (true);

CREATE POLICY "Public can insert inquiries" ON public.tarot_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view inquiries" ON public.tarot_inquiries FOR SELECT USING (true);

CREATE POLICY "Allow all for admin signals" ON public.tarot_admin_signals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for tarot settings" ON public.tarot_settings FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 8. Enable Supabase Realtime Replication
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tarot_bookings;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tarot_newsletter;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tarot_settings;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tarot_admin_signals;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- ------------------------------------------------------------------------------
-- 9. Initial Seed Data (Historical Bookings, Subscribers, Settings)
-- ------------------------------------------------------------------------------

-- Seed Settings
INSERT INTO public.tarot_settings (key, value, updated_at)
VALUES 
  ('admin_config', '{"master_pin": "tarotx2026", "brand_name": "TAROT X OFFICIAL", "allow_live_consultations": true}'::jsonb, now())
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, updated_at = now();

-- Seed Bookings
INSERT INTO public.tarot_bookings (
  id, created_at, name, email, phone, service_title, price, inr_amount, 
  format, preferred_date, preferred_time, timezone, focus_area, notes, 
  reader_notes, payment_id, payment_status, status
) VALUES
  (
    'book_1725619200000_a1f9',
    now() - interval '4 hours',
    'Aarav Mehta',
    'aarav.mehta@example.com',
    '+91 98201 44521',
    '1-to-1 Live Zoom Reading',
    '₹999',
    999,
    'Live Zoom Video',
    (current_date + interval '1 day')::text,
    '18:00',
    'Asia/Kolkata',
    'Career & High-Stakes Venture',
    'Exiting a 6-year tech startup to launch an independent fund. Facing intense decision paralysis on timing and equity split.',
    'Client exhibits repetitive hesitation loops around co-founder conflict. Bring up the 8 of Swords pattern.',
    'pay_P8gX91KdLv2q01',
    'paid',
    'confirmed'
  ),
  (
    'book_1725532800000_b2e8',
    now() - interval '18 hours',
    'Pooja Ramanathan',
    'pooja.r@example.com',
    '+91 97412 88902',
    'Offline Pattern Report',
    '₹99',
    99,
    'Offline Written Report (Email)',
    current_date::text,
    'Asynchronous Delivery',
    'Asia/Kolkata',
    'Relationship Dynamics & Patterns',
    'Recurring relationship cycles where emotional withdrawal triggers overcompensation. Seeking brutal objective breakdown.',
    'Dossier drafted and spread photographed. Ready to dispatch.',
    'pay_P7mB84NcJv1p99',
    'paid',
    'completed'
  ),
  (
    'book_1725446400000_c3d7',
    now() - interval '42 hours',
    'Vikramaditya Sengupta',
    'vikram.sen@example.com',
    '+91 98110 32415',
    '1-to-1 Live Zoom Reading',
    '₹999',
    999,
    'Live Zoom Video',
    (current_date + interval '2 days')::text,
    '20:30',
    'Asia/Kolkata',
    'Decision Crossroads & Ethics',
    'Offered executive role in rival firm overseas vs staying to stabilize family manufacturing enterprise.',
    '',
    'pay_P6kL73MbJw0q88',
    'paid',
    'confirmed'
  ),
  (
    'book_1725360000000_d4c6',
    now() - interval '68 hours',
    'Ananya Deshmukh',
    'ananya.d@example.com',
    '+91 99670 19823',
    'Offline Pattern Report',
    '₹99',
    99,
    'Offline Written Report (Email)',
    (current_date - interval '1 day')::text,
    'Asynchronous Delivery',
    'Asia/Kolkata',
    'Unconscious Blind Spots & Habits',
    'Chronic procrastination masked as perfectionism in creative manuscript submission.',
    'Sent PDF dossier on Sep 05. Client acknowledged receipt with high praise.',
    'pay_P5jK62LaIv9p77',
    'paid',
    'completed'
  ),
  (
    'book_1725273600000_e5b5',
    now() - interval '92 hours',
    'Rohan Kapoor',
    'rohan.k@example.com',
    '+91 98711 77620',
    '1-to-1 Live Zoom Reading',
    '₹999',
    999,
    'Live Zoom Video',
    (current_date - interval '2 days')::text,
    '19:00',
    'Asia/Kolkata',
    'Career & High-Stakes Venture',
    'Navigating investor term sheet negotiations. Need clarity on hidden counterparty motivations.',
    'Conducted live session. Client unblocked key clause negotiation strategy.',
    'pay_P4iJ51KzHu8o66',
    'paid',
    'completed'
  ),
  (
    'book_1725187200000_f6a4',
    now() - interval '120 hours',
    'Meera Nambiar',
    'meera.nambiar@example.com',
    '+91 94470 55142',
    'Offline Pattern Report',
    '₹99',
    99,
    'Offline Written Report (Email)',
    (current_date - interval '3 days')::text,
    'Asynchronous Delivery',
    'Asia/Kolkata',
    'Relationship Dynamics & Patterns',
    'Examine pattern of boundary collapse with business co-signers.',
    'Completed report delivered.',
    'pay_P3hI40JyGt7n55',
    'paid',
    'completed'
  ),
  (
    'book_1725100800000_g7z3',
    now() - interval '144 hours',
    'Devansh Parekh',
    'devansh.parekh@example.com',
    '+91 98250 33491',
    '1-to-1 Live Zoom Reading',
    '₹999',
    999,
    'Live Zoom Video',
    (current_date + interval '3 days')::text,
    '21:00',
    'Asia/Kolkata',
    'Decision Crossroads & Ethics',
    'Pivotal crossroads between continuing family legacy enterprise or migrating to Berlin accelerator.',
    'Upcoming video consultation.',
    'pay_P2gH39IxFs6m44',
    'paid',
    'confirmed'
  )
ON CONFLICT (id) DO NOTHING;

-- Seed Newsletter Subscribers
INSERT INTO public.tarot_newsletter (id, created_at, email, source, status)
VALUES
  ('sub_001', now() - interval '12 hours', 'siddharth.sharma@gmail.com', 'website_footer', 'subscribed'),
  ('sub_002', now() - interval '28 hours', 'tanya.verma@outlook.com', 'probability_dossier_modal', 'subscribed'),
  ('sub_003', now() - interval '54 hours', 'karan.johar.analytics@venture.co', 'website_footer', 'subscribed'),
  ('sub_004', now() - interval '86 hours', 'sneha.patel@designstudio.in', 'reading_completion', 'subscribed'),
  ('sub_005', now() - interval '130 hours', 'aditya.chawla@fintech.io', 'website_footer', 'subscribed')
ON CONFLICT (email) DO NOTHING;
