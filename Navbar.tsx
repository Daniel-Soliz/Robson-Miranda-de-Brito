import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, ArrowRight } from 'lucide-react';
import { ContactSettings } from '../../data/types.ts';
import { StaggeredMenu } from './StaggeredMenu.tsx';

interface NavbarProps {
  contacts: ContactSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ contacts }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { label: 'Portfólio', href: '#portfolio' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Agenda', href: '#agenda' },
    { label: 'Contato', href: '#contato' },
  ];

  return (
    <>
      {/* Desktop Floating Pill Navbar */}
      <AnimatePresence>
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-5 left-0 right-0 z-40 px-4 sm:px-8 flex justify-center pointer-events-none select-none"
        >
          <div className="pointer-events-auto flex items-center justify-between gap-6 px-6 py-2.5 rounded-full bg-[#08080A]/90 backdrop-blur-xl border border-[rgba(242,238,232,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.6)] w-full max-w-4xl transition-all duration-300 hover:border-[rgba(212,182,121,0.25)]">
            {/* Logo Monogram */}
            <a
              href="#"
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <span className="font-cormorant text-xl sm:text-2xl font-light text-[#FAF7F2] tracking-wider group-hover:text-[#D4B679] transition-colors">
                Robson Brito
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4B679] opacity-75 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link, idx) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-inter text-[11px] uppercase tracking-[0.22em] text-[#8E8982] hover:text-[#FAF7F2] transition-colors relative py-1"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop Right CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <a
                href="#agenda"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E0E12] border border-[rgba(212,182,121,0.3)] text-[#D4B679] font-inter text-[11px] tracking-[0.18em] uppercase hover:border-[#D4B679] hover:bg-[#D4B679]/10 transition-all cursor-pointer"
              >
                <span>Agendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Abrir menu"
                className="md:hidden p-2 rounded-full text-[#FAF7F2] hover:text-[#D4B679] transition-colors focus:outline-none"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.header>
      </AnimatePresence>

      {/* Mobile Staggered Menu */}
      <StaggeredMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        contacts={contacts}
      />
    </>
  );
};
