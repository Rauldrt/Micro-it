import React from 'react';
import { ActiveModule, CardItem } from '../types';
import { Layers, PanelBottom, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderBarProps {
  activeModule: ActiveModule;
  onSelectModule: (mod: ActiveModule) => void;
  activeCard: CardItem;
  currentIndex: number;
  totalCards: number;
  onReset: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeModule,
  onSelectModule,
  activeCard,
  currentIndex,
  totalCards,
  onReset
}) => {
  return (
    <header className="w-full px-3 py-2 md:px-6 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between gap-2 z-30 shrink-0 h-12 text-slate-100 overflow-x-auto no-scrollbar select-none">
      {/* Title & Brand */}
      <div className="flex items-center gap-2 shrink-0">
        <div 
          className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-slate-950 shadow-sm transition-colors duration-500"
          style={{ backgroundColor: activeCard.accentColor }}
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
        </div>
        <h1 className="text-xs md:text-sm font-bold tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
          <span>Carrusel Vertical</span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            v2.0
          </span>
        </h1>
      </div>

      {/* Module Switcher */}
      <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-slate-900 border border-white/10 shrink-0">
        <button
          onClick={() => onSelectModule('carousel')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeModule === 'carousel'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>Carrusel</span>
        </button>

        <button
          onClick={() => onSelectModule('bottomElement')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeModule === 'bottomElement'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PanelBottom className="w-3 h-3" />
          <span>Panel</span>
        </button>
      </div>

      {/* Card Counter & Reset */}
      <div className="flex items-center gap-2 text-[11px] font-mono shrink-0">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 whitespace-nowrap">
          <span className="text-slate-500">Índice:</span>
          <span className="font-bold text-white">0{currentIndex + 1}</span>
          <span className="text-slate-500">/ 0{totalCards}</span>
        </div>

        <button
          onClick={onReset}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Reiniciar a Card 1"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>
    </header>
  );
};
