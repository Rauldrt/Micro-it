import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Sparkles, Share2, Bookmark, ExternalLink } from 'lucide-react';
import { CardItem } from '../types';
import { LazyImage } from './LazyImage';

interface FullscreenCardModalProps {
  card: CardItem | null;
  onClose: () => void;
}

export const FullscreenCardModal: React.FC<FullscreenCardModalProps> = ({
  card,
  onClose
}) => {
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

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          key={card.id}
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
        >
          {/* Botón flotante para salir con sombra Aurora Boreal */}
          <div className="sticky top-5 z-40 flex justify-end px-6 pointer-events-none h-0">
            <button
              onClick={onClose}
              className="pointer-events-auto h-10 px-4 rounded-full bg-black/90 hover:bg-black text-white text-xs font-semibold border border-white/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer animate-aurora-symbol"
              title="Salir (Esc)"
            >
              <span>Salir</span>
              <X className="w-4 h-4 text-sky-300" />
            </button>
          </div>

          {/* Hero Image Section */}
          <div className="relative w-full h-[55vh] min-h-[360px] max-h-[600px] overflow-hidden">
            <LazyImage
              src={card.imageUrl}
              alt={card.title}
              accentColor={card.accentColor}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className={`absolute inset-0 bg-gradient-to-b ${card.gradient} opacity-60 mix-blend-multiply`} />

            {/* Hero Text Content */}
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-12 max-w-5xl mx-auto flex flex-col items-start gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${card.badgeBg}`}>
                  {card.category}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-black/40 text-slate-200 border border-white/10 backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {card.location}
                </span>
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
