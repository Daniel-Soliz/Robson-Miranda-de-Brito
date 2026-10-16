import React from 'react';
import { MessageSquare } from 'lucide-react';
import { ContactSettings } from '../../data/types.ts';
import { normalizePhoneNumber } from '../../utils/scheduler.ts';

interface FloatingWhatsAppProps {
  contacts: ContactSettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ contacts }) => {
  if (!contacts.whatsapp) return null;

  const phone = normalizePhoneNumber(contacts.whatsapp);
  const defaultMsg = contacts.defaultWhatsappMsg || 'Olá Robson! Gostaria de consultar informações sobre seus ensaios e casamentos.';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp com Robson Brito"
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#131315]/90 backdrop-blur-md border border-[rgba(200,169,106,0.3)] shadow-2xl hover:border-[#C8A96A] hover:bg-[#18181B] transition-all duration-300"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8A96A] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C8A96A]" />
        </span>

        <MessageSquare className="w-4 h-4 text-[#C8A96A]" />

        <span className="hidden sm:inline-block font-inter text-xs text-[#F2EEE8] font-medium tracking-wide">
          WhatsApp
        </span>
      </a>
    </div>
  );
};
