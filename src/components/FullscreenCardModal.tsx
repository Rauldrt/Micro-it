import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Sparkles, Share2, Bookmark, ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { CardItem } from '../types';
import { LazyImage } from './LazyImage';
import { MicroLogo } from './MicroLogo';
import { FormattedDescription } from './FormattedDescription';

interface FullscreenCardModalProps {
  card: CardItem | null;
  onClose: () => void;
}

export const FullscreenCardModal: React.FC<FullscreenCardModalProps> = ({
  card,
  onClose
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Coordenadas del cursor en pantalla para el spotlight interactivo
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 500, y: 300 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Listener de scroll directo y nativo sobre el contenedor del modal
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollOffset(e.currentTarget.scrollTop);
  };

  // Parallax cinematográfico a paso 2:1 (por cada 2 pasos de scroll, el video se mueve 1)
  const mediaY = scrollOffset * 0.5;
  const mediaScale = 1 + Math.min(scrollOffset / 4000, 0.04);
  const heroOpacity = Math.max(0.15, 1 - scrollOffset / 900);

  // Cálculo reactivo para la Collapsing Toolbar (se revela a medida que el título del pie del video llega al tope)
  const toolbarProgress = Math.min(Math.max((scrollOffset - 360) / 160, 0), 1);
  const toolbarY = (1 - toolbarProgress) * -20;
  const showToolbar = toolbarProgress > 0.02;

  // Listen for Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (card) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [card, onClose]);

  // Detectar si el recurso es video o gif
  const isVideo = card?.mediaType === 'video' || (card?.videoUrl && card.videoUrl.trim() !== '') || (card?.imageUrl && (card.imageUrl.endsWith('.mp4') || card.imageUrl.endsWith('.webm')));
  const videoSource = card?.videoUrl || (isVideo ? card?.imageUrl : '');

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          key={card.id}
          ref={containerRef}
          initial={{ 
            clipPath: 'inset(36% 0% 36% 0%)',
            scaleY: 0.5,
            opacity: 0.9
          }}
          animate={{ 
            clipPath: 'inset(0% 0% 0% 0%)',
            scaleY: 1,
            opacity: 1
          }}
          exit={{ 
            clipPath: 'inset(36% 0% 36% 0%)',
            scaleY: 0.5,
            opacity: 0
          }}
          style={{ originY: 0.5 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1]
          }}
          onMouseMove={handleMouseMove}
          className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-y-auto overflow-x-hidden select-none"
          onScroll={handleScroll}
        >
          {/* 1. FONDO TÉCNICO CONTINUO DE MICRO-IT (Fixed: Cero Cortes o Líneas en Todo el Scroll) */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Cuadrícula Blueprint sutil que abarca toda la pantalla sin cortes */}
            <div 
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #ffffff 1px, transparent 1px),
                  linear-gradient(to bottom, #ffffff 1px, transparent 1px)
                `,
                backgroundSize: '48px 48px'
              }}
            />

            {/* Spotlight Linterna Reactivo al Cursor (Sigue el puntero en todo el documento) */}
            <div 
              className="absolute inset-0 transition-opacity duration-300 opacity-60 pointer-events-none"
              style={{
                background: `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, ${card.accentColor}25 0%, transparent 70%)`
              }}
            />

            {/* Resplandor Ambiental Polar Reactivo al Color de la Solución */}
            <div 
              className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[520px] blur-[160px] opacity-20 rounded-full pointer-events-none"
              style={{ backgroundColor: card.accentColor }}
            />
            <div 
              className="absolute bottom-10 right-10 w-[520px] h-[400px] blur-[180px] opacity-15 rounded-full bg-sky-500 pointer-events-none"
            />
          </div>

          {/* 2. COLLAPSING TOOLBAR FLOTANTE (Se revela suavemente al ocultarse el Hero) */}
          <div className="sticky top-0 z-40 w-full pointer-events-none h-0 overflow-visible">
            <div
              style={{
                opacity: toolbarProgress,
                transform: `translate3d(0, ${toolbarY}px, 0)`,
                pointerEvents: showToolbar ? 'auto' : 'none',
                visibility: showToolbar ? 'visible' : 'hidden'
              }}
              className="w-full px-4 md:px-8 py-3 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-2xl flex items-center justify-between transition-[opacity,transform] duration-150 ease-out"
            >
              {/* Identidad y Título de la Solución que emerge al scrollear */}
              <div className="flex items-center gap-3">
                <MicroLogo
                  variant="badge"
                  accentColor={card.accentColor}
                  size="sm"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs font-mono font-black"
                      style={{ color: card.accentColor }}
                    >
                      {card.number}
                    </span>
                    <h2 className="text-sm md:text-base font-extrabold text-white tracking-tight truncate max-w-[200px] sm:max-w-md">
                      {card.title}
                    </h2>
                    {isVideo && (
                      <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className="pointer-events-auto ml-2 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90 cursor-pointer"
                        title={isMuted ? 'Activar Audio' : 'Silenciar Audio'}
                      >
                        {isMuted ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium truncate hidden sm:block">
                    {card.subtitle}
                  </span>
                </div>
              </div>

              {/* Espacio reservado a la derecha alineado con el botón Salir */}
              <div className="w-24 shrink-0 pointer-events-none" />
            </div>
          </div>

          {/* 3. BOTÓN FLOTANTE SALIR (Esc) - Despejado y limpio en el tope */}
          <div className="sticky top-3.5 z-50 flex justify-end px-4 md:px-8 pointer-events-none h-0">
            <button
              onClick={onClose}
              className="pointer-events-auto h-9 px-3.5 rounded-full bg-black/90 hover:bg-black text-white text-xs font-semibold border border-white/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer animate-aurora-symbol shadow-xl"
              title="Salir (Esc)"
            >
              <span>Salir</span>
              <X className="w-3.5 h-3.5 text-sky-300" />
            </button>
          </div>

          {/* 4. ESCENARIO PARALLAX 2:1 (El video tiene protagonismo total, sin cortes y con movimiento a medio paso) */}
          <div className="absolute inset-x-0 top-0 h-[86vh] min-h-[580px] max-h-[920px] overflow-hidden pointer-events-none z-10">
            <div 
              style={{
                transform: `translate3d(0, ${mediaY}px, 0) scale(${mediaScale})`,
                transformOrigin: 'center top',
                willChange: 'transform, opacity',
                opacity: heroOpacity,
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 78%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 78%, transparent 100%)'
              }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {isVideo && videoSource ? (
                <video
                  src={videoSource}
                  poster={card.imageUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover object-top pointer-events-none opacity-95"
                />
              ) : (
                <LazyImage
                  src={card.imageUrl}
                  alt={card.title}
                  accentColor={card.accentColor}
                  className="w-full h-full object-cover object-top opacity-95"
                />
              )}

              {/* Viñeta lateral suave para que tampoco se corte en pantallas ultra-anchas */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80 pointer-events-none" />
              <div className={`absolute inset-0 bg-gradient-to-b ${card.gradient} opacity-20 mix-blend-multiply pointer-events-none`} />
            </div>
          </div>

          {/* 5. CAPA DE ELEMENTOS EN SCROLL (Ubicados al pie del video para que las tarjetas apenas asomen en el borde inferior) */}
          <div className="relative z-20 w-full min-h-screen">
            {/* Hero Text & Badges: Inician a ~70vh / 74vh, dejando ver el video completo y asomando apenas las tarjetas de specs */}
            <div 
              style={{
                opacity: Math.max(0, 1 - scrollOffset / 480),
                transform: `translate3d(0, ${scrollOffset * -0.1}px, 0)`
              }}
              className="pt-[70vh] md:pt-[74vh] pb-8 px-6 md:px-12 max-w-5xl mx-auto flex flex-col items-start gap-4 pointer-events-none"
            >
              {/* Badges y Control de Sonido ubicados juntos al pie del video */}
              <div className="flex flex-wrap items-center gap-2.5 pointer-events-auto">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${card.badgeBg}`}>
                  {card.category}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-black/50 text-slate-200 border border-white/10 backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {card.location}
                </span>
                {isVideo && (
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-mono uppercase tracking-wider">
                    Video Demo
                  </span>
                )}
                {/* Control de Audio reubicado al pie del video junto a las etiquetas */}
                {isVideo && (
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="px-3.5 py-1 rounded-full bg-slate-900/90 hover:bg-black text-white border border-white/20 backdrop-blur-md flex items-center gap-2 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:border-white/40"
                    title={isMuted ? 'Activar Audio' : 'Silenciar Audio'}
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        <span>Activar Sonido</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Sonido Activo</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-baseline gap-4">
                <span 
                  className="text-4xl md:text-6xl font-black font-mono tracking-tight opacity-40"
                  style={{ color: card.accentColor }}
                >
                  {card.number}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-2xl">
                  {card.title}
                </h1>
              </div>

              <p className="text-lg md:text-xl text-slate-200 font-light max-w-2xl drop-shadow-md">
                {card.subtitle}
              </p>
            </div>

            {/* Contenedor Central con ancho contenido (Tarjetas de especificaciones, Descripción detallada y Acciones) */}
            <div className="max-w-5xl w-full mx-auto px-6 pb-24 space-y-12 select-text">
              {/* Spec Cards Grid con Acentos Vivos & Glassmorphism Reforzado (Desliza suavemente sobre el video) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {card.specs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="group relative p-4 rounded-2xl bg-gradient-to-b from-slate-900/85 to-slate-950/80 border border-white/10 hover:border-white/25 backdrop-blur-md flex flex-col gap-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden"
                  >
                    {/* Borde superior tenue con el acento de la card */}
                    <div 
                      className="absolute top-0 inset-x-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: card.accentColor }}
                    />
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
                      <span>{spec.label}</span>
                      <span className="w-1 h-1 rounded-full opacity-60 group-hover:scale-150 transition-transform" style={{ backgroundColor: card.accentColor }} />
                    </span>
                    <span 
                      className="text-lg md:text-xl font-black tracking-tight"
                      style={{ color: card.accentColor }}
                    >
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Detailed Overview con Renderizador Interactivo & Tablas Glassmorphism */}
              <div className="relative p-6 md:p-10 rounded-3xl bg-gradient-to-b from-slate-900/85 via-slate-900/65 to-slate-950/90 border border-white/15 backdrop-blur-xl space-y-6 shadow-2xl overflow-hidden">
                {/* Destello sutil en esquina superior izquierda */}
                <div 
                  className="absolute -top-16 -left-16 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: card.accentColor }}
                />

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5 text-xs md:text-sm font-bold tracking-wider uppercase text-slate-200">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Propuesta de Valor & Especificaciones</span>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-[11px] font-mono font-bold border shadow-sm"
                    style={{ 
                      color: card.accentColor,
                      borderColor: `${card.accentColor}50`,
                      backgroundColor: `${card.accentColor}18`
                    }}
                  >
                    {card.category}
                  </span>
                </div>

                {/* Contenido estilizado dinámicamente con Markdown */}
                <FormattedDescription 
                  content={card.longDescription} 
                  accentColor={card.accentColor} 
                />

                <div className="pt-4 flex flex-wrap gap-2 border-t border-white/10">
                  {card.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/5 border border-white/10 text-slate-300 hover:border-white/20 hover:text-white transition-all cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 pb-16">
                <div className="flex items-center gap-3">
                  <button 
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-slate-950 transition-all hover:brightness-110 active:scale-95 shadow-xl cursor-pointer"
                    style={{ backgroundColor: card.accentColor }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Explorar Experiencia</span>
                  </button>

                  <button className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 cursor-pointer">
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <button className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 cursor-pointer">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Cerrar vista completa (Esc)
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
