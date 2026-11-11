import React, { useState, useEffect, useCallback } from 'react';
import { CARDS_DATA } from './data/cardsData';
import { ActiveModule, CardItem } from './types';
import { HeaderBar } from './components/HeaderBar';
import { VerticalCarousel } from './components/VerticalCarousel';
import { BottomElement } from './components/BottomElement';
import { FullscreenCardModal } from './components/FullscreenCardModal';

export default function App() {
  const [cards] = useState<CardItem[]>(CARDS_DATA);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeModule, setActiveModule] = useState<ActiveModule>('carousel');
  const [fullscreenCard, setFullscreenCard] = useState<CardItem | null>(null);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(4);

  const activeCard = cards[currentIndex];

  // Next and prev handlers
  const handleNextCard = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const handlePrevCard = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if fullscreen modal is open
      if (fullscreenCard) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevCard();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextCard();
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (activeModule === 'carousel') {
          e.preventDefault();
          setFullscreenCard(activeCard);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevCard, handleNextCard, activeCard, activeModule, fullscreenCard]);

  // AutoPlay Timer
  useEffect(() => {
    if (!autoPlay || fullscreenCard) return;

    const interval = setInterval(() => {
      handleNextCard();
    }, speed * 1000);

    return () => clearInterval(interval);
  }, [autoPlay, speed, handleNextCard, fullscreenCard]);

  return (
    <div className="relative w-full h-screen h-[100dvh] max-h-[100dvh] flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Background Ambient Glow relative to active card */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 transition-all duration-1000 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${activeCard.accentColor}, transparent 70%)`
        }}
      />

      {/* Header Bar */}
      <HeaderBar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        activeCard={activeCard}
        currentIndex={currentIndex}
        totalCards={cards.length}
        onReset={() => setCurrentIndex(0)}
      />

      {/* Main View Container (MD3 App Container with Floating Panels) */}
      <main className="app-container flex-1 relative overflow-hidden">
        
        {/* Panel 1: Dashboard / Carrusel 3D */}
        <div
          id="panel1"
          className={`interactive-panel ${activeModule === 'carousel' ? 'expanded' : 'collapsed'}`}
          onClick={() => {
            if (activeModule !== 'carousel') setActiveModule('carousel');
          }}
        >
          <div className="panel-header">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-purple-300">space_dashboard</span>
              <h2 className="font-semibold text-white">Dashboard</h2>
            </div>
            {activeModule === 'bottomElement' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 text-purple-200 border border-white/10 ml-1">
                  {activeCard.number} · {activeCard.title}
                </span>
                <span className="material-symbols-outlined text-purple-300 text-lg opacity-70">unfold_more</span>
              </div>
            )}
          </div>

          <div className="panel-content">
            <VerticalCarousel
              cards={cards}
              currentIndex={currentIndex}
              onSelectIndex={setCurrentIndex}
              onOpenCardDetails={(card) => setFullscreenCard(card)}
              isExpanded={activeModule === 'carousel'}
              onCompress={() => setActiveModule('bottomElement')}
            />
          </div>
        </div>

        {/* Panel 2: Ajustes y Panel Inferior */}
        <div
          id="panel2"
          className={`interactive-panel ${activeModule === 'bottomElement' ? 'expanded' : 'collapsed'}`}
          onClick={() => {
            if (activeModule !== 'bottomElement') setActiveModule('bottomElement');
          }}
        >
          <div className="panel-header">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-purple-300">settings</span>
              <h2 className="font-semibold text-white">Ajustes</h2>
            </div>
            {activeModule === 'carousel' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 text-purple-200 border border-white/10 ml-1">
                  {activeCard.category}
                </span>
                <span className="material-symbols-outlined text-purple-300 text-lg opacity-70">unfold_more</span>
              </div>
            )}
          </div>

          <div className="panel-content">
            <BottomElement
              activeCard={activeCard}
              isExpanded={activeModule === 'bottomElement'}
              onCompress={() => setActiveModule('carousel')}
              autoPlay={autoPlay}
              onToggleAutoPlay={() => setAutoPlay(!autoPlay)}
              speed={speed}
              onChangeSpeed={setSpeed}
              cardIndex={currentIndex}
              totalCards={cards.length}
              onSelectCard={(idx) => {
                setCurrentIndex(idx);
              }}
            />
          </div>
        </div>
      </main>

      {/* Fullscreen Card Detail Modal */}
      <FullscreenCardModal
        card={fullscreenCard}
        onClose={() => setFullscreenCard(null)}
      />
    </div>
  );
}
