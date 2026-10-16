import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, QrCode } from 'lucide-react';
import { ServiceItem } from '../../data/types.ts';

interface PixModalProps {
  service: ServiceItem | null;
  onClose: () => void;
}

export const PixModal: React.FC<PixModalProps> = ({ service, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!service) return null;

  const pixKey = service.pixKey || 'contato@byrobsonbrito.com.br';
  const pixType = service.pixType || 'Chave E-mail';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0B0C]/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#131315] border border-[rgba(242,238,232,0.15)] p-6 sm:p-8 rounded-[2px] shadow-2xl text-left"
        >
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-5 right-5 text-[#9A958D] hover:text-[#F2EEE8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full border border-[rgba(200,169,106,0.3)] bg-[#0B0B0C] flex items-center justify-center text-[#C8A96A]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="label-editorial text-[9px] block">RESERVA DE DATA</span>
              <h3 className="font-cormorant text-2xl text-[#F2EEE8] italic">{service.name}</h3>
            </div>
          </div>

          <p className="text-sm text-[#9A958D] leading-relaxed mb-6 font-inter">
            Para garantir a exclusividade da sua data na agenda, você pode efetuar o sinal de reserva diretamente via Pix. O comprovante pode ser enviado diretamente pelo WhatsApp.
          </p>

          <div className="bg-[#0B0B0C] border border-[rgba(242,238,232,0.1)] p-4 rounded-[2px] mb-6">
            <span className="text-[10px] uppercase tracking-wider text-[#9A958D] block mb-1 font-inter">
              Tipo: {pixType.toUpperCase()}
            </span>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-sm text-[#F2EEE8] truncate select-all">
                {pixKey}
              </span>
              <button
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#C8A96A] text-[#0B0B0C] font-inter text-xs font-medium rounded-[2px] hover:bg-[#d9bc7f] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar chave</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {service.paymentLink && (
            <div className="mb-6">
              <a
                href={service.paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full py-2.5 border border-[rgba(200,169,106,0.4)] text-[#C8A96A] text-xs uppercase tracking-widest font-inter hover:bg-[#C8A96A]/10 transition-colors rounded-[2px]"
              >
                Abrir link de pagamento online
              </a>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={onClose}
              className="text-xs uppercase tracking-widest text-[#9A958D] hover:text-[#F2EEE8] transition-colors font-inter"
            >
              Fechar janela
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
