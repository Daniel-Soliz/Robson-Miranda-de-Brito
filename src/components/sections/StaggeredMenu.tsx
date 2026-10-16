import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ContactSettings } from '../../data/types.ts';

interface StaggeredMenuProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: ContactSettings;
}

const navLinks = [
  { label: 'Início', to: '/' },
  { label: 'Portfólio', to: '/portfolio' },
  { label: 'Serviços', to: '/servicos' },
  { label: 'Sobre', to: '/sobre' },
  { label: 'Agenda', to: '/agenda' },
  { label: 'Contato', to: '/contato' },
];

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({ isOpen, onClose, contacts }) => {
  const location = useLocation();
  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog" aria-modal="true" aria-label="Menu principal"
          className="fixed inset-0 z-50 bg-[#0B0B0C] flex flex-col justify-between p-5 sm:p-10 overflow-y-auto"
        >
          <div className="flex items-center justify-between">
            <span className="font-cormorant text-2xl italic tracking-wider text-[#F2EEE8]">Robson Brito</span>
            <button type="button" onClick={onClose} aria-label="Fechar menu" className="p-3 rounded-full border border-[#F2EEE8]/15 text-[#F2EEE8] hover:border-[#D4B679]">
              <X size={24} />
            </button>
          </div>

          <nav aria-label="Categorias" className="flex flex-col gap-1 sm:gap-2 my-8">
            {navLinks.map((item, index) => (
              <motion.div key={item.to} initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, delay: 0.035 * index }}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  aria-current={location.pathname === item.to ? 'page' : undefined}
                  className={`group flex items-center justify-between w-full font-cormorant text-3xl sm:text-4xl transition-colors py-2 ${location.pathname === item.to ? 'text-[#D4B679]' : 'text-[#F2EEE8] hover:text-[#D4B679]'}`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-[11px] text-[#9A958D] opacity-60">0{index + 1}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="border-t border-[#F2EEE8]/10 pt-5 flex items-center justify-between gap-3 flex-wrap">
            <a href="https://www.instagram.com/byrobsonbrito/" target="_blank" rel="noopener noreferrer"
               className="text-xs uppercase tracking-widest text-[#9A958D] hover:text-[#D4B679] flex items-center gap-1">
              Instagram <ArrowUpRight size={14} />
            </a>
            <span className="text-xs text-[#9A958D]">{contacts.city || 'Atendimento sob consulta'}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
