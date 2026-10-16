import React, { useState } from 'react';
import { SpotlightCard } from '../reactbits/SpotlightCard.tsx';
import { ServiceItem } from '../../data/types.ts';
import { Check, Clock, Calendar, MessageSquare, QrCode } from 'lucide-react';
import { PixModal } from './PixModal.tsx';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForBooking: (serviceId: string) => void;
  onSelectServiceForQuote: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForBooking,
  onSelectServiceForQuote,
}) => {
  const [selectedPixService, setSelectedPixService] = useState<ServiceItem | null>(null);

  const visibleServices = services.filter(s => s.visible);

  return (
    <section id="servicos" className="py-24 sm:py-32 px-5vw bg-[#08080A] border-t border-[rgba(242,238,232,0.06)] relative select-none">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
            <span className="label-editorial text-[10px]">EXPERIÊNCIAS & PACOTES</span>
            <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
          </div>
          <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl text-[#FAF7F2] font-light">
            Serviços <span className="italic font-normal text-[#D4B679]">Autorais</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8E8982] font-inter font-light">
            Cada trabalho é tratado como um projeto artístico singular, com atenção minuciosa aos detalhes e entrega no mais alto padrão fine art.
          </p>
        </div>

        {/* Services Grid with SpotlightCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {visibleServices.map(service => (
            <SpotlightCard key={service.id} className="h-full">
              {/* Cover Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#050506]">
                <img
                  src={service.coverImage}
                  alt={service.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="w-full h-full object-cover photo-zoom filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-transparent to-transparent" />
                
                {/* Price text badge */}
                <div className="absolute top-4 right-4 bg-[#050506]/90 backdrop-blur-md px-3.5 py-1.5 rounded-[2px] border border-[rgba(212,182,121,0.25)] shadow-lg">
                  <span className="font-mono text-xs text-[#D4B679] font-medium tracking-wider">
                    {service.priceText}
                  </span>
                </div>
              </div>

              {/* Service Details */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-[#0C0C0E]">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#8E8982] mb-2 font-inter">
                    <Clock className="w-3.5 h-3.5 text-[#D4B679]" />
                    <span>{service.duration}</span>
                  </div>

                  <h3 className="font-cormorant text-2xl sm:text-3xl text-[#FAF7F2] font-light mb-3">
                    {service.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#8E8982] leading-relaxed mb-6 font-inter font-light">
                    {service.shortDescription}
                  </p>

                  {/* Included Items Checklist */}
                  <div className="space-y-2.5 mb-8">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#8E8982] block font-inter">
                      O que está incluso:
                    </span>
                    <ul className="space-y-2">
                      {service.includedItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#FAF7F2]/85 font-inter">
                          <Check className="w-3.5 h-3.5 text-[#D4B679] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-[rgba(242,238,232,0.07)] space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onSelectServiceForQuote(service.name)}
                      className="w-full py-2.5 px-3 rounded-[2px] border border-[rgba(242,238,232,0.12)] bg-[#070709] text-[#FAF7F2] text-xs uppercase tracking-wider font-inter hover:border-[#D4B679] hover:text-[#D4B679] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Pedir orçamento</span>
                    </button>

                    <button
                      onClick={() => onSelectServiceForBooking(service.id)}
                      className="w-full py-2.5 px-3 rounded-[2px] bg-[#D4B679] text-[#050506] text-xs uppercase tracking-wider font-inter font-medium hover:bg-[#e0c793] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Agendar</span>
                    </button>
                  </div>

                  {/* Optional Pix / Reservation with deposit button */}
                  {(service.pixKey || service.paymentLink) && (
                    <button
                      onClick={() => setSelectedPixService(service)}
                      className="w-full py-2 px-3 rounded-[2px] bg-[#0E0E12] border border-[rgba(212,182,121,0.22)] text-[#D4B679] text-[10px] uppercase tracking-[0.2em] font-inter hover:border-[#D4B679] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Reservar com sinal (Pix / Link)</span>
                    </button>
                  )}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>

      {/* Pix Modal */}
      <PixModal
        service={selectedPixService}
        onClose={() => setSelectedPixService(null)}
      />
    </section>
  );
};
