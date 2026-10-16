import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight } from 'lucide-react';
import { ContactSettings } from '../../data/types.ts';

interface StaggeredMenuProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: ContactSettings;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  isOpen,
  onClose,
  contacts,
}) => {
  const navLinks = [
    { label: 'Portfólio', href: '#portfolio' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Agenda', href: '#agenda' },
    { label: 'Contato', href: '#contato' },
  ];

  const handleLinkClick = (href: string) => {
    onClose();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-[#0B0B0C] flex flex-col justify-between p-6 sm:p-10"
        >
          {/* Top Bar with Close button */}
          <div className="flex items-center justify-between">
            <span className="font-cormorant text-2xl italic tracking-wider text-[#F2EEE8]">
              Robson Brito
            </span>
            <button
              onClick={onClose}
              aria-label="Fechar menu"
              className="p-3 rounded-full border border-[rgba(242,238,232,0.15)] text-[#F2EEE8] hover:text-[#C8A96A] hover:border-[#C8A96A] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Staggered Navigation Links */}
          <nav className="flex flex-col gap-4 my-auto">
            {navLinks.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{
                  duration: 0.4,
                  delay: 0.08 * index,
                  ease: [0.2, 0.7, 0.2, 1],
                }}
              >
                <button
                  onClick={() => handleLinkClick(item.href)}
                  className="group flex items-center justify-between w-full text-left font-cormorant text-3xl sm:text-4xl text-[#F2EEE8] hover:text-[#C8A96A] transition-colors py-2"
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-300">
                    {item.label}
                  </span>
                  <span className="text-sm font-mono text-[#9A958D] opacity-40 group-hover:opacity-100 group-hover:text-[#C8A96A] transition-all">
                    0{index + 1}
                  </span>
                </button>
              </motion.div>
            ))}
          </nav>

          {/* Bottom Socials & Quick Actions */}
          <div className="border-t border-[rgba(242,238,232,0.1)] pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              {contacts.instagram && (
                <a
                  href={`https://instagram.com/${contacts.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest text-[#9A958D] hover:text-[#C8A96A] transition-colors flex items-center gap-1 font-inter"
                >
                  Instagram <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
              {contacts.whatsapp && (
                <a
                  href={`https://wa.me/${contacts.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest text-[#9A958D] hover:text-[#C8A96A] transition-colors flex items-center gap-1 font-inter"
                >
                  WhatsApp <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </div>

            <span className="text-[11px] text-[#9A958D] font-inter">
              {contacts.city || 'São Paulo & Destination'}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
