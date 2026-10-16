export type PhotoOrientation = 'portrait' | 'landscape' | 'square';

export interface Photo {
  id: string;
  src: string;
  thumb: string;
  alt: string;
  caption: string;
  category: string;
  featured: boolean;
  visible: boolean;
  order: number;
  orientation: PhotoOrientation;
  width: number;
  height: number;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  shortDescription: string;
  includedItems: string[];
  duration: string;
  priceText: string; // e.g. "A partir de R$ 3.800" or "Sob consulta"
  coverImage: string;
  paymentLink?: string;
  pixKey?: string;
  pixType?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'aleatoria';
  whatsappMessage?: string;
  featured?: boolean;
  order: number;
  visible: boolean;
}

export type BookingStatus = 'pendente' | 'confirmado' | 'recusado' | 'concluido';

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "14:00"
  clientName: string;
  clientWhatsApp: string;
  clientEmail: string;
  locationCity: string;
  message?: string;
  status: BookingStatus;
  createdAt: number;
  notes?: string;
}

export interface WorkingHours {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  enabled: boolean;
  start: string; // "09:00"
  end: string;   // "18:00"
}

export interface ScheduleSettings {
  slotDurationMinutes: number; // e.g. 120
  bufferMinutes: number;       // e.g. 60
  advanceNoticeDays: number;   // minimum days in advance (e.g. 3)
  maxAdvanceDays: number;      // maximum booking window (e.g. 180)
  workingDays: WorkingHours[];
  blockedDates: string[];      // Array of "YYYY-MM-DD"
  defaultSlots: string[];      // default available slots per active day, e.g. ["09:00", "14:30", "17:00"]
}

export interface SocialLinks {
  whatsapp?: string;     // international format without symbols, e.g. "5511999999999"
  whatsappDisplay?: string; // e.g. "(11) 99999-9999"
  phone?: string;
  email?: string;
  instagram?: string;    // e.g. "byrobsonbrito"
  tiktok?: string;
  youtube?: string;
  pinterest?: string;
  facebook?: string;
  address?: string;
  city?: string;
  googleMapsUrl?: string;
  workingHoursText?: string; // e.g. "Segunda a Sábado, das 09h às 19h"
}

export interface BioLink {
  id: string;
  title: string;
  url: string;
  highlight?: boolean;
  order: number;
}

export interface ContactSettings extends SocialLinks {
  id?: string;
  defaultWhatsappMsg?: string;
  bioLinks?: BioLink[];
}

export interface Testimonial {
  id: string;
  coupleNames: string;
  eventDate: string;
  quote: string;
  eventType: string; // e.g. "Casamento em Ilhabela"
  photoUrl?: string;
  visible: boolean;
  order: number;
}

export interface StatItem {
  number: number;
  suffix?: string;
  label: string;
}

export interface SiteContent {
  heroTitle: string;
  heroWordHighlight: string;
  heroSubtitle: string;
  aboutTextParagraphs: string[];
  aboutPhotoUrl: string;
  aboutStats: StatItem[];
  siteName: string;
  tagline: string;
  metaDescription: string;
}
