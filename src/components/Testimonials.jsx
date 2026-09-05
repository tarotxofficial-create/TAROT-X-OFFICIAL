import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Elena Rostova',
      location: 'London, UK',
      session: 'Life Path & Deep Dive',
      quote: 'I was genuinely skeptical before booking, but the accuracy and gentle nuance of this session blew me away. She identified the exact professional stagnation I had been hiding from myself and gave me the courage to pivot.',
      rating: 5
    },
    {
      name: 'Marcus Vance',
      location: 'San Francisco, CA',
      session: 'Clarity & Crossroads',
      quote: 'No fluffy generalizations or vague clichés. Just piercing, articulate insight that helped me resolve a 6-month partnership dilemma in 30 minutes. Absolutely invaluable.',
      rating: 5
    },
    {
      name: 'Ananya Sharma',
      location: 'Dubai, UAE',
      session: 'Master Celtic Cross',
      quote: 'The 90-minute Celtic Cross blueprint was like a year of therapy combined with spiritual architecture. The recorded replay has been my compass for the past six months.',
      rating: 5
    }
  ];

  return (
    <section id="reviews" className="py-20 border-t border-slate-800/80 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-gold-400 text-xs font-cinzel uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Client Experiences</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold gold-gradient-text">
            Words From Past Seekers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real reflections from clients who found grounded direction through our sacred readings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex text-gold-400 space-x-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <h4 className="font-cinzel text-sm font-bold text-slate-100">{rev.name}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                  <span>{rev.location}</span>
                  <span className="text-gold-300 font-mono text-[10px]">{rev.session}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
