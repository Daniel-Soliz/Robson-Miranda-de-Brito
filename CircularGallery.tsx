import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Photo } from '../../data/types.ts';

interface CircularGalleryProps {
  photos: Photo[];
  onSelectPhoto?: (photo: Photo) => void;
  className?: string;
}

export const CircularGallery: React.FC<CircularGalleryProps> = ({
  photos,
  onSelectPhoto,
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = photos.length;
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentDeltaX = useRef(0);

  const next = useCallback(() => {
    if (total === 0) return;
    setActiveIndex(prev => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (total === 0) return;
    setActiveIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    currentDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    currentDeltaX.current = clientX - startX.current;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (currentDeltaX.current < -50) {
      next();
    } else if (currentDeltaX.current > 50) {
      prev();
    }
    currentDeltaX.current = 0;
  };

  if (total === 0) return null;

  const formattedIndex = String(activeIndex + 1).padStart(2, '0');
  const formattedTotal = String(total).padStart(2, '0');

  return (
    <div
      className={`relative w-full py-12 flex flex-col items-center select-none overflow-hidden ${className}`}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Cylindrical Orbit Container */}
      <div className="relative w-full h-[420px] sm:h-[500px] md:h-[580px] flex items-center justify-center perspective-[1200px]">
        {photos.map((photo, i) => {
          let offset = i - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isVisible = Math.abs(offset) <= 2;
          if (!isVisible) return null;

          const isActive = offset === 0;
          const translateX = offset * 260;
          const translateZ = -Math.abs(offset) * 160;
          const rotateY = offset * -22;
          const opacity = Math.max(0.18, 1 - Math.abs(offset) * 0.42);
          const scale = 1 - Math.abs(offset) * 0.12;

          return (
            <motion.div
              key={photo.id}
              className="absolute cursor-pointer will-change-transform"
              animate={{
                x: translateX,
                z: translateZ,
                rotateY: rotateY,
                opacity: opacity,
                scale: scale,
              }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                transformStyle: 'preserve-3d',
                zIndex: 20 - Math.abs(offset) * 5,
              }}
              onClick={() => {
                if (isActive) {
                  onSelectPhoto?.(photo);
                } else {
                  setActiveIndex(i);
                }
              }}
            >
              <div className="relative group w-[240px] sm:w-[300px] md:w-[360px] aspect-[3/4] bg-[#0A0A0C] rounded-[2px] overflow-hidden border border-[rgba(242,238,232,0.08)] shadow-[0_16px_40px_rgba(0,0,0,0.85)] transition-all duration-500 hover:border-[rgba(212,182,121,0.35)]">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="w-full h-full object-cover photo-zoom filter brightness-95 group-hover:brightness-105"
                />

                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050506]/90 via-transparent to-transparent pointer-events-none" />

                {/* Active hover inspect indicator */}
                {isActive && (
                  <div className="absolute top-4 right-4 bg-[#050506]/85 backdrop-blur-md border border-[rgba(212,182,121,0.3)] text-[#D4B679] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Eye className="w-4 h-4" />
                  </div>
                )}

                {/* Caption on card */}
                <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
                  <span className="label-editorial text-[9px] block mb-1 text-[#D4B679]">
                    {photo.category}
                  </span>
                  <p className="font-cormorant text-[#FAF7F2] text-lg sm:text-xl line-clamp-1 italic font-light">
                    {photo.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Gallery Bottom Controls & Modern Mono Counter */}
      <div className="mt-8 flex items-center justify-between w-full max-w-md px-6 z-30">
        <button
          onClick={prev}
          aria-label="Foto anterior"
          className="p-3 rounded-full bg-[#0A0A0C]/80 border border-[rgba(242,238,232,0.1)] text-[#FAF7F2] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors cursor-pointer backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <div className="font-mono text-xs tracking-[0.25em] text-[#D4B679] font-medium">
            <span>{formattedIndex}</span>
            <span className="text-[#8E8982] mx-2 opacity-40">/</span>
            <span className="text-[#8E8982]">{formattedTotal}</span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#8E8982] mt-1 font-inter">
            Arraste ou navegue
          </span>
        </div>

        <button
          onClick={next}
          aria-label="Próxima foto"
          className="p-3 rounded-full bg-[#0A0A0C]/80 border border-[rgba(242,238,232,0.1)] text-[#FAF7F2] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors cursor-pointer backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
