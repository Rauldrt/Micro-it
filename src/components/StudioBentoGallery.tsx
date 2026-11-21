import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { GalleryImageItem, CardItem } from '../types';
import { LazyImage } from './LazyImage';

interface StudioBentoGalleryProps {
  card: CardItem;
  accentColor?: string;
}

export const StudioBentoGallery: React.FC<StudioBentoGalleryProps> = ({
  card,
  accentColor = '#0ea5e9'
}) => {
  const galleryItems = card.gallery && card.gallery.length > 0 ? card.gallery : [];
  
  // Extraer categorías dinámicas para los chips de filtrado
  const categories = ['Todas', ...Array.from(new Set(galleryItems.map((item) => item.category || 'General').filter(Boolean)))];
  const [activeCategory, setActiveCategory] = useState<string>('Todas');

  // Estado para el visor Lightbox en pantalla completa
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const filteredItems = activeCategory === 'Todas' 
    ? galleryItems 
    : galleryItems.filter((item) => item.category === activeCategory);

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => (prev! + 1) % filteredItems.length);
  };

  // Keyboard navigation for Lightbox
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') setSelectedImageIndex(null);
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, filteredItems.length]);

  if (galleryItems.length === 0) {
    return null;
  }

  // Clases de tamaño Bento Tiles según la geometría de la imagen de referencia (RonDesignLab)
  const getTileClasses = (size: GalleryImageItem['size']) => {
    switch (size) {
      case 'large':
        return 'col-span-1 md:col-span-2 row-span-2 min-h-[300px] sm:min-h-[340px] md:min-h-[390px]';
      case 'tall':
        return 'col-span-1 row-span-2 min-h-[300px] sm:min-h-[340px] md:min-h-[390px]';
      case 'square':
        return 'col-span-1 row-span-1 min-h-[190px] sm:min-h-[210px]';
      case 'small':
      default:
        return 'col-span-1 row-span-1 min-h-[170px] sm:min-h-[190px]';
    }
  };

  return (
    <div className="w-full space-y-6 pt-3 select-none">
      {/* Cabecera de la Galería con Chips de Filtrado Líquidos Material Design 3 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Galería Visual de Proyectos & Casos de Éxito</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Portfolio & Ecosistema en Producción</span>
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
              {galleryItems.length} capturas
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-light">
            Estructura modular en Windows Tiles con geometría de cantos curvos profundos y transiciones líquidas MD3. Haz clic en cualquier imagen para ampliar:
          </p>
        </div>

        {/* Chips de Filtrado con indicador de resorte líquido */}
        {categories.length > 2 && (
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md self-start md:self-auto overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                    isSelected ? 'text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="bento-gallery-filter-pill"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 28
                      }}
                      className="absolute inset-0 rounded-xl shadow-md"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid de Galería Bento Tiles (Geometría con cantos curvos profundos rounded-[28px]) */}
      <motion.div 
        layout 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 24,
                delay: idx * 0.05
              }}
              whileHover={{ 
                y: -6, 
                scale: 1.015,
                transition: { type: 'spring', stiffness: 350, damping: 22 }
              }}
              onClick={() => setSelectedImageIndex(idx)}
              className={`group relative rounded-[38px] sm:rounded-[44px] md:rounded-[48px] overflow-hidden border border-white/15 hover:border-white/40 shadow-2xl bg-slate-950 cursor-pointer flex flex-col justify-between ${getTileClasses(item.size)}`}
              style={{
                boxShadow: '0 16px 40px -12px rgba(0,0,0,0.7)'
              }}
            >
              {/* Imagen de fondo con LazyImage optimizada y zoom en hover */}
              <div className="absolute inset-0 z-0">
                <LazyImage
                  src={item.url}
                  alt={item.title}
                  accentColor={accentColor}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
              </div>

              {/* Degradados de profundidad y legibilidad estilo RonDesignLab */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/20 pointer-events-none z-10" />
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none z-10"
                style={{
                  background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 75%)`
                }}
              />

              {/* Borde sutil superior en hover */}
              <div 
                className="absolute top-0 inset-x-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                style={{ backgroundColor: accentColor }}
              />

              {/* Cabecera del Tile: Badge de Categoría y Botón de Apertura */}
              <div className="relative z-20 p-5 sm:p-6 flex items-center justify-between">
                {item.category && (
                  <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-white border border-white/15 shadow-sm">
                    {item.category}
                  </span>
                )}
                
                {/* Botón flotante de zoom líquido */}
                <div className="w-8 h-8 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-slate-950 shadow-md">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Pie del Tile: Título y Descripción del Proyecto */}
              <div className="relative z-20 p-6 sm:p-7 md:p-8 space-y-1.5">
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors drop-shadow-md">
                  {item.title}
                </h4>
                {item.subtitle && (
                  <p className="text-xs text-slate-300 font-light line-clamp-2 drop-shadow leading-relaxed">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* =======================================================================
          MODAL LIGHTBOX FULLSCREEN: Apertura en pantalla completa al hacer clic
          ======================================================================= */}
      <AnimatePresence>
        {selectedImageIndex !== null && filteredItems[selectedImageIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-4 md:p-8"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Botón Salir */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50 cursor-pointer shadow-xl active:scale-90"
              title="Cerrar (Esc)"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Flecha Anterior */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/90 border border-white/20 text-white hover:bg-white/20 transition-all z-50 cursor-pointer shadow-2xl active:scale-90"
              title="Imagen Anterior (Flecha Izquierda)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Flecha Siguiente */}
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/90 border border-white/20 text-white hover:bg-white/20 transition-all z-50 cursor-pointer shadow-2xl active:scale-90"
              title="Siguiente Imagen (Flecha Derecha)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Contenedor Central de la Imagen Ampliada */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="relative max-w-5xl w-full max-h-[85vh] rounded-[38px] md:rounded-[48px] overflow-hidden border border-white/20 shadow-2xl bg-slate-900 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[60vh] sm:h-[68vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={filteredItems[selectedImageIndex].url}
                  alt={filteredItems[selectedImageIndex].title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Barra Informativa Inferior */}
              <div className="p-5 md:px-8 bg-slate-950/95 border-t border-white/10 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {filteredItems[selectedImageIndex].category && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        {filteredItems[selectedImageIndex].category}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-mono">
                      {selectedImageIndex + 1} de {filteredItems.length}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {filteredItems[selectedImageIndex].title}
                  </h4>
                  {filteredItems[selectedImageIndex].subtitle && (
                    <p className="text-xs text-slate-300 font-light mt-0.5">
                      {filteredItems[selectedImageIndex].subtitle}
                    </p>
                  )}
                </div>

                <a
                  href={filteredItems[selectedImageIndex].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver Original</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
