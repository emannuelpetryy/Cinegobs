export interface AvatarOption {
  id: string;
  name: string;
  category: string;
  url: string; // Either an image path (/imgs/...), photo data URI, or SVG avatar key
}

export const AVATAR_CATEGORIES = [
  'Todos',
  'Cinegobetti',
  'Clássicos',
  'Cinema',
  'Gradientes Apple',
];

export const AVATAR_OPTIONS: AvatarOption[] = [
  // Cinegobetti Official Mascots
  {
    id: 'cine-cat-official',
    name: 'Gatinho Cinegobetti',
    category: 'Cinegobetti',
    url: '/imgs/icon.png',
  },
  {
    id: 'cine-cat-dark',
    name: 'Gatinho Fundo Escuro',
    category: 'Cinegobetti',
    url: '/imgs/iconefundoescuro.png',
  },
  {
    id: 'cine-cat-light',
    name: 'Gatinho Fundo Claro',
    category: 'Cinegobetti',
    url: '/imgs/iconefundoclaro.png',
  },

  // Clássicos
  {
    id: 'netflix-red',
    name: 'Vermelho Clássico',
    category: 'Clássicos',
    url: 'netflix-red',
  },
  {
    id: 'crown-emerald',
    name: 'Coroa Real',
    category: 'Clássicos',
    url: 'crown-emerald',
  },
  {
    id: 'cosmic-star',
    name: 'Estrela Cósmica',
    category: 'Clássicos',
    url: 'cosmic-star',
  },

  // Cinema & Arte
  {
    id: 'aviator-glasses',
    name: 'Óculos Aviador',
    category: 'Cinema',
    url: 'aviator-glasses',
  },
  {
    id: 'cine-clapper',
    name: 'Claquete Studio',
    category: 'Cinema',
    url: 'cine-clapper',
  },
  {
    id: 'cine-popcorn',
    name: 'Pipoca Gourmet',
    category: 'Cinema',
    url: 'cine-popcorn',
  },
  {
    id: 'cine-ticket',
    name: 'Ticket VIP',
    category: 'Cinema',
    url: 'cine-ticket',
  },
  {
    id: 'director-violet',
    name: 'Diretor de Cinema',
    category: 'Cinema',
    url: 'director-violet',
  },
  {
    id: 'popcorn-amber',
    name: 'Pipoca Retrô',
    category: 'Cinema',
    url: 'popcorn-amber',
  },

  // Gradientes Apple
  {
    id: 'apple-aurora',
    name: 'Aurora Boreal',
    category: 'Gradientes Apple',
    url: 'apple-aurora',
  },
  {
    id: 'apple-sunset',
    name: 'Sunset Glow',
    category: 'Gradientes Apple',
    url: 'apple-sunset',
  },
  {
    id: 'apple-cyber',
    name: 'Cyber Neon',
    category: 'Gradientes Apple',
    url: 'apple-cyber',
  },
  {
    id: 'apple-emerald',
    name: 'Esmeralda Pura',
    category: 'Gradientes Apple',
    url: 'apple-emerald',
  },
  {
    id: 'apple-midnight',
    name: 'Safira Noturna',
    category: 'Gradientes Apple',
    url: 'apple-midnight',
  },
  {
    id: 'apple-gold',
    name: 'Royal Gold',
    category: 'Gradientes Apple',
    url: 'apple-gold',
  },
];
