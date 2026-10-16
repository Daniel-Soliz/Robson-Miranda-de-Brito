import React from 'react';

interface StarBorderProps {
  as?: React.ElementType;
  className?: string;
  color?: string;
  speed?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const StarBorder: React.FC<StarBorderProps> = ({
  as: Component = 'div',
  className = '',
  color = '#D4B679',
  speed = '4s',
  children,
  onClick,
  ...props
}) => {
  return (
    <Component
      onClick={onClick}
      className={`relative inline-block py-[1px] px-[1px] overflow-hidden rounded-[2px] cursor-pointer group select-none ${className}`}
      {...props}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-80 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 12%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="absolute w-[300%] h-[50%] opacity-80 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 12%)`,
          animationDuration: speed,
        }}
      />
      <div className="relative z-1 bg-[#09090B] border border-[rgba(242,238,232,0.1)] text-[#FAF7F2] text-center rounded-[2px] transition-all duration-300 group-hover:border-[rgba(212,182,121,0.5)] group-hover:bg-[#0D0D10]">
        {children}
      </div>

      <style>{`
        @keyframes star-movement-bottom {
          0% { transform: translate(0%, 0%); opacity: 1; }
          100% { transform: translate(-100%, 0%); opacity: 0; }
        }
        @keyframes star-movement-top {
          0% { transform: translate(0%, 0%); opacity: 1; }
          100% { transform: translate(100%, 0%); opacity: 0; }
        }
        .animate-star-movement-bottom {
          animation: star-movement-bottom linear infinite alternate;
        }
        .animate-star-movement-top {
          animation: star-movement-top linear infinite alternate;
        }
      `}</style>
    </Component>
  );
};
