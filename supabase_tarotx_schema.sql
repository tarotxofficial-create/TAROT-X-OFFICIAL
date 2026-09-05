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
  status TEXT DEFAULT 'pending_confirmation'
);

-- 3. Inquiries & Contact Messages Table
CREATE TABLE IF NOT EXISTS public.tarot_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.tarot_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarot_inquiries ENABLE ROW LEVEL SECURITY;

-- 5. Policies: Allow clients to submit bookings & inquiries
CREATE POLICY "Allow public insert to tarot_bookings"
ON public.tarot_bookings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public insert to tarot_inquiries"
ON public.tarot_inquiries FOR INSERT
WITH CHECK (true);
