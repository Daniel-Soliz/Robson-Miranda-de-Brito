import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  Instagram,
  Mail,
  MapPin,
  ExternalLink,
  ArrowLeft,
  Share2,
  Check,
} from 'lucide-react';
import { ContactSettings, SiteContent } from '../data/types.ts';
import { dataService } from '../lib/storageService.ts';

export const LinksPage: React.FC = () => {
  const [contacts, setContacts] = useState<ContactSettings | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([dataService.getContacts(), dataService.getSiteContent()]).then(
      ([c, s]) => {
        setContacts(c);
        setContent(s);
      }
    );
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Robson Brito — Fotografia Autoral',
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!contacts || !content) {
    return (
      <div className="min-h-screen bg-[#050506] flex items-center justify-center">
        <span className="label-editorial text-xs">Carregando...</span>
      </div>
    );
  }

  const bioLinks = contacts.bioLinks || [];

  return (
    <main className="min-h-screen bg-[#050506] text-[#FAF7F2] px-5 py-12 flex flex-col items-center justify-between relative selection:bg-[#D4B679] selection:text-[#050506]">
      {/* Top Bar with back to site and share */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 z-10">
        <a
          href={import.meta.env.BASE_URL}
          className="flex items-center gap-1.5 text-xs text-[#8E8982] hover:text-[#D4B679] transition-colors font-inter uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ver site completo</span>
        </a>

        <button
          onClick={handleShare}
          aria-label="Compartilhar página de links"
          className="p-2 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#0A0A0C] text-[#FAF7F2] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-[#D4B679]" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Profile Header */}
      <div className="w-full max-w-md text-center flex flex-col items-center mb-8 z-10">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#D4B679] p-1 bg-[#0A0A0C] shadow-2xl mb-4">
          <img
            src={content.aboutPhotoUrl}
            alt="Robson Brito"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <h1 className="font-cormorant text-3xl sm:text-4xl text-[#FAF7F2] font-light">
          Robson Brito
        </h1>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
          <span className="label-editorial text-[9px]">CASAMENTOS & RETRATOS AUTORAIS</span>
          <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
        </div>
        <p className="mt-3 text-xs sm:text-sm text-[#8E8982] max-w-xs font-inter font-light leading-relaxed">
          {content.heroSubtitle}
        </p>
      </div>

      {/* Big Action Buttons */}
      <div className="w-full max-w-md space-y-3 z-10">
        {!contacts.whatsapp && (
          <a
            href="https://www.instagram.com/byrobsonbrito/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-[2px] bg-[#D4B679] text-[#050506] flex items-center justify-between font-inter font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-[#e0c793] transition-all shadow-xl group"
          >
            <span>Conversar com Robson no Instagram</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
        {contacts.whatsapp && (
          <a
            href={`https://wa.me/${contacts.whatsapp}?text=${encodeURIComponent(
              contacts.defaultWhatsappMsg || 'Olá Robson! Vim pelo link da bio do Instagram e gostaria de informações.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-[2px] bg-[#D4B679] text-[#050506] flex items-center justify-between font-inter font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-[#e0c793] transition-all shadow-xl group"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-[#050506]" />
              <span>Falar no WhatsApp Pessoal</span>
            </div>
            <ExternalLink className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </a>
        )}

        <a
          href={`${import.meta.env.BASE_URL}#agenda`}
          className="w-full py-3.5 px-6 rounded-[2px] bg-[#0B0B0E] border border-[rgba(212,182,121,0.25)] text-[#FAF7F2] flex items-center justify-between font-inter text-xs sm:text-sm uppercase tracking-wider hover:border-[#D4B679] hover:text-[#D4B679] transition-all group"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-[#D4B679]" />
            <span>Consultar Datas & Agendar</span>
          </div>
          <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        </a>

        <a
          href={`${import.meta.env.BASE_URL}#portfolio`}
          className="w-full py-3.5 px-6 rounded-[2px] bg-[#0B0B0E] border border-[rgba(242,238,232,0.08)] text-[#FAF7F2] flex items-center justify-between font-inter text-xs sm:text-sm uppercase tracking-wider hover:border-[rgba(212,182,121,0.4)] hover:text-[#D4B679] transition-all group"
        >
          <div className="flex items-center gap-3">
            <ImageIcon className="w-4 h-4 text-[#D4B679]" />
            <span>Ver Portfólio Completo</span>
          </div>
          <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        </a>

        <a
          href={`${import.meta.env.BASE_URL}#servicos`}
          className="w-full py-3.5 px-6 rounded-[2px] bg-[#0B0B0E] border border-[rgba(242,238,232,0.08)] text-[#FAF7F2] flex items-center justify-between font-inter text-xs sm:text-sm uppercase tracking-wider hover:border-[rgba(212,182,121,0.4)] hover:text-[#D4B679] transition-all group"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#D4B679]" />
            <span>Serviços & Investimento</span>
          </div>
          <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        </a>

        {bioLinks.map(link => (
          <a
            key={link.id}
            href={link.url}
            target={link.url.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className={`w-full py-3.5 px-6 rounded-[2px] flex items-center justify-between font-inter text-xs sm:text-sm uppercase tracking-wider transition-all group ${
              link.highlight
                ? 'bg-[#121216] border border-[#D4B679] text-[#D4B679]'
                : 'bg-[#0B0B0E] border border-[rgba(242,238,232,0.08)] text-[#FAF7F2] hover:border-[rgba(212,182,121,0.35)]'
            }`}
          >
            <span>{link.title}</span>
            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>

      {/* Social Icons row */}
      <div className="w-full max-w-md pt-10 text-center space-y-4 z-10">
        <div className="flex items-center justify-center gap-4 text-[#8E8982]">
          {contacts.instagram && (
            <a
              href={`https://instagram.com/${contacts.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2.5 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#0A0A0C] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {contacts.email && (
            <a
              href={`mailto:${contacts.email}`}
              aria-label="E-mail"
              className="p-2.5 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#0A0A0C] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
          {contacts.googleMapsUrl && (
            <a
              href={contacts.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Localização"
              className="p-2.5 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#0A0A0C] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors"
            >
              <MapPin className="w-4 h-4" />
            </a>
          )}
        </div>

        <p className="text-[11px] text-[#8E8982]/50 font-inter">
          © {new Date().getFullYear()} Robson Brito Fotografia • {contacts.city || 'São Paulo'}
        </p>
      </div>
    </main>
  );
};
