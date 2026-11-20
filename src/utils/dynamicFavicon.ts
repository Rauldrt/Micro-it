import { MU_FLAT_PATH } from '../components/MicroLogo';

export interface DayFaviconConfig {
  dayName: string;
  themeName: string;
  neonWide: string;
  neonMid: string;
  neonContour: string;
  shapeDescription: string;
}

// Configuración cromática de la sombra neón por día de la semana (0 = Domingo, ..., 6 = Sábado)
// El símbolo µ se mantiene SIEMPRE intacto, variando dinámicamente su resplandor neón
export const WEEKDAY_FAVICON_CONFIGS: Record<number, DayFaviconConfig> = {
  // Domingo (0) - Aurora Cósmica Multicromática
  0: {
    dayName: 'Domingo',
    themeName: 'Aurora Cósmica',
    neonWide: '#06b6d4',
    neonMid: '#a855f7',
    neonContour: '#10b981',
    shapeDescription: 'Símbolo µ con aura mística multicolor'
  },
  // Lunes (1) - Verde Esmeralda Neón (Energía y comienzo)
  1: {
    dayName: 'Lunes',
    themeName: 'Verde Esmeralda',
    neonWide: '#059669',
    neonMid: '#10b981',
    neonContour: '#34d399',
    shapeDescription: 'Símbolo µ con resplandor verde esmeralda'
  },
  // Martes (2) - Cian Polar (Agilidad y tecnología)
  2: {
    dayName: 'Martes',
    themeName: 'Cian Polar',
    neonWide: '#0891b2',
    neonMid: '#06b6d4',
    neonContour: '#22d3ee',
    shapeDescription: 'Símbolo µ con resplandor cian polar'
  },
  // Miércoles (3) - Azul Eléctrico (Fuerza y estabilidad comercial)
  3: {
    dayName: 'Miércoles',
    themeName: 'Azul Eléctrico',
    neonWide: '#0284c7',
    neonMid: '#38bdf8',
    neonContour: '#60a5fa',
    shapeDescription: 'Símbolo µ con resplandor azul eléctrico'
  },
  // Jueves (4) - Violeta / Índigo Cyber (Creatividad y software)
  4: {
    dayName: 'Jueves',
    themeName: 'Violeta Cyber',
    neonWide: '#7c3aed',
    neonMid: '#8b5cf6',
    neonContour: '#c084fc',
    shapeDescription: 'Símbolo µ con resplandor violeta'
  },
  // Viernes (5) - Magenta / Fucsia Aurora de Alta Energía
  5: {
    dayName: 'Viernes',
    themeName: 'Magenta Eléctrico',
    neonWide: '#ec4899',
    neonMid: '#f43f5e',
    neonContour: '#fb7185',
    shapeDescription: 'Símbolo µ con resplandor magenta eléctrico'
  },
  // Sábado (6) - Ámbar / Naranja Solar (Hardware y calidez)
  6: {
    dayName: 'Sábado',
    themeName: 'Ámbar Solar',
    neonWide: '#d97706',
    neonMid: '#f59e0b',
    neonContour: '#fde047',
    shapeDescription: 'Símbolo µ con resplandor ámbar cálido'
  }
};

/**
 * Genera el SVG del favicon:
 * - Glifo oficial µ en negro puro (#000000).
 * - Borde blanco nítido (#ffffff) exclusivo para la pestaña, recortándolo sobre cualquier fondo.
 * - Sombra neón difuminada multi-capa dinámica según el día de la semana.
 */
export function generateFaviconSvg(dayIndex: number): string {
  const config = WEEKDAY_FAVICON_CONFIGS[dayIndex] ?? WEEKDAY_FAVICON_CONFIGS[1];
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-14 -12 128 124" width="100%" height="100%">
  <defs>
    <filter id="dayGlow" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="${config.neonWide}" flood-opacity="0.95" />
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="${config.neonMid}" flood-opacity="1" />
      <feDropShadow dx="0" dy="0" stdDeviation="1.8" flood-color="${config.neonContour}" flood-opacity="1" />
    </filter>
  </defs>
  <path 
    d="${MU_FLAT_PATH}" 
    fill="#000000" 
    stroke="#ffffff" 
    stroke-width="3" 
    stroke-linejoin="miter" 
    filter="url(#dayGlow)" 
  />
</svg>`;
}

/**
 * Devuelve el SVG como Data-URI seguro para ser asignado en <link rel="icon">.
 */
export function getFaviconDataUri(dayIndex: number): string {
  const svg = generateFaviconSvg(dayIndex);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Aplica el favicon dinámico del día actual en el <head> del documento.
 * Ejecución ultra-rápida (< 0.05ms) en memoria sin llamadas a red ni recálculos GPU.
 */
export function applyDynamicFavicon(forcedDayIndex?: number): void {
  if (typeof document === 'undefined') return;

  const dayToApply = forcedDayIndex ?? new Date().getDay();
  const faviconUri = getFaviconDataUri(dayToApply);

  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    document.head.appendChild(link);
  }

  link.href = faviconUri;
}

/**
 * Configura un temporizador silencioso que espera a la medianoche para cambiar el color del día automáticamente.
 * Costo de CPU: 0%.
 */
export function setupMidnightFaviconSync(): () => void {
  applyDynamicFavicon();

  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    1
  );
  const msUntilMidnight = midnight.getTime() - now.getTime();

  const timer = setTimeout(() => {
    applyDynamicFavicon();
    setupMidnightFaviconSync();
  }, Math.max(1000, msUntilMidnight));

  return () => clearTimeout(timer);
}
