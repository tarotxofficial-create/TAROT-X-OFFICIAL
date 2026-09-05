-- TAROT X OFFICIAL — Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tarot Readings Archive Table
CREATE TABLE IF NOT EXISTS public.tarot_readings (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  spread_id TEXT NOT NULL,
  spread_name TEXT NOT NULL,
  question TEXT,
  cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT false
);

-- 3. Spiritual Consultations Table
CREATE TABLE IF NOT EXISTS public.tarot_consultations (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tier_id TEXT NOT NULL,
  tier_title TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  price TEXT,
  notes TEXT,
  status TEXT DEFAULT 'confirmed'
);

-- 4. Celestial Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.tarot_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'web_footer'
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.tarot_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarot_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarot_subscribers ENABLE ROW LEVEL SECURITY;

-- 6. Public Policies for Anonymous & Authenticated Access
CREATE POLICY "Allow public insert to tarot_readings"
ON public.tarot_readings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public read of own tarot_readings"
ON public.tarot_readings FOR SELECT
USING (true);

CREATE POLICY "Allow public delete of tarot_readings"
ON public.tarot_readings FOR DELETE
USING (true);

CREATE POLICY "Allow public insert to tarot_consultations"
ON public.tarot_consultations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public insert to tarot_subscribers"
ON public.tarot_subscribers FOR INSERT
WITH CHECK (true);
