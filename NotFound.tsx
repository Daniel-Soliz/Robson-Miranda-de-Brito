import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#0B0B0C] text-[#F2EEE8] flex flex-col items-center justify-center p-6 text-center select-none">
      <span className="label-editorial text-xs mb-4">ERRO 404 • PÁGINA NÃO ENCONTRADA</span>
      <h1 className="font-cormorant text-6xl sm:text-8xl text-[#F2EEE8] font-light mb-4">
        O instante <span className="italic font-normal text-[#C8A96A]">desvaneceu</span>.
      </h1>
      <p className="text-sm sm:text-base text-[#9A958D] max-w-md mb-8 font-inter">
        O endereço solicitado não existe ou foi transferido para uma nova locação no portfólio.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[2px] bg-[#C8A96A] text-[#0B0B0C] font-inter text-xs uppercase tracking-widest font-medium hover:bg-[#d9bc7f] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retornar ao Início</span>
      </a>
    </main>
  );
};
