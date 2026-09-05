import React, { useState } from 'react';
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
    <div className="min-h-screen bg-obsidian-950 text-slate-100 font-sans selection:bg-gold-500 selection:text-obsidian-950">
      
      {/* Navigation */}
      <Navbar onBookClick={() => scrollToBooking()} />

      {/* Main Portfolio Sections */}
      <main>
        {/* 1. Hero */}
        <Hero 
          onBookClick={() => scrollToBooking()} 
          onExploreServices={scrollToServices} 
        />

        {/* 2. Reader Portfolio & Philosophy */}
        <About />

        {/* 3. Reading Packages & Pricing */}
        <Services onSelectService={(srv) => scrollToBooking(srv)} />

        {/* 4. Client Testimonials */}
        <Testimonials />

        {/* 5. Direct Reading Booking Form */}
        <BookingForm 
          selectedService={selectedService} 
          onServiceChange={setSelectedService} 
        />

        {/* 6. FAQ */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
