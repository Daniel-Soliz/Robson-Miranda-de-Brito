import type { Booking, ScheduleSettings } from '../data/types.ts';

/**
 * Normalizes phone numbers to digits only, prefixing with 55 if Brazilian standard 10 or 11 digits without country code.
 */
export function normalizePhoneNumber(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return digits;
}

/**
 * Formats a YYYY-MM-DD date to PT-BR display format: "DD de Mês de YYYY" or "DD/MM/YYYY"
 */
export function formatDatePTBR(dateStr: string, format: 'short' | 'long' = 'short'): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const date = new Date(year, month, day);

  if (isNaN(date.getTime())) return dateStr;

  if (format === 'short') {
    const dd = String(day).padStart(2, '0');
    const mm = String(month + 1).padStart(2, '0');
    return `${dd}/${mm}/${year}`;
  }

  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  return `${day} de ${months[month]} de ${year}`;
}

/**
 * Returns the ISO string YYYY-MM-DD for a Date instance using local day
 */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Determines whether a date (YYYY-MM-DD) is available for booking according to:
 * 1. advance notice rules
 * 2. maximum advance days
 * 3. blocked dates list
 * 4. workingDays settings
 */
export function isDateAvailable(
  dateStr: string,
  settings: ScheduleSettings,
  now: Date = new Date()
): { available: boolean; reason?: 'past' | 'too_soon' | 'too_far' | 'blocked' | 'day_disabled' } {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return { available: false, reason: 'past' };
  const target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  
  // Clean today
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { available: false, reason: 'past' };
  }
  if (diffDays < settings.advanceNoticeDays) {
    return { available: false, reason: 'too_soon' };
  }
  if (diffDays > settings.maxAdvanceDays) {
    return { available: false, reason: 'too_far' };
  }
  if (settings.blockedDates && settings.blockedDates.includes(dateStr)) {
    return { available: false, reason: 'blocked' };
  }

  const dayOfWeek = target.getDay(); // 0 is Sunday
  const dayConfig = settings.workingDays.find(d => d.dayOfWeek === dayOfWeek);
  if (!dayConfig || !dayConfig.enabled) {
    return { available: false, reason: 'day_disabled' };
  }

  return { available: true };
}

/**
 * Gets list of free slots for a date by filtering out booked slots (pendente or confirmado)
 */
export function getAvailableSlots(
  dateStr: string,
  settings: ScheduleSettings,
  bookings: Booking[]
): string[] {
  const dateCheck = isDateAvailable(dateStr, settings);
  if (!dateCheck.available) {
    return [];
  }

  const activeBookings = bookings.filter(b => 
    b.date === dateStr && (b.status === 'pendente' || b.status === 'confirmado')
  );
  const bookedSlots = new Set(activeBookings.map(b => b.timeSlot));

  return (settings.defaultSlots || []).filter(slot => !bookedSlots.has(slot));
}

/**
 * Creates the client-to-photographer WhatsApp message link
 */
export function generateClientWhatsAppUrl(params: {
  phone: string;
  clientName: string;
  clientWhatsApp: string;
  clientEmail: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  locationCity: string;
  message?: string;
}): string {
  const cleanPhone = normalizePhoneNumber(params.phone);
  const formattedDate = formatDatePTBR(params.date, 'long');

  const textLines = [
    `Olá, Robson! Gostaria de agendar uma sessão com você.`,
    ``,
    `*Detalhes do Pedido:*`,
    `• *Serviço:* ${params.serviceName}`,
    `• *Data:* ${formattedDate}`,
    `• *Horário pretendido:* ${params.timeSlot}`,
    `• *Cidade/Local:* ${params.locationCity}`,
    ``,
    `*Meus Dados:*`,
    `• *Nome:* ${params.clientName}`,
    `• *WhatsApp:* ${params.clientWhatsApp}`,
    `• *E-mail:* ${params.clientEmail}`,
  ];

  if (params.message && params.message.trim().length > 0) {
    textLines.push(`• *Mensagem:* ${params.message.trim()}`);
  }

  textLines.push(``, `Vi o seu portfólio no site e aguardo sua confirmação.`);

  const messageText = textLines.join('\n');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
}

/**
 * Creates admin WhatsApp response link to confirm or decline a booking
 */
export function generateAdminWhatsAppResponseUrl(params: {
  clientPhone: string;
  clientName: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  action: 'confirm' | 'decline';
  photographerName?: string;
}): string {
  const cleanPhone = normalizePhoneNumber(params.clientPhone);
  const formattedDate = formatDatePTBR(params.date, 'long');
  const name = params.photographerName || 'Robson Brito';

  let message = '';
  if (params.action === 'confirm') {
    message = `Olá, ${params.clientName}! Aqui é o ${name}.\n\n` +
      `Excelente notícia! O seu agendamento para *${params.serviceName}* no dia *${formattedDate}* às *${params.timeSlot}* está *CONFIRMADO*!\n\n` +
      `Estou muito feliz em registrar esse momento. Em breve entrarei em contato com mais detalhes e alinhamentos para o nosso dia. Qualquer dúvida, estou por aqui!`;
  } else {
    message = `Olá, ${params.clientName}! Aqui é o ${name}.\n\n` +
      `Agradeço muito pelo seu interesse em meu trabalho para a sessão de *${params.serviceName}* no dia *${formattedDate}*.\n\n` +
      `Infelizmente este horário específico não está mais disponível ou tive um imprevisto na agenda. Podemos verificar uma nova data que fique ótima para você?`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
