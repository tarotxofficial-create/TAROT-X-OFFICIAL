// TAROT X OFFICIAL — Spreads Dataset

export const SPREADS = [
  {
    id: 'single_card',
    name: 'Card of the Day',
    subtitle: 'Daily Oracle & Core Atmosphere',
    cardCount: 1,
    difficulty: 'All Levels',
    description: 'A focused single-card draw providing immediate guidance, morning meditation focus, and spiritual resonance for your day.',
    positions: [
      { id: 0, label: 'Divine Oracle', description: 'Core energy, central blessing, and spiritual focus for right now.' }
    ]
  },
  {
    id: 'three_card_timeline',
    name: '3-Card Timeline Spread',
    subtitle: 'Past • Present • Future',
    cardCount: 3,
    difficulty: 'Beginner',
    description: 'The classic timeline spread illustrating karmic roots, current crossroad energies, and where current momentum is heading.',
    positions: [
      { id: 0, label: 'The Root (Past)', description: 'Foundation energies and past influences shaping your present state.' },
      { id: 1, label: 'The Threshold (Present)', description: 'Active dynamics, choices, and current spiritual lessons.' },
      { id: 2, label: 'The Horizon (Future)', description: 'Likely culmination and emerging horizon if current energy persists.' }
    ]
  },
  {
    id: 'three_card_trinity',
    name: 'Mind • Body • Spirit Trinity',
    subtitle: 'Holistic Soul Balance',
    cardCount: 3,
    difficulty: 'Intermediate',
    description: 'Diagnoses energetic alignment across your mental state, physical vitality, and transcendent higher self.',
    positions: [
      { id: 0, label: 'The Conscious Mind', description: 'Thought patterns, beliefs, and intellectual focus.' },
      { id: 1, label: 'The Sacred Body', description: 'Physical energy, grounding, and somatic sensations.' },
      { id: 2, label: 'The Higher Spirit', description: 'Soul evolution, intuitive messages, and cosmic alignment.' }
    ]
  },
  {
    id: 'five_card_elemental',
    name: '5-Card Elemental Cross',
    subtitle: 'Fire • Water • Air • Earth • Quintessence',
    cardCount: 5,
    difficulty: 'Advanced',
    description: 'A deep occult spread exploring how the four primordial elements and quintessence spirit govern your situation.',
    positions: [
      { id: 0, label: 'Fire (Will & Passion)', description: 'Creative drive, motivation, and transformative spark.' },
      { id: 1, label: 'Water (Emotion & Heart)', description: 'Emotional currents, relationships, and intuitive flow.' },
      { id: 2, label: 'Air (Mind & Truth)', description: 'Truth, communication, perspective, and strategy.' },
      { id: 3, label: 'Earth (Grounded Reality)', description: 'Physical circumstances, finances, and material anchors.' },
      { id: 4, label: 'Ether (Soul Synthesis)', description: 'Higher spiritual purpose and cosmic integration.' }
    ]
  },
  {
    id: 'ten_card_celtic_cross',
    name: '10-Card Celtic Cross',
    subtitle: 'The Grand Arcane Blueprint',
    cardCount: 10,
    difficulty: 'Mastery',
    description: 'The venerated master layout delivering exhaustive multidimensional insight into destiny, psychology, hopes, and outcome.',
    positions: [
      { id: 0, label: '1. The Heart', description: 'The present core of the matter.' },
      { id: 1, label: '2. The Crossing', description: 'The immediate challenge or catalyst.' },
      { id: 2, label: '3. The Foundation', description: 'Unconscious roots and past origins.' },
      { id: 3, label: '4. The Recent Past', description: 'Passing influences fading away.' },
      { id: 4, label: '5. The Crown', description: 'Highest conscious aspirations.' },
      { id: 5, label: '6. The Immediate Future', description: 'Next emerging cycle.' },
      { id: 6, label: '7. The Self', description: 'Your internal stance and attitude.' },
      { id: 7, label: '8. The Environment', description: 'External people, atmosphere, and surroundings.' },
      { id: 8, label: '9. Hopes & Fears', description: 'Secret desires and hidden anxieties.' },
      { id: 9, label: '10. The Ultimate Culmination', description: 'Final synthesis and destiny resolution.' }
    ]
  }
];
