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
  
  // Referencias para las 3 capas del Parallax
  const videoLayerRef = useRef<HTMLDivElement>(null); // Capa 0: Fondo (Video)
  const gridLayerRef = useRef<HTMLDivElement>(null);  // Capa 1: Intermedia (Cuadrícula Blueprint)
  const midLightsRef = useRef<HTMLDivElement>(null);  // Capa 1: Intermedia (Luces y Spotlight)
  const spotlightRef = useRef<HTMLDivElement>(null);  // Spotlight reactivo al cursor
  const heroTextRef = useRef<HTMLDivElement>(null);   // Capa 2: Superior (Texto Hero)
  const toolbarRef = useRef<HTMLDivElement>(null);    // Toolbar superior fija

  const [isMuted, setIsMuted] = useState(true);
  const mouseRafRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);

  // MouseMove de ultra-alto rendimiento: actualiza el spotlight directamente en la capa intermedia
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlightRef.current || !card) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    const accentColor = card.accentColor;
    if (mouseRafRef.current !== null) cancelAnimationFrame(mouseRafRef.current);
    mouseRafRef.current = requestAnimationFrame(() => {
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(750px circle at ${clientX}px ${clientY}px, ${accentColor}28 0%, transparent 70%)`;
      }
      mouseRafRef.current = null;
    });
  };

  /**
   * Parallax Cinemático de 3 Capas con diferencia de 1/4 (25%) entre cada una:
   * - Capa 2 (Superior - Cards y Textos): Velocidad 1.00 (Flujo de scroll normal)
   * - Capa 1 (Intermedia - Cuadrícula Blueprint): Velocidad 0.75 (Diferencia de 1/4 con la superior)
   * - Capa 0 (Fondo - Video): Velocidad 0.50 (Diferencia de 1/4 con la intermedia)
   */
  const updateVisuals = (scrollTop: number) => {
    // 1. CAPA 0 (FONDO - VIDEO): Avanza a velocidad 0.50x
    if (videoLayerRef.current) {
      const mediaY = scrollTop * 0.50;
      const heroOpacity = Math.max(0.12, 1 - scrollTop / 1100);
      videoLayerRef.current.style.transform = `translate3d(0, ${mediaY}px, 0)`;
      videoLayerRef.current.style.opacity = `${heroOpacity}`;
    }

    // 2. CAPA 1 (INTERMEDIA - CUADRÍCULA & LUCES): Avanza a velocidad 0.75x
    if (gridLayerRef.current) {
      gridLayerRef.current.style.backgroundPositionY = `${-scrollTop * 0.75}px`;
    }
    if (midLightsRef.current) {
      midLightsRef.current.style.transform = `translate3d(0, ${-scrollTop * 0.25}px, 0)`;
    }

    // 3. CAPA 2 (SUPERIOR - CARDS Y TEXTOS): Avanza a velocidad 1.00x
    if (heroTextRef.current) {
      const opacity = Math.max(0, 1 - scrollTop / 480);
      const y = scrollTop * -0.1;
      heroTextRef.current.style.opacity = `${opacity}`;
      heroTextRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
    }

    // Collapsing Toolbar superior
    if (toolbarRef.current) {
      const progress = Math.min(Math.max((scrollTop - 360) / 160, 0), 1);
      const y = (1 - progress) * -20;
      toolbarRef.current.style.opacity = `${progress}`;
      toolbarRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
      toolbarRef.current.style.pointerEvents = progress > 0.02 ? 'auto' : 'none';
      toolbarRef.current.style.visibility = progress > 0.02 ? 'visible' : 'hidden';
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
    scrollRafRef.current = requestAnimationFrame(() => {
      updateVisuals(scrollTop);
      scrollRafRef.current = null;
    });
  };

  // Limpieza de eventos al desmontar
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
      if (mouseRafRef.current !== null) cancelAnimationFrame(mouseRafRef.current);
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
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
          className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-y-auto overflow-x-hidden select-none modal-smooth-scrollbar will-change-scroll"
          onScroll={handleScroll}
        >
          {/* =====================================================================
              CAPA 0 (FONDO): EL VIDEO / MEDIA STAGE (z-index: 0, Velocidad: 0.50x)
              ===================================================================== */}
          <div className="absolute inset-x-0 top-0 h-[88vh] min-h-[600px] max-h-[940px] overflow-hidden pointer-events-none z-0">
            <div 
              ref={videoLayerRef}
              style={{
                transform: 'translate3d(0, 0px, 0)',
                transformOrigin: 'center top',
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden'
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
                  preload="auto"
                  disablePictureInPicture
                  disableRemotePlayback
                  className="w-full h-full object-cover object-top pointer-events-none opacity-100"
                />
              ) : (
                <LazyImage
                  src={card.imageUrl}
                  alt={card.title}
                  accentColor={card.accentColor}
                  className="w-full h-full object-cover object-top opacity-100"
                />
              )}

              {/* Viñetas y difuminados de borde en capa superior */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950/80 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-950/80 to-transparent pointer-events-none z-10" />
              <div className={`absolute inset-0 bg-gradient-to-b ${card.gradient} opacity-15 pointer-events-none z-10`} />
            </div>
          </div>

          {/* =====================================================================
              CAPA 1 (INTERMEDIA): FONDO CUADRICULADO REACTIVO (z-index: 10, Velocidad: 0.75x)
              Flota sobre el video y por debajo de los cards, con diferencia de 1/4
              ===================================================================== */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {/* Cuadrícula Blueprint sutil que avanza en parallax sobre el video */}
            <div 
              ref={gridLayerRef}
              className="absolute inset-0 opacity-[0.055] pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #ffffff 1px, transparent 1px),
                  linear-gradient(to bottom, #ffffff 1px, transparent 1px)
                `,
                backgroundSize: '48px 48px',
                backgroundPosition: '0px 0px'
              }}
            />

            {/* Spotlight Linterna Reactivo al Cursor */}
            <div 
              ref={spotlightRef}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(750px circle at 50% 30%, ${card.accentColor}25 0%, transparent 70%)`
              }}
            />

            {/* Resplandor Ambiental Polar de la Capa Intermedia */}
            <div ref={midLightsRef} className="absolute inset-0 pointer-events-none will-change-transform">
              <div 
                className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[520px] rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at center, ${card.accentColor}33 0%, ${card.accentColor}0f 50%, transparent 75%)`
                }}
              />
              <div 
                className="absolute bottom-10 right-10 w-[520px] h-[400px] rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at center, rgba(14, 165, 233, 0.22) 0%, rgba(14, 165, 233, 0.06) 50%, transparent 75%)`
                }}
              />
            </div>
          </div>

          {/* =====================================================================
              CAPA 2 (SUPERIOR): CARDS Y TEXTOS (z-index: 20, Velocidad: 1.00x)
              ===================================================================== */}
          <div className="relative z-20 w-full min-h-screen">
            {/* Hero Text & Badges al pie del video */}
            <div 
              ref={heroTextRef}
              style={{
                transform: 'translate3d(0, 0px, 0)',
                willChange: 'transform, opacity'
              }}
              className="pt-[70vh] md:pt-[74vh] pb-8 px-6 md:px-12 max-w-5xl mx-auto flex flex-col items-start gap-4 pointer-events-none"
            >
              {/* Badges y Control de Sonido ubicados juntos al pie del video */}
              <div className="flex flex-wrap items-center gap-2.5 pointer-events-auto">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${card.badgeBg}`}>
                  {card.category}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-slate-900/90 text-slate-200 border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {card.location}
                </span>
                {isVideo && (
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-mono uppercase tracking-wider">
                    Video Demo
                  </span>
                )}
                {/* Control de Audio reubicado al pie del video */}
                {isVideo && (
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="px-3.5 py-1 rounded-full bg-slate-900/95 hover:bg-black text-white border border-white/20 flex items-center gap-2 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:border-white/40"
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
              {/* Spec Cards Grid: Rendimiento GPU ultra-ligero con gradientes sólidos (cero tirones) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {card.specs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="group relative p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-white/10 hover:border-white/25 flex flex-col gap-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden will-change-transform"
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

              {/* Detailed Overview con Renderizador Memoizado y Gradientes Sólidos */}
              <div className="relative p-6 md:p-10 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-white/15 space-y-6 shadow-2xl overflow-hidden">
                {/* Destello sutil en esquina superior izquierda con radial-gradient puro (sin blur pesado) */}
                <div 
                  className="absolute -top-16 -left-16 w-48 h-48 rounded-full pointer-events-none opacity-20"
                  style={{
                    background: `radial-gradient(circle at center, ${card.accentColor} 0%, transparent 70%)`
                  }}
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

                {/* Contenido estilizado dinámicamente con Markdown (100% memoizado) */}
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

          {/* =====================================================================
              COLLAPSING TOOLBAR FLOTANTE (z-index: 40) & BOTÓN SALIR (z-index: 50)
              ===================================================================== */}
          <div className="sticky top-0 z-40 w-full pointer-events-none h-0 overflow-visible">
            <div
              ref={toolbarRef}
              style={{
                opacity: 0,
                transform: 'translate3d(0, -20px, 0)',
                pointerEvents: 'none',
                visibility: 'hidden'
              }}
              className="w-full px-4 md:px-8 py-3 bg-slate-950/95 border-b border-white/10 shadow-2xl flex items-center justify-between"
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

          {/* Botón flotante Salir (Esc) */}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};
