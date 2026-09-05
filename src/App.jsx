import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PatternArchitecture from './components/PatternArchitecture';
import Services, { READING_SERVICES } from './components/Services';
import About from './components/About';
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
    const el = document.getElementById('sessions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-void text-bone font-sans selection:bg-brass selection:text-void">
      
      {/* Navigation */}
      <Navbar onBookClick={() => scrollToBooking()} />

      {/* Main Narrative Flow */}
      <main>
        {/* 1. Hero: Scenes 01 to 04 (Coordinates, Room, Thesis, Contradiction badges & interactive card probes) */}
        <Hero 
          onBookClick={() => scrollToBooking()} 
          onExploreServices={scrollToServices} 
        />

        {/* 2. Method: Pattern Architecture (6-node diagnostic cycle + 4 foundational principles) */}
        <PatternArchitecture onBookClick={() => scrollToBooking()} />

        {/* 3. Sessions: Section 8 (Choose the room you need: ₹99 Offline Dossier & ₹999 1-to-1 Live Zoom) */}
        <Services onSelectService={(srv) => scrollToBooking(srv)} />

        {/* 4. About: Section 11 (Philosophy over biography, archival parameters, rationalist manifesto) */}
        <About />

        {/* 5. Case Logs: Session debriefs & declassified observations */}
        <Testimonials />

        {/* 6. Intake & Booking: Section 9 & 10 (5 intake questions, boundary protocol, live checkout & confirmation scene) */}
        <BookingForm 
          selectedService={selectedService} 
          onServiceChange={setSelectedService} 
        />

        {/* 7. FAQ: Operational clarity and boundary protocol */}
        <FAQ />
      </main>

      {/* 8. Footer: Section 12 (Archival editorial footer with closing manifesto quote) */}
      <Footer />

    </div>
  );
}

