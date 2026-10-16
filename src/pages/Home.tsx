import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Photo, Category, ServiceItem, Booking, ContactSettings,
  ScheduleSettings, Testimonial, SiteContent,
} from '../data/types.ts';
import { dataService } from '../lib/storageService.ts';
import { Navbar } from '../components/sections/Navbar.tsx';
import { Hero } from '../components/sections/Hero.tsx';
import { CategoryNavigation } from '../components/sections/CategoryNavigation.tsx';
import { FeaturedGallery } from '../components/sections/FeaturedGallery.tsx';
import { AboutSection } from '../components/sections/AboutSection.tsx';
import { ServicesSection } from '../components/sections/ServicesSection.tsx';
import { FullGallery } from '../components/sections/FullGallery.tsx';
import { TimelineSection } from '../components/sections/TimelineSection.tsx';
import { BookingSection } from '../components/sections/BookingSection.tsx';
import { ContactSection } from '../components/sections/ContactSection.tsx';
import { Footer } from '../components/sections/Footer.tsx';
import { CustomCursor } from '../components/sections/CustomCursor.tsx';
import { FloatingWhatsApp } from '../components/sections/FloatingWhatsApp.tsx';
import { Lightbox } from '../components/sections/Lightbox.tsx';
import { JsonLd } from '../components/ui/JsonLd.tsx';

export const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const section = location.pathname.replace(/^\//, '') || 'inicio';
  const params = new URLSearchParams(location.search);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<ContactSettings | null>(null);
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<Photo | null>(null);

  const loadData = async () => {
    const [p, c, s, b, ct, sc, st] = await Promise.all([
      dataService.getPhotos(),
      dataService.getCategories(),
      dataService.getServices(),
      dataService.getBookings(),
      dataService.getContacts(),
      dataService.getScheduleSettings(),
      dataService.getSiteContent(),
    ]);
    setPhotos(p);
    setCategories(c);
    setServices(s);
    setBookings(b);
    setContacts(ct);
    setScheduleSettings(sc);
    setContent(st);
  };

  useEffect(() => {
    void loadData();
    const refresh = () => { void loadData(); };
    window.addEventListener('byrobsonbrito_data_updated', refresh);
    return () => window.removeEventListener('byrobsonbrito_data_updated', refresh);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setActiveLightboxPhoto(null);
  }, [location.pathname]);

  useEffect(() => {
    const select = (event: Event) => {
      const photo = (event as CustomEvent<{ photo?: Photo }>).detail?.photo;
      if (photo) setActiveLightboxPhoto(photo);
    };
    window.addEventListener('byrobsonbrito_select_photo', select);
    return () => window.removeEventListener('byrobsonbrito_select_photo', select);
  }, []);

  const handleSelectServiceForBooking = (serviceId: string) => {
    navigate(`/agenda?servico=${encodeURIComponent(serviceId)}`);
  };

  const handleSelectServiceForQuote = (serviceName: string) => {
    navigate(`/contato?assunto=${encodeURIComponent(serviceName)}`);
  };

  if (!contacts || !content || !scheduleSettings) {
    return (
      <div className="min-h-screen bg-[#050506] flex items-center justify-center">
        <span className="label-editorial text-xs">Carregando portfólio...</span>
      </div>
    );
  }

  const labels: Record<string, string> = {
    portfolio: 'Portfólio',
    servicos: 'Serviços',
    sobre: 'Sobre',
    agenda: 'Agenda',
    contato: 'Contato',
  };

  return (
    <div className="bg-[#050506] text-[#FAF7F2] min-h-screen relative selection:bg-[#D4B679] selection:text-[#050506] bg-film-grain">
      <JsonLd contacts={contacts} content={content} />
      <CustomCursor />
      <Navbar contacts={contacts} />

      {section === 'inicio' ? (
        <main>
          <Hero content={content} contacts={contacts} />
          <CategoryNavigation />
          <FeaturedGallery
            photos={photos}
            onSelectPhoto={setActiveLightboxPhoto}
          />
          <div className="text-center pb-20 px-6">
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center border border-[#D4B679]/50 text-[#D4B679] hover:bg-[#D4B679] hover:text-[#050506] transition-colors px-8 py-4 text-xs uppercase tracking-[0.2em]"
            >
              Explorar portfólio completo →
            </Link>
          </div>
        </main>
      ) : (
        <main className="pt-20 min-h-[55vh]">
          <div className="max-w-7xl mx-auto px-5vw pt-10 sm:pt-12">
            <nav aria-label="Você está aqui" className="flex items-center gap-3 text-[11px] font-inter uppercase tracking-[0.2em] text-[#8E8982]">
              <Link to="/" className="hover:text-[#D4B679] transition-colors">Início</Link>
              <span aria-hidden="true" className="text-[#D4B679]">/</span>
              <span className="text-[#D4B679]">{labels[section]}</span>
            </nav>
          </div>

          {section === 'portfolio' && (
            <FullGallery photos={photos} categories={categories} onSelectPhoto={setActiveLightboxPhoto} />
          )}
          {section === 'servicos' && (
            <ServicesSection
              services={services}
              onSelectServiceForBooking={handleSelectServiceForBooking}
              onSelectServiceForQuote={handleSelectServiceForQuote}
            />
          )}
          {section === 'sobre' && (
            <>
              <AboutSection content={content} contacts={contacts} />
              <TimelineSection />
            </>
          )}
          {section === 'agenda' && (
            <BookingSection
              services={services}
              bookings={bookings}
              scheduleSettings={scheduleSettings}
              contacts={contacts}
              preselectedServiceId={params.get('servico') || ''}
              onBookingCreated={() => { void loadData(); }}
            />
          )}
          {section === 'contato' && (
            <ContactSection
              contacts={contacts}
              initialQuoteSubject={params.get('assunto') || ''}
            />
          )}
        </main>
      )}

      <Footer contacts={contacts} />
      <FloatingWhatsApp contacts={contacts} />
      <Lightbox
        photos={photos.filter(photo => photo.visible)}
        activePhoto={activeLightboxPhoto}
        onClose={() => setActiveLightboxPhoto(null)}
      />
    </div>
  );
};
