import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Palette, 
  Cpu, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Server, 
  Globe, 
  Workflow,
  Radio,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface StudioBentoGalleryProps {
  accentColor?: string;
}

type FilterCategory = 'all' | 'web' | 'fiscal' | 'hardware' | 'ai' | 'design';

interface FilterTab {
  id: FilterCategory;
  label: string;
}

const FILTER_TABS: FilterTab[] = [
  { id: 'all', label: 'Todo el Ecosistema' },
  { id: 'web', label: 'Web & Cloud' },
  { id: 'fiscal', label: 'Fiscal ARCA / AFIP' },
  { id: 'hardware', label: 'Hardware & POS' },
  { id: 'ai', label: 'Gemini AI' },
  { id: 'design', label: 'UI/UX & Branding' }
];

export const StudioBentoGallery: React.FC<StudioBentoGalleryProps> = ({
  accentColor = '#0ea5e9'
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  
  // Estados para los switches interactivos con física líquida Material Design 3
  const [toggleHero, setToggleHero] = useState<boolean>(true);
  const [toggleDesign, setToggleDesign] = useState<boolean>(true);
  const [toggleFiscal, setToggleFiscal] = useState<boolean>(true);
  const [toggleAi, setToggleAi] = useState<boolean>(true);

  // Pasos del pipeline de desarrollo interactivo
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    { num: '01', title: 'Relevamiento & UI/UX', desc: 'Wireframes & Figma 4K', status: 'Completado' },
    { num: '02', title: 'Arquitectura Cloud', desc: 'React 19 + TypeScript', status: 'En Sprints' },
    { num: '03', title: 'Homologación AFIP', desc: 'CAE & Testing POS', status: 'Certificado' },
    { num: '04', title: 'Despliegue 24/7', desc: 'CI/CD & SLA 99.9%', status: 'Activo' }
  ];

  return (
    <div className="w-full space-y-6 pt-2 select-none">
      {/* Cabecera de la Galería Bento con Chips de Filtrado Líquidos MD3 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Galería de Ingeniería & Soluciones</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Arquitectura de Marca & Ecosistema de Software
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-light">
            Estructura modular al estilo Windows Tiles con geometría de cantos profundos y transiciones líquidas:
          </p>
        </div>

        {/* Chips de Filtrado con indicador líquido Material Design 3 */}
        <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md self-start md:self-auto overflow-x-auto no-scrollbar">
          {FILTER_TABS.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                  isSelected ? 'text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="bento-filter-pill"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 28
                    }}
                    className="absolute inset-0 rounded-xl shadow-md"
                    style={{ backgroundColor: accentColor }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Principal Bento: 3 Columnas con Tiles Asimétricos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* =====================================================================
            TILE 1 (HERO / PRINCIPAL - COL-SPAN 2):
            Geometría inspirada en el Hero Card de RonDesignLab (Workflow, Pipeline & Specs)
            ===================================================================== */}
        {(activeFilter === 'all' || activeFilter === 'web' || activeFilter === 'fiscal') && (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            whileHover={{ y: -4 }}
            className="lg:col-span-2 rounded-[28px] md:rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-slate-900/90 border border-white/15 shadow-2xl relative overflow-hidden flex flex-col justify-between group"
            style={{
              boxShadow: `0 20px 50px -12px ${accentColor}20`
            }}
          >
            {/* Destello de fondo sutil */}
            <div 
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none opacity-20 blur-2xl"
              style={{ background: accentColor }}
            />

            <div>
              {/* Header del Hero Tile */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-lg"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span>Ingeniería a Medida & PWAs</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Producción 24/7
                      </span>
                    </h4>
                    <span className="text-xs text-slate-400">
                      Sistemas web de alto rendimiento, facturación en la nube y aplicaciones de escritorio
                    </span>
                  </div>
                </div>

                {/* Stack de badges tecnológicos */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['React 19', 'TypeScript', 'Tailwind', 'Cloud Firestore', 'Node'].map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pipeline de Trabajo / Hitos Conectados (Geometría del timeline en la imagen) */}
              <div className="py-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Workflow className="w-3.5 h-3.5 text-sky-400" />
                    <span>Ciclo de Desarrollo Continuo</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Hito activo: <span className="text-white font-bold">{steps[activeStep].title}</span>
                  </span>
                </div>

                {/* Línea de nodos conectores estilo RonDesignLab */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
                  {steps.map((st, i) => {
                    const isSelected = activeStep === i;
                    return (
                      <div
                        key={i}
                        onClick={() => setActiveStep(i)}
                        className={`relative p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'bg-white/15 border-white/40 shadow-xl'
                            : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10'
                        }`}
                      >
                        {/* Micro checkmark / status */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-slate-400">{st.num}</span>
                          <div 
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                              isSelected ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-white/10 text-slate-400'
                            }`}
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        </div>
                        <div className="text-xs font-bold text-white truncate">{st.title}</div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{st.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Métricas Inferiores con Switch Líquido Material Design 3 */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Modalidad</div>
                  <div className="text-xs sm:text-sm font-black text-white mt-0.5">100% a Medida</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Metodología</div>
                  <div className="text-xs sm:text-sm font-black text-white mt-0.5">Sprints Ágiles</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Disponibilidad</div>
                  <div className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5">99.98% Uptime</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Soporte</div>
                  <div className="text-xs sm:text-sm font-black text-white mt-0.5">Directo Local</div>
                </div>
              </div>

              {/* Switch Líquido MD3 para simular estado activo */}
              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <span className="text-[11px] text-slate-300 font-mono">Modo Live</span>
                <button
                  type="button"
                  onClick={() => setToggleHero(!toggleHero)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 relative cursor-pointer ${
                    toggleHero ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                  title="Conmutador Líquido Material Design 3"
                >
                  <motion.div
                    layout
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30
                    }}
                    className={`w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center ${
                      toggleHero ? 'ml-auto' : ''
                    }`}
                  >
                    {toggleHero && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
                  </motion.div>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* =====================================================================
            TILE 2 & 3 (LATERALES DERECHOS):
            Geometría exacta inspirada en las dos tarjetas verticales de RonDesignLab
            ===================================================================== */}
        <div className="flex flex-col gap-5">
          
          {/* TILE 2: Diseño de Identidad & UI/UX (Estilo Unsplash Card en imagen) */}
          {(activeFilter === 'all' || activeFilter === 'design') && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              whileHover={{ y: -4 }}
              className="rounded-[28px] p-6 bg-gradient-to-br from-slate-900/95 to-slate-950/95 border border-white/15 shadow-xl relative overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center justify-center">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">Identidad & UI/UX</h5>
                      <span className="text-[10px] text-slate-400 font-mono">Figma to Production</span>
                    </div>
                  </div>

                  {/* Switch Líquido MD3 */}
                  <button
                    type="button"
                    onClick={() => setToggleDesign(!toggleDesign)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 cursor-pointer ${
                      toggleDesign ? 'bg-pink-500' : 'bg-slate-800'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center ${
                        toggleDesign ? 'ml-auto' : ''
                      }`}
                    >
                      {toggleDesign && <Check className="w-2.5 h-2.5 text-pink-600 stroke-[3]" />}
                    </motion.div>
                  </button>
                </div>

                <div className="pt-4">
                  <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                    Tasa de Refresco Visual
                  </div>
                  <div className="text-3xl font-black text-white tracking-tight mt-1">
                    120 <span className="text-pink-400 text-lg">FPS</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 font-light leading-relaxed">
                    Animaciones fluidas y diseño de sistemas tipográficos reactivos sin sobrecarga en CPU ni micro-tirones.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono mt-3">
                <span>Branding Completo</span>
                <span className="text-pink-400 font-bold">100% Vectorial</span>
              </div>
            </motion.div>
          )}

          {/* TILE 3: Fiscal ARCA / AFIP & Hardware POS (Estilo Dropbox Card en imagen) */}
          {(activeFilter === 'all' || activeFilter === 'fiscal' || activeFilter === 'hardware') && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-[28px] p-6 bg-gradient-to-br from-slate-900/95 to-slate-950/95 border border-white/15 shadow-xl relative overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">Fiscal ARCA / AFIP</h5>
                      <span className="text-[10px] text-slate-400 font-mono">CAE Inmediato</span>
                    </div>
                  </div>

                  {/* Switch Líquido MD3 */}
                  <button
                    type="button"
                    onClick={() => setToggleFiscal(!toggleFiscal)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 cursor-pointer ${
                      toggleFiscal ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center ${
                        toggleFiscal ? 'ml-auto' : ''
                      }`}
                    >
                      {toggleFiscal && <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />}
                    </motion.div>
                  </button>
                </div>

                <div className="pt-4">
                  <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                    Tiempo de Emisión Oficial
                  </div>
                  <div className="text-3xl font-black text-white tracking-tight mt-1">
                    0.8 <span className="text-emerald-400 text-lg">seg</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 font-light leading-relaxed">
                    Generación automática de comprobantes con código QR obligatorio, enlace a impresoras térmicas y respaldo fiscal.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono mt-3">
                <span>Homologación</span>
                <span className="text-emerald-400 font-bold">Oficial WSN</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* =====================================================================
          FILA INFERIOR DE TILES BENTO: 3 Módulos de Especialidad
          ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* TILE 4: Gemini AI Core */}
        {(activeFilter === 'all' || activeFilter === 'ai') && (
          <motion.div
            layout
            whileHover={{ y: -4 }}
            className="rounded-[26px] p-5 sm:p-6 bg-slate-900/90 border border-white/10 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h5 className="text-sm font-bold text-white">Inteligencia Artificial Gemini</h5>
              <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
                Transcripción y síntesis de notas de voz de clientes, análisis de imágenes y automatización conversacional.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-purple-300 mt-4">
              <span>IA Multimodal</span>
              <span className="font-bold">Google Gemini</span>
            </div>
          </motion.div>
        )}

        {/* TILE 5: Hardware de Última Milla */}
        {(activeFilter === 'all' || activeFilter === 'hardware') && (
          <motion.div
            layout
            whileHover={{ y: -4 }}
            className="rounded-[26px] p-5 sm:p-6 bg-slate-900/90 border border-white/10 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center mb-3">
                <Radio className="w-4 h-4" />
              </div>
              <h5 className="text-sm font-bold text-white">Hardware & Conectividad POS</h5>
              <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
                Lectores de código de barras, rollos continuos Bluetooth (58/80 mm) y balanzas de peso comerciales en sitio.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-amber-300 mt-4">
              <span>Bluetooth & USB</span>
              <span className="font-bold">Plug & Play</span>
            </div>
          </motion.div>
        )}

        {/* TILE 6: Offline-First & Seguridad */}
        {(activeFilter === 'all' || activeFilter === 'web' || activeFilter === 'fiscal') && (
          <motion.div
            layout
            whileHover={{ y: -4 }}
            className="rounded-[26px] p-5 sm:p-6 bg-slate-900/90 border border-white/10 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h5 className="text-sm font-bold text-white">Arquitectura Offline-First</h5>
              <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
                Tus operaciones comerciales nunca se detienen: cobrá sin internet y sincronizá automáticamente al reconectar.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-sky-300 mt-4">
              <span>Zero Downtime</span>
              <span className="font-bold">100% Autónomo</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
