import React from 'react';
import { ArrowUp, Instagram, MessageSquare, Mail, Phone, MapPin, Youtube, ExternalLink } from 'lucide-react';
import { ContactSettings } from '../../data/types.ts';

interface FooterProps {
  contacts: ContactSettings;
  compact?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ contacts, compact = false }) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`${compact ? 'pt-10 pb-7' : 'pt-16 pb-10'} px-5vw bg-[#030304] border-t border-[rgba(242,238,232,0.06)] relative overflow-hidden select-none`}>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Giant Monolithic Name: ROBSON BRITO */}
        <div className={compact ? 'hidden' : 'text-center overflow-hidden'}>
          <h2
            className="font-cormorant font-light text-[#FAF7F2] uppercase tracking-[-0.03em] transition-all"
            style={{
              fontSize: 'clamp(3.2rem, 14vw, 13rem)',
              lineHeight: 0.85,
            }}
          >
            ROBSON BRITO
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
            <span className="label-editorial text-[9px] sm:text-[10px] text-[#D4B679]">
              FOTOGRAFIA AUTORAL • PRÉVIA EM DESENVOLVIMENTO
            </span>
            <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
          </div>
        </div>

        {/* Links and Active Socials Row */}
        <div className="pt-12 border-t border-[rgba(242,238,232,0.06)] grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Active Social Media Icons/Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5">
            {contacts.instagram && (
              <a
                href={`https://instagram.com/${contacts.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @byrobsonbrito"
                className="p-2.5 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#070709] text-[#FAF7F2] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}

            {contacts.whatsapp && (
              <a
                href={`https://wa.me/${contacts.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2.5 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#070709] text-[#FAF7F2] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            )}

            {contacts.email && (
              <a
                href={`mailto:${contacts.email}`}
                aria-label="E-mail"
                className="p-2.5 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#070709] text-[#FAF7F2] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}

            {contacts.phone && (
              <a
                href={`tel:${contacts.phone}`}
                aria-label="Telefone"
                className="p-2.5 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#070709] text-[#FAF7F2] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}

            {contacts.googleMapsUrl && (
              <a
                href={contacts.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Localização no Google Maps"
                className="p-2.5 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#070709] text-[#FAF7F2] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors"
              >
                <MapPin className="w-4 h-4" />
              </a>
            )}

            {contacts.youtube && (
              <a
                href={`https://youtube.com/${contacts.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-2.5 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#070709] text-[#FAF7F2] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Quick Navigation */}
          <div className="flex items-center justify-center gap-6 text-xs text-[#8E8982] font-inter">
            <a href={`${import.meta.env.BASE_URL}links`} className="hover:text-[#D4B679] transition-colors flex items-center gap-1">
              <span>Bio /links</span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
            <a href={`${import.meta.env.BASE_URL}admin`} className="hover:text-[#D4B679] transition-colors">
              Painel
            </a>
            <a href={`${import.meta.env.BASE_URL}portfolio`} className="hover:text-[#D4B679] transition-colors">
              Galeria
            </a>
            <a href={`${import.meta.env.BASE_URL}agenda`} className="hover:text-[#D4B679] transition-colors">
              Agenda
            </a>
          </div>

          {/* Back to top */}
          <div className="flex justify-center md:justify-end">
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 text-xs uppercase tracking-widest text-[#8E8982] hover:text-[#D4B679] transition-colors cursor-pointer font-inter"
            >
              <span>Voltar ao topo</span>
              <div className="p-2 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#070709] group-hover:border-[#D4B679] transition-colors">
                <ArrowUp className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-[rgba(242,238,232,0.04)] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8E8982]/60 font-inter gap-4">
          <p>© {currentYear} Robson Brito. Todos os direitos reservados. Fotografias protegidas por lei autoral.</p>
          <p className="tracking-widest uppercase text-[9px] font-mono">LUZ • ALMA • TEMPO</p>
        </div>
      </div>
      <p className="text-center text-[11px] text-[#8E8982] px-5 pb-5">Prévia de apresentação. Fotos do acervo do projeto; pacotes, disponibilidade e contatos sujeitos à confirmação.</p>
    </footer>
  );
};
