import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { CARDS_DATA } from './data/cardsData';
import { ActiveModule, CardItem } from './types';
import { HeaderBar } from './components/HeaderBar';
import { VerticalCarousel } from './components/VerticalCarousel';
import { CyberQuantumBoot } from './components/CyberQuantumBoot';
import { subscribeToCards } from './services/cardsService';
import { setupMidnightFaviconSync } from './utils/dynamicFavicon';

const BottomElement = lazy(() =>
  import('./components/BottomElement').then((m) => ({ default: m.BottomElement }))
);
const FullscreenCardModal = lazy(() =>
  import('./components/FullscreenCardModal').then((m) => ({ default: m.FullscreenCardModal }))
);

export default function App() {
  const [cards, setCards] = useState<CardItem[]>(CARDS_DATA);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeModule, setActiveModule] = useState<ActiveModule>('carousel');
  const [fullscreenCard, setFullscreenCard] = useState<CardItem | null>(null);
  const [hasOpenedModal, setHasOpenedModal] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(4);
  const [isBooting, setIsBooting] = useState<boolean>(true);

  const openFullscreenCard = useCallback((card: CardItem) => {
    setHasOpenedModal(true);
    setFullscreenCard(card);
  }, []);

  // Sincronización automática del favicon por día de la semana (costo CPU 0%)
  useEffect(() => {
    const cleanup = setupMidnightFaviconSync();
    return cleanup;
  }, []);

  // Suscripción reactiva en tiempo real a Firestore (o respaldo local)
  useEffect(() => {
    // Pre-cargar imágenes iniciales para caché inmediata en segundo plano
    CARDS_DATA.forEach((card) => {
      if (card.imageUrl) {
        const img = new Image();
        img.src = card.imageUrl;
      }
    });

    const unsubscribe = subscribeToCards((updatedCards) => {
      if (updatedCards && updatedCards.length > 0) {
        setCards(updatedCards);
        setCurrentIndex((prev) => (prev >= updatedCards.length ? 0 : prev));
        // Pre-cargar imágenes actualizadas en caché
        updatedCards.forEach((c) => {
          if (c.imageUrl) {
            const img = new Image();
            img.src = c.imageUrl;
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const activeCard = cards[currentIndex] || cards[0] || CARDS_DATA[0];

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
          openFullscreenCard(activeCard);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevCard, handleNextCard, activeCard, activeModule, fullscreenCard, openFullscreenCard]);

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
      {/* Cyber Quantum Boot Cinemático Inicial */}
      {isBooting && (
        <CyberQuantumBoot 
          onComplete={() => setIsBooting(false)} 
          accentColor={activeCard.accentColor} 
        />
      )}

      {/* Background Ambient Glow relative to active card - High GPU Performance */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at 50% 35%, ${activeCard.accentColor}33 0%, transparent 65%)`
        }}
      />

      {/* Header Bar con entrada fluida */}
      <motion.div
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: isBooting ? -64 : 0, opacity: isBooting ? 0 : 1 }}
        transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="z-30 shrink-0"
      >
        <HeaderBar activeCard={activeCard} />
      </motion.div>

      {/* Main View Container (MD3 App Container with Floating Panels) */}
      <main 
        className="app-container flex-1 relative overflow-hidden transition-opacity duration-700"
        style={{ opacity: isBooting ? 0 : 1 }}
      >
        
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
              onOpenCardDetails={openFullscreenCard}
              isExpanded={activeModule === 'carousel'}
              onCompress={() => setActiveModule('bottomElement')}
              isBooting={isBooting}
            />
          </div>
        </div>

        {/* Panel 2: Ajustes y Panel Inferior (Mantiene física y centrado nativo MD3) */}
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
            {activeModule === 'bottomElement' && (
              <Suspense fallback={null}>
                <BottomElement
                  cards={cards}
                  activeCard={activeCard}
                  isExpanded={true}
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
              </Suspense>
            )}
          </div>
        </div>
      </main>

      {/* Fullscreen Card Detail Modal */}
      {hasOpenedModal && (
        <Suspense fallback={null}>
          <FullscreenCardModal
            card={fullscreenCard}
            onClose={() => setFullscreenCard(null)}
          />
        </Suspense>
      )}
    </div>
  );
}
