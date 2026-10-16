import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Share2, Check } from 'lucide-react';
import { Photo } from '../../data/types.ts';

interface LightboxProps {
  photos: Photo[];
  activePhoto: Photo | null;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  activePhoto,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const currentIndex = photos.findIndex(p => p.id === activePhoto?.id);

  const handleNext = useCallback(() => {
    if (currentIndex === -1 || photos.length === 0) return;
    const nextIndex = (currentIndex + 1) % photos.length;
    // update parent through trigger or custom event
    const event = new CustomEvent('byrobsonbrito_select_photo', {
      detail: { photo: photos[nextIndex] },
    });
    window.dispatchEvent(event);
  }, [currentIndex, photos]);

  const handlePrev = useCallback(() => {
    if (currentIndex === -1 || photos.length === 0) return;
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    const event = new CustomEvent('byrobsonbrito_select_photo', {
      detail: { photo: photos[prevIndex] },
    });
    window.dispatchEvent(event);
  }, [currentIndex, photos]);

  // Preload next image
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < photos.length - 1) {
      const nextImg = new Image();
      nextImg.src = photos[currentIndex + 1].src;
    }
  }, [currentIndex, photos]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activePhoto) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhoto, onClose, handleNext, handlePrev]);

  // Lock background scroll when open
  useEffect(() => {
    if (activePhoto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activePhoto]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    if (diff < -50) {
      handleNext();
    } else if (diff > 50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const handleShare = async () => {
    if (!activePhoto) return;
    const shareData = {
      title: 'Robson Brito Fotografia',
      text: activePhoto.caption,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // fallback
      }
    }
  };

  if (!activePhoto) return null;

  const currentCount = String(currentIndex + 1).padStart(2, '0');
  const totalCount = String(photos.length).padStart(2, '0');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-[#0B0B0C]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between z-10 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="label-editorial text-xs tracking-widest text-[#C8A96A]">
              {activePhoto.category}
            </span>
            <span className="text-[#9A958D] text-xs font-mono">
              {currentCount} / {totalCount}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              aria-label="Compartilhar foto"
              className="p-2.5 rounded-full border border-[rgba(242,238,232,0.15)] text-[#F2EEE8] hover:text-[#C8A96A] hover:border-[#C8A96A] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#C8A96A]" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              aria-label="Fechar galeria"
              className="p-2.5 rounded-full border border-[rgba(242,238,232,0.15)] text-[#F2EEE8] hover:text-[#C8A96A] hover:border-[#C8A96A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Central Display Area with Arrows */}
        <div className="relative flex-1 flex items-center justify-center my-2 max-w-7xl mx-auto w-full">
          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Foto anterior"
            className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-[#131315]/70 border border-[rgba(242,238,232,0.15)] text-[#F2EEE8] hover:text-[#C8A96A] hover:border-[#C8A96A] transition-all cursor-pointer backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Main Image */}
          <div className="relative max-h-[72vh] max-w-[90vw] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={activePhoto.id}
                src={activePhoto.src}
                alt={activePhoto.alt}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85';
                }}
                className="max-h-[72vh] max-w-full object-contain rounded-[2px] shadow-2xl border border-[rgba(242,238,232,0.1)]"
              />
            </AnimatePresence>
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            aria-label="Próxima foto"
            className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-[#131315]/70 border border-[rgba(242,238,232,0.15)] text-[#F2EEE8] hover:text-[#C8A96A] hover:border-[#C8A96A] transition-all cursor-pointer backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Caption */}
        <div className="text-center max-w-2xl mx-auto w-full z-10 py-2">
          <p className="font-cormorant italic text-lg sm:text-2xl text-[#F2EEE8]">
            {activePhoto.caption}
          </p>
          <span className="text-[11px] text-[#9A958D] uppercase tracking-widest mt-1 block font-inter">
            Robson Brito — Fotografia Autoral
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
