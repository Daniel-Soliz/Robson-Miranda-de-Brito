import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Photo } from '../../data/types.ts';

interface MasonryProps {
  photos: Photo[];
  onSelectPhoto: (photo: Photo) => void;
  className?: string;
}

export const Masonry: React.FC<MasonryProps> = ({
  photos,
  onSelectPhoto,
  className = '',
}) => {
  // Columns distribution: on wide screens, 3 columns; on tablets, 2; mobile, 1 or 2
  // Responsive layout using CSS columns or column buckets
  return (
    <div className={`columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 ${className}`}>
      <AnimatePresence mode="popLayout">
        {photos.map(photo => (
          <motion.div
            key={photo.id}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            className="break-inside-avoid group cursor-pointer"
            onClick={() => onSelectPhoto(photo)}
          >
            <div className="relative overflow-hidden rounded-[2px] border border-[rgba(242,238,232,0.12)] bg-[#131315] shadow-lg transition-all duration-500 hover:border-[rgba(200,169,106,0.4)]">
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                width={photo.width}
                height={photo.height}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-auto object-cover photo-zoom filter brightness-95 group-hover:brightness-105"
                style={{
                  aspectRatio:
                    photo.orientation === 'portrait'
                      ? '3/4'
                      : photo.orientation === 'landscape'
                      ? '3/2'
                      : '1/1',
                }}
              />

              {/* Hover overlay with fine champagne typography */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/90 via-[#0B0B0C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 p-6 flex flex-col justify-end">
                <span className="label-editorial text-[9px] mb-1">
                  {photo.category}
                </span>
                <p className="font-cormorant text-xl text-[#F2EEE8] italic leading-tight">
                  {photo.caption}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A]" />
                  <span className="text-[10px] text-[#9A958D] uppercase tracking-wider font-inter">
                    Expandir fotografia
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
