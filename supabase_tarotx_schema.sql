-- TAROT X OFFICIAL — Portfolio & Reading Bookings Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Reading Bookings Table
CREATE TABLE IF NOT EXISTS public.tarot_bookings (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_title TEXT NOT NULL,
  price TEXT,
  format TEXT DEFAULT 'Live Zoom Video',
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  notes TEXT,
  payment_id TEXT,
  payment_status TEXT DEFAULT 'paid',
  status TEXT DEFAULT 'confirmed'
);

-- 3. Inquiries & Contact Messages Table
CREATE TABLE IF NOT EXISTS public.tarot_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL
);

-- 4. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.tarot_newsletter (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'website_footer',
  status TEXT DEFAULT 'subscribed'
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.tarot_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarot_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarot_newsletter ENABLE ROW LEVEL SECURITY;

-- 6. Policies: Allow clients to submit bookings, inquiries & newsletter subscriptions
CREATE POLICY "Allow public insert to tarot_bookings"
ON public.tarot_bookings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public read to tarot_bookings"
ON public.tarot_bookings FOR SELECT
USING (true);

CREATE POLICY "Allow public update to tarot_bookings"
ON public.tarot_bookings FOR UPDATE
USING (true);

CREATE POLICY "Allow public insert to tarot_inquiries"
ON public.tarot_inquiries FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public insert to tarot_newsletter"
ON public.tarot_newsletter FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public read to tarot_newsletter"
ON public.tarot_newsletter FOR SELECT
USING (true);

