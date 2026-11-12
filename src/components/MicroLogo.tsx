import React from 'react';

export type LogoVariant = 'badge' | 'geometric' | 'circuit' | 'minimal';

interface MicroLogoProps {
  variant?: LogoVariant;
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

// Vector del glifo µ con bordes rectos (flat-cut / sin extremos redondeados):
// - Extremo superior de ambas astas con corte plano recto horizontal.
// - Extremo inferior del descendente con corte plano recto horizontal.
// - Terminal / espolón inferior derecho con corte vertical limpio.
// - Cuerpo ensanchado y robusto, 100% negro puro (#000000).
export const MU_FLAT_PATH = `
  M 17.5,12.0
  L 35.5,12.0
  L 35.5,46.0
  C 35.5,53.5 39.5,58.0 46.5,58.0
  C 53.5,58.0 57.5,53.5 57.5,46.0
  L 57.5,12.0
  L 75.5,12.0
  L 75.5,51.0
  C 75.5,56.5 78.5,59.5 84.5,60.5
  L 84.5,72.5
  C 74.0,72.5 64.5,66.0 61.0,58.0
  C 56.0,66.0 47.5,70.5 39.5,70.5
  C 36.0,70.5 35.5,68.0 35.5,64.0
  L 35.5,88.0
  L 17.5,88.0
  Z
`.replace(/\s+/g, ' ').trim();

export const MU_EXACT_PATH = MU_FLAT_PATH;

export const MicroLogo: React.FC<MicroLogoProps> = ({
  variant = 'badge',
  accentColor = '#0ea5e9',
  size = 'md',
  className = '',
  onClick
}) => {
  // Dimensiones ampliadas: protagonismo rotundo para el símbolo
  const sizeMap = {
    sm: { container: 'w-9 h-9 rounded-xl', svg: 'w-7 h-7' },
    md: { container: 'w-12 h-12 rounded-2xl', svg: 'w-9.5 h-9.5' },
    lg: { container: 'w-16 h-16 rounded-2xl', svg: 'w-13 h-13' },
    xl: { container: 'w-24 h-24 rounded-3xl', svg: 'w-20 h-20' }
  };

  const currentSize = sizeMap[size];

  // =========================================================================
  // 01. BADGE DINÁMICO 3D (DIRECCIÓN OFICIAL MICRO-IT)
  // - Cuerpo del icono: GRADIENTE QUE PARTE DE NEGRO (#000000) HACIA EL COLOR DINÁMICO
  // - Símbolo de micro (µ): BORDES RECTOS PLANOS (sin bordes curvos en extremos), negro puro
  // - Sombra Aurora Boreal: PRODUCIDA EXCLUSIVAMENTE SOBRE EL SÍMBOLO PARA SU REALCE
  // =========================================================================
  if (variant === 'badge') {
    return (
      <div
        onClick={onClick}
        className={`relative inline-flex items-center justify-center cursor-pointer group active:scale-95 transition-transform duration-300 ${className}`}
        title="Micro-it — 01. Badge Reactivo Negro a Color con Símbolo Recto Aurora"
      >
        {/* Cuerpo del icono: gradiente de Negro hacia Color Dinámico */}
        <div 
          className={`relative flex items-center justify-center border shadow-xl transition-all duration-600 ease-out group-hover:scale-105 ${currentSize.container}`}
          style={{
            background: `linear-gradient(135deg, #000000 0%, color-mix(in srgb, ${accentColor} 30%, #000000) 45%, ${accentColor} 100%)`,
            boxShadow: `0 10px 28px -4px ${accentColor}70, inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.35), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.5)`,
            borderColor: 'rgba(255, 255, 255, 0.25)'
          }}
        >
          {/* Micro destello especular superior de cristal 3D */}
          <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/25 via-transparent to-black/30 pointer-events-none" />

          {/* Símbolo µ con BORDES RECTOS, NEGRO PURO y SOMBRA AURORA BOREAL */}
          <svg
            viewBox="0 0 100 100"
            className={`${currentSize.svg} relative z-10 transition-transform duration-300 group-hover:scale-110 animate-aurora-symbol`}
          >
            <path
              d={MU_FLAT_PATH}
              fill="#000000"
            />
          </svg>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VARIANTE 2: GEOMÉTRICA VECTORIAL (ISOTIPO HIGH-TECH)
  // =========================================================================
  if (variant === 'geometric') {
    return (
      <div
        onClick={onClick}
        className={`relative flex items-center justify-center bg-slate-900 border border-white/20 shadow-lg transition-all duration-500 cursor-pointer group active:scale-95 ${currentSize.container} ${className}`}
        style={{
          boxShadow: `0 4px 16px -2px ${accentColor}40`
        }}
        title="Micro-it Logo (Variante Geométrica)"
      >
        <svg
          viewBox="0 0 100 100"
          className={`${currentSize.svg} transition-transform duration-300 group-hover:scale-110 animate-aurora-symbol`}
        >
          <path
            d={MU_FLAT_PATH}
            fill="#000000"
            stroke={accentColor}
            strokeWidth="3.5"
            strokeLinejoin="miter"
          />
        </svg>
      </div>
    );
  }

  // =========================================================================
  // VARIANTE 3: CIRCUIT / CONNECTED NODE (SOFTWARE & HARDWARE)
  // =========================================================================
  if (variant === 'circuit') {
    return (
      <div
        onClick={onClick}
        className={`relative flex items-center justify-center bg-slate-950 border border-white/20 shadow-lg transition-all duration-500 cursor-pointer group active:scale-95 ${currentSize.container} ${className}`}
        style={{
          boxShadow: `0 0 20px -4px ${accentColor}50`
        }}
        title="Micro-it Logo (Variante Circuit Node)"
      >
        <svg
          viewBox="0 0 100 100"
          className={`${currentSize.svg} transition-transform duration-300 group-hover:scale-110 animate-aurora-symbol`}
        >
          <path
            d={MU_FLAT_PATH}
            fill="#000000"
            stroke={accentColor}
            strokeWidth="3"
            strokeLinejoin="miter"
          />
          <rect x="23" y="83" width="7" height="7" fill={accentColor} rx="1" />
          <rect x="63" y="9" width="6" height="6" fill={accentColor} rx="1" />
          <rect x="79" y="62" width="6" height="6" fill="#38bdf8" rx="1" />
        </svg>
      </div>
    );
  }

  // =========================================================================
  // VARIANTE 4: MINIMALISTA OUTLINE
  // =========================================================================
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center bg-white/5 border border-white/20 shadow-md transition-all duration-500 cursor-pointer group active:scale-95 ${currentSize.container} ${className}`}
      style={{
        borderColor: `${accentColor}60`
      }}
      title="Micro-it Logo (Variante Minimalista)"
    >
      <svg
        viewBox="0 0 100 100"
        className={`${currentSize.svg} transition-transform duration-300 group-hover:scale-110 animate-aurora-symbol`}
      >
        <path
          d={MU_FLAT_PATH}
          fill="#000000"
          stroke={accentColor}
          strokeWidth="3.5"
          strokeLinejoin="miter"
        />
      </svg>
    </div>
  );
};
