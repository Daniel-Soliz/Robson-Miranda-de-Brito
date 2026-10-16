import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4.5,
  className = '',
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block relative overflow-hidden font-cormorant italic font-light ${className}`}
      style={{
        backgroundImage: disabled
          ? 'none'
          : 'linear-gradient(120deg, #D4B679 0%, #FFF5E3 50%, #D4B679 100%)',
        backgroundSize: '200% auto',
        color: disabled ? '#D4B679' : 'transparent',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        animation: disabled ? 'none' : `champagneShine ${animationDuration} ease-in-out infinite`,
      }}
    >
      {text}
      <style>{`
        @keyframes champagneShine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </span>
  );
};
