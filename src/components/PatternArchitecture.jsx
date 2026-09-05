import React, { useState } from 'react';
import { Network, Activity } from 'lucide-react';

export default function PatternArchitecture() {
  const [activeNode, setActiveNode] = useState('pattern');

  const nodes = [
    {
      id: 'situation',
      step: '01',
      title: 'Situation',
      tag: 'Raw Input',
      desc: 'The concrete facts supplied by the client. Events, choices, timelines, and real-world friction before interpretation or emotional projection.',
      detail: 'X strips away wishful thinking. We begin with cold reality: what has actually occurred, who is involved, and what tangible constraints exist right now.'
    },
    {
      id: 'pattern',
      step: '02',
      title: 'Pattern',
      tag: 'Structural Recognition',
      desc: 'Recurring loops connecting past and present behaviors. The subtle cycles you repeat across relationships, work, and pivotal decisions.',
      detail: 'People don’t have bad luck; they have uninspected loops. The cards surface recurring archetypal dynamics you keep participating in without realizing it.'
    },
    {
      id: 'driver',
      step: '03',
      title: 'Driver',
      tag: 'Hidden Motivation',
      desc: 'The subconscious incentives, underlying fears, and emotional payoffs keeping the old loop alive.',
      detail: 'Every dysfunctional pattern serves a hidden purpose — safety, avoidance of shame, or fear of autonomy. We expose what the pattern is protecting.'
    },
    {
      id: 'probability',
      step: '04',
      title: 'Probability',
      tag: 'Branching Forecast',
      desc: 'Conditional outcomes. What occurs if your current behavioral trajectory continues unaltered over the next 3 to 6 months.',
      detail: 'Not an inescapable destiny. If you take the same road, you reach the same cliff. We calculate the likely statistical and psychological outcomes.'
    },
    {
      id: 'variable',
      step: '05',
      title: 'Variable',
      tag: 'Leverage Point',
      desc: 'The single conscious behavioral shift, boundary, or conversation that fractures the old loop and alters the entire system.',
      detail: 'A small change in a critical variable redirects the entire current. We identify the exact pressure point where your action carries the highest leverage.'
    },
    {
      id: 'choice',
      step: '06',
      title: 'Choice',
      tag: 'Agency Returned',
      desc: 'Full sovereignty returned to you. Clear models replace anxious confusion, leaving you with an unambiguous decision point.',
      detail: 'You are never bound by a card reading. You leave the room with your agency restored, armed with a clear psychological map instead of blind superstition.'
    }
  ];

  const current = nodes.find(n => n.id === activeNode) || nodes[1];

  const principles = [
    {
      num: '01',
      headline: 'What X believes',
      copy: 'People repeat structures. Their decisions, fears, incentives and relationships create predictable trajectories.'
    },
    {
      num: '02',
      headline: 'What the cards do',
      copy: 'Cards introduce symbolic prompts and randomized structure to bypass mental defense mechanisms. They do not control reality.'
    },
    {
      num: '03',
      headline: 'What X reads',
      copy: 'Behavioral contradictions, recurring dynamics, unspoken constraints, and likely cause-and-effect consequences.'
    },
    {
      num: '04',
      headline: 'What a reading produces',
      copy: 'A clearer model of the present, a conditional probability forecast, and an actionable decision point.'
    }
  ];

  return (
    <section id="method" className="py-24 border-t border-brass/20 bg-ink/60 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center space-x-2 text-brass text-[11px] font-mono uppercase tracking-[0.25em]">
            <Network className="w-3.5 h-3.5" />
            <span>Methodology // Pattern Architecture</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-bone leading-tight">
            Tarot is the interface. <br />
            <span className="brass-gradient-text">The pattern is the subject.</span>
          </h2>
          <p className="text-xs sm:text-sm text-smoke leading-relaxed font-sans">
            How a rationalist reading actually works: we demystify the arcane. We do not channel spirits. We use 78 symbolic archetypes as an analytical projection surface to dissect your circumstances.
          </p>
        </div>

        {/* 4 Foundation Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {principles.map((p) => (
            <div 
              key={p.num}
              className="p-5 rounded-sm bg-ink border border-brass/25 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-brass tracking-widest">{p.num}</span>
                <span className="w-1 h-1 bg-brass/60 rounded-full" />
              </div>
              <h3 className="font-cinzel text-sm font-bold text-bone uppercase tracking-wider">
                {p.headline}
              </h3>
              <p className="text-xs text-smoke leading-relaxed font-sans">
                {p.copy}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Pattern Architecture Module */}
        <div className="archive-panel rounded-sm p-6 sm:p-10 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brass/20 pb-5">
            <div>
              <span className="text-[10px] font-mono text-brass uppercase tracking-widest block">
                Interactive Analytical Module
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-bone">
                The Pattern Architecture
              </h3>
            </div>
            <p className="text-xs font-mono text-smoke">
              Click any node to inspect the diagnostic pipeline
            </p>
          </div>

          {/* Node Progression Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {nodes.map((node) => {
              const isSelected = activeNode === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveNode(node.id)}
                  className={`p-3.5 rounded-sm border text-left transition-all relative ${
                    isSelected
                      ? 'bg-charcoal border-brass text-bone shadow-lg shadow-brass/10 ring-1 ring-brass/50'
                      : 'bg-void/80 border-brass/20 text-smoke hover:border-brass/40 hover:text-bone'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] font-mono text-brass mb-1">
                    <span>{node.step}</span>
                    <span className="uppercase tracking-widest">{node.tag}</span>
                  </div>
                  <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider">{node.title}</h4>
                </button>
              );
            })}
          </div>

          {/* Active Node Deep-Dive Dossier */}
          <div className="p-6 rounded-sm bg-void border border-brass/30 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-4 space-y-2 border-b md:border-b-0 md:border-r border-brass/20 pb-4 md:pb-0 md:pr-6">
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-brass block">
                PHASE {current.step} // {current.tag}
              </span>
              <h4 className="font-cinzel text-2xl font-bold text-bone">
                {current.title}
              </h4>
              <p className="text-xs text-smoke leading-relaxed font-sans">
                {current.desc}
              </p>
            </div>

            <div className="md:col-span-8 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brass/80 block">
                How X Diagnoses This:
              </span>
              <p className="text-sm text-bone leading-relaxed font-sans">
                {current.detail}
              </p>
              
              <div className="pt-2 flex items-center space-x-2 text-[11px] font-mono text-smoke">
                <Activity className="w-3.5 h-3.5 text-brass" />
                <span>Deterministic inputs + Archetypal symbolic mapping = Probabilistic clarity</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
