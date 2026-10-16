import React, { useRef, useEffect } from 'react';

interface ScrollVelocityProps {
  texts: string[];
  velocity?: number;
  className?: string;
}

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  texts,
  velocity = 1,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const lastScrollY = useRef(0);
  const scrollSpeed = useRef(1);

  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;
      scrollSpeed.current = Math.min(Math.max(delta * 0.15, -4), 4);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const loop = () => {
      offsetRef.current -= (velocity + Math.abs(scrollSpeed.current)) * 0.75;
      scrollSpeed.current *= 0.94;

      if (containerRef.current) {
        const wrapWidth = containerRef.current.scrollWidth / 3;
        if (Math.abs(offsetRef.current) >= wrapWidth) {
          offsetRef.current = 0;
        }
        containerRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, [velocity]);

  const repeated = [...texts, ...texts, ...texts, ...texts, ...texts, ...texts];

  return (
    <div className={`overflow-hidden whitespace-nowrap select-none py-6 border-y border-[rgba(242,238,232,0.06)] bg-[#050506] ${className}`}>
      <div
        ref={containerRef}
        className="inline-flex items-center gap-10 will-change-transform"
      >
        {repeated.map((text, idx) => (
          <span
            key={idx}
            className="font-cormorant italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl stroke-text tracking-wide transition-all duration-300"
          >
            {text}
            <span className="inline-block mx-8 text-lg sm:text-xl text-[#D4B679] opacity-35 font-normal not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};
