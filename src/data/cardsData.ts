import { CardItem } from '../types';

export const CARDS_DATA: CardItem[] = [
  {
    id: 'card-1',
    number: '01',
    title: 'Aurora Boreal',
    subtitle: 'Noches Magicas del Norte',
    category: 'Fenómeno Natural',
    location: 'Reykjavík, Islandia',
    imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#10b981',
    gradient: 'from-emerald-900/90 via-teal-900/60 to-slate-950',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Danza electromagnética luminosa en la magnetosfera polar septentrional.',
    specs: [
      { label: 'Altitud', value: '100 - 300 km' },
      { label: 'Intensidad KP', value: '6.8 Solar' },
      { label: 'Temperatura', value: '-12°C' },
      { label: 'Visibilidad', value: '98% Excelente' }
    ],
    longDescription: 'La aurora boreal es uno de los fenómenos ópticos atmosféricos más sobrecogedores del planeta. Ocurre cuando las partículas cargadas del viento solar colisionan con los gases de la termosfera terrestre, emitiendo radiaciones lumínicas en tonos esmeralda, cian y violeta.',
    tags: ['Islandia', 'Magnetosfera', 'Ecoturismo', 'Fotografía Nocturna']
  },
  {
    id: 'card-2',
    number: '02',
    title: 'Ciudad Neón',
    subtitle: 'Futurismo Urbano',
    category: 'Arquitectura Cyberpunk',
    location: 'Shinjuku, Tokio',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#ec4899',
    gradient: 'from-pink-900/90 via-purple-900/60 to-slate-950',
    glowColor: 'rgba(236, 72, 153, 0.35)',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    description: 'Rascacielos iluminados por luminiscencia retrofuturista de alta densidad.',
    specs: [
      { label: 'Densidad Pop.', value: '15,000 /km²' },
      { label: 'Luces Neón', value: '2.4M LED' },
      { label: 'Tráfico Peatonal', value: '3.5M /día' },
      { label: 'Energía', value: '100% Renovable' }
    ],
    longDescription: 'Tokio representa la cúspide de la metrópoli moderna. Sus avenidas en Shinjuku y Shibuya cobran vida al anochecer con pantallas gigantográficas holográficas, arquitectura vertical desafiante y una sinfonía cibernética en movimiento constante.',
    tags: ['Tokio', 'Neón', 'Cyberpunk', 'Rascacielos']
  },
  {
    id: 'card-3',
    number: '03',
    title: 'Abismo Marino',
    subtitle: 'Profundidades Abisales',
    category: 'Mundo Submarino',
    location: 'Fosa de las Marianas',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#3b82f6',
    gradient: 'from-blue-900/90 via-indigo-950/70 to-slate-950',
    glowColor: 'rgba(59, 130, 246, 0.35)',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    description: 'Ecosistema abisal con criaturas bioluminiscentes e hidrotérmicas.',
    specs: [
      { label: 'Profundidad', value: '10,994 m' },
      { label: 'Presión Atm.', value: '1,086 bar' },
      { label: 'Especies', value: '2,400+ Únicas' },
      { label: 'Luz Solar', value: '0.00% Absoluta' }
    ],
    longDescription: 'En la fosa más profunda de la Tierra impera una oscuridad perpetua y presiones colosales. A pesar de estas condiciones extremas, la vida florece a través de la quimiosíntesis alrededor de fumarolas hidrotermales.',
    tags: ['Océano', 'Bioluminiscencia', 'Exploración', 'Fosa Abisal']
  },
  {
    id: 'card-4',
    number: '04',
    title: 'Dunas de Atacama',
    subtitle: 'Horizonte Dorado',
    category: 'Paisaje Desértico',
    location: 'San Pedro, Chile',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#f97316',
    gradient: 'from-amber-900/90 via-orange-950/60 to-slate-950',
    glowColor: 'rgba(249, 115, 22, 0.35)',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    description: 'Ondulaciones de arena de salitre y cañones esculpidos por milenios.',
    specs: [
      { label: 'Humedad', value: '2.1% Máx' },
      { label: 'Altitud Media', value: '2,400 m' },
      { label: 'Cielo Limpio', value: '330 días/año' },
      { label: 'Radiación', value: 'Extrema UV' }
    ],
    longDescription: 'El desierto de Atacama es el lugar no polar más árido del planeta. Sus formaciones rocosas rojas, salares resplandecientes y horizontes cobrizos ofrecen uno de los cielos nocturnos más nítidos para la observación astronómica mundial.',
    tags: ['Atacama', 'Desierto', 'Cielo Estelar', 'Geología']
  },
  {
    id: 'card-5',
    number: '05',
    title: 'Valle Esmeralda',
    subtitle: 'Gigantes Antiguos',
    category: 'Bosque Primario',
    location: 'Parque Yosemite, EE.UU.',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#84cc16',
    gradient: 'from-lime-900/90 via-emerald-950/70 to-slate-950',
    glowColor: 'rgba(132, 204, 22, 0.35)',
    badgeBg: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
    description: 'Secuoyas milenarias envueltas en brumas místicas de alta montaña.',
    specs: [
      { label: 'Altura Árboles', value: '95 metros' },
      { label: 'Longevidad', value: '3,000+ años' },
      { label: 'Oxígeno', value: 'Puro 99.4%' },
      { label: 'Biodiversidad', value: 'Alta Escala' }
    ],
    longDescription: 'Los bosques de secuoyas gigantes albergan a los seres vivos más masivos del planeta. Sus frondosas copas filtran la luz solar creando haces dorados que atraviesan la niebla matutina en un entorno boscoso ancestral.',
    tags: ['Bosque', 'Secuoyas', 'Naturaleza', 'Yosemite']
  },
  {
    id: 'card-6',
    number: '06',
    title: 'Nebulosa Orión',
    subtitle: 'Cuna de Estrellas',
    category: 'Astrofísica Cósmica',
    location: 'Constelación de Orión',
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#a855f7',
    gradient: 'from-purple-900/90 via-violet-950/70 to-slate-950',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description: 'Materia estelar interestelar en gestación masiva de protoxestrellas.',
    specs: [
      { label: 'Distancia', value: '1,344 años luz' },
      { label: 'Diámetro', value: '24 años luz' },
      { label: 'Masa Solar', value: '2,000x M☉' },
      { label: 'Componente', value: 'H2 + Helio' }
    ],
    longDescription: 'Ubicada al sur del Cinturón de Orión, la Nebulosa M42 es una de las nebulosas más brillantes del cielo nocturno. Es una auténtica nursery estelar donde nuevas estrellas nacen condensando nubes interestelares de gas y polvo.',
    tags: ['Cosmos', 'Nebulosa', 'Estrellas', 'Universo']
  }
];
