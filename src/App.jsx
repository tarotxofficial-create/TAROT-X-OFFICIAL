import React, { useState } from 'react';
import AntigravityCanvas from './components/3d/AntigravityCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services, { READING_SERVICES } from './components/Services';
import Testimonials from './components/Testimonials';
import BookingForm from './components/BookingForm';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  const [selectedService, setSelectedService] = useState(READING_SERVICES[0]);

  const scrollToBooking = (service) => {
    if (service) setSelectedService(service);
    const el = document.getElementById('booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-obsidian-950 text-slate-100 font-sans selection:bg-gold-500 selection:text-obsidian-950 overflow-x-hidden">
      
      {/* 1. WebGL 3D Zero-G Spatial Canvas (Fixed in Background) */}
      <AntigravityCanvas />

      {/* 2. Deep Space Contrast Vignette (Calibrated to let 3D realms pop while keeping crystal clear text contrast) */}
      <div className="fixed inset-0 bg-gradient-to-b from-obsidian-950/45 via-obsidian-950/20 to-obsidian-950/60 pointer-events-none z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,5,8,0.75)_100%)] pointer-events-none z-10" />

      {/* 3. Atmospheric CRT Scanline & Grain Texture */}
      <div className="fixed inset-0 scanline-overlay pointer-events-none z-10 opacity-15" />

      {/* 4. Sticky Top Navigation with 432Hz Synthesizer Audio Toggle */}
      <Navbar onBookClick={() => scrollToBooking()} />

      {/* 4. Single Continuous Scroll-Down Sections */}
      <main className="relative z-20">
        {/* Section 1: Hero */}
        <section id="hero">
          <Hero 
            onBookClick={() => scrollToBooking()} 
            onExploreServices={scrollToServices} 
          />
        </section>

        {/* Section 2: About & Reader Philosophy */}
        <About />

        {/* Section 3: Consultation Offerings & Pricing (₹99 & ₹999) */}
        <Services onSelectService={(srv) => scrollToBooking(srv)} />

        {/* Section 4: Words From Past Seekers / Client Experiences */}
        <Testimonials />

        {/* Section 5: Direct Reading Booking Form with Live Razorpay */}
        <BookingForm 
          selectedService={selectedService} 
          onServiceChange={setSelectedService} 
        />

        {/* Section 6: Frequently Asked Questions */}
        <FAQ />
      </main>

      {/* 5. Footer */}
      <Footer />

    </div>
  );
}

