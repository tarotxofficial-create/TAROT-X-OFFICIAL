import React, { useState } from 'react';
import { Sparkles, Mail, ShieldCheck, Heart, ArrowUp, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { subscribeNewsletter } from '../lib/adminStore';

export default function Footer({ onOpenAdmin }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await subscribeNewsletter(email, 'website_footer');
      if (res.success) {
        setSubscribed(true);
        setEmail('');
      } else {
        setErrorMsg(res.message || 'Could not complete subscription.');
      }
    } catch {
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-gold-500/20 bg-obsidian-950 pt-16 pb-12 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Newsletter Subscription Container: "The Probability Dispatch" */}
        <div className="p-8 sm:p-10 rounded-3xl bg-obsidian-900/90 border border-gold-500/30 relative overflow-hidden shadow-2xl shadow-gold-500/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-gold-500/10 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center space-x-2 text-gold-400 text-xs font-cinzel uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Probability Dispatch</span>
              </div>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold gold-gradient-text">
                Patterns Don't Lie. Decisions Do.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Weekly deep-dives into psychological decision loops, probability mapping, and unvarnished tarot case studies. No mystical fluff—only clarity.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs space-y-1">
                  <div className="flex items-center space-x-2 font-semibold font-cinzel">
                    <CheckCircle2 className="w-4 h-4 text-gold-400" />
                    <span>Dispatched & Confirmed</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    You're registered for the next weekly analytical dispatch.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative w-full">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        placeholder="Enter your email address..."
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-950 border border-slate-700 focus:border-gold-400 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-gold-400 via-amber-500 to-yellow-600 hover:from-gold-300 hover:to-amber-500 text-obsidian-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-lg shadow-gold-500/20 transition-all shrink-0 flex items-center justify-center space-x-1.5"
                    >
                      <span>{submitting ? 'Adding...' : 'Subscribe'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {errorMsg && (
                    <p className="text-[11px] text-red-400 font-mono pl-1">{errorMsg}</p>
                  )}
                  <p className="text-[10px] text-slate-500 font-mono pl-1">
                    Zero spam. Unsubscribe with 1 click anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
          
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-9 h-9 rounded-xl bg-obsidian-900 border border-gold-500/30 overflow-hidden flex items-center justify-center">
              <img src="/logo.jpg" alt="Tarot X Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-cinzel text-base font-bold gold-gradient-text tracking-wider">
                TAROT X OFFICIAL
              </span>
              <p className="text-[11px] text-slate-500">
                Pattern Recognition & Probability Analysis
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <a href="#about" className="hover:text-gold-300 transition-colors">About</a>
            <a href="#services" className="hover:text-gold-300 transition-colors">Readings</a>
            <a href="#reviews" className="hover:text-gold-300 transition-colors">Reviews</a>
            <a href="#booking" className="hover:text-gold-300 transition-colors">Book Now</a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-obsidian-900 border border-slate-800 hover:border-gold-500/40 text-slate-400 hover:text-gold-300 transition-all flex items-center space-x-1.5 text-xs"
            title="Scroll to Top"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

        </div>

        {/* Bottom Credits & Discreet Admin Portal Link */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} TAROT X OFFICIAL. All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            <p className="text-[11px]">
              Structured analytical models for decision clarity. No supernatural claims.
            </p>

            <button
              onClick={() => {
                if (onOpenAdmin) onOpenAdmin();
                else window.location.hash = '#admin';
              }}
              className="inline-flex items-center space-x-1 text-[11px] font-mono text-slate-600 hover:text-gold-400 transition-colors p-1"
              title="Restricted Reader Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
