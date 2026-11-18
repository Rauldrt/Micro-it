import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
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

  // Coordenadas del cursor relativas al cuerpo del contenido para el halo interactivo
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 500, y: 300 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Listener de scroll directo y nativo sobre el contenedor del modal
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollOffset(e.currentTarget.scrollTop);
  };

  // Parallax suave: parte de translateY = 0 en el tope de la pantalla para nunca recortar la cabecera del video
  const mediaY = scrollOffset * 0.28;
  const mediaScale = 1 + Math.min(scrollOffset / 3000, 0.05);
  const heroOpacity = Math.max(0.15, 1 - scrollOffset / 500);

  // Cálculo reactivo para la Collapsing Toolbar (se revela entre 180px y 300px de scroll)
  const toolbarProgress = Math.min(Math.max((scrollOffset - 180) / 120, 0), 1);
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
          // Simultaneous top & bottom vertical stretch animation without altering width
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
            ease: [0.16, 1, 0.3, 1] // Smooth deceleration curve at the end
          }}
          className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-y-auto overflow-x-hidden"
          onScroll={handleScroll}
        >
          {/* Collapsing Toolbar flotante: Se revela con blur al ocultarse el Hero en scroll */}
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

          {/* Botón flotante para salir con sombra Aurora Boreal */}
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

          {/* Hero Section con Parallax (Video / Imagen / GIF) */}
          <div className="relative w-full h-[65vh] min-h-[460px] max-h-[760px] overflow-hidden bg-slate-950 shrink-0">
            {/* Sutil viñeta en el tope para integrar el video con el fondo oscuro y dar margen estético */}
            <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-slate-950 via-slate-950/40 to-transparent pointer-events-none z-20" />

            <div 
              style={{
                transform: `translate3d(0, ${mediaY}px, 0) scale(${mediaScale})`,
                transformOrigin: 'center top',
                opacity: heroOpacity,
                willChange: 'transform, opacity'
              }}
              className="absolute inset-x-0 top-3 md:top-5 bottom-[-15%] w-full h-[115%]"
            >
              {isVideo && videoSource ? (
                <div className="relative w-full h-full">
                  <video
                    src={videoSource}
                    poster={card.imageUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover object-top pointer-events-none"
                  />
                  {/* Control Mute/Unmute para videos con audio */}
                  <div className="absolute top-6 left-6 z-30">
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2.5 rounded-full bg-slate-950/80 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all active:scale-90 cursor-pointer flex items-center gap-2 text-xs font-medium shadow-2xl"
                      title={isMuted ? 'Activar Audio' : 'Silenciar Audio'}
                    >
                      {isMuted ? (
                        <>
                          <VolumeX className="w-4 h-4 text-rose-400" />
                          <span className="hidden sm:inline">Activar Sonido</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                          <span className="hidden sm:inline">Sonido Activo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <LazyImage
                  src={card.imageUrl}
                  alt={card.title}
                  accentColor={card.accentColor}
                  className="w-full h-full object-cover object-top"
                />
              )}
            </div>

            {/* Gradient Overlays elegantes (resaltan el texto inferior sin oscurecer ni recortar el tope del video) */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
            <div className={`absolute inset-0 bg-gradient-to-b ${card.gradient} opacity-30 mix-blend-multiply pointer-events-none`} />

            {/* Hero Text Content */}
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-12 max-w-5xl mx-auto flex flex-col items-start gap-3 pointer-events-none">
              <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${card.badgeBg}`}>
                  {card.category}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-black/40 text-slate-200 border border-white/10 backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {card.location}
                </span>
                {isVideo && (
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-mono uppercase tracking-wider">
                    Video Demo
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-4">
                <span 
                  className="text-4xl md:text-6xl font-black font-mono tracking-tight opacity-40"
                  style={{ color: card.accentColor }}
                >
                  {card.number}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
                  {card.title}
                </h1>
              </div>

              <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl">
                {card.subtitle}
              </p>
            </div>
          </div>

          {/* Content Body con Fondo Técnico de Micro-it (Cuadrícula Blueprint & Resplandores Especulares Reactivos al Cursor) */}
          <div 
            onMouseMove={handleMouseMove}
            className="relative w-full bg-slate-950 min-h-screen"
          >
            {/* Capa de Fondo Técnico Aislada (overflow-hidden y pointer-events-none para que los blurs no desborden ni intercepten el scroll) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* 1. Malla Geométrica Tecnológica (Blueprint Grid sutil) */}
              <div 
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #ffffff 1px, transparent 1px),
                    linear-gradient(to bottom, #ffffff 1px, transparent 1px)
                  `,
                  backgroundSize: '48px 48px'
                }}
              />

              {/* 2. Spotlight Reactivo al Movimiento del Mouse (Efecto Linterna de Alta Tecnología) */}
              <div 
                className="absolute inset-0 transition-opacity duration-300 opacity-60"
                style={{
                  background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, ${card.accentColor}25 0%, transparent 70%)`
                }}
              />

              {/* 3. Resplandor Ambiental Polar Reactivo al Color de la Solución (Base de Profundidad) */}
              <div 
                className="absolute top-10 left-1/2 -translate-x-1/2 w-[720px] h-[450px] blur-[150px] opacity-25 rounded-full"
                style={{ backgroundColor: card.accentColor }}
              />
              <div 
                className="absolute bottom-20 right-10 w-[460px] h-[360px] blur-[170px] opacity-15 rounded-full bg-sky-500"
              />
            </div>

            {/* Contenedor Central con ancho contenido */}
            <div className="relative z-10 max-w-5xl w-full mx-auto px-6 py-8 md:py-14 space-y-12 select-text">
              {/* Spec Cards Grid con Acentos Vivos & Glassmorphism Reforzado */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {card.specs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="group relative p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-white/10 hover:border-white/25 backdrop-blur-md flex flex-col gap-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden"
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
              <div className="relative p-6 md:p-10 rounded-3xl bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-950/90 border border-white/15 backdrop-blur-xl space-y-6 shadow-2xl overflow-hidden">
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
