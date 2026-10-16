import {
  Photo,
  Category,
  ServiceItem,
  Testimonial,
  ContactSettings,
  ScheduleSettings,
  SiteContent,
} from '../data/types.ts';

/**
 * Editorial fallback generator for offline or network issues.
 * Generates an SVG with obsidian background, champagne wireframe and elegant typography.
 */
export function createEditorialFallback(
  width: number,
  height: number,
  label: string,
  tone: 'dark' | 'warm' | 'cool' = 'dark'
): string {
  const bg = tone === 'warm' ? '#0E0D0C' : tone === 'cool' ? '#0A0B0E' : '#08080A';
  const accent = '#C8A96A';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${bg}"/>
    <g opacity="0.06" stroke="#FAF7F2" stroke-width="1">
      <line x1="0" y1="0" x2="${width}" y2="${height}"/>
      <line x1="${width}" y1="0" x2="0" y2="${height}"/>
      <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) * 0.28}" fill="none"/>
    </g>
    <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="${accent}" stroke-width="1" stroke-opacity="0.2" />
    <g font-family="serif" font-size="14" fill="#FAF7F2" letter-spacing="4" text-anchor="middle">
      <text x="${width / 2}" y="${height / 2 - 10}" font-size="12" fill="${accent}" opacity="0.8">ROBSON BRITO</text>
      <text x="${width / 2}" y="${height / 2 + 18}" font-size="11" opacity="0.5">${label.toUpperCase()}</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-eventos', name: 'Eventos & Festas', slug: 'eventos', order: 1 },
  { id: 'cat-infantil', name: 'Infantil', slug: 'infantil', order: 2 },
  { id: 'cat-retratos', name: 'Retratos', slug: 'retratos', order: 3 },
  { id: 'cat-viagens', name: 'Viagens', slug: 'viagens', order: 4 },
];

/** Fotografias reais enviadas para a prévia de Robson Brito; arquivos estáticos do GitHub Pages. */
export const DEFAULT_PHOTOS: Photo[] = [
  {
    id: 'portfolio-real-1',
    src: `${import.meta.env.BASE_URL}portfolio/paisagem.png`,
    thumb: `${import.meta.env.BASE_URL}portfolio/paisagem.png`,
    alt: "Paisagem de montanha histórica cercada por água, sob céu azul",
    caption: "Paisagens e histórias pelo mundo",
    category: 'viagens',
    featured: true,
    visible: true,
    order: 1,
    orientation: 'portrait',
    width: 330,
    height: 444,
    createdAt: 1760648400000,
  },
  {
    id: 'portfolio-real-2',
    src: `${import.meta.env.BASE_URL}portfolio/vestido-azul.png`,
    thumb: `${import.meta.env.BASE_URL}portfolio/vestido-azul.png`,
    alt: "Jovem em vestido azul de festa, sentada em poltrona decorada",
    caption: "Retrato de debutante",
    category: 'retratos',
    featured: true,
    visible: true,
    order: 2,
    orientation: 'portrait',
    width: 332,
    height: 440,
    createdAt: 1760648400000,
  },
  {
    id: 'portfolio-real-3',
    src: `${import.meta.env.BASE_URL}portfolio/crianca-familia.png`,
    thumb: `${import.meta.env.BASE_URL}portfolio/crianca-familia.png`,
    alt: "Criança sorrindo durante encontro com familiares",
    caption: "Sorrisos em família",
    category: 'infantil',
    featured: true,
    visible: true,
    order: 3,
    orientation: 'portrait',
    width: 332,
    height: 440,
    createdAt: 1760648400000,
  },
  {
    id: 'portfolio-real-4',
    src: `${import.meta.env.BASE_URL}portfolio/atleta.png`,
    thumb: `${import.meta.env.BASE_URL}portfolio/atleta.png`,
    alt: "Retrato de atleta em ambiente de treino",
    caption: "Força e personalidade",
    category: 'retratos',
    featured: true,
    visible: true,
    order: 4,
    orientation: 'portrait',
    width: 328,
    height: 442,
    createdAt: 1760648400000,
  },
  {
    id: 'portfolio-real-5',
    src: `${import.meta.env.BASE_URL}portfolio/pintura-facial.png`,
    thumb: `${import.meta.env.BASE_URL}portfolio/pintura-facial.png`,
    alt: "Pintura facial em criança durante comemoração",
    caption: "Cores da infância",
    category: 'infantil',
    featured: true,
    visible: true,
    order: 5,
    orientation: 'portrait',
    width: 330,
    height: 438,
    createdAt: 1760648400000,
  },
  {
    id: 'portfolio-real-6',
    src: `${import.meta.env.BASE_URL}portfolio/festa-selfie.png`,
    thumb: `${import.meta.env.BASE_URL}portfolio/festa-selfie.png`,
    alt: "Convidados registrando selfie em festa com balões",
    caption: "Momentos de celebração",
    category: 'eventos',
    featured: true,
    visible: true,
    order: 6,
    orientation: 'portrait',
    width: 334,
    height: 444,
    createdAt: 1760648400000,
  },
  {
    id: 'portfolio-real-7',
    src: `${import.meta.env.BASE_URL}portfolio/mae-crianca.png`,
    thumb: `${import.meta.env.BASE_URL}portfolio/mae-crianca.png`,
    alt: "Mulher de vestido vermelho segurando uma criança durante festa",
    caption: "Afeto em cada detalhe",
    category: 'eventos',
    featured: true,
    visible: true,
    order: 7,
    orientation: 'portrait',
    width: 332,
    height: 444,
    createdAt: 1760648400000,
  },
  {
    id: 'portfolio-real-8',
    src: `${import.meta.env.BASE_URL}portfolio/familia-bolo.png`,
    thumb: `${import.meta.env.BASE_URL}portfolio/familia-bolo.png`,
    alt: "Família reunida em torno de bolo de aniversário infantil",
    caption: "Memórias de aniversário",
    category: 'eventos',
    featured: true,
    visible: true,
    order: 8,
    orientation: 'portrait',
    width: 336,
    height: 444,
    createdAt: 1760648400000,
  },
  {
    id: 'portfolio-real-9',
    src: `${import.meta.env.BASE_URL}portfolio/robson-retrato.png`,
    thumb: `${import.meta.env.BASE_URL}portfolio/robson-retrato.png`,
    alt: "Retrato em preto e branco de Robson Brito segurando câmera fotográfica",
    caption: "Robson Brito — o fotógrafo",
    category: 'retratos',
    featured: true,
    visible: true,
    order: 9,
    orientation: 'portrait',
    width: 330,
    height: 440,
    createdAt: 1760648400000,
  },
  {
    id: 'portfolio-real-10',
    src: `${import.meta.env.BASE_URL}portfolio/robson-paris.png`,
    thumb: `${import.meta.env.BASE_URL}portfolio/robson-paris.png`,
    alt: "Robson e sua esposa em Paris com a Torre Eiffel ao fundo",
    caption: "Robson e sua esposa em Paris",
    category: 'viagens',
    featured: true,
    visible: true,
    order: 10,
    orientation: 'portrait',
    width: 332,
    height: 444,
    createdAt: 1760648400000,
  },
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'serv-casamento',
    name: 'Casamento Completo',
    shortDescription: 'Cobertura documental e sensível do making of até a última música da festa.',
    includedItems: [
      'Robson Brito + 2º fotógrafo sênior dedicado',
      'Cobertura sem limite rígido de horas (making of até a festa)',
      'Sessão pré-wedding completa inclusa',
      'Curadoria e tratamento minucioso com assinatura autoral',
      'Galeria online privada para download em alta e compartilhamento',
      'Caixa artesanal em linho com impressões fine art selecionadas',
    ],
    duration: 'Dia inteiro de cobertura',
    priceText: 'Sob consulta',
    coverImage: `${import.meta.env.BASE_URL}portfolio/familia-bolo.png`,
    paymentLink: '',
    pixKey: '',
    pixType: 'email',
    whatsappMessage: 'Olá Robson, gostaria de conversar sobre a cobertura completa do meu casamento.',
    featured: true,
    order: 1,
    visible: true,
  },
  {
    id: 'serv-pre-wedding',
    name: 'Ensaio Pré-Wedding / Casal',
    shortDescription: 'Uma experiência leve e autêntica de 2 a 3 horas em locação especial para registrar a conexão real de vocês.',
    includedItems: [
      'Direção natural e tranquila (sem poses forçadas)',
      'Assessoria completa para escolha de locação e figurinos',
      'Mínimo de 70 fotografias tratadas individualmente',
      'Entrega em até 10 dias úteis em galeria online privativa',
      'Opção de deslocamento para serra, praia ou fazenda',
    ],
    duration: '2h30 a 3h de ensaio',
    priceText: 'Sob consulta',
    coverImage: `${import.meta.env.BASE_URL}portfolio/vestido-azul.png`,
    paymentLink: '',
    pixKey: '',
    pixType: 'email',
    whatsappMessage: 'Olá Robson, gostaria de agendar nosso ensaio pré-wedding.',
    featured: true,
    order: 2,
    visible: true,
  },
  {
    id: 'serv-editorial',
    name: 'Ensaio Editorial & Retrato',
    shortDescription: 'Retratos com linguagem de moda e estética de revista para profissionais, artistas e projetos autorais.',
    includedItems: [
      'Planejamento de moodboard, conceito visual e styling',
      'Sessão em estúdio intimista ou locação urbana selecionada',
      'Direção precisa de expressão, luz e presença corporal',
      'Tratamento minucioso de pele preservando textura real',
      'Seleção pronta para publicação editorial e redes sociais',
    ],
    duration: '2h de ensaio',
    priceText: 'Sob consulta',
    coverImage: `${import.meta.env.BASE_URL}portfolio/atleta.png`,
    paymentLink: '',
    pixKey: '',
    pixType: 'email',
    whatsappMessage: 'Olá Robson, gostaria de saber mais sobre o ensaio editorial e retrato.',
    featured: true,
    order: 3,
    visible: true,
  },
  {
    id: 'serv-destination',
    name: 'Elopement & Destination Wedding',
    shortDescription: 'Documentação cinematográfica para casamentos a dois ou micro-weddings em qualquer lugar do mundo.',
    includedItems: [
      'Presença dedicada de Robson Brito durante todo o evento',
      'Cobertura documental dos dias de celebração e boas-vindas',
      'Mini sessão fotográfica nos arredores do destino',
      'Assessoria logística completa de locações e melhor luz local',
      'Álbum artesanal fine art de grande formato incluso',
    ],
    duration: '1 a 3 dias de cobertura',
    priceText: 'Sob consulta',
    coverImage: `${import.meta.env.BASE_URL}portfolio/robson-paris.png`,
    paymentLink: '',
    pixKey: '',
    pixType: 'email',
    whatsappMessage: 'Olá Robson, temos interesse em uma cobertura de destination wedding / elopement.',
    featured: true,
    order: 4,
    visible: true,
  },
];

export const DEFAULT_CONTACTS: ContactSettings = {
  id: 'contacts-main',
  whatsapp: '',
  whatsappDisplay: '',
  phone: '',
  email: '',
  instagram: 'byrobsonbrito',
  tiktok: '',
  youtube: '',
  pinterest: '',
  facebook: '',
  address: '',
  city: 'Atendimento e local a combinar',
  googleMapsUrl: '',
  workingHoursText: 'Horários e disponibilidade sob consulta',
  defaultWhatsappMsg: 'Olá Robson! Conheci seu trabalho pelo site e gostaria de conversar sobre uma data especial.',
  bioLinks: [
    { id: 'instagram-oficial', title: 'Instagram @byrobsonbrito', url: 'https://www.instagram.com/byrobsonbrito/', highlight: true, order: 1 },
  ],
};

export const DEFAULT_SCHEDULE_SETTINGS: ScheduleSettings = {
  slotDurationMinutes: 120,
  bufferMinutes: 60,
  advanceNoticeDays: 3,
  maxAdvanceDays: 180,
  workingDays: [
    { dayOfWeek: 0, enabled: false, start: '09:00', end: '18:00' }, // Domingo
    { dayOfWeek: 1, enabled: true, start: '09:00', end: '19:00' },  // Segunda
    { dayOfWeek: 2, enabled: true, start: '09:00', end: '19:00' },  // Terça
    { dayOfWeek: 3, enabled: true, start: '09:00', end: '19:00' },  // Quarta
    { dayOfWeek: 4, enabled: true, start: '09:00', end: '19:00' },  // Quinta
    { dayOfWeek: 5, enabled: true, start: '09:00', end: '19:00' },  // Sexta
    { dayOfWeek: 6, enabled: true, start: '09:00', end: '18:00' },  // Sábado
  ],
  blockedDates: [],
  defaultSlots: ['09:30', '14:00', '16:30'],
};

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    coupleNames: 'Camila & Leonardo',
    eventType: 'Casamento na Fazenda Vila Rica',
    eventDate: 'Novembro de 2025',
    quote: 'O Robson não apenas fotografou nosso casamento; ele capturou a respiração, as lágrimas do meu pai e a alegria desenfreada da pista com uma delicadeza que nenhuma palavra traduz. Olhar para as fotos nos devolve àquele dia com a mesma intensidade.',
    order: 1,
    visible: false,
  },
  {
    id: 't-2',
    coupleNames: 'Beatriz & Rodrigo',
    eventType: 'Destination em Trancoso',
    eventDate: 'Janeiro de 2026',
    quote: 'Nós tínhamos muito receio de ficar travados na frente da câmera. Mas com o Robson tudo fluiu como uma caminhada na praia entre amigos. A luz, os ângulos e o bom gosto dele são de outro patamar.',
    order: 2,
    visible: false,
  },
  {
    id: 't-3',
    coupleNames: 'Fernanda & Guilherme',
    eventType: 'Casamento Intimista na Serra',
    eventDate: 'Agosto de 2025',
    quote: 'Quando o álbum físico chegou em casa, nós choramos de novo. Uma verdadeira obra de arte que nossos futuros filhos vão ter orgulho de folhear. Robson é um artista raro.',
    order: 3,
    visible: false,
  },
];

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTitle: 'Momentos que o',
  heroWordHighlight: 'tempo',
  heroSubtitle: 'Narrativas visuais autênticas para casamentos e ensaios atemporais. A luz natural como cúmplice, a espontaneidade como essência.',
  aboutTextParagraphs: [
    'Acredito na fotografia que não envelhece. Aquela que dispensa artifícios passageiros para se concentrar no que realmente importa: a verdade do gesto, o calor do olhar e a cumplicidade silenciosa que existe entre duas pessoas.',
    'Minha abordagem visual procura unir a sensibilidade do fotojornalismo à elegância da fotografia editorial, valorizando cada história de maneira única.',
    'Para mim, cada casamento e cada ensaio é um projeto único de preservação de memória. Meu compromisso é entregar lembranças que continuem tocando o coração de vocês daqui a cinquenta anos.',
  ],
  aboutPhotoUrl: `${import.meta.env.BASE_URL}portfolio/robson-retrato.png`,
  aboutStats: [],
  siteName: 'Robson Brito',
  tagline: 'Fotografia de Casamentos & Ensaios',
  metaDescription: 'Fotografia autoral e cinematográfica de casamentos e ensaios por Robson Brito. São Paulo, Brasil e Destination.',
};
