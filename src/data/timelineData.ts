/**
 * Single source of truth for every piece of text, date and caption on the site.
 * UI components only read from this file — edit content here, never in components.
 *
 * The lunches come from the group's own records, copied word for word:
 *  - 1982 to 2016: the "Almoços" summary document
 *  - 2009 to 2025: the actas (minutes) of each lunch
 * There was no lunch in 2013, 2020 or 2021 (see `noLunchYears`).
 *
 * Still to fill in:
 *  - `members` is empty until the names are added
 *  - `nextLunch.date` / `venue` are null until the 2026 lunch is booked
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
  /** The place ("Local") as written in the records; shown as the lunch's title. */
  title: string;
  /** ISO date (YYYY-MM-DD) when the records give it. */
  date?: string;
  /** "Organização" */
  organizers?: string;
  /** "Presenças" */
  attendees?: string;
  /** "Ementa", one item per line */
  menu?: string[];
  /** "Bebidas", one item per line */
  drinks?: string[];
  /** "Ementa / Vinhos", for years recorded as one combined line */
  menuAndDrinks?: string;
  /** "Observações" */
  notes?: string;
  /** Paragraphs of the acta (minutes), word for word */
  minutes?: string[];
  /** Where the text comes from, e.g. "Acta 2019" or "Almoços" */
  source?: string;
  photos: TimelinePhoto[];
}

export interface Member {
  id: string;
  name: string;
  /** A role in the group, e.g. "Deão" (the eldest). Shown first. */
  role?: string;
  /** How the group calls him at the table. */
  nickname?: string;
  /** First lunch attended. */
  since?: number;
  photo?: string;
  note?: string;
}

export interface InMemoriamMember {
  id: string;
  name: string;
  /** A short tribute. */
  tribute: string;
}

export interface NextLunch {
  year: number;
  /** Chosen at the previous lunch. */
  organizers: string | null;
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

export interface RestaurantSuggestion {
  id: string;
  name: string;
  /** Grouping shown as a sub-heading, e.g. "Lisboa" or "Costa do Estoril e Cascais". */
  region: string;
  /** Neighbourhood, shown next to the name. */
  area: string;
  /** "Ideal para quem escolheu: …" */
  match: string;
  /** The reasoning paragraph. */
  why: string;
  /** Price band, e.g. "€€€". */
  price: string;
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
    id: "almoco-1964",
    year: 1964,
    title: "O Primeiro Almoço de Natal",
    date: "1964-12-24",
    organizers: "Pai (Patrono)",
    attendees: "Patrono, Vasco, Carlos e João",
    notes:
      "Local: Adega Regional de Coimbra (\u201c13 da Rua do Norte\u201d) e Anarquistas. Os almoços de 1964 a 1970 foram registados numa só acta (ver acta de 2009).",
    minutes: [
      "assim se fecha um ciclo, iniciado ali bem perto, no então Restaurante Regional de Coimbra, mais conhecido pelo “13 da Rua do Norte”, nos anos sessenta",
      "o Vasco lembrou que o primeiro destes almoços se realizou no dia 24 de Dezembro de 1964 que se fixa como o início desta organização",
    ],
    source: "Acta 2009",
    photos: [],
  },
  {
    id: "almoco-1971",
    year: 1971,
    title: "Os Anarquistas",
    organizers: "Patrono",
    attendees: "Patrono, João, Carlos, Vasco",
    source: "Tabela Almoços de Natal",
    photos: [],
  },
  {
    id: "almoco-1973",
    year: 1973,
    title: "Adega Regional",
    organizers: "Vasco",
    attendees: "João, Graça, Vasco, M.ª Luís, J. João",
    source: "Tabela Almoços de Natal",
    photos: [],
  },
  {
    id: "almoco-1974",
    year: 1974,
    title: "Colina",
    organizers: "João",
    attendees: "João, Vasco, Miguel, J. João",
    source: "Tabela Almoços de Natal",
    photos: [],
  },
  {
    id: "almoco-1975",
    year: 1975,
    title: "Alfoz",
    organizers: "Xico",
    attendees: "João, Rosarinho, Carlos, Graça, Vasco, Xico",
    source: "Tabela Almoços de Natal",
    photos: [],
  },
  {
    id: "almoco-1976",
    year: 1976,
    title: "Alfaia",
    organizers: "Carlos",
    attendees: "Miguel, Vasco, J. João, Carlos",
    source: "Tabela Almoços de Natal",
    photos: [],
  },
  {
    id: "almoco-1980",
    year: 1980,
    title: "Solar do Loreto",
    organizers: "Ginho",
    attendees: "Restelo em peso",
    source: "Tabela Almoços de Natal",
    photos: [],
  },
  {
    id: "almoco-1981",
    year: 1981,
    title: "Alfaia",
    organizers: "Carlos / João",
    attendees: "Rosarinho, Carlos, J. João, Madalena, Vasco, M.ª Luís, Miguel, João",
    source: "Tabela Almoços de Natal",
    photos: [],
  },
  {
    id: "almoco-1982",
    year: 1982,
    title: "Saisa",
    organizers: "Vasco",
    attendees: "João, Miguel, Ginho, Pedro, J. João, Vasco, Carlos",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1983",
    year: 1983,
    title: "D. Pepe",
    organizers: "J. João",
    attendees: "Carlos, João, J. João, Pedro, Miguel, Vasco, M. Peres, Ginho",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1984",
    year: 1984,
    title: "D. Pepe",
    organizers: "M. Peres",
    attendees: "Carlos, João, J. João, Vasco, M. Peres, Miguel, Ginho, Xico",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1985",
    year: 1985,
    title: "D. Pepe",
    organizers: "M. Peres",
    attendees: "João, Miguel, M. Peres, B. Leitão, J. Penalva, Ginho, Nuno S. Pereira",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1986",
    year: 1986,
    title: "A Severa",
    organizers: "Carlos",
    attendees: "J. João, Miguel, Ginho, João, Carlos, N. Rosas",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1987",
    year: 1987,
    title: "Giuseppe de Verde",
    organizers: "Ginho",
    attendees: "J. João, Miguel, M. Peres, Vasco, J. Cintra, M. Isaac, Ginho, João, Carlos",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1988",
    year: 1988,
    title: "A Severa",
    organizers: "Carlos / João",
    attendees: "Patrono, João, Miguel, Vasco, Pedro, Carlos",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1989",
    year: 1989,
    title: "A Severa",
    organizers: "Carlos / João",
    attendees: "João, Miguel, J. João, Pedro, Carlos",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1990",
    year: 1990,
    title: "A Severa",
    organizers: "Carlos / João",
    attendees: "Patrono, Xico, M. Peres, Vasco, Carlos, Ginho, P. Lino, João Miguel, J. João, Pedro",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1991",
    year: 1991,
    title: "Adega do Zé Manel",
    organizers: "J. João",
    attendees: "Vasco, J. João, B. Leitão, M. Peres, P. Lino, Ginho, João, Miguel, Carlos",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1992",
    year: 1992,
    title: "Luzmar",
    organizers: "M. Peres",
    attendees: "Vasco, J. João, M. Peres, João, Miguel, M. Costa, Ginho, F. C. Barros, P. Lino, Carlos",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1993",
    year: 1993,
    title: "Adega do Zé Manel",
    organizers: "J. João",
    attendees: "Vasco, J. João, M. Peres, Xico, M. Maia, Ginho, Carlos",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1994",
    year: 1994,
    title: "Solar (Pedro) dos Leitões",
    organizers: "Incerto",
    attendees: "Xico, J. João, João, Miguel, Vasco, M. Peres, Ginho, Carlos, P. Lino, J. Spínola, M. Costa, J. Valério, Calhim, M. Branco, Duarte e Rodrigo Amaral",
    notes: "Celebrou-se a formatura do Vasco, bem como a entrada da 3ª geração; foi o 20º almoço.",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1995",
    year: 1995,
    title: "D. Leitão",
    organizers: "M. Peres",
    attendees: "Miguel, João, Ginho, Xico, P. Lino, P. Castro e Costa, Carlos, J. Spínola, J. Valério, J. Vaz, M. Maia, M. Peres, Vasco, J. João",
    notes: "Próxima organização - Ginho e Carlos",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1996",
    year: 1996,
    title: "O Barrote Atiçado",
    organizers: "Ginho / Carlos",
    attendees: "Vasco, Ginho, J. Vaz, Xico, Miguel, Carlos, M. Maia, João, L. F. Salgado, Pedro",
    menuAndDrinks: "Serviço à lista / Encostas do Enxoé",
    notes: "Celebrou-se o 25º aniversário | Próxima organização - João e Miguel",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1997",
    year: 1997,
    title: "Belcanto",
    organizers: "João / Miguel",
    attendees: "Patrono, J. João, Pedro, Miguel, João, Vasco, M. Peres, Xico, M. Maia, Carlos, Ginho",
    menuAndDrinks: "Cozido à portuguesa / Reguengos DOC",
    notes: "Próxima organização - M. Maia / Xico",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1998",
    year: 1998,
    title: "Toscano",
    organizers: "M. Maia",
    attendees: "Patrono, Vasco, Pedro, J. Vaz, Xico, Ginho, M. Maia, Carlos, M. Peres, João, Miguel, J. João",
    menuAndDrinks: "Dourada no pão - Cabrito assado / Aliança Galeria Chardonnay - Real Cª Velha Granléve - Moët&Chandon*",
    notes: "*Tendo esgotado o vinho tinto, o Toscano (para se limpar de um pequeno quid pro quo!) ofereceu uma garrafa de Moët&Chandon como homenagem ao grupo. Próxima organização - Vasco / 99.12.18",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-1999",
    year: 1999,
    title: "Flor da Várzea",
    date: "1999-12-18",
    organizers: "Patrono / Vasco",
    attendees: "Patrono, Vasco, J. João, M. Maia, J. Vaz, João, M. Peres, Ginho, Duarte, Carlos e Xico",
    menuAndDrinks: "Rodízio de Carnes / Esteva",
    notes: "Os Gaspar ofereceram o almoço (exceto as bebidas), em retribuição pelas ofertas anuais do almoço do fundador, o que motivou votos de protesto de todos os outros. Por ser o último “antes do século”, Vasco fez um discurso de síntese sobre os cerca de 40 anos que o grupo já passou em conjunto, chamando a atenção para três pontos altos: as únicas questões entre nós foram sobre copos de vinho, nunca houve interferência das senhoras nestes almoços e rematando que isto revela uma mente sã pelo que só temos de cuidar do corpo para os desafios do futuro, em especial de três órgãos: fígado, intestinos e vesícula.",
    minutes: [
      "A conversa que se seguiu foi uma das mais interessantes que já se produziu nestes almoços. Sinal de maturidade?",
      "Próxima organização - J. João",
    ],
    source: "Acta 1999",
    photos: [],
  },
  {
    id: "almoco-2000",
    year: 2000,
    title: "D. Sopas",
    organizers: "J. João",
    attendees: "Patrono, Vasco, Pedro, J. João, M. Maia, J. Vaz, João, M. Peres, Miguel, Carlos e Xico",
    menuAndDrinks: "Sopas e Cabrito Assado",
    notes: "Próxima organização - Xico",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-2001",
    year: 2001,
    title: "A Cabrinha",
    organizers: "Xico/M. Maia",
    attendees: "Xico, M. Maia, M. Peres, Miguel, J. Vaz, Vasco, João, Duarte, T. Maia, Patrono, J. João, Pedro e Carlos",
    menuAndDrinks: "Caldeirada à Fragateiro, Massinha / Tinto Velho José de Sousa",
    notes: "Próxima organização - M. Peres",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-2002",
    year: 2002,
    title: "Clube de Golf da Bela Vista",
    organizers: "M. Peres",
    attendees: "Patrono, Xico, Ginho, Miguel, J. João, João, M. Maia, Carlos, Pedro, J. Vaz, M. Peres e Vasco.",
    menuAndDrinks: "Serviço à carta / Dão Q.ta de Cabriz Encruzado - Marquês de Borba",
    notes: "Mais uma vez, esgotámos o stock de vinho tinto (!) Próxima organização - Ginho (2003.12.20)",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-2003",
    year: 2003,
    title: "Casa do Ginho, em Azeitão",
    date: "2003-12-20",
    organizers: "Ginho",
    attendees: "Xico, Ginho, Miguel, João, M. Maia, Carlos, J. Vaz, M. Peres, Vasco, Tozé Maia, Duarte e Francisco Padinha",
    menuAndDrinks: "Aperitivos variados - Empada de rins - Paelha à Valenciana / Monte das Cepas (Branco) - Cruz Miranda (Tinto – 15º)",
    notes: "Próxima organização - Miguel e Ginho",
    source: "Almoços",
    photos: [
      { src: groupCelebration, alt: "Convivas à mesa, com paelha e marisco, numa sala com cortinados floridos e janela para o jardim", caption: "Casa do Ginho, em Azeitão." },
    ],
  },
  {
    id: "almoco-2004",
    year: 2004,
    title: "Estoril Mandarim",
    organizers: "Miguel e Ginho",
    attendees: "Xico, Ginho, M. Peres, J. Vaz, Pedro, Miguel, João, Duarte, Carlos, J. João, Tozé, M. Maia, Zé P. Cabral e Vasco",
    menuAndDrinks: "Múltiplas iguarias chinesas, incluindo o famoso Pato Assado à Pequim / Duque de Viseu",
    notes: "Próxima organização - Tozé e Pedro",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-2005",
    year: 2005,
    title: "QB (Quinta da Beloura)",
    organizers: "Pedro",
    attendees: "Patrono, Xico, Ginho, J. Vaz, Pedro, Miguel, Duarte, Carlos, J. João, Tozé, M. Maia e Vasco",
    menuAndDrinks: "Cozido à portuguesa / Quinta da Coquinha (Douro)",
    notes: "Próxima organização - João Vaz",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-2006",
    year: 2006,
    title: "Mercearia",
    organizers: "João Vaz",
    attendees: "Patrono, Xico, Ginho, J. Vaz, Pedro, Miguel, Carlos, J. João, M. Maia, M. Peres, Vasco e Licas",
    menuAndDrinks: "Diversos pratos de excelente carne / Esteva 2003 (Medalhado)",
    notes: "Próxima organização - Patrono e Vasco",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-2007",
    year: 2007,
    title: "A Pateira",
    organizers: "Patrono e Vasco",
    attendees: "Patrono, Xico, Ginho, Vasco, J. Vaz, M. Peres, Duarte, M. Maia, Pedro, Carlos, Miguel, João, J. João e Tozé",
    menuAndDrinks: "Entradas - Cabrito assado, com batatinhas e legumes / Herdade Grande 2005 (branco e tinto)",
    notes: "Próxima organização - Xico e Ginho",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-2008",
    year: 2008,
    title: "A CATAPLANA (Novo Tico-Tico)",
    organizers: "Xico e Ginho",
    attendees: "Patrono, Xico, Ginho, Vasco, J. Vaz, M. Maia, Carlos, Miguel e J. João",
    menuAndDrinks: "Entradas várias - Serviço à carta / Prova Régia e Convento da Tomina",
    notes: "Foi lido um protesto de um membro ausente (Pedro), pelo facto de a organização tardia do almoço lhe ter inviabilizado a presença - Próxima organização - Carlos",
    source: "Almoços",
    photos: [],
  },
  {
    id: "almoco-2009",
    year: 2009,
    title: "O Fidalgo",
    date: "2009-12-19",
    organizers: "Carlos",
    attendees: "Xico, Ginho, Vasco, J. Vaz, M. Peres, M. Maia, Pedro, Carlos, Miguel, João, J. João, Tozé, Vasco (filho), Pedro (filho) e o conviva surpresa Carlos Heitor",
    menuAndDrinks: "Serviço à carta / Espumante Murganheira Reserva Bruto e Quinta dos Arciprestes Reserva Tinto",
    notes: "Próxima organização - Vasco",
    minutes: [
      "O Carlos foi o organizador e o almoço teve lugar no Restaurante Fidalgo, no Bairro Alto, c/serviço à lista, acompanhado de Espumante Murganheira Reserva Bruto e Vinho Tinto Quinta dos Arciprestes Reserva;",
      "Estiveram presentes Xico, Ginho, Vasco, J. Vaz, M. Peres, M. Maia, Pedro, Carlos, Miguel, João, J. João, Tozé, Vasco (filho), Pedro (filho) e o conviva surpresa Carlos Heitor;",
      "Depois de lida a acta do almoço anterior, o organizador pediu para fazer uma intervenção, começando por justificar ter escolhido o local, no Bairro Alto, o que constitui um regresso às origens, por se tratar de um almoço especial – o primeiro em que o Patrono, o Pai Gaspar, deixa de estar presente – e referindo que assim se fecha um ciclo, iniciado ali bem perto, no então Restaurante Regional de Coimbra, mais conhecido pelo “13 da Rua do Norte”, nos anos sessenta; o Vasco lembrou que o primeiro destes almoços se realizou no dia 24 de Dezembro de 1964 que se fixa como o início desta organização que assim perfaz 45 anos; fez-se então, com a participação de todos, uma evocação e saudação ao Patrono;",
      "Foram apresentadas várias propostas, ficando aprovadas as seguintes:",
      "a.  Manter o Pai Gaspar como Patrono ad eternam;",
      "b.  Continuar com o registo dos almoços em acta;",
      "c.  Registar numa só acta os almoços de 1964 a 1970;",
      "d.  Criar o cargo de Deão e nomear o Xico para este cargo, por ser o mais velho (embora não pareça);",
      "e.  Ser o Vasco o organizador do próximo almoço, podendo este vir a ter lugar na s/futura casa de Torres Vedras, sendo desejável alugar, para o efeito, um autocarro com condutor;",
      "f.  Melhorar o aspecto da apresentação das actas",
      "Foram apresentadas ainda as seguintes propostas que ficaram por aprovar:",
      "a.  Criação da Confraria do Almoço de Natal;",
      "b.  Criação de uma placa representativa para uso dos convivas;",
      "c.  Fixação da data do almoço no sábado anterior ao Solstício de Inverno.",
    ],
    source: "Acta 2009",
    photos: [],
  },
  {
    id: "almoco-2010",
    year: 2010,
    title: "Areeiro 3, Lisboa",
    date: "2010-12-17",
    organizers: "Vasco",
    attendees: "Xico, Ginho, Vasco, J. Vaz, M. Maia, Pedro, Carlos, Miguel, João, J. João e Tozé",
    minutes: [
      "O Vasco foi o organizador e o almoço teve lugar no restaurante Areeiro 3, em Lisboa, c/serviço à lista, acompanhado de Pynga Selection 2009 Branco (Alvarinho/Viognier) e Quinta S. Cristóvão 2008 Tinto (Aragonês/Merlot);",
      "O organizador justificou a escolha do local, dizendo que por não ter sido possível realizar o almoço em Torres Vedras, como tinha pensado, este restaurante assegurava grande parte da qualidade que pretendia, nomeadamente no que respeita aos vinhos;",
      "Ficou decidido ser o Vasco o organizador do próximo almoço, podendo este vir a ter lugar na sua futura casa de Torres Vedras, sendo desejável alugar, para o efeito, um autocarro com condutor;",
      "Nada mais havendo a tratar, foi lavrada a presente acta que vai ser assinada por todos os presentes",
    ],
    source: "Acta 2010",
    photos: [],
  },
  {
    id: "almoco-2011",
    year: 2011,
    title: "Pizzeria Nosolo Italia, Padrão dos Descobrimentos, Lisboa",
    date: "2011-12-23",
    organizers: "Vasco",
    attendees: "Xico, Ginho, Vasco, J. Vaz, M. Maia, Carlos, Miguel, João, J. João, Tozé, Pedro Maia e o conviva surpresa Jorge Ávila e Castro",
    minutes: [
      "O Vasco foi o organizador e o almoço teve lugar na Pizzeria Nosolo Italia, junto ao Monumento aos Descobrimentos, em Lisboa, c/serviço à lista, acompanhado de Nosolo Italia Branco e Tinto (vinho da casa);",
      "Foi enviada mensagem ao ausente Pedro Gaspar que agradeceu e retribuiu;",
      "Em face de alguns comentários menos favoráveis ao local escolhido, o organizador referiu que a localização (junto ao rio e de fácil acesso por via pedestre, muito adequada aos convivas, designadamente aos menos jovens) tinha sido fator predominante na escolha, sublinhando que o dia primaveril que se registava confirmava a correção da mesma;",
      "Ficou decidido serem o Ginho e o Xico os organizadores do próximo almoço;",
      "Não ficou assente data para o almoço de 2012, devendo os organizadores propor aos restantes convivas, com a devida antecedência, a data preferencial e respectivas alternativas;",
      "Nada mais havendo a tratar, foi lavrada a presente acta que vai ser assinada por todos os presentes (dado que a acta é lida no final do próximo almoço, vale como assinatura um acenar de cabeça ou, simplesmente, não dizer nada!).",
    ],
    source: "Acta 2011",
    photos: [],
  },
  {
    id: "almoco-2012",
    year: 2012,
    title: "Zé da Mouraria, Lisboa",
    date: "2012-12-22",
    organizers: "Ginho e Xico",
    attendees: "Vasco, Ginho, J. Vaz, Miguel, Duarte, João, J. João, M. Maia, Tozé, Pedro Maia, Xico e Pedro",
    minutes: [
      "O Ginho e o Xico foram os organizadores e o almoço teve lugar o Zé da Mouraria;",
      "Foi servido Bacalhau à Minhota, acompanhado de Verde Branco de Lixa, e Montado Branco e Tinto;",
      "Estiveram presentes Vasco, Ginho, J. Vaz, Miguel, Duarte, João, J. João, M. Maia, Tozé, Pedro Maia, Xico e Pedro;",
      "Já no decurso do almoço, o Carlos enviou uma mensagem informando não poder comparecer, a qual foi recebida, entre outra reações, com impropérios que a decência impede que sejam transcritos para a ata;",
      "Foram produzidos alguns comentários menos favoráveis à demora do serviço, à localização da mesa e, sobretudo, ao atraso de um conviva e à ausência de outro, sobretudo por esta não ter sido comunicada com a devida antecedência;",
      "Ficou decidido serem o M. Maia e o João os organizadores do próximo almoço;",
      "Não foi lida a ata do almoço anterior, por manifesta incapacidade auditiva (do local, não dos convivas)",
    ],
    source: "Acta 2012",
    photos: [],
  },
  {
    id: "almoco-2014",
    year: 2014,
    title: "Casa das Palmeiras, Parede",
    date: "2014-12-21",
    organizers: "Ginho",
    attendees: "Xico (/Decano), Ginho, J. Vaz, Pedro, Miguel, João, Zé João, Tozé, Pedro Maia, Duarte Amaral, Manel Peres, Carlos, Duarte Sanches, Pedro Gaspar II, Vasco Gaspar II, Carlos Gaspar II, Francisco Padinha II, Calocha Maia e Diogo Amaral",
    menu: [
      "Cozido à Portuguesa (buffet)",
    ],
    drinks: [
      "Vinho Fonte do Nico (Palmela), tinto e branco",
    ],
    minutes: [
      "O Secretário fez uma resenha histórica desde o último almoço (2012), fez uma evocação dos desaparecidos (Patrono, Vasco e Manel), e saudações à terceira geração e também à quarta, exemplarmente representada pelo Diogo Amaral, e terminou com o habitual pedido para um dos convivas se disponibilizar para organizar o almoço de 2015, o que foi prontamente correspondido pelo Zé João.",
      "Em intervenção complementar, o mesmo orador saudou a retoma dos almoços, impulsionada pelo Pedro da Maia em momento e circunstâncias bem difíceis, e a que correspondeu o Ginho com uma pronta e eficiente organização, e incitou os representantes das novas gerações para que se mantenham firmes, pois esta é uma boa maneira de ter presentes os que já partiram e que tantas saudades deixam, concluindo com o pedido para que participem na organização do próximo almoço, o que foi prontamente aceite.",
      "Organizador para 2015: Zé João, coadjuvado por um membro da nova geração que o organizador queira designar.",
    ],
    source: "Acta 2014",
    photos: [
      { src: heroChristmasDinner, alt: "Grupo grande de várias gerações em duas mesas compridas, numa sala amarela com chão de tijoleira", caption: "Casa das Palmeiras, Parede." },
    ],
  },
  {
    id: "almoco-2015",
    year: 2015,
    title: "Sal e Brasas",
    date: "2015-12-19",
    organizers: "Zé João",
    attendees: "Manel Peres (Decano), João, Miguel, Zé João, J. Vaz, Tozé, Carlos, Calocha, Pedro Maia, Vasco II, Pedro Gaspar II, Carlos Gaspar II, Xico II, Duarte Amaral, Pedro e Duarte Sanches.",
    menu: [
      "Carnes grelhadas e Cozido à Portuguesa",
    ],
    drinks: [
      "Branco Apelido 2013 e Tinto Planura 2014",
    ],
    minutes: [
      "O Secretário começou por ler a ata do último almoço a qual, depois de lida, foi aprovada por unanimidade.",
      "De seguida, foram saudados os presentes e nomeados os ausentes, com o sem motivo justificado, seguindo-se a evocação do Patrono e do Trio Incomparável: Vasco, Manel e Xico.",
      "Nesta oportunidade, o Secretário referiu o desejo expresso pelo Francisco II para que não deixasse de se realizar o almoço de 2015, expresso de forma clara e inequívoca em momento tão difícil e doloroso e que mereceu a imediata concordância de todos.",
      "Seguiu-se a entronização do novo Decano, manel Peres, que teve alguma relutância em aceitar, por entender que ainda é muito novo para tal (pelo menos é o que diz que ouve as miúdas comentarem…).",
      "A terminar foi aprovada, por aclamação, a escolha dos organizadores do Almoço de Natal 2016, a saber, Pedro maia, Vaco II, Pedro II, Carlos II e Xico II, sendo a primeira vez que organização recai exclusivamente sobre membros da 3ª geração, sendo de assinalar que se trata dos filhos do Trio Incomparável que, deste modo, terá uma participação ainda mais reforçado no referido Almoço de Natal de 2016.",
      "Nada mais havendo a tratar…",
    ],
    source: "Acta 2015",
    photos: [],
  },
  {
    id: "almoco-2016",
    year: 2016,
    title: "Atalho (Embassy – Palácio Ribeiro da Cunha/Príncipe Real)",
    date: "2016-12-17",
    organizers: "Pedro Maia, Pedro Gaspar II, Vasco Gaspar II, Carlos Gaspar II e Francisco II",
    attendees: "Manel Peres (Deão), João, Miguel, Zé João, J. Vaz, Carlos, Calocha, Pedro Maia, Pedro Gaspar II, Carlos Gaspar II, Duarte Amaral, Duarte Sanches, Francisco Moreira e Ginho.",
    menu: [
      "Carnes grelhadas",
    ],
    drinks: [
      "Branco Catarina 2015 e Tinto Quinta dos Carvalhais 2012",
    ],
    minutes: [
      "O Secretário começou por ler a ata do último almoço a qual, apesar do intenso ruído de fundo, foi aprovada por aparente unanimidade de gestos afirmativos de cabeça, já que ninguém ouviu nada…",
      "De seguida, foram saudados os presentes, nomeadamente o novo membro, Francisco Moreira, da distinta família Sanches que muitos e bons membros tem dado ao Almoço de Natal, e nomeados os ausentes, todos devidamente justificados.",
      "Finalmente, procedeu-se à evocação do Patrono e do Trio Incomparável (Vasco, Manel e Xico).",
      "A terminar foi aprovada, por aclamação, a escolha dos organizadores do Almoço de Natal 2017: Ginho e Manel, o Deão.",
      "Após o levantar da mesa e o abandono da sala, depois de fez e bem as contas do almoço, os vários participantes deslocaram-se para os jardins do Príncipe Real onde permaneceram em amena cavaqueira, acompanhada de algumas bujecas, até que as línguas se entaramelaram e as ideias se confundiram!",
      "Nada mais havendo a tratar...",
    ],
    source: "Acta 2016",
    photos: [],
  },
  {
    id: "almoco-2017",
    year: 2017,
    title: "Quinta da Beloura (Centro hípico)",
    date: "2017-12-23",
    organizers: "Manel Peres",
    attendees: "Manel Peres (Deão), João, Miguel, Zé João, J. Vaz, Carlos, Calocha, Pedro Maia, Carlos Gaspar II, Tozé Maia e Pedro",
    menu: [
      "Entradas variadas, Filetes de Peixe Galo no Forno e Lombinhos de porco com batatas “duchesse”",
    ],
    drinks: [
      "Branco Quinta da Espiga 2016 e Tinto Quinta das Amoras 2016",
    ],
    minutes: [
      "Depois de uns aperitivos no simpático bar, os convivas tomaram assento na mesa, ampla, confortável e devidamente amesendada.",
      "O Secretário começou por ler a ata do último almoço que foi aprovada por unanimidade (desta vez todos ouviram bem…).",
      "De seguida, foram saudados os presentes e nomeados os ausentes, todos devidamente justificados.",
      "Finalmente, procedeu-se à evocação do Patrono, e do Trio Incomparável (Vasco, Manel e Xico).",
      "A terminar, foi aprovada, por aclamação, a escolha do organizador do Almoço de Natal 2018: Miguel Sanches.",
      "Depois de uns bons momentos de conversa, à mesa do almoço e na varanda do restaurante, os convivas retiraram-se em boa ordem.",
      "Nada mais havendo a tratar….",
    ],
    source: "Acta 2017",
    photos: [],
  },
  {
    id: "almoco-2018",
    year: 2018,
    title: "Marítima do Restelo",
    date: "2018-12-08",
    organizers: "Miguel Sanches",
    attendees: "Manel Peres (Deão), João, Miguel, Zé João, João Vaz, Tozé Maia, Carlos Maia, Pedro Maia e Duarte Sanches",
    menu: [
      "Pão, queijo e presunto fatiado",
      "Sopa de peixe (só alguns, e muito elogiada)",
      "Borrego assado no forno, com batata corada, arroz de miúdos e grelos (muito apreciado, pela confeção, e por o ovino ser de Vila Velha do Ródão!)",
      "Sobremesas várias",
      "Café",
    ],
    drinks: [
      "Branco e Tinto Vinha dos Santos 2016 (Douro)",
    ],
    minutes: [
      "Na ausência do Secretário, devida e antecipadamente justificada, não foi lida a ata do último almoço",
      "De seguida, foram saudados os presentes e nomeados os ausentes, nem todos, lamentavelmente, com a devida a atempada justificação…",
      "Finalmente, procedeu-se à evocação do Patrono, e do Trio Incomparável (Vasco, Manel e Xico).",
      "A terminar, não foi votada a escolha do organizador do Almoço de Natal 2019, o que veio a dar origem a um clima de grande angústia, durante todo o último ano, até que o Zé João e o Duarte Amaral se candidataram a esta função, tendo prontamente sido eleitos por meio de voto eletrónico.",
      "Nada mais havendo a tratar….",
    ],
    source: "Acta 2018",
    photos: [],
  },
  {
    id: "almoco-2019",
    year: 2019,
    title: "Restaurante Sancho",
    date: "2019-12-20",
    organizers: "Zé João e Duarte Amaral",
    attendees: "Manel Peres (Deão), Zé João, Duarte, Pedro, Carlos, João, Miguel, Tozé, Calocha, Duarte Sanches, Rodrigo Amaral, Salvador Amaral e Francisco Moreira.",
    menu: [
      "à lista, tendo sido servidos, como entrada, uns excelentes croquetes.",
    ],
    drinks: [
      "Branco Quinta de S. Sebastião 2017 (Lisboa)",
      "Tinto Quinta de S. Sebastião Reserva 2015 (Lisboa)",
    ],
    minutes: [
      "Mesa em U, ampla, muito confrontável e devidamente posta e decorada.",
      "O Secretário tomou a palavra e, lembrando que no último almoço não fora lida a ata do almoço anterior, procedeu à leitura das atas dos almoços de 2017 e 2018, as quais foram aprovadas por unanimidade.",
      "De seguida, o Secretário lembrou também que no último almoço não havia sido designado o organizador do almoço de 2019, aproveitando para pedir um voto de louvor aos organizadores, Zé João e Duarte Amaral, pela prontidão com que responderam ao apelo para esta tarefa, e pela qualidade da sua organização, nesse momento já bem patente!",
      "Como habitualmente, foram saudados os presentes, sendo feita uma saudação especial ao Rodrigo que, 25 anos depois, voltou a poder participar e se fez acompanhar do seu filho Salvador, tendo prometido que proximamente seria acompanhado pelo seu neto, abrindo assim a participação da 5ª geração, o que foi efusivamente saudado por todos os presentes.",
      "Foram também nomeados os ausentes, todos devida e antecipadamente, justificados.",
      "Teve então lugar a regimental evocação do Patrono e do Trio Incomparável (Vasco, Manel e Xico).",
      "A terminar, foi aprovada, por aclamação, a escolha dos organizadores do Almoço de Natal 2020: manos Tozé e Calocha Maia.",
      "Nada mais havendo a tratar….",
    ],
    source: "Acta 2019",
    photos: [],
  },
  {
    id: "almoco-2022",
    year: 2022,
    title: "Restaurante Nobre",
    date: "2022-12-16",
    organizers: "Duarte Amaral",
    attendees: "Zé João, Duarte, Pedro, Carlos, João, João Vaz, Miguel, Tozé, Calocha, Rodrigo Amaral, Salvador Amaral .",
    menu: [
      "Entradas variadas",
      "Sopa de santola",
      "Lombinhos com guarnição",
      "Sobremesas variadas",
    ],
    drinks: [
      "branco e tinto Consensual Douro 2021",
    ],
    minutes: [
      "Mesa, em quadrado, ampla, muito confrontável e devidamente posta e decorada.",
      "O Secretário tomou a palavra e começou por saudar o recomeço dos almoços, após dois anos de pandemia, lembrando que neste período se registou, com muita tristeza, a partida do Ginho, em consequência da maldita COVID 19, pelo que logo se fez uma saudação a este membro, tão assíduo quanto a sua saúde o permitiu, e que foi responsável pela organização de vários excelentes Almoços de Natal, nomeadamente um, memorável, na sua casa de Azeitão.",
      "Continuando, o Secretário pediu desculpa aos manos Maia por não se ter seguido a ordem estabelecida para a organização do almoço seguinte ao de 2019, explicando que as circunstâncias impuseram a exceção deste ano, pelos motivos explicados em devido tempo e que foram prontamente aceites, e aproveitou para agradecer ao Duarte Amaral a organização deste almoço.",
      "A terminar esta sua intervenção, que já ia longa, começando a motivar alguma agitação na mesa, o Secretário nomeou os ausentes, todos devida e antecipadamente justificados.",
      "Teve então lugar a regimental evocação do Patrono e do Trio Incomparável (Vasco, Manel e Xico).",
      "Antes de terminar o almoço, foi sugerido, pelo João, a criação de um blogue, para consulta pública.",
      "Nada mais havendo a tratar….",
    ],
    source: "Acta 2022",
    photos: [],
  },
  {
    id: "almoco-2023",
    year: 2023,
    title: "Restaurante Nobre",
    date: "2023-12-17",
    organizers: "Duarte Amaral",
    attendees: "Calocha, Carlos, Carlos II, Duarte Amaral, João Sanches, João Vaz, Miguel, Nuno, Pedro Gaspar, Pedro Maia, Salvador, Rodrigo e Tozé.",
    menu: [
      "Entradas variadas",
      "O “famoso Cozido da Justa”",
      "Sobremesas variadas",
    ],
    drinks: [
      "branco e tinto Consensual Douro 2022",
    ],
    minutes: [
      "Mesa, em quadrado, ampla, muito confrontável e devidamente posta e decorada.",
      "O Secretário tomou a palavra e leu a ata da sessão de 2022 que, submetida a votação, foi aprovada por unanimidade, tendo depois nomeado os ausentes, devida e antecipadamente justificados.",
      "Teve então lugar a regimental evocação do Patrono, do Trio Incomparável (Vasco, Manel e Xico) e dos restantes membros que já não se encontram entre nós, designadamente o Ginho e o Zé João.",
      "Neste momento, o Secretário entendeu dizer umas palavras sobre o Zé João, desaparecido em 2023, lembrando que era um apoiante incondicional dos Almoços de Natal, tendo estado presente em praticamente todos, e que foi responsável pela introdução da 3ª geração (Duarte e Rodrigo, 1994) e da 4ª geração (Diogo, 2014), para além de ter organizado alguns excelentes almoços.",
      "A terminar estas palavras, o Secretário fez questão da dar um testemunho pessoal, recordando que no último almoço levou o Zé João a casa, tendo-se então apercebido de que se tratava de uma despedida, não ainda da pessoa do Zé João, que pensava que seria muito mais tarde do que infelizmente veio a acontecer, mas de uma certa forma de estar, de uma cultura, de uma vivência, que só quem com ele conviveu pode entender e que, no caso pessoal do orador, começara há cerca de 60 anos, na Nau Redonda, no largo da Princesa, numa noite de fados, por iniciativa do Vasco.",
      "A terminar a sua intervenção, o Secretário lembrou que no próximo ano se comemoram os 60 anos do início desta confraria, e pediu para que alguém se oferecesse para organizar o próximo almoço, como é tradição. Tendo-se voluntariados o Duarte para, mais uma vez, ser o organizador, foi aprovado por unanimidade e merecida aclamação.",
      "Em resposta, o Duarte fez questão de agradecer as palavras sobre o Zé João e as saudações calorosas que as mesmas mereceram, prometendo tratar do próximo almoço com a qualidade a que nos tem habituado, ficando de, em devido tempo, tratar da questão da data, que não será, em princípio, num domingo.",
      "Antes de terminar o almoço, foi sugerido, mais uma vez, pelo João Sanches, a criação de uma ferramenta informática que permita a todos terem acesso às atas dos almoços, ficando o Miguel de pesquisar a melhor forma de se dar resposta a esta importante sugestão.",
      "Nada mais havendo a tratar….",
    ],
    source: "Acta 2023",
    photos: [],
  },
  {
    id: "almoco-2024",
    year: 2024,
    title: "Restaurante Nobre",
    date: "2024-12-21",
    organizers: "Duarte Amaral",
    attendees: "Deão, Calocha, Carlos, Carlos II, Duarte Amaral, João Sanches, Miguel, Pedro Maia, Pedro II, Salvador, Rodrigo e Vasco II",
    menu: [
      "Entradas variadas",
      "Sopa de santola",
      "Lombinhos de vitela",
      "Sobremesas variadas",
    ],
    drinks: [
      "Consensual Branco e Flor do Tua Tinto",
    ],
    minutes: [
      "Mesa, em quadrado, ampla, muito confortável e devidamente posta e decorada.",
      "O Secretário tomou a palavra para lembrar que a ata da sessão de 2023 tinha sido distribuída antecipadamente por todos os membros, com recurso à nova ferramenta tecnológica, em boa hora preparada pelo Duarte Sanches, pelo que, não havendo objeções, a ata foi aprovada por unanimidade, tendo depois nomeado os ausentes, devida e antecipadamente justificados, quase todos por motivo da 2ª dose da vacina contra a gripe...",
      "Seguiu-se a regimental evocação do Patrono, do Trio Incomparável (Vasco, Manel e Xico) e dos restantes membros que já não se encontram entre nós, designadamente o Ginho e o Zé João.",
      "De seguida, o Secretário fez questão de expressar um agradecimento ao Miguel e ao Duarte Sanches, pelo empenhamento colocado na conceção e execução do LINK para acesso de todos às atas e demais documentos do arquivo do Almoço de Natal, tornando o agradecimento extensivo ao João Sanches pela insistência em propor a criação desta ferramenta, que agora se tornou realidade.",
      "A terminar a sua intervenção, o Secretário lembrou que se estava a comemorar o 60º aniversário do Almoço de Natal e, para assinalar esta efeméride, propôs a criação da categoria de Membro Emérito, e a atribuição desta categoria ao João Sanches, o que considerou de inteira justiça, pelo seu exemplo de constância, desde o primeiro momento, e de empenhamento, conforme referido a propósito da criação do LINK. Estas propostas foram aprovadas por unanimidade, embora a segunda tenha merecido, da parte do agraciado, vivos protestos, naturais dada a sua proverbial modéstia!",
      "Tendo alguns membros pedido informação detalhada sobre o porquê do 60º aniversário, o Secretário fez um pequeno resumo das origens do Almoço de Natal e do seu desenvolvimento ao longo destes 60 anos.",
      "Após um agradecimento ao Duarte Amaral pela organização deste almoço, o Secretário abriu o debate sobre a organização do Almoço de Natal 2025; houve intervenções no sentido de manter o organizador e o local atual, e intervenções no sentido de não sobrecarregar o Duarte e de se mudar de local. A rematar o debate, o Duarte declarou que não havia lugar a qualquer sobrecarga e que tinha muito gosto em organizar estes almoços, propondo-se averiguar a hipótese de o próximo ser no restaurante Sancho, onde já se realizou um Almoço de Natal (2019), o que mereceu aprovação de todos os presentes.",
      "Nada mais havendo a tratar….",
    ],
    source: "Acta 2024",
    photos: [
      { src: tableSetting, alt: "Convivas à volta de uma mesa quadrada com chávenas de café, sob três candeeiros brancos", caption: "Restaurante Nobre." },
    ],
  },
  {
    id: "almoco-2025",
    year: 2025,
    title: "Restaurante Sancho",
    date: "2025-12-19",
    organizers: "Duarte Amaral",
    attendees: "Deão, Carlos Gaspar, Carlos Gaspar II, Duarte Amaral, Duarte Sanches, João Sanches, João Vaz, Miguel Sanches, Pedro Gaspar, Pedro Gaspar II, Salvador Amaral, Rodrigo Amaral, Vasco Gaspar II e o conviva-surpresa, Carlos Montepegado.",
    menu: [
      "Entradas variadas",
      "Lombos de garoupa no forno",
      "Sobremesas variadas",
    ],
    drinks: [
      "Herédias Douro tinto e branco",
    ],
    minutes: [
      "Mesa em U, ampla, muito confortável e devidamente posta e decorada.",
      "O Secretário tomou a palavra para lembrar que a ata da sessão de 2024 tinha sido distribuída antecipadamente por todos os membros, com recurso à nova ferramenta tecnológica, em boa hora preparada pelo Duarte Sanches, pelo que, não havendo objeções, a ata foi aprovada por unanimidade.",
      "Seguiu-se a nomeação dos ausentes os ausentes, devida e antecipadamente justificados, posto o que se procedeu à regimental evocação do Patrono, do Trio Incomparável (Vasco, Manel e Xico) e dos restantes membros que já não se encontram entre nós, designadamente o Ginho e o Zé João.",
      "O Secretário passou, então, à apresentação do conviva-surpresa, lembrando que esta figura esteve muito em uso, em sessões antigas, sendo uma prerrogativa do organizador do almoço, da qual o Vasco, quando lhe competia, fazia quase sempre uso, e acrescentou que tivera a ideia de retomar esta prática, tendo previamente combinado com o organizador a respetiva concretização.",
      "Sobre o conviva-surpresa deste almoço, o Secretário fez a respetiva apresentação, para os (poucos) que não o conheciam, referindo que o Carlos Montepegado era da Soldados da Índia, que foram colegas na escola primária, que era, obviamente, frequentador dos Gelados, embora dedicasse muito do seu tempo ao desporto automóvel, que foram contemporâneos em Angola, durante algum tempo, e que a amizade iniciada nos bancos da escola perdurou até aos dias de hoje. O Secretário entendeu, também, lembrar que o Licas Montepegado, irmão do conviva-surpresa, fora também ele conviva-surpresa, no almoço de 2006.",
      "Seguiu-se uma troca de impressões e recordações, bem como referências do conviva-surpresa ao gosto de estar presente neste “tão simpático almoço” e de partilhar tão boas memórias, com bons e velhos amigos!",
      "Após um agradecimento ao Duarte Amaral pela organização de mais um excelente almoço, o Secretário abriu as inscrições para a organização do Almoço de Natal de 2026; tendo havido várias intervenções no sentido de manter o Duarte como organizador, e tendo o próprio manifestado total disponibilidade e muito gosto em organizar estes almoços, foi aprovada, por unanimidade e aclamação, a nomeação do Duarte Amaral para a organização do Almoço de Natal de 2026.",
      "Nada mais havendo a tratar….",
    ],
    source: "Acta 2025",
    photos: [],
  },
];

/* ================================================================== */
/* Years with no lunch, as recorded in the actas                       */
/* ================================================================== */

export const noLunchYears: Record<number, string> = {
  1972: "Não se realizou, segundo o quadro dos Almoços de Natal.",
  1977: "Não se realizou, segundo o quadro dos Almoços de Natal.",
  1978: "Não se realizou, segundo o quadro dos Almoços de Natal.",
  1979: "Não se realizou, segundo o quadro dos Almoços de Natal.",
  2013: "Não houve almoço. A acta de 2014 faz a resenha desde o último almoço (2012) e saúda a retoma dos almoços.",
  2020: "Não houve almoço. A acta de 2022 saúda o recomeço dos almoços, após dois anos de pandemia.",
  2021: "Não houve almoço. A acta de 2022 saúda o recomeço dos almoços, após dois anos de pandemia.",
};

/* ================================================================== */
/* Members — TODO: add one object per member                           */
/* Example: { id: "joao", name: "João …", nickname: "…", since: 1964 }  */
/* ================================================================== */

export const members: Member[] = [
  { id: "manel-peres", name: "Manel Peres", role: "Deão" },
  { id: "calocha-maia", name: "Calocha Maia" },
  { id: "carlos-gaspar", name: "Carlos Gaspar" },
  { id: "carlos-gaspar-ii", name: "Carlos Gaspar II" },
  { id: "diogo-amaral", name: "Diogo Amaral" },
  { id: "duarte-amaral", name: "Duarte Amaral" },
  { id: "duarte-sanches", name: "Duarte Sanches" },
  { id: "francisco-moreira", name: "Francisco Moreira" },
  { id: "francisco-padinha-ii", name: "Francisco Padinha II" },
  { id: "joao-sanches", name: "João Sanches" },
  { id: "joao-vaz", name: "João Vaz" },
  { id: "miguel-sanches", name: "Miguel Sanches" },
  { id: "nuno-gaspar", name: "Nuno Gaspar" },
  { id: "pedro-gaspar", name: "Pedro Gaspar" },
  { id: "pedro-gaspar-ii", name: "Pedro Gaspar II" },
  { id: "pedro-maia", name: "Pedro Maia" },
  { id: "rodrigo-amaral", name: "Rodrigo Amaral" },
  { id: "salvador-amaral", name: "Salvador Amaral" },
  { id: "toze-maia", name: "Tozé Maia" },
  { id: "vasco-gaspar-ii", name: "Vasco Gaspar II" },
];

/** Members no longer with us, honoured on the Membros page. */
export const inMemoriam: InMemoriamMember[] = [
  { id: "patrono-gaspar", name: "Patrono, Pai/Sr. Gaspar", tribute: "O patriarca que sempre nos inspirou" },
  { id: "vasco", name: "Vasco", tribute: "Cuja alegria contagiante faz falta" },
  { id: "manel-maia", name: "Manel Maia", tribute: "Sempre presente nos nossos corações" },
  { id: "xico", name: "Xico", tribute: "Que nos deixou saudades eternas" },
  { id: "ginho", name: "Ginho", tribute: "Amigo de todas as horas" },
  { id: "ze-joao", name: "Zé João", tribute: "Cuja memória honramos a cada encontro" },
];

/* ================================================================== */
/* Next lunch — TODO: fill in when booked                              */
/* ================================================================== */

export const nextLunch: NextLunch = {
  year: 2026,
  // Acta 2025: "foi aprovada, por unanimidade e aclamação, a nomeação do Duarte Amaral para a organização do Almoço de Natal de 2026"
  organizers: "Duarte Amaral",
  date: null,
  venue: null,
  address: null,
  mapUrl: null,
  notes: null,
};

/* ================================================================== */
/* Restaurant suggestions for the next lunch (shown on Próximo Almoço) */
/* ================================================================== */

export const restaurantSuggestions: RestaurantSuggestion[] = [
  {
    id: "nunes",
    name: "Nunes Real Marisqueira",
    region: "Lisboa",
    area: "Belém",
    match: "Ideal para quem escolheu: Peixe e Marisco",
    why: "A um passo das vossas raízes no Restelo. O Nunes oferece o melhor marisco da área metropolitana num ambiente recém-renovado, extremamente confortável, com cadeirões espaçosos e um serviço imaculado. Perfeito para partilhar grandes travessas e abrir bons vinhos brancos.",
    price: "€€€€",
  },
  {
    id: "solar-dos-presuntos",
    name: "Solar dos Presuntos",
    region: "Lisboa",
    area: "Baixa de Lisboa",
    match: "Ideal para quem escolheu: Carnes, Grelhados e Cozinha Tradicional",
    why: "Uma instituição histórica lisboeta. É a escolha mais segura para um almoço de grupo longo e animado. Totalmente acessível (com elevador), cadeiras muito confortáveis e uma garrafeira incomparável para quem aprecia um grande vinho do Douro a acompanhar pratos tradicionais de tacho e forno.",
    price: "€€€",
  },
  {
    id: "pinoquio",
    name: "Restaurante Pinóquio",
    region: "Lisboa",
    area: "Restauradores",
    match: "Ideal para quem escolheu: Misto (Carne e Marisco)",
    why: "Um clássico intemporal para a malta. Famoso pelo Pica-pau no tacho de cobre e pelas amêijoas à Bulhão Pato. O restaurante foi recentemente remodelado, oferecendo agora muito mais espaço, melhor acústica para conversas de grupo e o mesmo serviço de excelência de sempre.",
    price: "€€€",
  },
  {
    id: "monte-mar-cascais",
    name: "Monte Mar",
    region: "Costa do Estoril e Cascais",
    area: "Cascais (Guincho)",
    match: "Ideal para quem escolheu: Peixe e Marisco",
    why: "Mesmo à beira-mar, na estrada do Guincho, com vista aberta sobre o Atlântico. Uma referência da costa para peixe e marisco fresco, a poucos minutos de Cascais. Boa opção para quem prefere fazer o almoço mais perto de casa, sem ir até à cidade.",
    price: "€€€€",
  },
  {
    id: "marisco-na-praca-cascais",
    name: "Marisco na Praça",
    region: "Costa do Estoril e Cascais",
    area: "Cascais — Mercado da Vila",
    match: "Ideal para quem escolheu: Peixe e Marisco",
    why: "No Mercado da Vila, em Cascais: escolhe-se o marisco e o peixe na banca e são preparados na hora. Ambiente informal e animado, a poucos minutos da estação de Cascais — prático para quem vem de comboio pela linha.",
    price: "€€€",
  },
  {
    id: "os-arcos-paco-de-arcos",
    name: "Os Arcos",
    region: "Costa do Estoril e Cascais",
    area: "Paço de Arcos",
    match: "Ideal para quem escolheu: Peixe e Marisco",
    why: "Marisqueira clássica em Paço de Arcos, a meio caminho entre Lisboa e Cascais e bem servida pela linha de comboio. Casa de tradição, conhecida pelo marisco e pelo peixe fresco, cómoda para quem vem de um lado e do outro.",
    price: "€€€",
  },
  {
    id: "porto-de-santa-maria-guincho",
    name: "Porto de Santa Maria",
    region: "Costa do Estoril e Cascais",
    area: "Cascais (Guincho)",
    match: "Ideal para quem escolheu: Peixe e Marisco (ocasião especial)",
    why: "Na estrada do Guincho, com vista para o mar, é uma das grandes casas de peixe e marisco da região, com uma garrafeira de referência. A escolha para um almoço mais cerimonioso, junto ao oceano.",
    price: "€€€€",
  },
];

/* ================================================================== */
/* Date poll — the Fridays and Saturdays up to 23 December             */
/* (for the year in `nextLunch`). ISO dates; the poll tallies votes.   */
/* ================================================================== */

export const datePollOptions: string[] = [
  "2026-12-04",
  "2026-12-05",
  "2026-12-11",
  "2026-12-12",
  "2026-12-18",
  "2026-12-19",
];

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
    backToTop: "Voltar ao Topo",
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
      "Desde 24 de dezembro de 1964, a Malta do Restelo junta-se à mesa por altura do Natal. Mudam os restaurantes e os organizadores, mas cada almoço fica registado em acta, lida no almoço seguinte.",
    introLink: "A nossa história",
    timelineHeading: "Linha do Tempo",
    timelineIntro: "Os almoços da Malta do Restelo, um ano de cada vez.",
    timelineLink: "Ver o arquivo completo",
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

  /** Field labels, as used in the records. */
  lunchFacts: {
    venue: "Local",
    date: "Data",
    organizers: "Organização",
    attendees: "Presenças",
    menu: "Ementa",
    drinks: "Bebidas",
    menuAndDrinks: "Ementa / Vinhos",
    notes: "Observações",
    minutes: "Acta",
    source: (source: string) => `Fonte: ${source}`,
  },

  decadeMenu: {
    label: "Saltar para a década:",
    navLabel: "Décadas",
    yearRange: (decade: number) => `${decade} a ${decade + 9}`,
    emptyDecade: "Ainda não há memórias desta década. Tem fotografias destes anos? Adicione-as ao arquivo.",
    unknownHeading: "Ano por confirmar",
    unknownIntro: "Almoços que sabemos que aconteceram, mas cujo ano ainda falta confirmar.",
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
    noLunch: "Sem almoço",
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
    intro: "Quem se senta à mesa, e quem continua sempre connosco.",
    turmaHeading: "A Turma",
    turmaIntro: "Os companheiros de viagem.",
    deaoLabel: "Deão",
    memoriamHeading: "Em Memória",
    memoriamIntro: "Sempre presentes nos nossos corações.",
    since: (year: number) => `À mesa desde ${year}`,
    empty:
      "A lista da Malta está a ser preparada. Em breve, cada nome terá aqui o seu lugar à mesa.",
    groupPhotoCaption: "A Malta reunida na sala amarela.",
  },

  about: {
    heading: "Sobre",
    lead: "Desde 24 de dezembro de 1964, um grupo de amigos junta-se à mesa por altura do Natal.",
    // Resumo feito a partir das actas de 2009 a 2025
    body: [
      "Segundo a acta de 2009, o primeiro almoço realizou-se a 24 de dezembro de 1964, data que se fixa como o início desta organização. Em 2024 celebrou-se o 60.º aniversário do Almoço de Natal.",
      "O Pai Gaspar é o Patrono ad eternam. Em cada almoço evoca-se o Patrono e o Trio Incomparável: Vasco, Manel e Xico. O mais velho dos convivas é o Deão.",
      "Este site guarda essa memória: cada almoço tem o seu lugar, com o local, a data, quem esteve presente, a ementa e a acta.",
    ],
    pillarsHeading: "O que nos junta",
    pillars: [
      { title: "A acta", body: "Cada almoço fica registado em acta, lida e aprovada no almoço seguinte." },
      { title: "O organizador", body: "No fim de cada almoço escolhe-se, por aclamação, quem organiza o do ano seguinte." },
      { title: "As gerações", body: "A 3.ª geração chegou à mesa em 1994 e a 4.ª em 2014." },
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
    organizersLabel: "Organização",
    openMap: "Abrir no mapa",
    addToCalendar: "Adicionar ao calendário",
    calendarTitle: (year: number) => `Almoço de Natal ${year} — Malta do Restelo`,
    homeBannerHeading: (year: number) => `Almoço de Natal ${year}`,
    homeBannerLink: "Ver detalhes",
    datePoll: {
      heading: "Votação da data",
      intro:
        "Que dia fica melhor para a malta? Marque todas as sextas e sábados em que pode estar presente, até 23 de dezembro. A data com mais disponibilidade ganha.",
      signInPrompt: "Inicie sessão para votar na data.",
      selected: "Disponível ✓",
      votes: (n: number) => (n === 1 ? "1 voto" : `${n} votos`),
      leading: "Mais votada",
      empty: "Ainda ninguém votou. Seja o primeiro a marcar a sua disponibilidade.",
      error: "O voto não foi guardado. Tente outra vez.",
      deviceNote: "As suas escolhas ficam guardadas neste dispositivo.",
      signInToCount: "Inicie sessão para o seu voto contar para a contagem de todos.",
    },
    restaurants: {
      heading: "Sugestões de Restaurante",
      intro:
        "Três sugestões para o próximo almoço, conforme o que a malta preferir comer. Escolha a sua e vote.",
      whyLabel: "Porquê",
      priceLabel: "Preço",
      voteButton: "Votar neste Restaurante",
      voted: "A sua escolha",
      voteToast: (name: string) => `Votou em ${name}.`,
    },
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
    noLunchHeading: "Sem almoço neste ano",
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

/** "sábado, 21 de dezembro de 2014" from "2014-12-21". */
export const formatLunchDay = (isoDate: string): string => {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(
    new Date(y, m - 1, d),
  );
};

/** "sexta-feira, 4 de dezembro" — for the date poll (no year). */
export const formatPollDay = (isoDate: string): string => {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "numeric", month: "long" }).format(
    new Date(y, m - 1, d),
  );
};

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

export interface DecadeGroup {
  /** Stable key, also used in the anchor id. `null` decade = year not confirmed. */
  decade: number | null;
  /** Anchor id the decade menu scrolls to, e.g. "decada-1960". */
  anchorId: string;
  label: string;
  entries: TimelineEntry[];
}

/**
 * Timeline entries grouped by decade, oldest first, for the decade menu and the
 * timeline sections. Every decade from 1960 to today is included (empty ones too,
 * so the menu is complete and predictable); entries without a year come last.
 */
export const getDecadeGroups = (
  entries: TimelineEntry[] = timelineEntries,
  now: Date = new Date(),
): DecadeGroup[] => {
  const groups: DecadeGroup[] = getDecades(now).map((decade) => ({
    decade,
    anchorId: `decada-${decade}`,
    label: siteContent.archive.decadeLabel(decade),
    entries: entries
      .filter((e) => e.year !== null && decadeOf(e.year) === decade)
      .sort((a, b) => (a.year as number) - (b.year as number)),
  }));

  const undated = entries.filter((e) => e.year === null);
  if (undated.length > 0) {
    groups.push({
      decade: null,
      anchorId: "decada-sem-ano",
      label: siteContent.decadeMenu.unknownHeading,
      entries: undated,
    });
  }
  return groups;
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
