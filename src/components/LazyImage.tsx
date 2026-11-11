import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  accentColor?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  accentColor = '#6366f1'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-slate-900/80 ${className}`}>
      {/* Skeleton Shimmer when loading */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/90 animate-pulse">
          <div 
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: `${accentColor} transparent ${accentColor} ${accentColor}` }}
          />
        </div>
      )}

      {/* Fallback view if error */}
      {isError ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900 text-slate-500 p-4 text-center">
          <ImageOff className="w-8 h-8 mb-2 opacity-60" />
          <span className="text-xs">Imagen no disponible</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      )}
    </div>
  );
};
