import { CardItem } from '../types';

export const CARDS_DATA: CardItem[] = [
  {
    id: 'card-1',
    number: '01',
    title: 'Micro-it Studio',
    subtitle: 'Desarrollo a Medida & Branding',
    category: 'Agencia de Software',
    location: 'Argentina / Latam',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#0ea5e9',
    gradient: 'from-sky-900/90 via-blue-950/70 to-slate-950',
    glowColor: 'rgba(14, 165, 233, 0.35)',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    description: 'Ingeniería de software, diseño de identidad de marca y sistemas web/móviles para empresas.',
    specs: [
      { label: 'Modalidad', value: '100% a Medida' },
      { label: 'Metodología', value: 'Sprints Ágiles' },
      { label: 'Plataformas', value: 'Web & Android' },
      { label: 'Soporte', value: 'Continuo Local' }
    ],
    longDescription: 'En Micro-it unificamos la ingeniería de software con la creación de marca. Diseñamos identidades visuales atractivas y desarrollamos sistemas a medida (PWAs, paneles administrativos y aplicaciones móviles) optimizados para el flujo operativo real de tu comercio o empresa.',
    tags: ['Desarrollo Web', 'Branding', 'UI/UX', 'Software a Medida']
  },
  {
    id: 'card-2',
    number: '02',
    title: 'Wanda POS & Cloud',
    subtitle: 'Facturación AFIP & Punto de Venta',
    category: 'Software Propio (SaaS)',
    location: 'Comercios & Retail',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67e557224e?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#10b981',
    gradient: 'from-emerald-900/90 via-teal-950/70 to-slate-950',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Terminal de cobro táctil con CAE automático de AFIP/ARCA, escáner de códigos de barra y app Android.',
    specs: [
      { label: 'Fiscal', value: 'AFIP/ARCA CAE' },
      { label: 'Plataforma', value: 'Android + Web' },
      { label: 'Catálogo', value: 'IA Quita Fondos' },
      { label: 'Modo', value: 'SaaS Multi-caja' }
    ],
    longDescription: 'Sistema integral de punto de venta multiplataforma. Emite tickets y facturas electrónicas con CAE oficial en segundos, lee códigos de barra con la cámara del dispositivo o lector físico, genera reportes de caja en tiempo real y sincroniza inventario multi-sucursal en la nube.',
    tags: ['Punto de Venta', 'AFIP ARCA', 'Facturación', 'Android APK']
  },
  {
    id: 'card-3',
    number: '03',
    title: 'WhatsApp Bulk Sender',
    subtitle: 'Automatización & Difusión B2B',
    category: 'Herramienta de Marketing',
    location: 'Venta Directa & Cobranzas',
    imageUrl: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#8b5cf6',
    gradient: 'from-purple-900/90 via-indigo-950/70 to-slate-950',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description: 'Envíos masivos y personalizados de promociones, listas de precios y avisos con algoritmo anti-bloqueo.',
    specs: [
      { label: 'Formato', value: 'Desktop .exe' },
      { label: 'Importación', value: 'Excel / CSV' },
      { label: 'Seguridad', value: 'Delay Anti-Ban' },
      { label: 'Licencia', value: 'Anual / Mensual' }
    ],
    longDescription: 'Plataforma de escritorio para comunicación masiva por WhatsApp. Carga contactos desde CSV, personaliza mensajes con variables dinámicas ({nombre}), guarda plantillas recurrentes y protege tu línea comercial con pausas inteligentes programadas.',
    tags: ['WhatsApp Marketing', 'Automatización', 'B2B', 'Desktop App']
  },
  {
    id: 'card-4',
    number: '04',
    title: 'PrintLabel Pro',
    subtitle: 'Impresión Térmica & Bluetooth',
    category: 'Hardware & Góndola',
    location: '100% Offline PWA',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#f59e0b',
    gradient: 'from-amber-900/90 via-orange-950/70 to-slate-950',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Generador e impresor de códigos de barras y QR en rollos térmicos continuos (50x30 mm, 58 mm).',
    specs: [
      { label: 'Conectividad', value: 'Bluetooth & USB' },
      { label: 'Conexión', value: '100% Offline' },
      { label: 'Simbologías', value: 'EAN-13, 128, QR' },
      { label: 'Dispositivos', value: 'Móvil & PC' }
    ],
    longDescription: 'Progressive Web App autónoma para crear e imprimir etiquetas de productos y códigos de barras en tiras térmicas continuas. Funciona sin internet ni bases de datos externas, se conecta directamente a impresoras térmicas Bluetooth o cableadas y permite ajustes milimétricos en vivo.',
    tags: ['Código de Barras', 'Impresora Térmica', 'Bluetooth SPP', 'PWA']
  },
  {
    id: 'card-5',
    number: '05',
    title: 'AudioNotes AI',
    subtitle: 'Transcripción Inteligente con Gemini',
    category: 'Inteligencia Artificial',
    location: 'Chrome Ext & Android',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#ec4899',
    gradient: 'from-pink-900/90 via-rose-950/70 to-slate-950',
    glowColor: 'rgba(236, 72, 153, 0.35)',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    description: 'Transcribe notas de voz extensas de WhatsApp a texto limpio y redacta respuestas con audio ultra-natural.',
    specs: [
      { label: 'Motor IA', value: 'Google Gemini' },
      { label: 'Velocidad', value: 'Tiempo Real' },
      { label: 'Formatos', value: 'Audio a Texto / TTS' },
      { label: 'Integración', value: 'WhatsApp Web' }
    ],
    longDescription: 'Herramienta de productividad impulsada por Inteligencia Artificial multimodal. Convierte audios largos de clientes en resúmenes ejecutivos accionables y permite responder redactando texto que luego es emitido con una voz sintetizada natural.',
    tags: ['Gemini AI', 'Transcripción', 'Notas de Voz', 'Extensión']
  },
  {
    id: 'card-6',
    number: '06',
    title: 'Hardware & Integraciones',
    subtitle: 'Conexión Comercial de Última Milla',
    category: 'Infraestructura & Operaciones',
    location: 'En Tu Negocio',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#3b82f6',
    gradient: 'from-blue-900/90 via-cyan-950/70 to-slate-950',
    glowColor: 'rgba(59, 130, 246, 0.35)',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    description: 'Integración de balanzas, impresoras de remitos desde Google Drive, ruteo de distribución y soporte en sitio.',
    specs: [
      { label: 'Google Sync', value: 'Drive & Sheets' },
      { label: 'Logística', value: 'Ruteo Reparto' },
      { label: 'Hardware', value: 'Balanzas & Fiscal' },
      { label: 'Garantía', value: 'Soporte Directo' }
    ],
    longDescription: 'Acompañamos a tu empresa en la instalación y puesta en marcha física de su equipamiento informático. Configuramos impresión automática de comprobantes desde Drive, enlaces con balanzas de peso, sistemas de reparto y optimización de redes locales.',
    tags: ['Hardware', 'Impresión Drive', 'Logística', 'Soporte']
  }
];
