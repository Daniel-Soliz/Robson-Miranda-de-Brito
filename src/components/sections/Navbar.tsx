import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, ArrowRight } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ContactSettings } from '../../data/types.ts';
import { StaggeredMenu } from './StaggeredMenu.tsx';

interface NavbarProps { contacts: ContactSettings; }

const navLinks = [
  { label: 'Portfólio', to: '/portfolio' },
  { label: 'Serviços', to: '/servicos' },
  { label: 'Sobre', to: '/sobre' },
  { label: 'Agenda', to: '/agenda' },
  { label: 'Contato', to: '/contato' },
];

export const Navbar: React.FC<NavbarProps> = ({ contacts }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  useEffect(() => { setIsMobileMenuOpen(false); setIsVisible(true); }, [location.pathname]);

  useEffect(() => {
    let previousY = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      setIsVisible(current < 80 || current < previousY);
      previousY = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: isVisible ? 0 : -110, opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-4 left-0 right-0 z-40 px-3 sm:px-8 flex justify-center pointer-events-none"
        >
          <div className="pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-3 rounded-full bg-[#08080A]/95 backdrop-blur-xl border border-[#F2EEE8]/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] w-full max-w-5xl">
            <Link to="/" aria-label="Robson Brito — início" className="flex items-center gap-2.5 shrink-0 group">
              <span className="font-cormorant text-xl sm:text-2xl font-light text-[#FAF7F2] tracking-wider group-hover:text-[#D4B679] transition-colors">Robson Brito</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4B679]" />
            </Link>

            <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-5 xl:gap-7">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `font-inter text-[10px] uppercase tracking-[0.17em] py-2 transition-colors ${isActive ? 'text-[#D4B679]' : 'text-[#9A958D] hover:text-[#FAF7F2]'}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/agenda"
                className="hidden sm:inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#0E0E12] border border-[#D4B679]/30 text-[#D4B679] font-inter text-[10px] tracking-[0.12em] uppercase hover:border-[#D4B679] transition-all"
              >
                Agendar <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Abrir menu de categorias"
                aria-expanded={isMobileMenuOpen}
                className="lg:hidden p-2.5 rounded-full text-[#FAF7F2] hover:text-[#D4B679] transition-colors"
              >
                <Menu size={21} />
              </button>
            </div>
          </div>
        </motion.header>
      </AnimatePresence>
      <StaggeredMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} contacts={contacts} />
    </>
  );
};
