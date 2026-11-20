import React, { useState, useEffect, useRef } from 'react';
import { ImageOff, RefreshCw } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  accentColor?: string;
  priority?: boolean;
}

// Caché global en memoria: Si una imagen ya se descargó una vez, no vuelve a mostrar el spinner al rotar el carrusel
const globalLoadedImages = new Set<string>();

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  accentColor = '#6366f1',
  priority = false
}) => {
  const isAlreadyCached = globalLoadedImages.has(src);
  const [isLoaded, setIsLoaded] = useState<boolean>(isAlreadyCached);
  const [isError, setIsError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Comprobar si la imagen ya fue cargada o está en caché del navegador
  useEffect(() => {
    if (globalLoadedImages.has(src)) {
      setIsLoaded(true);
      setIsError(false);
      return;
    }

    setIsLoaded(false);
    setIsError(false);

    // Verificación directa en el nodo DOM (evita el bug de onLoad omitido en imágenes cacheadas)
    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth > 0) {
        globalLoadedImages.add(src);
        setIsLoaded(true);
      } else {
        setIsError(true);
      }
    }

    // Pre-carga activa en segundo plano para forzar la resolución de red
    const preloader = new Image();
    preloader.src = src;
    preloader.onload = () => {
      globalLoadedImages.add(src);
      setIsLoaded(true);
      setIsError(false);
    };
    preloader.onerror = () => {
      // Si falla, permitimos 1 reintento con timestamp anti-caché
      if (retryCount < 1) {
        setRetryCount((prev) => prev + 1);
      } else {
        setIsError(true);
      }
    };

    return () => {
      preloader.onload = null;
      preloader.onerror = null;
    };
  }, [src, retryCount]);

  const handleManualRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsError(false);
    setIsLoaded(false);
    setRetryCount((prev) => prev + 1);
  };

  return (
    <div className={`relative overflow-hidden bg-slate-900/80 ${className}`}>
      {/* Skeleton / Spinner cuando está descargando */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/90 animate-pulse">
          <div 
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: `${accentColor} transparent ${accentColor} ${accentColor}` }}
          />
        </div>
      )}

      {/* Vista de error si falla la conexión */}
      {isError ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/95 text-slate-400 p-4 text-center select-none">
          <ImageOff className="w-8 h-8 mb-2 opacity-60 text-slate-500" />
          <span className="text-xs mb-3 font-medium">No se pudo cargar la imagen</span>
          <button
            onClick={handleManualRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reintentar</span>
          </button>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={retryCount > 0 ? `${src}&retry=${retryCount}` : src}
          alt={alt}
          // Usamos eager en lugar de lazy para evitar que el viewport 100dvh con CSS 3D retenga la carga
          loading={priority ? 'eager' : 'eager'}
          decoding="async"
          onLoad={() => {
            globalLoadedImages.add(src);
            setIsLoaded(true);
            setIsError(false);
          }}
          onError={() => {
            if (retryCount < 1) {
              setRetryCount((prev) => prev + 1);
            } else {
              setIsError(true);
            }
          }}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      )}
    </div>
  );
};
