/**
 * Single source of truth for every piece of text, date and caption on the site.
 * UI components only read from this file — edit content here, never in components.
 *
 * Anything marked `TODO` is a placeholder waiting for the group to confirm it:
 *  - timeline entries with `year: null` render as "Ano por confirmar"
 *  - `members` is empty until the names are added
 *  - `nextLunch.date` / `venue` are null until the lunch is booked
 */

import heroChristmasDinner from "@/assets/hero-christmas-dinner.jpg";
import groupCelebration from "@/assets/group-celebration.jpg";
import tableSetting from "@/assets/table-setting.jpg";

/* ================================================================== */
/* Types                                                               */
/* ================================================================== */

export interface TimelinePhoto {
  src: string;
  alt: string;
  caption: string;
  credit?: string;
}

export interface TimelineEntry {
  /** Stable id, used as React key and anchor (#id). */
  id: string;
  /** Year of the lunch. `null` while the year is still being confirmed. */
  year: number | null;
  title: string;
  venue?: string;
  summary: string;
  /** Longer text shown on the lunch's own page. */
  story?: string;
  photos: TimelinePhoto[];
}

export interface Member {
  id: string;
  name: string;
  /** How the group calls him at the table. */
  nickname?: string;
  /** First lunch attended. */
  since?: number;
  photo?: string;
  note?: string;
}

export interface NextLunch {
  year: number;
  /** ISO date-time in Lisbon time, e.g. "2026-12-12T13:00:00". */
  date: string | null;
  venue: string | null;
  address: string | null;
  /** Google Maps (or similar) link for the venue. */
  mapUrl: string | null;
  notes: string | null;
}

export interface NavItem {
  label: string;
  to: string;
}

export type UploadErrorCode =
  | "not-configured"
  | "not-authenticated"
  | "invalid-type"
  | "too-large"
  | "upload-failed"
  | "list-failed"
  | "rsvp-failed";

/* ================================================================== */
/* Constants                                                           */
/* ================================================================== */

export const FOUNDING_YEAR = 1964;
export const SITE_NAME = "Malta do Restelo";

export const HERO_IMAGE: TimelinePhoto = {
  src: heroChristmasDinner,
  alt: "A Malta do Restelo reunida à volta de duas mesas compridas numa sala de paredes amarelas",
  caption: "A Malta do Restelo à mesa.",
};

/* ================================================================== */
/* Timeline — keep entries in chronological order                      */
/* ================================================================== */

export const timelineEntries: TimelineEntry[] = [
  {
    id: "1964-primeiro-almoco",
    year: FOUNDING_YEAR,
    title: "O Primeiro Almoço",
    summary:
      "Onde tudo começou. Um almoço de Natal entre amigos que viria a repetir-se todos os anos.",
    // TODO: contar a história do primeiro almoço
    story:
      "Em 1964, um grupo de amigos do Restelo sentou-se à mesa por altura do Natal. Ninguém sabia que estava a começar uma tradição.",
    photos: [],
  },
  {
    // TODO: confirmar ano, local e texto
    id: "almoco-em-casa",
    year: null,
    title: "À Mesa em Casa",
    summary: "Marisco, conversa e a luz de fim de tarde a entrar pela janela.",
    photos: [
      {
        src: groupCelebration,
        alt: "Amigos sentados à volta de uma mesa com pratos de marisco, numa sala com cortinados floridos",
        caption: "Almoço em casa, com marisco na mesa.",
      },
    ],
  },
  {
    // TODO: confirmar ano, local e texto
    id: "sala-amarela",
    year: null,
    title: "A Sala Amarela",
    summary: "A mesa cresce: várias gerações à volta da mesma toalha.",
    photos: [
      {
        src: heroChristmasDinner,
        alt: "Grupo grande de várias gerações em duas mesas compridas, numa sala amarela com chão de tijoleira",
        caption: "Duas mesas compridas e várias gerações reunidas.",
      },
    ],
  },
  {
    // TODO: confirmar ano, local e texto
    id: "depois-do-cafe",
    year: null,
    title: "Depois do Café",
    summary: "Os cafés já servidos e a conversa ainda longe do fim.",
    photos: [
      {
        src: tableSetting,
        alt: "Onze amigos à volta de uma mesa quadrada com chávenas de café, sob três candeeiros brancos",
        caption: "Mesa posta, cafés servidos.",
      },
    ],
  },
];

/* ================================================================== */
/* Members — TODO: add one object per member                           */
/* Example: { id: "joao", name: "João …", nickname: "…", since: 1964 }  */
/* ================================================================== */

export const members: Member[] = [];

/* ================================================================== */
/* Next lunch — TODO: fill in when booked                              */
/* ================================================================== */

export const nextLunch: NextLunch = {
  year: 2026,
  date: null,
  venue: null,
  address: null,
  mapUrl: null,
  notes: null,
};

/* ================================================================== */
/* Site copy                                                           */
/* ================================================================== */

export const siteContent = {
  brand: SITE_NAME,
  title: "Crónicas do Almoço de Natal dos Amigos",
  tagline: "Onde as risadas e as histórias se encontram, ano após ano.",
  description:
    "Arquivo digital dos almoços anuais de Natal do grupo Malta do Restelo. Onde as risadas e as histórias se encontram, ano após ano.",

  nav: [
    { label: "Início", to: "/" },
    { label: "Histórico", to: "/historico" },
    { label: "Arquivo", to: "/arquivo" },
    { label: "Fotografias", to: "/fotografias" },
    { label: "Membros", to: "/membros" },
    { label: "Sobre", to: "/sobre" },
    { label: "Próximo Almoço", to: "/proximo-almoco" },
  ] satisfies NavItem[],

  a11y: {
    mainNav: "Navegação principal",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    skipToContent: "Saltar para o conteúdo",
    closeLightbox: "Fechar fotografia",
    previousPhoto: "Fotografia anterior",
    nextPhoto: "Fotografia seguinte",
    openPhoto: (alt: string) => `Abrir fotografia: ${alt}`,
  },

  pageTitles: {
    home: "Crónicas do Almoço de Natal dos Amigos",
    history: "Histórico",
    archive: "Arquivo",
    photos: "Fotografias",
    members: "Membros",
    about: "Sobre",
    nextLunch: "Próximo Almoço",
    lunch: (year: number) => `Almoço de ${year}`,
    auth: "Iniciar sessão",
    notFound: "Página não encontrada",
  },

  hero: {
    cta: "Percorrer a linha do tempo",
    secondaryCta: "Ver o arquivo",
    yearsLabel: (years: number) => `${years} anos à mesma mesa`,
  },

  home: {
    introHeading: "Uma mesa que atravessa gerações",
    introBody:
      "Todos os anos, por altura do Natal, a Malta do Restelo volta a juntar-se. Mudam os restaurantes, mudam as caras à mesa, mas a conversa continua onde ficou no ano anterior.",
    introLink: "A nossa história",
    timelineHeading: "Linha do Tempo",
    timelineIntro: "Os almoços da Malta do Restelo, um ano de cada vez.",
    timelineLink: "Ver o histórico completo",
  },

  timeline: {
    anchorId: "linha-do-tempo",
    unknownYear: "Ano por confirmar",
    viewLunch: "Ver almoço",
    viewLunchYear: (year: number) => `Ver o almoço de ${year}`,
    addPhoto: "Adicionar Nova Fotografia",
    noPhotoYet: "Ainda não há fotografias deste almoço.",
    photoCount: (n: number) => (n === 1 ? "1 fotografia" : `${n} fotografias`),
  },

  history: {
    heading: "Histórico",
    intro: "Cada almoço registado até hoje, por ordem. Os anos que ainda faltam esperam pelas vossas fotografias e histórias.",
  },

  archive: {
    heading: "Arquivo",
    intro: (from: number, to: number) =>
      `Todos os anos de ${from} a ${to}. Os que estão a verde já têm história; os outros estão à espera dela.`,
    allDecades: "Todas",
    decadeLabel: (decade: number) => (decade < 2000 ? `Anos ${String(decade).slice(2)}` : `Anos ${decade}`),
    documented: "Documentado",
    undocumented: "Por documentar",
    documentedCount: (n: number, total: number) => `${n} de ${total} anos documentados`,
    unknownHeading: "Almoços sem ano confirmado",
    unknownIntro: "Sabemos que aconteceram, só falta saber quando. Se se lembra do ano, diga-nos.",
  },

  photos: {
    heading: "Fotografias",
    intro: "Todas as fotografias do arquivo. Clique numa para a ver em grande.",
    filterAll: "Todas",
    memberPhotosHeading: "Fotografias enviadas pela Malta",
    memberPhotosSignedOut: "Inicie sessão para ver as fotografias enviadas pelos membros.",
    empty: "Ainda não há fotografias aqui.",
  },

  members: {
    heading: "Membros",
    intro: "Quem se senta à mesa.",
    since: (year: number) => `À mesa desde ${year}`,
    empty:
      "A lista da Malta está a ser preparada. Em breve, cada nome terá aqui o seu lugar à mesa.",
    groupPhotoCaption: "A Malta reunida na sala amarela.",
  },

  about: {
    heading: "Sobre",
    lead: "Desde 1964, um grupo de amigos do Restelo junta-se à mesa por altura do Natal.",
    // TODO: completar com a história contada pela Malta
    body: [
      "O que começou como um almoço entre amigos tornou-se um compromisso anual. Os restaurantes foram mudando e a mesa foi crescendo: aos amigos de sempre juntaram-se filhos e netos.",
      "Este site guarda essa memória. Cada ano tem o seu lugar, com as fotografias, as histórias e os nomes de quem lá esteve.",
    ],
    pillarsHeading: "O que nos junta",
    pillars: [
      { title: "A mesa", body: "Um almoço por ano, sem falhar. É o ponto fixo à volta do qual tudo o resto acontece." },
      { title: "A conversa", body: "As histórias de sempre, contadas outra vez, e as novas que hão de ser contadas no ano seguinte." },
      { title: "As gerações", body: "Os amigos de 1964 sentam-se hoje ao lado dos filhos e dos netos." },
    ],
    factsHeading: "Em números",
    facts: {
      since: "Primeiro almoço",
      years: "Anos de tradição",
      documented: "Almoços documentados",
      photos: "Fotografias no arquivo",
    },
  },

  nextLunchPage: {
    heading: (year: number) => `Almoço de Natal ${year}`,
    dateTbd: "Data a anunciar",
    dateTbdBody: "A data e o local ainda estão a ser combinados. Assim que estiverem marcados, aparecem aqui.",
    venueTbd: "Local a anunciar",
    countdownUnits: { days: "dias", hours: "horas", minutes: "minutos", seconds: "segundos" },
    happeningNow: "É hoje! Bom almoço.",
    whenLabel: "Quando",
    whereLabel: "Onde",
    openMap: "Abrir no mapa",
    addToCalendar: "Adicionar ao calendário",
    calendarTitle: (year: number) => `Almoço de Natal ${year} — Malta do Restelo`,
    homeBannerHeading: (year: number) => `Almoço de Natal ${year}`,
    homeBannerLink: "Ver detalhes",
  },

  rsvp: {
    heading: "Confirmar presença",
    intro: "Diga-nos se conta estar presente, para a reserva ser feita com o número certo.",
    signInPrompt: "Inicie sessão para confirmar a sua presença.",
    nameLabel: "Nome",
    guestsLabel: "Acompanhantes",
    noteLabel: "Mensagem (opcional)",
    submit: "Confirmar presença",
    update: "Atualizar confirmação",
    cancel: "Cancelar confirmação",
    confirmed: "Presença confirmada",
    cancelled: "Confirmação cancelada",
    yourRsvp: (guests: number) =>
      guests === 0
        ? "Está confirmado."
        : `Está confirmado, com ${guests} ${guests === 1 ? "acompanhante" : "acompanhantes"}.`,
    total: (people: number) => (people === 1 ? "1 pessoa confirmada" : `${people} pessoas confirmadas`),
  },

  lunch: {
    backToArchive: "Voltar ao arquivo",
    previous: "Ano anterior",
    next: "Ano seguinte",
    undocumentedHeading: "Este almoço ainda não foi documentado",
    undocumentedBody:
      "Tem fotografias ou lembra-se de alguma história deste ano? Inicie sessão e adicione-as abaixo.",
    photosHeading: "Fotografias",
    memberPhotosHeading: "Fotografias enviadas pela Malta",
    invalidYear: "Não há almoço para esse ano.",
  },

  upload: {
    anchorId: "contribuir",
    heading: "Adicionar fotografias ao arquivo",
    intro: "Tem fotografias de um almoço? Arraste-as para aqui para ficarem guardadas no arquivo da Malta.",
    yearLabel: "Ano do almoço",
    unknownYearOption: "Ano por confirmar",
    dropTitle: "Arraste fotografias para aqui",
    dropActive: "Largue para carregar",
    dropHint: "ou clique para escolher. JPG, PNG, WEBP ou HEIC, até 15 MB cada.",
    signInPrompt: "Inicie sessão para adicionar fotografias.",
    signInCta: "Iniciar sessão",
    signOut: "Terminar sessão",
    signedInAs: (email: string) => `Sessão iniciada como ${email}`,
    statusUploading: "A carregar…",
    statusDone: "Carregada",
    statusError: "Erro",
    galleryHeading: (year: string) => `Fotografias de ${year}`,
    galleryEmpty: "Ainda não há fotografias para este ano.",
    errors: {
      "not-configured": "O arquivo ainda não está ligado ao Supabase.",
      "not-authenticated": "É preciso iniciar sessão para continuar.",
      "invalid-type": "Formato não suportado. Use JPG, PNG, WEBP ou HEIC.",
      "too-large": "Ficheiro demasiado grande. O máximo é 15 MB.",
      "upload-failed": "A fotografia não foi carregada. Tente outra vez.",
      "list-failed": "Não foi possível obter as fotografias. Recarregue a página.",
      "rsvp-failed": "A confirmação não foi guardada. Tente outra vez.",
    } satisfies Record<UploadErrorCode, string>,
  },

  auth: {
    heading: "Iniciar sessão",
    intro: "A área de membros serve para adicionar fotografias e confirmar presença nos almoços.",
    tabMagic: "Ligação por email",
    tabPassword: "Palavra-passe",
    emailLabel: "Email",
    passwordLabel: "Palavra-passe",
    sendLink: "Enviar ligação",
    signIn: "Iniciar sessão",
    linkSent: (email: string) => `Enviámos uma ligação para ${email}. Abra-a neste dispositivo para entrar.`,
    invalidCredentials: "Email ou palavra-passe errados.",
    linkFailed: "A ligação não foi enviada. Confirme que este email pertence a um membro.",
    membersOnly: "Só membros da Malta têm acesso. Se ainda não tem conta, peça a quem gere o site.",
    alreadySignedIn: (email: string) => `Já tem sessão iniciada como ${email}.`,
    continue: "Continuar",
  },

  notFound: {
    heading: "Esta mesa não existe",
    body: "A página que procura não está no arquivo. Talvez a ligação esteja errada ou a página tenha mudado de lugar.",
    cta: "Voltar ao início",
  },

  footer: {
    line: `Almoço de Natal da Malta do Restelo, desde ${FOUNDING_YEAR}`,
  },
} as const;

/* ================================================================== */
/* Helpers                                                             */
/* ================================================================== */

export const currentYear = (now: Date = new Date()): number => now.getFullYear();

/** Label shown for an entry's year. */
export const formatEntryYear = (year: number | null): string =>
  year === null ? siteContent.timeline.unknownYear : String(year);

/** Years selectable in forms, newest first: current year back to 1964. */
export const getSelectableYears = (now: Date = new Date()): number[] => {
  const years: number[] = [];
  for (let y = currentYear(now); y >= FOUNDING_YEAR; y -= 1) years.push(y);
  return years;
};

/** Every year of the tradition, oldest first. */
export const getAllYears = (now: Date = new Date()): number[] =>
  getSelectableYears(now).slice().reverse();

export const yearsOfTradition = (now: Date = new Date()): number => currentYear(now) - FOUNDING_YEAR;

export const isValidLunchYear = (year: number, now: Date = new Date()): boolean =>
  Number.isInteger(year) && year >= FOUNDING_YEAR && year <= currentYear(now) + 1;

export const getEntryByYear = (year: number): TimelineEntry | undefined =>
  timelineEntries.find((e) => e.year === year);

export const datedEntries = (): TimelineEntry[] => timelineEntries.filter((e) => e.year !== null);
export const undatedEntries = (): TimelineEntry[] => timelineEntries.filter((e) => e.year === null);

export const documentedYears = (): Set<number> =>
  new Set(datedEntries().map((e) => e.year as number));

export const decadeOf = (year: number): number => Math.floor(year / 10) * 10;

export const getDecades = (now: Date = new Date()): number[] => {
  const decades: number[] = [];
  for (let d = decadeOf(FOUNDING_YEAR); d <= decadeOf(currentYear(now)); d += 10) decades.push(d);
  return decades;
};

export interface GalleryPhoto extends TimelinePhoto {
  key: string;
  year: number | null;
  entryTitle: string;
}

/** Every bundled photo across the timeline, de-duplicated by src, in timeline order. */
export const getAllStaticPhotos = (): GalleryPhoto[] => {
  const seen = new Set<string>();
  const out: GalleryPhoto[] = [];
  timelineEntries.forEach((entry) =>
    entry.photos.forEach((photo, i) => {
      if (seen.has(photo.src)) return;
      seen.add(photo.src);
      out.push({ ...photo, key: `${entry.id}-${i}`, year: entry.year, entryTitle: entry.title });
    }),
  );
  return out;
};

export const archiveStats = (now: Date = new Date()) => ({
  since: FOUNDING_YEAR,
  years: yearsOfTradition(now),
  documented: timelineEntries.length,
  photos: getAllStaticPhotos().length,
});

/** Previous/next years for the per-year page, clamped to the tradition's range. */
export const getAdjacentYears = (year: number, now: Date = new Date()) => ({
  previous: year > FOUNDING_YEAR ? year - 1 : null,
  next: year < currentYear(now) ? year + 1 : null,
});
