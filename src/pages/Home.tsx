import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import {
  Photo,
  Category,
  ServiceItem,
  Booking,
  ContactSettings,
  ScheduleSettings,
  Testimonial,
  SiteContent,
} from '../data/types.ts';
import { dataService } from '../lib/storageService.ts';
import { Navbar } from '../components/sections/Navbar.tsx';
import { Hero } from '../components/sections/Hero.tsx';
import { VelocityRibbon } from '../components/sections/VelocityRibbon.tsx';
import { FeaturedGallery } from '../components/sections/FeaturedGallery.tsx';
import { HighlightsStack } from '../components/sections/HighlightsStack.tsx';
import { AboutSection } from '../components/sections/AboutSection.tsx';
import { ServicesSection } from '../components/sections/ServicesSection.tsx';
import { FullGallery } from '../components/sections/FullGallery.tsx';
import { TestimonialsSection } from '../components/sections/TestimonialsSection.tsx';
import { TimelineSection } from '../components/sections/TimelineSection.tsx';
import { BookingSection } from '../components/sections/BookingSection.tsx';
import { ContactSection } from '../components/sections/ContactSection.tsx';
import { Footer } from '../components/sections/Footer.tsx';
import { CustomCursor } from '../components/sections/CustomCursor.tsx';
import { FloatingWhatsApp } from '../components/sections/FloatingWhatsApp.tsx';
import { Lightbox } from '../components/sections/Lightbox.tsx';
import { JsonLd } from '../components/ui/JsonLd.tsx';

export const Home: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<ContactSettings | null>(null);
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);

  // Lightbox selection
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<Photo | null>(null);

  // Preselected service for booking & quote
  const [bookingServiceId, setBookingServiceId] = useState<string>('');
  const [quoteServiceSubject, setQuoteServiceSubject] = useState<string>('');

  // Lenis smooth scroll
  useEffect(() => {
    // Only on desktop and without prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lenis: Lenis | null = null;
    let rafId: number;

    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis initialization note:', e);
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  // Listen to custom lightbox events
  useEffect(() => {
    const handleSelect = (e: any) => {
      if (e.detail?.photo) {
        setActiveLightboxPhoto(e.detail.photo);
      }
    };
    window.addEventListener('byrobsonbrito_select_photo', handleSelect);
    return () => window.removeEventListener('byrobsonbrito_select_photo', handleSelect);
  }, []);

  // Load Data
  const loadData = async () => {
    const [p, c, s, b, ct, sc, t, st] = await Promise.all([
      dataService.getPhotos(),
      dataService.getCategories(),
      dataService.getServices(),
      dataService.getBookings(),
      dataService.getContacts(),
      dataService.getScheduleSettings(),
      dataService.getTestimonials(),
      dataService.getSiteContent(),
    ]);
    setPhotos(p);
    setCategories(c);
    setServices(s);
    setBookings(b);
    setContacts(ct);
    setScheduleSettings(sc);
    setTestimonials(t);
    setContent(st);
  };

  useEffect(() => {
    loadData();

    // Listen to local storage updates
    const handleStorageUpdate = () => loadData();
    window.addEventListener('byrobsonbrito_data_updated', handleStorageUpdate);
    return () => window.removeEventListener('byrobsonbrito_data_updated', handleStorageUpdate);
  }, []);

  const handleSelectServiceForBooking = (serviceId: string) => {
    setBookingServiceId(serviceId);
    const agendaEl = document.getElementById('agenda');
    if (agendaEl) {
      agendaEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForQuote = (serviceName: string) => {
    setQuoteServiceSubject(serviceName);
    const contatoEl = document.getElementById('contato');
    if (contatoEl) {
      contatoEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!contacts || !content || !scheduleSettings) {
    return (
      <div className="min-h-screen bg-[#050506] flex items-center justify-center">
        <span className="label-editorial text-xs">Carregando portfólio...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#050506] text-[#FAF7F2] min-h-screen relative selection:bg-[#D4B679] selection:text-[#050506] bg-film-grain">
      {/* Schema.org JSON-LD Structured Data */}
      <JsonLd contacts={contacts} content={content} />

      {/* Custom Desktop Interactive Cursor */}
      <CustomCursor />

      {/* Floating Pill Header */}
      <Navbar contacts={contacts} />

      {/* 1. HERO SECTION */}
      <Hero content={content} contacts={contacts} />

      {/* 3. FAIXA GIGANTE (ScrollVelocity) */}
      <VelocityRibbon categories={categories} />

      {/* 4. PORTFÓLIO EM DESTAQUE (CircularGallery) */}
      <FeaturedGallery
        photos={photos}
        onSelectPhoto={photo => setActiveLightboxPhoto(photo)}
      />

      {/* 5. DESTAQUES EM PILHA (Stack) */}
      <HighlightsStack
        photos={photos}
        onSelectPhoto={photo => setActiveLightboxPhoto(photo)}
      />

      {/* 6. SOBRE (TiltedCard + ScrollReveal + CountUp) */}
      <AboutSection content={content} contacts={contacts} />

      {/* 7. SERVIÇOS (SpotlightCard) */}
      <ServicesSection
        services={services}
        onSelectServiceForBooking={handleSelectServiceForBooking}
        onSelectServiceForQuote={handleSelectServiceForQuote}
      />

      {/* 8. GALERIA COMPLETA (Masonry + Filter) */}
      <FullGallery
        photos={photos}
        categories={categories}
        onSelectPhoto={photo => setActiveLightboxPhoto(photo)}
      />

      {/* 9. DEPOIMENTOS */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 10. COMO FUNCIONA (Timeline) */}
      <TimelineSection />

      {/* 11. AGENDAMENTO (Agenda) */}
      <BookingSection
        services={services}
        bookings={bookings}
        scheduleSettings={scheduleSettings}
        contacts={contacts}
        preselectedServiceId={bookingServiceId}
        onBookingCreated={() => loadData()}
      />

      {/* 12. CONTATO ALINHADO */}
      <ContactSection
        contacts={contacts}
        initialQuoteSubject={quoteServiceSubject}
      />

      {/* 13. RODAPÉ */}
      <Footer contacts={contacts} />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp contacts={contacts} />

      {/* 8. LIGHTBOX */}
      <Lightbox
        photos={photos.filter(p => p.visible)}
        activePhoto={activeLightboxPhoto}
        onClose={() => setActiveLightboxPhoto(null)}
      />
    </div>
  );
};
