import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '../../data/types.ts';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const visibleItems = testimonials.filter(t => t.visible);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (visibleItems.length === 0) return null;

  const current = visibleItems[currentIndex];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % visibleItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + visibleItems.length) % visibleItems.length);
  };

  return (
    <section className="py-24 sm:py-32 px-5vw bg-[#08080A] border-y border-[rgba(242,238,232,0.06)] relative overflow-hidden select-none">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
          <span className="label-editorial text-[10px]">PALAVRAS DE QUEM VIVEU</span>
          <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
        </div>

        <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl text-[#FAF7F2] font-light mb-16">
          Memórias que <span className="italic font-normal text-[#D4B679]">Permanecem</span>
        </h2>

        {/* Testimonial Card Display */}
        <div className="relative min-h-[280px] sm:min-h-[240px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <Quote className="w-10 h-10 text-[#D4B679] opacity-35 mx-auto" />

              <blockquote className="font-cormorant italic text-xl sm:text-2xl md:text-3xl text-[#FAF7F2] leading-relaxed max-w-3xl mx-auto font-light">
                "{current.quote}"
              </blockquote>

              <div className="space-y-1">
                <span className="font-inter text-sm sm:text-base text-[#FAF7F2] font-medium tracking-wide block">
                  {current.coupleNames}
                </span>
                <span className="text-xs text-[#8E8982] font-inter">
                  {current.eventType} {current.eventDate && `• ${current.eventDate}`}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Controls */}
        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            onClick={handlePrev}
            aria-label="Depoimento anterior"
            className="p-3 rounded-full bg-[#0A0A0C] border border-[rgba(242,238,232,0.1)] text-[#FAF7F2] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {visibleItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir para depoimento ${idx + 1}`}
                className={`h-1.5 transition-all rounded-full cursor-pointer ${
                  idx === currentIndex ? 'w-8 bg-[#D4B679]' : 'w-2 bg-[#8E8982]/25'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Próximo depoimento"
            className="p-3 rounded-full bg-[#0A0A0C] border border-[rgba(242,238,232,0.1)] text-[#FAF7F2] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
