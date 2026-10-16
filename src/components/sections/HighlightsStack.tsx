import React from 'react';
import { Stack } from '../reactbits/Stack.tsx';
import { Photo } from '../../data/types.ts';
import { ArrowRight } from 'lucide-react';

interface HighlightsStackProps {
  photos: Photo[];
  onSelectPhoto: (photo: Photo) => void;
}

export const HighlightsStack: React.FC<HighlightsStackProps> = ({
  photos,
  onSelectPhoto,
}) => {
  const stackPhotos = photos
    .filter(p => p.orientation === 'portrait')
    .slice(0, 5);

  const fallbackPhotos = stackPhotos.length >= 3 ? stackPhotos : photos.slice(0, 5);

  return (
    <section className="py-24 sm:py-32 px-5vw bg-[#08080A] border-y border-[rgba(242,238,232,0.06)] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Editorial Philosophy Copy */}
        <div className="lg:col-span-7 text-left space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
            <span className="label-editorial text-[10px]">FILOSOFIA & ESTILO</span>
          </div>

          <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl text-[#FAF7F2] font-light leading-tight">
            A luz natural como cúmplice, a{' '}
            <span className="italic font-normal text-[#D4B679]">espontaneidade</span> como essência.
          </h2>

          <div className="space-y-4 text-[#8E8982] text-sm sm:text-base leading-relaxed font-inter font-light">
            <p>
              Não acredito em poses rígidas ou sorrisos encomendados. As memórias mais viscerais nascem nos intervalos: o sussurro no ouvido antes de entrar na igreja, o alívio compartilhado após os votos, a gargalhada despretensiosa com amigos de infância.
            </p>
            <p>
              Minha presença é atenta e silenciosa. Deixo que a história aconteça no ritmo natural de vocês, intervindo apenas quando a luz pede um enquadramento mais poético.
            </p>
          </div>

          <div className="pt-4 flex items-center gap-6">
            <a
              href="#sobre"
              className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#D4B679] hover:text-[#FAF7F2] transition-colors font-inter"
            >
              <span>Conhecer a trajetória</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Right 5-Photo Interactive Stack */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <Stack photos={fallbackPhotos} onSelectPhoto={onSelectPhoto} />
        </div>
      </div>
    </section>
  );
};
