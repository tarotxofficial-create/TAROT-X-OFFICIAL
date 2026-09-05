import React from 'react';
import { Sparkles, Compass, ShieldCheck, Heart, Eye, CheckCircle2 } from 'lucide-react';

export default function About() {
  const principles = [
    {
      title: 'Empowerment Over Fatalism',
      description: 'The cards do not lock in an unchangeable fate; they illuminate existing energies, unconscious blind spots, and empower you to choose the highest path.'
    },
    {
      title: 'Sacred Confidentiality',
      description: 'Your life, relationships, and queries are treated with absolute discretion. Every session takes place in a safe, compassionate, non-judgmental container.'
    },
    {
      title: 'Actionable Practical Guidance',
      description: 'Beyond esoteric insights, every reading concludes with grounded, actionable steps you can integrate immediately into your daily reality.'
    }
  ];

  return (
    <section id="about" className="py-20 border-t border-slate-800/80 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-gold-400 text-xs font-cinzel uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Reader & Philosophy</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold gold-gradient-text">
            About Tarot X Official
          </h2>
        </div>

        {/* Bio Narrative & Image/Quote Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Reader Profile Visual Box */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-72 h-96 rounded-3xl overflow-hidden border-2 border-gold-500/40 p-2 bg-obsidian-900 shadow-2xl shadow-gold-500/10">
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
                alt="Tarot X Intuitive Reader"
                className="w-full h-full object-cover rounded-2xl brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent flex flex-col justify-end p-5">
                <span className="font-cinzel text-base font-bold text-gold-300">Intuitive Tarot Practitioner</span>
                <span className="text-xs text-slate-300">Over 7+ Years of Sacred Card Study</span>
              </div>
            </div>
          </div>

          {/* Bio Story */}
          <div className="md:col-span-7 space-y-5">
            <h3 className="font-cinzel text-2xl font-bold text-slate-100">
              Transforming Uncertainty Into Strategic Insight
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              I view the Tarot not as a parlor trick or fear-inducing fortune telling, but as an ancient psychological mirror and sacred cartography of the human psyche.
            </p>

            <p className="text-sm text-slate-300 leading-relaxed">
              Whether you are confronting a major professional crossroads, navigating complex relational dynamics, or seeking realignment with your authentic soul purpose, our readings create a serene space to decipher the underlying currents of your life.
            </p>

            {/* Guiding Principles Cards */}
            <div className="space-y-3 pt-2">
              {principles.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-obsidian-900/60 border border-slate-800 flex items-start space-x-3.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-cinzel font-bold text-slate-200">{p.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
