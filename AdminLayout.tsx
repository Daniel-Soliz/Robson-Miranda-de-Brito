import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Calendar,
  Phone,
  FileText,
  ExternalLink,
  Copy,
  Check,
  LogOut,
} from 'lucide-react';
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
import { isFirebaseConfigured, auth } from '../lib/firebase.ts';
import { signOut } from 'firebase/auth';
import { PhotosTab } from './tabs/PhotosTab.tsx';
import { ServicesTab } from './tabs/ServicesTab.tsx';
import { AgendaTab } from './tabs/AgendaTab.tsx';
import { ContactsTab } from './tabs/ContactsTab.tsx';
import { ContentTab } from './tabs/ContentTab.tsx';
import { Toast, ToastMessage } from './ui/Toast.tsx';

interface AdminLayoutProps {
  userEmail: string;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ userEmail, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'fotos' | 'servicos' | 'agenda' | 'contatos' | 'textos'>('fotos');

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<ContactSettings | null>(null);
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const loadAll = async () => {
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
    loadAll();
  }, []);

  const handleCopyBioLink = async () => {
    const url = `${window.location.origin}/links`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      showToast('Link da página /links copiado para a área de transferência!', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showToast('Não foi possível copiar o link.', 'error');
    }
  };

  const handleSignOut = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    onLogout();
  };

  const pendingBookingsCount = bookings.filter(b => b.status === 'pendente').length;

  return (
    <div className="min-h-screen bg-[#050506] text-[#FAF7F2] flex flex-col select-none">
      {/* Top Banner for Demo Mode */}
      {!isFirebaseConfigured && (
        <div className="bg-[#0C0C0F] border-b border-[rgba(212,182,121,0.25)] py-2 px-4 text-center text-xs font-inter flex flex-wrap items-center justify-center gap-2 text-[#8E8982]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4B679] animate-pulse" />
          <strong className="text-[#D4B679]">Modo demonstração:</strong>
          <span>alterações são mantidas no navegador para testes. Conecte o Firebase via .env para sincronizar com a nuvem.</span>
        </div>
      )}

      {/* Main Admin Navbar */}
      <header className="sticky top-0 z-40 bg-[#08080A]/95 backdrop-blur-xl border-b border-[rgba(242,238,232,0.08)] px-4 sm:px-8 py-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-cormorant text-2xl text-[#FAF7F2] italic tracking-wide">
              Robson Brito
            </span>
            <span className="label-editorial text-[9px] hidden sm:inline-block">
              PAINEL ADMINISTRATIVO
            </span>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleCopyBioLink}
              className="px-3 py-1.5 rounded-[2px] bg-[#0E0E12] border border-[rgba(242,238,232,0.08)] text-[#FAF7F2] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors text-xs font-inter flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#D4B679]" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Copiar link /links</span>
              <span className="sm:hidden">Bio</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-[2px] bg-[#0E0E12] border border-[rgba(242,238,232,0.08)] text-[#FAF7F2] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors text-xs font-inter flex items-center gap-1.5"
            >
              <span>Ver site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleSignOut}
              aria-label="Sair do painel"
              className="p-2 text-[#8E8982] hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop/Tablet Horizontal Tabs Bar */}
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto pt-3 pb-0 text-xs font-inter uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('fotos')}
            className={`px-4 py-2 border-b-2 font-medium transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'fotos'
                ? 'border-[#D4B679] text-[#D4B679]'
                : 'border-transparent text-[#8E8982] hover:text-[#FAF7F2]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Fotos & Portfólio ({photos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('servicos')}
            className={`px-4 py-2 border-b-2 font-medium transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'servicos'
                ? 'border-[#D4B679] text-[#D4B679]'
                : 'border-transparent text-[#8E8982] hover:text-[#FAF7F2]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Serviços ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-4 py-2 border-b-2 font-medium transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'agenda'
                ? 'border-[#D4B679] text-[#D4B679]'
                : 'border-transparent text-[#8E8982] hover:text-[#FAF7F2]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agenda & Pedidos</span>
            {pendingBookingsCount > 0 && (
              <span className="bg-[#D4B679] text-[#050506] px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                {pendingBookingsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('contatos')}
            className={`px-4 py-2 border-b-2 font-medium transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'contatos'
                ? 'border-[#D4B679] text-[#D4B679]'
                : 'border-transparent text-[#8E8982] hover:text-[#FAF7F2]'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Contatos & Redes</span>
          </button>

          <button
            onClick={() => setActiveTab('textos')}
            className={`px-4 py-2 border-b-2 font-medium transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'textos'
                ? 'border-[#D4B679] text-[#D4B679]'
                : 'border-transparent text-[#8E8982] hover:text-[#FAF7F2]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Textos & Marca</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 pb-24 md:pb-12">
        {activeTab === 'fotos' && (
          <PhotosTab
            photos={photos}
            categories={categories}
            onRefresh={loadAll}
            showToast={showToast}
          />
        )}

        {activeTab === 'servicos' && (
          <ServicesTab
            services={services}
            onRefresh={loadAll}
            showToast={showToast}
          />
        )}

        {activeTab === 'agenda' && scheduleSettings && (
          <AgendaTab
            bookings={bookings}
            scheduleSettings={scheduleSettings}
            onRefresh={loadAll}
            showToast={showToast}
          />
        )}

        {activeTab === 'contatos' && contacts && (
          <ContactsTab
            contacts={contacts}
            onRefresh={loadAll}
            showToast={showToast}
          />
        )}

        {activeTab === 'textos' && content && (
          <ContentTab
            content={content}
            testimonials={testimonials}
            onRefresh={loadAll}
            showToast={showToast}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08080A]/95 backdrop-blur-xl border-t border-[rgba(242,238,232,0.08)] px-2 py-2 flex items-center justify-around text-[10px] font-inter">
        <button
          onClick={() => setActiveTab('fotos')}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === 'fotos' ? 'text-[#D4B679]' : 'text-[#8E8982]'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Fotos</span>
        </button>

        <button
          onClick={() => setActiveTab('servicos')}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === 'servicos' ? 'text-[#D4B679]' : 'text-[#8E8982]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Serviços</span>
        </button>

        <button
          onClick={() => setActiveTab('agenda')}
          className={`relative flex flex-col items-center gap-1 p-1 ${
            activeTab === 'agenda' ? 'text-[#D4B679]' : 'text-[#8E8982]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Agenda</span>
          {pendingBookingsCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-[#D4B679]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('contatos')}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === 'contatos' ? 'text-[#D4B679]' : 'text-[#8E8982]'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contatos</span>
        </button>

        <button
          onClick={() => setActiveTab('textos')}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === 'textos' ? 'text-[#D4B679]' : 'text-[#8E8982]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Textos</span>
        </button>
      </nav>

      {/* Global Toast Alerts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
