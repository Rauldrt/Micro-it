import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CardItem } from '../types';
import { 
  BarChart3, 
  Sliders, 
  Compass, 
  Sparkles, 
  Minimize2, 
  Play, 
  Pause, 
  Touchpad, 
  ChevronRight,
  Layers,
  Palette,
  Database
} from 'lucide-react';
import { MicroLogo, LogoVariant } from './MicroLogo';
import { AdminCardsPanel } from './AdminCardsPanel';

interface BottomElementProps {
  cards?: CardItem[];
  activeCard: CardItem;
  isExpanded: boolean;
  onCompress: () => void;
  autoPlay: boolean;
  onToggleAutoPlay: () => void;
  speed: number;
  onChangeSpeed: (val: number) => void;
  cardIndex: number;
  totalCards: number;
  onSelectCard: (index: number) => void;
}

export const BottomElement: React.FC<BottomElementProps> = ({
  cards = [],
  activeCard,
  isExpanded,
  onCompress,
  autoPlay,
  onToggleAutoPlay,
  speed,
  onChangeSpeed,
  cardIndex,
  totalCards,
  onSelectCard
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'controls' | 'navigator' | 'branding' | 'admin'>('details');

  if (!isExpanded) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-2 md:p-4">
      <motion.div
        layoutId="bottom-morph"
        transition={{
          type: 'spring',
          stiffness: 240,
          damping: 24,
          mass: 0.85
        }}
        className="relative overflow-hidden rounded-3xl bg-slate-900 border border-white/20 shadow-2xl text-white"
      >
        {/* Glow Header Accent */}
        <div 
          className="absolute top-0 inset-x-0 h-1 transition-colors duration-500"
          style={{ backgroundColor: activeCard.accentColor }}
        />

        {/* Card Top Navigation / Compress Button */}
        <motion.div 
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          className="flex items-center justify-between p-4 md:px-6 border-b border-white/10"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: activeCard.accentColor }}
            />
            <div>
              <h3 className="text-sm font-bold tracking-wide flex items-center gap-2">
                <span>Panel Inferior Activo</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                  {activeCard.number} / {String(totalCards).padStart(2, '0')}
                </span>
              </h3>
              <p className="text-xs text-slate-400">Información extendida y controles del carrusel</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCompress}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition-all active:scale-95 cursor-pointer"
              title="Comprimir panel inferior hacia icono centro inferior"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Comprimir Panel</span>
            </button>
          </div>
        </motion.div>

        {/* Tab Selector */}
        <motion.div 
          initial={{ opacity: 0, scaleX: 0.85 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.45, delay: 0.18, ease: 'easeOut' }}
          className="flex border-b border-white/10 bg-black/20 p-1.5"
        >
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Telemetría</span>
          </button>

          <button
            onClick={() => setActiveTab('controls')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'controls'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Ajustes Fluidez</span>
          </button>

          <button
            onClick={() => setActiveTab('navigator')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'navigator'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Navegador</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'branding'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Variantes µ</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-amber-500/30 text-amber-300 shadow-sm border border-amber-500/40'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Cards</span>
          </button>
        </motion.div>

        {/* Tab Contents */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
          className="p-4 md:p-6 min-h-[160px]"
        >
          {activeTab === 'details' && (
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.28 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Card Seleccionado
                  </span>
                  <h4 className="text-lg font-extrabold text-white">
                    {activeCard.title} — {activeCard.subtitle}
                  </h4>
                </div>
                <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold border ${activeCard.badgeBg}`}>
                  {activeCard.category}
                </span>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.32 }}
                className="text-xs text-slate-300 leading-relaxed"
              >
                {activeCard.description}
              </motion.p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {activeCard.specs.map((spec, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.9, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.35 + i * 0.05 }}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="text-[10px] text-slate-400 font-mono">{spec.label}</div>
                    <div className="text-sm font-bold text-slate-100">{spec.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'controls' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.28 }}
              className="space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                    <Touchpad className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Reproducción Automática</div>
                    <div className="text-[11px] text-slate-400">Desplazamiento vertical fluido temporizado</div>
                  </div>
                </div>

                <button
                  onClick={onToggleAutoPlay}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    autoPlay
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{autoPlay ? 'Pausado' : 'Activar Auto'}</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Intervalo de Transición (Segundos)</span>
                  <span className="font-mono font-bold text-indigo-400">{speed}s</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="0.5"
                  value={speed}
                  onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'navigator' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.28 }}
              className="space-y-3"
            >
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Saltar directamente a cualquier tarjeta:</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {Array.from({ length: totalCards }).map((_, idx) => {
                  const isActive = idx === cardIndex;
                  return (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 + idx * 0.04 }}
                      onClick={() => onSelectCard(idx)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 border-indigo-400 text-white font-bold shadow-lg scale-105'
                          : 'bg-white/5 border-white/10 hover:bg-white/15 text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-mono font-bold">0{idx + 1}</div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'branding' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.28 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>Variantes de Identidad del Símbolo Micro (µ)</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Explora las 4 propuestas vectoriales para el isotipo oficial de Micro-it:
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  Acento actual: {activeCard.accentColor}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {/* 1. BADGE DINÁMICO 3D (ELEGIDO) */}
                <div className="p-4 rounded-2xl bg-white/10 border-2 border-emerald-400/40 shadow-xl flex flex-col items-center text-center gap-3 hover:border-emerald-400 transition-all relative overflow-hidden">
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                    Elegido
                  </div>
                  <MicroLogo variant="badge" size="lg" accentColor={activeCard.accentColor} />
                  <div>
                    <div className="text-xs font-bold text-white">01. Badge Dinámico 3D</div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                      Símbolo µ con bordes rectos en negro sólido, cuerpo con gradiente de negro al color dinámico y sombra polar Aurora Boreal.
                    </p>
                  </div>
                </div>

                {/* 2. GEOMÉTRICO */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center gap-3 hover:border-white/25 transition-all">
                  <MicroLogo variant="geometric" size="lg" accentColor={activeCard.accentColor} />
                  <div>
                    <div className="text-xs font-bold text-white">02. Isotipo Geométrico</div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Trazo tecnológico limpio con esquinas suaves y proporciones matemáticas.
                    </p>
                  </div>
                </div>

                {/* 3. CIRCUIT NODE */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center gap-3 hover:border-white/25 transition-all">
                  <MicroLogo variant="circuit" size="lg" accentColor={activeCard.accentColor} />
                  <div>
                    <div className="text-xs font-bold text-white">03. Circuit Node</div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Terminal de circuito integrado: representa desarrollo de software y hardware.
                    </p>
                  </div>
                </div>

                {/* 4. MINIMALISTA OUTLINE */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center gap-3 hover:border-white/25 transition-all">
                  <MicroLogo variant="minimal" size="lg" accentColor={activeCard.accentColor} />
                  <div>
                    <div className="text-xs font-bold text-white">04. Minimal Outline</div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Línea pura sin rellenos densos, perfecta para señalética y favicons ligeros.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.28 }}
            >
              <AdminCardsPanel cards={cards} />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
