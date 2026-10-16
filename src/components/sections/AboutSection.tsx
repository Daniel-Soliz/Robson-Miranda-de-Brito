import React from 'react';
import { TiltedCard } from '../reactbits/TiltedCard.tsx';
import { ScrollReveal } from '../reactbits/ScrollReveal.tsx';
import { CountUp } from '../reactbits/CountUp.tsx';
import { SiteContent, ContactSettings } from '../../data/types.ts';

interface AboutSectionProps {
  content: SiteContent;
  contacts: ContactSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ content, contacts }) => {
  return (
    <section id="sobre" className="py-24 sm:py-32 px-5vw relative overflow-hidden bg-[#050506] select-none">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Robson's Photo in TiltedCard (Max 8°) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[380px] aspect-[4/5]">
              <TiltedCard
                imageSrc={content.aboutPhotoUrl}
                altText="Robson Brito — Fotógrafo de Casamento e Retrato"
                captionText="Robson Brito"
                maxTilt={8}
                className="w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
              />
            </div>
          </div>

          {/* First-person text with ScrollReveal */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
              <span className="label-editorial text-[10px]">SOBRE O ARTISTA</span>
            </div>

            <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl text-[#FAF7F2] font-light leading-tight">
              A verdade do instante,{' '}
              <span className="italic font-normal text-[#D4B679]">sem artifícios</span>.
            </h2>

            <div className="space-y-4 text-[#8E8982] text-base sm:text-lg leading-relaxed font-inter font-light">
              {content.aboutTextParagraphs.map((paragraph, idx) => (
                <ScrollReveal key={idx} delay={0.15 * idx}>
                  <p>{paragraph}</p>
                </ScrollReveal>
              ))}
            </div>

            {/* 3 Numbers with CountUp */}
            <div className="pt-8 grid grid-cols-3 gap-6 sm:gap-8 border-t border-[rgba(242,238,232,0.08)]">
              {content.aboutStats.map((stat, idx) => (
                <div key={idx} className="space-y-1 relative">
                  <div className="text-3xl sm:text-4xl md:text-5xl text-[#FAF7F2] font-light font-cormorant">
                    <CountUp to={stat.number} suffix={stat.suffix} duration={2.2} />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-[#8E8982] font-inter uppercase tracking-[0.18em] block">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
