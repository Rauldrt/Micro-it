import React from 'react';
import { CardItem } from '../types';
import { MicroLogo } from './MicroLogo';

interface HeaderBarProps {
  activeCard: CardItem;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeCard
}) => {
  return (
    <header className="w-full px-3 py-2 md:px-6 border-b border-white/10 bg-slate-950/95 backdrop-blur-md flex items-center justify-between gap-4 z-30 shrink-0 h-16 text-slate-100 overflow-x-auto no-scrollbar select-none">
      {/* Title & Brand con Ícono de Micro Prominente 3D y Sombra Aurora */}
      <div className="flex items-center gap-3.5 shrink-0 py-1">
        <MicroLogo 
          variant="badge"
          accentColor={activeCard.accentColor}
          size="md"
        />
        <div>
          <h1 className="text-base md:text-lg font-extrabold tracking-tight text-white flex items-center gap-2 whitespace-nowrap">
            <span>Micro<span className="text-sky-400">-it</span></span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Studio & Apps
            </span>
          </h1>
        </div>
      </div>
    </header>
  );
};
