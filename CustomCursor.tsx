import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHoveredPhoto, setIsHoveredPhoto] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || isReducedMotion) {
      setIsTouchDevice(true);
      return;
    }

    setIsTouchDevice(false);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('.photo-zoom') ||
          target.closest('.group') ||
          target.closest('[data-cursor="view"]') ||
          target.tagName === 'IMG')
      ) {
        setIsHoveredPhoto(true);
      } else {
        setIsHoveredPhoto(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center select-none"
      animate={{
        x: position.x,
        y: position.y,
        width: isHoveredPhoto ? 70 : 10,
        height: isHoveredPhoto ? 70 : 10,
        backgroundColor: isHoveredPhoto ? 'rgba(212, 182, 121, 0.94)' : 'rgba(212, 182, 121, 0.7)',
      }}
      transition={{
        type: 'spring',
        stiffness: 480,
        damping: 30,
        mass: 0.08,
      }}
      style={{
        borderRadius: '50%',
        mixBlendMode: isHoveredPhoto ? 'normal' : 'difference',
      }}
    >
      {isHoveredPhoto && (
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono font-bold text-[#050506]">
          VER
        </span>
      )}
    </motion.div>
  );
};
