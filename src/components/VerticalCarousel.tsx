import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue } from 'motion/react';
import { CardItem } from '../types';
import { LazyImage } from './LazyImage';
import { MapPin, Maximize2, ChevronUp, ChevronDown } from 'lucide-react';

interface VerticalCarouselProps {
  cards: CardItem[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  onOpenCardDetails: (card: CardItem) => void;
  isExpanded: boolean;
  onCompress: () => void;
}

export const VerticalCarousel: React.FC<VerticalCarouselProps> = ({
  cards,
  currentIndex,
  onSelectIndex,
  onOpenCardDetails,
  isExpanded
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const total = cards.length;
  const [isDragging, setIsDragging] = useState(false);

  // Responsive screen size check for small screen transition tuning
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Motion value for touch/drag tracking
  const dragY = useMotionValue(0);

  // Helper to get relative offset (-3 to +3) with circular wrap
  const getOffset = (cardIndex: number) => {
    let diff = cardIndex - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const handleNext = () => {
    onSelectIndex((currentIndex + 1) % total);
  };

  const handlePrev = () => {
    onSelectIndex((currentIndex - 1 + total) % total);
  };

  // Wheel listener for vertical 3D rotation
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isExpanded) return;

    let lastWheelTime = 0;
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime < 280) return;

      if (Math.abs(e.deltaY) > 20) {
        lastWheelTime = now;
        if (e.deltaY > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: true });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [currentIndex, total, isExpanded]);

  if (!isExpanded) return null;

  const compressedWidth = isMobile ? '80%' : '85%';

  return (
    <motion.div
      ref={containerRef}
      layoutId="top-morph"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 24,
        mass: 0.85
      }}
      className="relative w-full flex-1 flex flex-col items-center justify-center overflow-hidden select-none py-4"
      style={{ perspective: '1200px' }}
    >
      {/* Side Navigation Buttons */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full bg-slate-900/90 border border-white/20 text-slate-200 hover:text-white hover:bg-indigo-600 transition-all active:scale-90 shadow-2xl cursor-pointer"
          title="Tarjeta Anterior (Arrastrar / Tecla Arriba)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-slate-900/90 border border-white/20 text-slate-200 hover:text-white hover:bg-indigo-600 transition-all active:scale-90 shadow-2xl cursor-pointer"
          title="Siguiente Tarjeta (Arrastrar / Tecla Abajo)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* 3D Elastic Cards Stack */}
      <div className="relative w-full h-[480px] sm:h-[520px] md:h-[560px] flex items-center justify-center">
        {cards.map((card, idx) => {
          const offset = getOffset(idx);
          if (Math.abs(offset) > 2) return null;

          const isActive = offset === 0;
          const isTop = offset === -1;
          const isBottom = offset === 1;

          return (
            <motion.div
              key={card.id}
              drag="y"
              dragConstraints={{ top: -60, bottom: 60 }}
              dragElastic={0.4}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(_, info) => {
                setIsDragging(false);
                if (info.offset.y < -40 || info.velocity.y < -300) {
                  handleNext();
                } else if (info.offset.y > 40 || info.velocity.y > 300) {
                  handlePrev();
                }
              }}
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                willChange: 'transform, opacity',
                boxShadow: isActive
                  ? card.glowColor
                    ? `0 20px 50px -10px ${card.glowColor}`
                    : '0 20px 50px -10px rgba(0,0,0,0.8)'
                  : '0 8px 24px -8px rgba(0,0,0,0.5)'
              }}
              initial={false}
              animate={
                isActive
                  ? {
                      // ACTIVE CARD: Arrives at center, then expands width side-to-side
                      translateY: 0,
                      translateZ: 60,
                      rotateX: 0,
                      scale: 1,
                      width: '100%',
                      maxWidth: '100%',
                      borderRadius: '0px',
                      opacity: 1,
                      zIndex: 20
                    }
                  : isTop
                  ? {
                      // TOP CARD: Compressed width, tilted backward at top
                      translateY: isMobile ? -145 : -160,
                      translateZ: -60,
                      rotateX: -16,
                      scale: 0.86,
                      width: compressedWidth,
                      maxWidth: '42rem',
                      borderRadius: '24px',
                      opacity: 0.7,
                      zIndex: 10
                    }
                  : isBottom
                  ? {
                      // BOTTOM CARD: Compressed width, tilted backward at bottom
                      translateY: isMobile ? 145 : 160,
                      translateZ: -60,
                      rotateX: 16,
                      scale: 0.86,
                      width: compressedWidth,
                      maxWidth: '42rem',
                      borderRadius: '24px',
                      opacity: 0.7,
                      zIndex: 10
                    }
                  : {
                      // FAR TOP OR BOTTOM CARD
                      translateY: offset < 0 ? -280 : 280,
                      translateZ: -180,
                      rotateX: offset < 0 ? -30 : 30,
                      scale: 0.7,
                      width: '75%',
                      maxWidth: '36rem',
                      borderRadius: '24px',
                      opacity: 0,
                      zIndex: 0
                    }
              }
              transition={{
                // Critically-damped spring (damping: 26) prevents any vertical double-bounce or oscillation
                type: 'spring',
                stiffness: 220,
                damping: 26,
                mass: 1,
                // Sequential width expansion with smooth ease-out curve
                width: {
                  duration: isMobile ? 0.65 : 0.5,
                  delay: isActive ? (isMobile ? 0.18 : 0.12) : 0,
                  ease: [0.16, 1, 0.3, 1]
                },
                maxWidth: {
                  duration: isMobile ? 0.65 : 0.5,
                  delay: isActive ? (isMobile ? 0.18 : 0.12) : 0,
                  ease: [0.16, 1, 0.3, 1]
                },
                borderRadius: {
                  duration: isMobile ? 0.5 : 0.4,
                  delay: isActive ? (isMobile ? 0.15 : 0.1) : 0,
                  ease: 'easeOut'
                }
              }}
              onClick={() => {
                if (isDragging) return;
                if (isActive) {
                  onOpenCardDetails(card);
                } else if (isTop) {
                  handlePrev();
                } else if (isBottom) {
                  handleNext();
                }
              }}
              className={`absolute h-[210px] sm:h-[250px] md:h-[280px] overflow-hidden cursor-pointer group shadow-2xl border ${
                isActive ? 'border-y border-x-0 border-white/30' : 'border-white/20'
              }`}
            >
              {/* Card Image */}
              <LazyImage
                src={card.imageUrl}
                alt={card.title}
                accentColor={card.accentColor}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
              <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-60 pointer-events-none`} />

              {/* Accent Line on Top */}
              <div
                className="absolute top-0 inset-x-0 h-1 transition-colors"
                style={{ backgroundColor: card.accentColor }}
              />

              {/* Card Inner Content */}
              <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-between max-w-7xl mx-auto w-full">
                {/* Header info inside card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border bg-slate-950/75 ${card.badgeBg}`}>
                      {card.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-200 bg-slate-950/75 px-2.5 py-1 rounded-full border border-white/10">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {card.location}
                    </span>
                  </div>

                  {isActive && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 group-hover:bg-white/25 text-white text-xs font-semibold border border-white/10 transition-all active:scale-95">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ver Completo</span>
                    </div>
                  )}

                  {!isActive && (
                    <span className="text-[10px] uppercase font-mono px-2 py-1 rounded bg-black/40 text-slate-300 border border-white/10">
                      {isTop ? 'Anterior' : 'Siguiente'}
                    </span>
                  )}
                </div>

                {/* Footer info inside card */}
                <div className="flex items-end justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-3">
                      <span
                        className="text-2xl md:text-4xl font-mono font-black"
                        style={{ color: card.accentColor }}
                      >
                        {card.number}
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow">
                        {card.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 font-light line-clamp-1 max-w-xl">
                      {card.subtitle} — {card.description}
                    </p>
                  </div>

                  {isActive && (
                    <div className="hidden sm:flex items-center gap-2">
                      {card.specs.slice(0, 2).map((s, specIdx) => (
                        <div key={specIdx} className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-right">
                          <div className="text-[10px] text-slate-400 uppercase font-mono">{s.label}</div>
                          <div className="text-xs font-bold text-white">{s.value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

