import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, ArrowLeft, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { getAdminPasscode, setAdminAuthenticated } from '../../lib/adminStore';

export default function AdminAuth({ onAuthenticated, onExit }) {
  const [passcode, setPasscode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const actualPin = getAdminPasscode();

    setTimeout(() => {
      if (passcode.trim() === actualPin.trim()) {
        setAdminAuthenticated(rememberMe);
        onAuthenticated();
      } else {
        setErrorMsg('Invalid Master Passcode. Please verify and try again.');
        setIsSubmitting(false);
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-gold-500/10 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="fixed inset-0 scanline-overlay pointer-events-none opacity-20" />

      <div className="relative z-10 w-full max-w-md">
        {/* Top return or App Mode badge */}
        {typeof navigator !== 'undefined' && (navigator.userAgent.includes('TarotXAdmin') || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('admin_app') === '1')) ? (
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-gold-400/90 mb-6 bg-gold-500/10 border border-gold-500/30 px-3.5 py-1.5 rounded-full shadow-sm shadow-gold-500/10">
            <ShieldAlert className="w-3.5 h-3.5 text-gold-400" />
            <span>Tarot X Admin Dedicated App · Sanctuary Secured</span>
          </div>
        ) : (
          <button
            onClick={onExit}
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-gold-300 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Public Website</span>
          </button>
        )}

        {/* Card Container */}
        <div className="bg-obsidian-900/90 border border-gold-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-gold-500/10 backdrop-blur-xl space-y-8 relative">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-obsidian-950 border border-gold-500/40 flex items-center justify-center shadow-inner group">
              <Lock className="w-6 h-6 text-gold-400 group-hover:scale-110 transition-transform" />
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-[11px] font-mono uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>Executive Portal</span>
            </div>

            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold gold-gradient-text tracking-wide">
              TAROT X ADMIN
            </h1>

            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Restricted management console for client pattern reports, financial analytics, and newsletter intelligence.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-cinzel tracking-wider uppercase text-slate-300 font-semibold">
                Master Security Passcode
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4 text-gold-400/80" />
                </div>

                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter passcode..."
                  autoFocus
                  required
                  className="w-full pl-10 pr-11 py-3.5 rounded-xl bg-obsidian-950/90 border border-slate-700/80 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 text-slate-100 font-mono text-sm tracking-wider placeholder-slate-600 transition-all outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {errorMsg && (
                <div className="flex items-center space-x-2 text-red-400 text-xs mt-1.5 animate-in fade-in slide-in-from-top-1">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-obsidian-950 text-gold-500 focus:ring-gold-500/50"
                />
                <span className="hover:text-slate-300 transition-colors">Remember on this device</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setPasscode('tarotx2026');
                  if (errorMsg) setErrorMsg('');
                }}
                className="text-[11px] font-mono text-gold-400/80 hover:text-gold-300 underline decoration-dotted underline-offset-2"
              >
                Auto-fill: tarotx2026
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !passcode}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-400 via-amber-500 to-yellow-600 hover:from-gold-300 hover:to-amber-500 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-lg shadow-gold-500/20 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying Access...' : 'Unlock Executive Console'}</span>
            </button>
          </form>

          {/* Quick Helper Badge */}
          <div className="pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500 font-mono">
              Tarot X Cryptographic Security · Master Access Node
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
