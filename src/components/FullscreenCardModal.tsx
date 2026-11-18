import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { X, MapPin, Sparkles, Share2, Bookmark, ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { CardItem } from '../types';
import { LazyImage } from './LazyImage';
import { MicroLogo } from './MicroLogo';

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

  // Listener de scroll directo y nativo sobre el contenedor del modal
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollOffset(e.currentTarget.scrollTop);
  };

  // Cálculo reactivo para el Parallax
  // A medida que scrolleamos hacia abajo, el Hero baja a velocidad reducida (0.35x) y se agranda levemente
  const mediaY = scrollOffset * 0.35;
  const mediaScale = 1 + Math.min(scrollOffset / 2000, 0.08);
  const heroOpacity = Math.max(0.2, 1 - scrollOffset / 450);

  // Cálculo reactivo para la Collapsing Toolbar (se revela entre 180px y 300px de scroll)
  const toolbarProgress = Math.min(Math.max((scrollOffset - 180) / 120, 0), 1);
  const toolbarY = (1 - toolbarProgress) * -20; // emerge suave desde arriba
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
          className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-y-auto scrollbar-none"
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
          <div className="relative w-full h-[58vh] min-h-[380px] max-h-[640px] overflow-hidden bg-slate-950">
            <div 
              style={{
                transform: `translate3d(0, ${mediaY}px, 0) scale(${mediaScale})`,
                opacity: heroOpacity,
                willChange: 'transform, opacity'
              }}
              className="absolute inset-0 w-full h-full"
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
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  {/* Control Mute/Unmute para videos con audio */}
                  <div className="absolute top-6 left-6 z-30">
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2.5 rounded-full bg-slate-950/80 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all active:scale-90 cursor-pointer flex items-center gap-2 text-xs font-medium"
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
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Gradient Overlays para legibilidad y elegancia */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />
            <div className={`absolute inset-0 bg-gradient-to-b ${card.gradient} opacity-50 mix-blend-multiply pointer-events-none`} />

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

          {/* Content Body */}
          <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 md:py-12 space-y-10">
            {/* Spec Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {card.specs.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-sm flex flex-col gap-1 hover:border-white/20 transition-colors"
                >
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                    {spec.label}
                  </span>
                  <span 
                    className="text-lg font-bold"
                    style={{ color: card.accentColor }}
                  >
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Detailed Overview */}
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-slate-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Descripción Detallada</span>
              </div>

              <p className="text-base md:text-lg text-slate-300 leading-relaxed font-normal">
                {card.longDescription}
              </p>

              <div className="pt-4 flex flex-wrap gap-2">
                {card.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 pb-8">
              <div className="flex items-center gap-3">
                <button 
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm text-slate-950 transition-all hover:brightness-110 active:scale-95 shadow-lg cursor-pointer"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};
