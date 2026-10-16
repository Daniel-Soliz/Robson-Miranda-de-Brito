import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Photo } from '../../data/types.ts';

interface StackProps {
  photos: Photo[];
  onSelectPhoto?: (photo: Photo) => void;
  className?: string;
}

export const Stack: React.FC<StackProps> = ({
  photos,
  onSelectPhoto,
  className = '',
}) => {
  const [items, setItems] = useState<Photo[]>(() => photos.slice(0, 5));

  React.useEffect(() => {
    if (photos.length > 0) {
      setItems(photos.slice(0, 5));
    }
  }, [photos]);

  const handleNext = () => {
    setItems(prev => {
      if (prev.length <= 1) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  if (!items.length) return null;

  return (
    <div className={`relative w-[280px] sm:w-[320px] md:w-[380px] h-[400px] sm:h-[460px] md:h-[520px] flex items-center justify-center select-none ${className}`}>
      {items.map((photo, index) => {
        // index 0 is top
        const isTop = index === 0;
        const rotations = [0, -3, 3, -5, 5];
        const rot = rotations[index % rotations.length];
        const offsetY = index * 12;
        const scale = 1 - index * 0.04;
        const zIndex = items.length - index;

        return (
          <motion.div
            key={photo.id}
            layout
            onClick={() => {
              if (isTop) {
                handleNext();
                onSelectPhoto?.(photo);
              } else {
                handleNext();
              }
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale,
              y: offsetY,
              rotateZ: rot,
              opacity: index > 3 ? 0 : 1 - index * 0.15,
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 24,
            }}
            style={{ zIndex }}
            className="absolute inset-0 cursor-pointer group"
          >
            <div className="w-full h-full bg-[#131315] rounded-[2px] overflow-hidden border border-[rgba(242,238,232,0.12)] shadow-2xl relative">
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-5 right-5 pointer-events-none">
                <span className="label-editorial text-[9px] block mb-0.5">
                  {photo.category}
                </span>
                <p className="font-cormorant text-lg text-[#F2EEE8] italic line-clamp-1">
                  {photo.caption}
                </p>
              </div>

              {isTop && (
                <div className="absolute top-4 right-4 bg-[#0B0B0C]/75 backdrop-blur-md px-3 py-1 rounded-full border border-[rgba(200,169,106,0.3)]">
                  <span className="text-[10px] tracking-widest text-[#C8A96A] uppercase font-inter">
                    Toque para alternar
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
