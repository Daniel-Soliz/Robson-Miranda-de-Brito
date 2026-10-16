import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface TiltedCardProps {
  imageSrc: string;
  altText: string;
  captionText?: string;
  className?: string;
  maxTilt?: number;
}

export const TiltedCard: React.FC<TiltedCardProps> = ({
  imageSrc,
  altText,
  captionText = 'Robson Brito',
  className = '',
  maxTilt = 8, // max 8° per requirement
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -maxTilt;
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    setRotateX(tiltX);
    setRotateY(tiltY);

    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.18,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative perspective-[1000px] cursor-pointer select-none ${className}`}
    >
      <motion.div
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 150,
          mass: 0.2,
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="w-full h-full relative rounded-[2px] overflow-hidden border border-[rgba(242,238,232,0.12)] shadow-2xl bg-[#131315]"
      >
        <img
          src={imageSrc}
          alt={altText}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover photo-zoom filter brightness-95"
        />

        {/* Glare sheen */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: glarePosition.opacity,
            background: `radial-gradient(circle 280px at ${glarePosition.x}% ${glarePosition.y}%, rgba(200, 169, 106, 0.4), transparent 80%)`,
          }}
        />

        {/* Minimal caption badge */}
        <div className="absolute bottom-4 left-4 right-4 bg-[#0B0B0C]/80 backdrop-blur-md px-4 py-2 border border-[rgba(242,238,232,0.1)] flex items-center justify-between">
          <span className="font-cormorant italic text-lg text-[#F2EEE8]">{captionText}</span>
          <span className="label-editorial text-[9px]">DIRETOR & FOTÓGRAFO</span>
        </div>
      </motion.div>
    </div>
  );
};
