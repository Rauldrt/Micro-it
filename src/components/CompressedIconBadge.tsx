import React from 'react';
import { motion } from 'motion/react';
import { Layers, Info, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { CardItem } from '../types';

interface CompressedIconBadgeProps {
  position: 'top' | 'bottom';
  activeCard?: CardItem;
  onClick: () => void;
  label?: string;
}

export const CompressedIconBadge: React.FC<CompressedIconBadgeProps> = ({
  position,
  activeCard,
  onClick,
  label
}) => {
  const isTop = position === 'top';
  const layoutId = isTop ? 'top-morph' : 'bottom-morph';

  return (
    <motion.div
      layoutId={layoutId}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 24,
        mass: 0.85
      }}
      onClick={onClick}
      className="group relative flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-white cursor-pointer my-2 z-40 overflow-hidden"
      style={{
        boxShadow: activeCard?.glowColor
          ? `0 10px 28px -4px ${activeCard.glowColor}`
          : '0 10px 28px -4px rgba(99, 102, 241, 0.35)'
      }}
    >
      {/* Glowing pulse ring */}
      <span 
        className="absolute inset-0 rounded-full animate-ping opacity-25 pointer-events-none"
        style={{ backgroundColor: activeCard?.accentColor || '#6366f1' }}
      />

      {/* Icon */}
      <div 
        className="relative flex items-center justify-center w-8 h-8 rounded-full text-slate-950 font-bold shrink-0"
        style={{ backgroundColor: activeCard?.accentColor || '#6366f1' }}
      >
        {isTop ? (
          <Layers className="w-4 h-4 text-slate-950" />
        ) : (
          <Info className="w-4 h-4 text-slate-950" />
        )}
      </div>

      {/* Text details */}
      <div className="flex flex-col text-left pr-1 min-w-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white whitespace-nowrap">
          <span>{label || (isTop ? 'Carrusel Relegado' : 'Panel Inactivo')}</span>
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse shrink-0" />
        </div>
        {activeCard && (
          <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
            {activeCard.number} · {activeCard.title}
          </span>
        )}
      </div>

      {/* Chevron direction indicator */}
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-slate-300 group-hover:bg-white/20 transition-colors shrink-0">
        {isTop ? (
          <ChevronDown className="w-4 h-4 animate-bounce" />
        ) : (
          <ChevronUp className="w-4 h-4 animate-bounce" />
        )}
      </div>
    </motion.div>
  );
};
