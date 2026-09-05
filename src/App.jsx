import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TarotTable from './components/TarotTable';
import CardCodex from './components/CardCodex';
import DailyCosmicPortal from './components/DailyCosmicPortal';
import NumerologyEngine from './components/NumerologyEngine';
import BookingSection from './components/BookingSection';
import MysticJournal from './components/MysticJournal';
import Footer from './components/Footer';
import { getSavedReadings } from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState('sanctuary'); // sanctuary | codex | cosmic | numerology | booking | journal
  const [savedCount, setSavedCount] = useState(0);
  const canvasRef = useRef(null);

  // Refresh saved journal count
  const refreshJournalCount = async () => {
    const list = await getSavedReadings();
    setSavedCount(list?.length || 0);
  };

  useEffect(() => {
    refreshJournalCount();
  }, []);

  // Ambient Celestial Starfield Canvas Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate stars
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.015 + 0.005,
      color: Math.random() > 0.6 ? '#d4af37' : Math.random() > 0.3 ? '#818cf8' : '#e2e8f0'
    }));

    let t = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.02;

      stars.forEach((star, i) => {
        const flicker = Math.sin(t + i) * 0.3 + star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, flicker));
        ctx.fill();

        // Slow drift
        star.y -= star.speed * 8;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-obsidian-950 text-slate-100 font-sans selection:bg-gold-500 selection:text-obsidian-950">
      
      {/* Dynamic Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-60"
      />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedCount}
      />

      {/* Main Content Areas */}
      <main className="relative z-10 flex-grow">
        {activeTab === 'sanctuary' && (
          <>
            <HeroSection
              onStartReading={() => {
                const el = document.getElementById('oracle-table');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreCodex={() => setActiveTab('codex')}
              onCalculateSoul={() => setActiveTab('numerology')}
            />
            <div id="oracle-table">
              <TarotTable onSaveToJournal={refreshJournalCount} />
            </div>
          </>
        )}

        {activeTab === 'codex' && (
          <CardCodex />
        )}

        {activeTab === 'cosmic' && (
          <DailyCosmicPortal />
        )}

        {activeTab === 'numerology' && (
          <NumerologyEngine />
        )}

        {activeTab === 'booking' && (
          <BookingSection />
        )}

        {activeTab === 'journal' && (
          <MysticJournal onSwitchToSanctuary={() => setActiveTab('sanctuary')} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />
    </div>
  );
}
