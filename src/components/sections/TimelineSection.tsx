import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const TimelineSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      num: '01',
      title: 'Contato & Disponibilidade',
      desc: 'Você escolhe o serviço e data pretendida pelo site ou WhatsApp. Analisamos a agenda em até 24h e apresentamos a proposta detalhada.',
    },
    {
      num: '02',
      title: 'Alinhamento & Conceito',
      desc: 'Reunião pessoal ou por videoconferência. Conversamos sobre a história de vocês, referências estéticas, cronograma de luz e detalhes do local.',
    },
    {
      num: '03',
      title: 'Ensaio ou Cobertura',
      desc: 'O dia vivido com liberdade. Uma presença sensível, discreta e atenta, guiando com naturalidade para que a emoção real seja a protagonista.',
    },
    {
      num: '04',
      title: 'Curadoria & Entrega Fine Art',
      desc: 'Tratamento autoral foto a foto. Entrega em galeria online privativa em alta resolução para download, além de caixa em linho ou álbum artesanal.',
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      line.style.height = '100%';
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: true,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section id="como-funciona" className="py-24 sm:py-32 px-5vw bg-[#050506] relative select-none">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
            <span className="label-editorial text-[10px]">EXPERIÊNCIA COMPLETA</span>
            <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
          </div>
          <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl text-[#FAF7F2] font-light">
            Como <span className="italic font-normal text-[#D4B679]">Acontece</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8E8982] font-inter font-light">
            Um processo transparente e cuidadoso desde a primeira mensagem até o álbum em mãos.
          </p>
        </div>

        {/* Timeline Items */}
        <div ref={containerRef} className="relative">
          {/* Animated GSAP Center Line (Desktop) / Left Line (Mobile) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-[rgba(242,238,232,0.06)] -translate-x-1/2">
            <div
              ref={lineRef}
              className="w-full h-full bg-[#D4B679] origin-top will-change-transform"
            />
          </div>

          <div className="space-y-12 sm:space-y-16">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.num}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content Box */}
                  <div
                    className={`w-full md:w-1/2 pl-14 md:pl-0 ${
                      isEven ? 'md:pl-12 text-left' : 'md:pr-12 md:text-right'
                    }`}
                  >
                    <div className="bg-[#0B0B0E] border border-[rgba(242,238,232,0.08)] p-6 sm:p-8 rounded-[2px] transition-all hover:border-[rgba(212,182,121,0.3)] shadow-lg">
                      <span className="font-cormorant text-2xl text-[#D4B679] italic block mb-2">
                        {step.num}
                      </span>
                      <h3 className="font-cormorant text-2xl sm:text-3xl text-[#FAF7F2] font-light mb-3">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#8E8982] leading-relaxed font-inter font-light">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Marker Circle */}
                  <div className="absolute left-6 md:left-1/2 top-6 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#050506] border-2 border-[#D4B679] z-10 shadow-[0_0_12px_rgba(212,182,121,0.4)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
