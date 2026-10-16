import React from 'react';
import { CircularGallery } from '../reactbits/CircularGallery.tsx';
import { Photo } from '../../data/types.ts';

interface FeaturedGalleryProps {
  photos: Photo[];
  onSelectPhoto: (photo: Photo) => void;
}

export const FeaturedGallery: React.FC<FeaturedGalleryProps> = ({
  photos,
  onSelectPhoto,
}) => {
  const featured = photos.filter(p => p.featured && p.visible);
  const displayPhotos = featured.length > 0 ? featured : photos.slice(0, 8);

  return (
    <section id="portfolio-destaque" className="py-20 sm:py-28 px-5vw text-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto mb-8 text-center">
        <span className="label-editorial text-xs block mb-3">CURADORIA SELECIONADA</span>
        <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl text-[#F2EEE8] font-light">
          O Olhar em <span className="italic font-normal text-[#C8A96A]">Destaque</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[#9A958D] max-w-xl mx-auto font-inter">
          Uma seleção de instantes marcantes onde a sensibilidade encontra a geometria e a emoção autêntica.
        </p>
      </div>

      <CircularGallery photos={displayPhotos} onSelectPhoto={onSelectPhoto} />
    </section>
  );
};
