import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  ServiceItem,
  Booking,
  ScheduleSettings,
  ContactSettings,
} from '../../data/types.ts';
import {
  isDateAvailable,
  getAvailableSlots,
  generateClientWhatsAppUrl,
  formatDatePTBR,
  toISODate,
} from '../../utils/scheduler.ts';
import { dataService } from '../../lib/storageService.ts';

interface BookingSectionProps {
  services: ServiceItem[];
  bookings: Booking[];
  scheduleSettings: ScheduleSettings;
  contacts: ContactSettings;
  preselectedServiceId?: string;
  onBookingCreated?: (booking: Booking) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  services,
  bookings,
  scheduleSettings,
  contacts,
  preselectedServiceId,
  onBookingCreated,
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || (services[0]?.id || '')
  );
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const [clientName, setClientName] = useState('');
  const [clientWhatsApp, setClientWhatsApp] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [message, setMessage] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);

  React.useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
    }
  }, [preselectedServiceId]);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const daysArray = useMemo(() => {
    const arr: { dayNumber: number; dateStr: string }[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      arr.push({
        dayNumber: i,
        dateStr: toISODate(d),
      });
    }
    return arr;
  }, [year, month, daysInMonth]);

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    return getAvailableSlots(selectedDate, scheduleSettings, bookings);
  }, [selectedDate, scheduleSettings, bookings]);

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleSelectDate = (dateStr: string, isAvail: boolean, isFullyBooked: boolean) => {
    if (!isAvail || isFullyBooked) return;
    setSelectedDate(dateStr);
    setSelectedSlot('');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (honeypot) return;

    if (submissionCount >= 3) {
      setErrorMessage('Limite de tentativas excedido para esta sessão. Por favor, fale direto pelo WhatsApp.');
      return;
    }

    if (!selectedServiceId) {
      setErrorMessage('Por favor, selecione um serviço.');
      return;
    }
    if (!selectedDate) {
      setErrorMessage('Por favor, escolha uma data disponível no calendário.');
      return;
    }
    if (!selectedSlot) {
      setErrorMessage('Por favor, escolha um horário para a sua sessão.');
      return;
    }
    if (!clientName.trim() || !clientWhatsApp.trim() || !clientEmail.trim() || !locationCity.trim()) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (!lgpdConsent) {
      setErrorMessage('É necessário concordar com o aviso de privacidade para prosseguir.');
      return;
    }

    // Nesta prévia, sem WhatsApp oficial e sem backend, não criar reservas reais.
    if (!contacts.whatsapp) {
      const serviceName = services.find(service => service.id === selectedServiceId)?.name || 'Ensaio fotográfico';
      const draft = `Olá, Robson! Gostaria de consultar uma data pelo site de demonstração.\nServiço: ${serviceName}\nData: ${formatDatePTBR(selectedDate)} às ${selectedSlot}\nNome: ${clientName}\nWhatsApp: ${clientWhatsApp}\nE-mail: ${clientEmail}\nLocal: ${locationCity}\nObservações: ${message}`;
      if (navigator.clipboard?.writeText) {
        void navigator.clipboard.writeText(draft).catch(() => window.prompt('Copie a mensagem para enviar no Direct:', draft));
      } else {
        window.prompt('Copie a mensagem para enviar no Direct:', draft);
      }
      window.open('https://www.instagram.com/byrobsonbrito/', '_blank', 'noopener,noreferrer');
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedService = services.find(s => s.id === selectedServiceId);
      const serviceName = selectedService ? selectedService.name : 'Sessão Fotográfica';

      const newBooking: Booking = {
        id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        serviceId: selectedServiceId,
        serviceName,
        date: selectedDate,
        timeSlot: selectedSlot,
        clientName: clientName.trim(),
        clientWhatsApp: clientWhatsApp.trim(),
        clientEmail: clientEmail.trim(),
        locationCity: locationCity.trim(),
        message: message.trim(),
        status: 'pendente',
        createdAt: Date.now(),
      };

      await dataService.createBooking(newBooking);
      onBookingCreated?.(newBooking);
      setSubmissionCount(prev => prev + 1);

      const waUrl = generateClientWhatsAppUrl({
        phone: contacts.whatsapp,
        clientName: newBooking.clientName,
        clientWhatsApp: newBooking.clientWhatsApp,
        clientEmail: newBooking.clientEmail,
        serviceName: newBooking.serviceName,
        date: newBooking.date,
        timeSlot: newBooking.timeSlot,
        locationCity: newBooking.locationCity,
        message: newBooking.message,
      });

      setIsSuccess(true);

      setTimeout(() => {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 700);
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrorMessage('Ocorreu um erro ao registrar o agendamento. Tente novamente ou nos chame no WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServiceName = services.find(s => s.id === selectedServiceId)?.name;

  return (
    <section id="agenda" className="py-24 sm:py-32 px-5vw bg-[#050506] relative select-none">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
            <span className="label-editorial text-[10px]">CONSULTA DE DISPONIBILIDADE</span>
            <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
          </div>
          <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl text-[#FAF7F2] font-light">
            Agende Sua <span className="italic font-normal text-[#D4B679]">Sessão</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8E8982] font-inter font-light">
            Simule sua data e prepare uma mensagem para consulta. A disponibilidade e os serviços precisam ser confirmados diretamente com o fotógrafo.
          </p>
        </div>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-[#0B0B0E] border border-[rgba(212,182,121,0.4)] p-8 sm:p-10 rounded-[2px] text-center space-y-6 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-[#050506] border border-[#D4B679] mx-auto flex items-center justify-center text-[#D4B679]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="label-editorial text-[10px] block">{contacts.whatsapp ? 'PEDIDO PREPARADO' : 'PRÉVIA DE AGENDAMENTO'}</span>

            <h3 className="font-cormorant text-3xl sm:text-4xl text-[#FAF7F2] font-light italic">
              {contacts.whatsapp ? 'Solicitação registrada!' : 'Sua mensagem está pronta!'}
            </h3>

            <p className="text-[#8E8982] text-sm sm:text-base font-inter leading-relaxed">
              Obrigado pelo carinho e interesse no meu olhar, <strong className="text-[#FAF7F2]">{clientName}</strong>. 
              {contacts.whatsapp ? 'O pedido foi preparado para envio pelo WhatsApp. Confirme a mensagem no aplicativo.' : 'Esta é apenas uma simulação. Cole o texto no Direct do Instagram para consultar a disponibilidade com o Robson.'}
            </p>

            <div className="bg-[#050506] border border-[rgba(242,238,232,0.08)] p-4 rounded-[2px] text-left text-xs space-y-1.5 font-inter">
              <div className="text-[#8E8982]">
                <strong className="text-[#FAF7F2]">Serviço:</strong> {selectedServiceName}
              </div>
              <div className="text-[#8E8982]">
                <strong className="text-[#FAF7F2]">Data:</strong> {formatDatePTBR(selectedDate, 'long')} às {selectedSlot}
              </div>
              <div className="text-[#8E8982]">
                <strong className="text-[#FAF7F2]">Local:</strong> {locationCity}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={contacts.whatsapp ? generateClientWhatsAppUrl({
                  phone: contacts.whatsapp,
                  clientName,
                  clientWhatsApp,
                  clientEmail,
                  serviceName: selectedServiceName || '',
                  date: selectedDate,
                  timeSlot: selectedSlot,
                  locationCity,
                  message,
                }) : 'https://www.instagram.com/byrobsonbrito/'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-[#D4B679] text-[#050506] font-inter text-xs uppercase tracking-widest font-medium rounded-[2px] hover:bg-[#e0c793] transition-colors"
              >
                {contacts.whatsapp ? 'Abrir WhatsApp novamente' : 'Abrir Instagram do Robson'}
              </a>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setSelectedDate('');
                  setSelectedSlot('');
                }}
                className="text-xs uppercase tracking-widest text-[#8E8982] hover:text-[#FAF7F2] font-inter cursor-pointer"
              >
                Fazer outro agendamento
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Calendar & Slot Selection */}
            <div className="lg:col-span-7 bg-[#0B0B0E] border border-[rgba(242,238,232,0.08)] p-6 sm:p-8 rounded-[2px] shadow-xl">
              {/* Step 1: Service selector */}
              <div className="mb-8">
                <label className="label-editorial text-[10px] block mb-2">
                  1. SELECIONE A EXPERIÊNCIA
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {services.filter(s => s.visible).map(svc => (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setSelectedServiceId(svc.id)}
                      className={`p-3 text-left rounded-[2px] border transition-all cursor-pointer ${
                        selectedServiceId === svc.id
                          ? 'border-[#D4B679] bg-[#D4B679]/10 text-[#FAF7F2]'
                          : 'border-[rgba(242,238,232,0.07)] bg-[#050506] text-[#8E8982] hover:border-[rgba(212,182,121,0.25)]'
                      }`}
                    >
                      <span className="font-cormorant text-lg text-[#FAF7F2] block leading-tight">
                        {svc.name}
                      </span>
                      <span className="text-[11px] text-[#D4B679] font-mono mt-0.5 block">
                        {svc.priceText}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Monthly Calendar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="label-editorial text-[10px]">
                    2. ESCOLHA O DIA PRETENDIDO
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={prevMonth}
                      aria-label="Mês anterior"
                      className="p-1.5 rounded-full border border-[rgba(242,238,232,0.1)] text-[#FAF7F2] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-cormorant text-xl text-[#FAF7F2] italic min-w-[140px] text-center font-light">
                      {monthNames[month]} {year}
                    </span>
                    <button
                      type="button"
                      onClick={nextMonth}
                      aria-label="Próximo mês"
                      className="p-1.5 rounded-full border border-[rgba(242,238,232,0.1)] text-[#FAF7F2] hover:text-[#D4B679] hover:border-[#D4B679] transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Day of week labels */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-[#8E8982] font-mono mb-2">
                  <span>Dom</span>
                  <span>Seg</span>
                  <span>Ter</span>
                  <span>Qua</span>
                  <span>Qui</span>
                  <span>Sex</span>
                  <span>Sáb</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square opacity-0" />
                  ))}

                  {daysArray.map(({ dayNumber, dateStr }) => {
                    const dateCheck = isDateAvailable(dateStr, scheduleSettings);
                    const isAvailable = dateCheck.available;
                    const activeSlots = getAvailableSlots(dateStr, scheduleSettings, bookings);
                    const isFullyBooked = isAvailable && activeSlots.length === 0;
                    const isSelected = selectedDate === dateStr;

                    let stateClasses = 'text-[#8E8982]/25 border-transparent cursor-not-allowed';
                    if (isAvailable && !isFullyBooked) {
                      stateClasses = isSelected
                        ? 'bg-[#D4B679] text-[#050506] font-semibold border-[#D4B679] shadow-md'
                        : 'bg-[#050506] text-[#FAF7F2] border-[rgba(212,182,121,0.25)] hover:border-[#D4B679] hover:bg-[#D4B679]/10 cursor-pointer';
                    } else if (isFullyBooked) {
                      stateClasses = 'text-[#8E8982]/35 line-through bg-[#050506]/40 border-transparent cursor-not-allowed';
                    }

                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => handleSelectDate(dateStr, isAvailable, isFullyBooked)}
                        disabled={!isAvailable || isFullyBooked}
                        className={`aspect-square rounded-[2px] border text-xs font-mono flex flex-col items-center justify-center transition-all ${stateClasses}`}
                      >
                        <span>{dayNumber}</span>
                        {isAvailable && !isFullyBooked && !isSelected && (
                          <span className="w-1 h-1 rounded-full bg-[#D4B679] mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Calendar legend */}
                <div className="mt-4 pt-3 border-t border-[rgba(242,238,232,0.06)] flex items-center justify-center gap-6 text-[10px] text-[#8E8982] font-inter">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D4B679]" />
                    <span>Disponível</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#8E8982]/25" />
                    <span>Indisponível</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#8E8982]/35 line-through" />
                    <span>Reservado</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Slots Selection */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 pt-6 border-t border-[rgba(242,238,232,0.08)]"
                >
                  <label className="label-editorial text-[10px] block mb-2">
                    3. HORÁRIO DISPONÍVEL EM {formatDatePTBR(selectedDate, 'long').toUpperCase()}
                  </label>

                  {availableSlots.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {availableSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-4 py-2 rounded-[2px] border text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                            selectedSlot === slot
                              ? 'bg-[#D4B679] text-[#050506] border-[#D4B679] font-medium shadow-md'
                              : 'bg-[#050506] text-[#FAF7F2] border-[rgba(242,238,232,0.12)] hover:border-[#D4B679]'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{slot}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#8E8982] italic font-inter">
                      Nenhum horário livre nesta data. Por favor, escolha outro dia no calendário.
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Right Column: Client Information Form */}
            <div className="lg:col-span-5 bg-[#0B0B0E] border border-[rgba(242,238,232,0.08)] p-6 sm:p-8 rounded-[2px] flex flex-col justify-between shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <span className="label-editorial text-[10px] block mb-2">
                  4. DADOS PARA CONFIRMAÇÃO
                </span>

                <div className="hidden" aria-hidden="true">
                  <label>Não preencha este campo</label>
                  <input
                    type="text"
                    value={honeypot}
                    onChange={e => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8E8982] mb-1 font-inter">
                    Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="Ex: Beatriz Albuquerque"
                    className="w-full bg-[#050506] border border-[rgba(242,238,232,0.08)] px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF7F2] rounded-[2px] focus:outline-none focus:border-[#D4B679] font-inter"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8E8982] mb-1 font-inter">
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientWhatsApp}
                      onChange={e => setClientWhatsApp(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-[#050506] border border-[rgba(242,238,232,0.08)] px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF7F2] rounded-[2px] focus:outline-none focus:border-[#D4B679] font-inter"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8E8982] mb-1 font-inter">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={e => setClientEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full bg-[#050506] border border-[rgba(242,238,232,0.08)] px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF7F2] rounded-[2px] focus:outline-none focus:border-[#D4B679] font-inter"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8E8982] mb-1 font-inter">
                    Cidade / Local do Evento *
                  </label>
                  <input
                    type="text"
                    required
                    value={locationCity}
                    onChange={e => setLocationCity(e.target.value)}
                    placeholder="Ex: Fazenda Vila Rica, Itatiba - SP"
                    className="w-full bg-[#050506] border border-[rgba(242,238,232,0.08)] px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF7F2] rounded-[2px] focus:outline-none focus:border-[#D4B679] font-inter"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8E8982] mb-1 font-inter">
                    Mensagem ou detalhes da sua história
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Conte um pouco sobre como vocês se conheceram, ideias para o ensaio ou o que sonham para o casamento..."
                    className="w-full bg-[#050506] border border-[rgba(242,238,232,0.08)] px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF7F2] rounded-[2px] focus:outline-none focus:border-[#D4B679] font-inter resize-none"
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#8E8982] font-inter">
                    <input
                      type="checkbox"
                      checked={lgpdConsent}
                      onChange={e => setLgpdConsent(e.target.checked)}
                      className="mt-0.5 rounded border-[rgba(242,238,232,0.2)] bg-[#050506] text-[#D4B679] focus:ring-0 focus:outline-none"
                    />
                    <span>
                      Concordo com o armazenamento seguro dos meus dados exclusivamente para contato e elaboração do orçamento da sessão (LGPD).
                    </span>
                  </label>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-[2px] flex items-center gap-2 text-xs text-red-200 font-inter">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="p-3 bg-[#050506] border border-[rgba(242,238,232,0.06)] rounded-[2px] text-xs font-inter space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#8E8982]">Data selecionada:</span>
                    <span className="text-[#FAF7F2] font-mono">
                      {selectedDate ? formatDatePTBR(selectedDate, 'short') : 'Não escolhida'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8982]">Horário:</span>
                    <span className="text-[#FAF7F2] font-mono">{selectedSlot || 'Não escolhido'}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#D4B679] text-[#050506] text-xs uppercase tracking-[0.2em] font-medium font-inter rounded-[2px] hover:bg-[#e0c793] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Enviando...' : '{contacts.whatsapp ? 'Enviar pedido & abrir WhatsApp' : 'Preparar pedido & abrir Instagram'}'}</span>
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-[rgba(242,238,232,0.06)] flex items-center justify-center gap-2 text-[11px] text-[#8E8982] font-inter">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4B679]" />
                <span>{contacts.whatsapp ? 'Pedido sujeito à confirmação do fotógrafo' : 'Agenda ilustrativa: nenhuma reserva é realizada nesta prévia'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
