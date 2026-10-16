import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { ContactSettings } from '../../data/types.ts';
import { normalizePhoneNumber } from '../../utils/scheduler.ts';

interface ContactSectionProps {
  contacts: ContactSettings;
  initialQuoteSubject?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contacts,
  initialQuoteSubject = '',
}) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(initialQuoteSubject);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (initialQuoteSubject) {
      setSubject(`Orçamento: ${initialQuoteSubject}`);
    }
  }, [initialQuoteSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp) return;

    const phone = normalizePhoneNumber(contacts.whatsapp);
    const text = `Olá Robson!\n\n*Solicitação de Orçamento pelo Site*\n• *Nome:* ${name}\n• *WhatsApp:* ${whatsapp}\n• *E-mail:* ${email || 'Não informado'}\n• *Assunto/Serviço:* ${subject || 'Geral'}\n• *Mensagem:* ${message || 'Gostaria de receber a apresentação e valores.'}`;

    if (phone) {
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    } else {
      // No official WhatsApp number was provided. Keep the draft for Instagram Direct.
      if (navigator.clipboard?.writeText) {
        void navigator.clipboard.writeText(text).catch(() => window.prompt('Copie a mensagem para enviar no Direct:', text));
      } else {
        window.prompt('Copie a mensagem para enviar no Direct:', text);
      }
      window.open('https://www.instagram.com/byrobsonbrito/', '_blank', 'noopener,noreferrer');
    }
    setSubmitted(true);
  };

  return (
    <section id="contato" className="py-24 sm:py-32 px-5vw bg-[#08080A] border-t border-[rgba(242,238,232,0.06)] relative select-none">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Contact Details */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
                <span className="label-editorial text-[10px]">CANAL DIRETO</span>
              </div>
              <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl text-[#FAF7F2] font-light leading-tight">
                Vamos Conversar sobre o{' '}
                <span className="italic font-normal text-[#D4B679]">Seu Dia</span>?
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#8E8982] font-inter font-light">
                Seja para tirar dúvidas sobre datas, pacotes para casamentos ou ensaios, respondo pessoalmente a cada mensagem com a máxima atenção.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[rgba(242,238,232,0.08)]">
              {contacts.whatsapp && (
                <a
                  href={`https://wa.me/${contacts.whatsapp}?text=${encodeURIComponent(
                    contacts.defaultWhatsappMsg || 'Olá Robson! Gostaria de conversar sobre uma data.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 group text-[#FAF7F2] hover:text-[#D4B679] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#0C0C0E] flex items-center justify-center text-[#D4B679] group-hover:border-[#D4B679] transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#8E8982] block font-inter">
                      WhatsApp Pessoal
                    </span>
                    <span className="text-sm font-medium font-inter">
                      {contacts.whatsappDisplay || contacts.whatsapp}
                    </span>
                  </div>
                </a>
              )}

              {contacts.phone && (
                <a
                  href={`tel:${contacts.phone}`}
                  className="flex items-center gap-3.5 group text-[#FAF7F2] hover:text-[#D4B679] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#0C0C0E] flex items-center justify-center text-[#D4B679] group-hover:border-[#D4B679] transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#8E8982] block font-inter">
                      Ligar / Telefone
                    </span>
                    <span className="text-sm font-medium font-inter">{contacts.phone}</span>
                  </div>
                </a>
              )}

              {contacts.email && (
                <a
                  href={`mailto:${contacts.email}`}
                  className="flex items-center gap-3.5 group text-[#FAF7F2] hover:text-[#D4B679] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#0C0C0E] flex items-center justify-center text-[#D4B679] group-hover:border-[#D4B679] transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#8E8982] block font-inter">
                      E-mail Direto
                    </span>
                    <span className="text-sm font-medium font-inter">{contacts.email}</span>
                  </div>
                </a>
              )}

              {contacts.city && (
                <div className="flex items-center gap-3.5 text-[#FAF7F2]">
                  <div className="w-10 h-10 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#0C0C0E] flex items-center justify-center text-[#D4B679]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#8E8982] block font-inter">
                      Atendimento & Base
                    </span>
                    <span className="text-sm font-medium font-inter">{contacts.city}</span>
                    {contacts.address && (
                      <span className="text-xs text-[#8E8982] block font-inter">{contacts.address}</span>
                    )}
                  </div>
                </div>
              )}

              {contacts.workingHoursText && (
                <div className="flex items-center gap-3.5 text-[#FAF7F2]">
                  <div className="w-10 h-10 rounded-full border border-[rgba(242,238,232,0.08)] bg-[#0C0C0E] flex items-center justify-center text-[#D4B679]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#8E8982] block font-inter">
                      Horário de Atendimento
                    </span>
                    <span className="text-xs text-[#8E8982] font-inter">
                      {contacts.workingHoursText}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Direct Fast Quote Form */}
          <div className="lg:col-span-7 bg-[#0B0B0E] border border-[rgba(242,238,232,0.08)] p-6 sm:p-10 rounded-[2px] shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#D4B679] mx-auto" />
                <h3 className="font-cormorant text-3xl text-[#FAF7F2] italic">
                  Mensagem preparada!
                </h3>
                <p className="text-sm text-[#8E8982] font-inter max-w-md mx-auto">
                  {contacts.whatsapp ? 'O WhatsApp foi aberto com seu pedido. Confira o envio da mensagem.' : 'A página do Instagram foi aberta. Cole a mensagem no Direct para enviá-la; nenhum pedido é enviado automaticamente nesta prévia.'}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 border border-[rgba(242,238,232,0.12)] text-xs uppercase tracking-widest text-[#FAF7F2] font-inter rounded-[2px] hover:border-[#D4B679]"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <span className="label-editorial text-[10px] block mb-2">
                  SOLICITAÇÃO RÁPIDA DE ORÇAMENTO
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8E8982] mb-1 font-inter">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Nome e Sobrenome"
                      className="w-full bg-[#050506] border border-[rgba(242,238,232,0.08)] px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF7F2] rounded-[2px] focus:outline-none focus:border-[#D4B679] font-inter"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8E8982] mb-1 font-inter">
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-[#050506] border border-[rgba(242,238,232,0.08)] px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF7F2] rounded-[2px] focus:outline-none focus:border-[#D4B679] font-inter"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8E8982] mb-1 font-inter">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full bg-[#050506] border border-[rgba(242,238,232,0.08)] px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF7F2] rounded-[2px] focus:outline-none focus:border-[#D4B679] font-inter"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8E8982] mb-1 font-inter">
                      Interesse / Serviço
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="Casamento Completo, Pré-Wedding..."
                      className="w-full bg-[#050506] border border-[rgba(242,238,232,0.08)] px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF7F2] rounded-[2px] focus:outline-none focus:border-[#D4B679] font-inter"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8E8982] mb-1 font-inter">
                    Conte sobre o evento ou ideia
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Data prevista, local ou cidade, estilo de celebração..."
                    className="w-full bg-[#050506] border border-[rgba(242,238,232,0.08)] px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF7F2] rounded-[2px] focus:outline-none focus:border-[#D4B679] font-inter resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#D4B679] text-[#050506] text-xs uppercase tracking-[0.2em] font-medium font-inter rounded-[2px] hover:bg-[#e0c793] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{contacts.whatsapp ? 'Preparar mensagem via WhatsApp' : 'Preparar mensagem no Instagram'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
