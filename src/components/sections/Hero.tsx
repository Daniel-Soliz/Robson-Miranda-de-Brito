import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { Silk } from '../reactbits/Silk.tsx';
import { SplitText } from '../reactbits/SplitText.tsx';
import { ShinyText } from '../reactbits/ShinyText.tsx';
import { Magnet } from '../reactbits/Magnet.tsx';
import { StarBorder } from '../reactbits/StarBorder.tsx';
import { SiteContent, ContactSettings } from '../../data/types.ts';

interface HeroProps {
  content: SiteContent;
  contacts: ContactSettings;
}

export const Hero: React.FC<HeroProps> = ({ content, contacts }) => {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 sm:px-12 md:px-16 overflow-hidden select-none bg-[#050506]">
      {/* Background WebGL Silk with deep obsidian black and champagne sheen */}
      <Silk className="z-0" speed={0.45} sheenIntensity={0.42} />

      {/* Subtle radial depth gradient in the center */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle 900px at 50% 40%, rgba(212, 182, 121, 0.05), transparent 75%)',
        }}
      />

      {/* Top Editorial Label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="z-10 flex items-center justify-between w-full max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
          <span className="label-editorial text-[9px] sm:text-[10px] text-[#D4B679]">
            FOTOGRAFIA & NARRATIVAS VISUAIS
          </span>
        </div>
        <span className="text-[10px] text-[#8E8982] font-mono tracking-widest uppercase hidden sm:block">
          {contacts.city || 'Atendimento sob consulta'}
        </span>
      </motion.div>

      {/* Main Hero Typography: clamp(3.5rem, 11vw, 10rem), line-height 0.92, letter-spacing -0.02em */}
      <div className="z-10 my-auto w-full max-w-7xl mx-auto text-left">
        <h1
          className="font-cormorant font-light text-[#FAF7F2]"
          style={{
            fontSize: 'clamp(3.5rem, 11vw, 9.8rem)',
            lineHeight: 0.92,
            letterSpacing: '-0.025em',
          }}
        >
          <SplitText text="Momentos que o" delay={0.2} duration={0.8} />{' '}
          <ShinyText text="tempo" className="font-light" />
          <br />
          <SplitText text="não leva" delay={0.5} duration={0.8} />
        </h1>

        {/* Subtitle with fade */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-base sm:text-lg md:text-xl text-[#8E8982] max-w-2xl font-inter font-light leading-relaxed"
        >
          {content.heroSubtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-12 flex flex-wrap items-center gap-5"
        >
          {/* CTA 1: Solicitar orçamento (Magnet + StarBorder) */}
          <Magnet strength={0.22}>
            <StarBorder
              as="button"
              onClick={() => handleScrollTo('contato')}
              color="#D4B679"
              speed="3.5s"
              className="focus:outline-none"
            >
              <span className="px-8 py-3.5 block font-inter text-xs uppercase tracking-[0.22em] font-medium text-[#FAF7F2] hover:text-[#D4B679] transition-colors">
                Solicitar orçamento
              </span>
            </StarBorder>
          </Magnet>

          {/* CTA 2: Agendar sessão */}
          <button
            onClick={() => handleScrollTo('agenda')}
            className="px-8 py-3.5 rounded-[2px] border border-[rgba(242,238,232,0.12)] bg-[#08080A]/60 backdrop-blur-sm text-[#FAF7F2] font-inter text-xs uppercase tracking-[0.22em] hover:border-[#D4B679] hover:text-[#D4B679] transition-all cursor-pointer"
          >
            Agendar sessão
          </button>
        </motion.div>
      </div>

      {/* Bottom Row: Scroll to explore indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="z-10 flex items-center justify-between w-full max-w-7xl mx-auto pt-6 border-t border-[rgba(242,238,232,0.06)]"
      >
        <button
          onClick={() => handleScrollTo('portfolio')}
          className="group flex items-center gap-3 text-[#8E8982] hover:text-[#D4B679] transition-colors cursor-pointer"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] font-inter">
            Role para explorar
          </span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
        </button>

        <div className="flex items-center gap-4 text-[10px] text-[#8E8982] font-mono tracking-widest uppercase">
          <span>[ 01 / 06 ]</span>
          <span className="hidden sm:inline opacity-40">•</span>
          <span className="hidden sm:inline">@byrobsonbrito</span>
        </div>
      </motion.div>
    </section>
  );
};
