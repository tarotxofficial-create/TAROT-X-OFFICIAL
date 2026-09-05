import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Trash2, 
  Calendar, 
  Sparkles, 
  Copy, 
  ExternalLink, 
  Cloud, 
  CloudOff,
  Flame,
  Search
} from 'lucide-react';
import { getSavedReadings, deleteSavedReading, isSupabaseConfigured } from '../lib/supabase';
import { soundEngine } from '../lib/soundEngine';

export default function MysticJournal({ onSwitchToSanctuary }) {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copyToast, setCopyToast] = useState('');

  const loadReadings = async () => {
    setLoading(true);
    const data = await getSavedReadings();
    setReadings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadReadings();
  }, []);

  const handleDelete = async (id) => {
    soundEngine.playCardFlipSound();
    await deleteSavedReading(id);
    setReadings(readings.filter(r => r.id !== id));
  };

  const handleCopy = (reading) => {
    const text = [
      `🔮 TAROT X READING: ${reading.spread_name}`,
      `Date: ${new Date(reading.created_at).toLocaleDateString()}`,
      `Query: "${reading.question}"`,
      '',
      ...(reading.cards || []).map(c => `• ${c.positionLabel}: ${c.name} (${c.isReversed ? 'Reversed' : 'Upright'})`)
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopyToast(reading.id);
    setTimeout(() => setCopyToast(''), 3000);
  };

  const filtered = readings.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const matchQuery = (r.question || '').toLowerCase().includes(q);
    const matchSpread = (r.spread_name || '').toLowerCase().includes(q);
    const matchCards = (r.cards || []).some(c => c.name.toLowerCase().includes(q));
    return matchQuery || matchSpread || matchCards;
  });

  return (
    <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold-500/20 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 text-gold-400">
              <Bookmark className="w-6 h-6" />
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wide gold-gradient-text">
                Your Mystic Journal
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Archived records of your soul inquiries, spreads, and evolutionary guidance.
            </p>
          </div>

          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-obsidian-900 border border-slate-700 text-xs text-slate-300">
            {isSupabaseConfigured ? (
              <>
                <Cloud className="w-4 h-4 text-emerald-400" />
                <span>Supabase Live Sync Active</span>
              </>
            ) : (
              <>
                <CloudOff className="w-4 h-4 text-amber-400" />
                <span>Local Cache Encrypted</span>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        {readings.length > 0 && (
          <div className="relative pt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search saved readings by question, card, or spread..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:border-gold-400 outline-none"
            />
          </div>
        )}
      </div>

      {/* Reading Cards Stream */}
      {loading ? (
        <div className="text-center py-16 space-y-2">
          <Sparkles className="w-8 h-8 text-gold-400 animate-spin-slow mx-auto" />
          <p className="text-xs font-cinzel text-slate-400">Opening Sacred Chronicle...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-cinzel text-lg font-bold text-slate-200">No Readings In Journal Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Cast a spread in the Oracle Sanctuary and tap "Save to Journal" to archive your readings here.
            </p>
          </div>
          <button
            onClick={onSwitchToSanctuary}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-md"
          >
            Go to Oracle Sanctuary
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((reading) => (
            <div
              key={reading.id}
              className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 hover:border-gold-500/40 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block">
                    {reading.spread_name}
                  </span>
                  <h4 className="font-cinzel text-base font-bold text-slate-100">
                    "{reading.question || 'General Guidance'}"
                  </h4>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(reading.created_at).toLocaleDateString()}</span>
                  </span>

                  <button
                    onClick={() => handleCopy(reading)}
                    title="Copy Reading Text"
                    className="p-1.5 rounded-lg bg-obsidian-900 hover:bg-slate-800 text-slate-400 hover:text-gold-300"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(reading.id)}
                    title="Delete Record"
                    className="p-1.5 rounded-lg bg-obsidian-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Cards in this reading */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(reading.cards || []).map((card, i) => (
                  <div key={i} className="p-3 rounded-xl bg-obsidian-900/60 border border-slate-800 space-y-1 text-xs">
                    <span className="text-[10px] font-cinzel text-gold-400 block font-bold truncate">
                      {card.positionLabel}
                    </span>
                    <div className="font-semibold text-slate-200">
                      {card.name} {card.isReversed && <span className="text-rose-400 text-[10px]">(Rev)</span>}
                    </div>
                  </div>
                ))}
              </div>

              {copyToast === reading.id && (
                <div className="text-[11px] text-emerald-400 font-mono">
                  ✓ Reading copied to clipboard!
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </section>
  );
}
