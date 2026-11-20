import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MicroLogo } from './MicroLogo';

interface CyberQuantumBootProps {
  onComplete: () => void;
  accentColor?: string;
}

export const CyberQuantumBoot: React.FC<CyberQuantumBootProps> = ({
  onComplete,
  accentColor = '#0ea5e9'
}) => {
  const [statusText, setStatusText] = useState('INICIALIZANDO NÚCLEO CUÁNTICO...');
  const [progress, setProgress] = useState(15);
  const [isExiting, setIsExiting] = useState(false);

  const handleFinish = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  }, [onComplete]);

  // Secuencia de tiempo del boot cinemático (1.2 segundos totales)
  useEffect(() => {
    const t1 = setTimeout(() => {
      setStatusText('CARGANDO SOLUCIONES 3D...');
      setProgress(65);
    }, 450);

    const t2 = setTimeout(() => {
      setStatusText('SISTEMA LISTO • DESPLEGANDO');
      setProgress(100);
    }, 900);

    const t3 = setTimeout(() => {
      handleFinish();
    }, 1250);

    const handleKey = (e: KeyboardEvent) => {
      handleFinish();
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('keydown', handleKey);
    };
  }, [handleFinish]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="cyber-boot"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            filter: 'blur(8px)',
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
          }}
          onClick={handleFinish}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white select-none cursor-pointer overflow-hidden"
        >
          {/* Grilla Blueprint táctica con pulso de luz */}
          <div 
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #ffffff 1px, transparent 1px),
                linear-gradient(to bottom, #ffffff 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              backgroundPosition: 'center center'
            }}
          />

          {/* Resplandor ambiental de fondo con pulso de Aurora Boreal */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0.2 }}
            animate={{ scale: [0.8, 1.15, 1], opacity: [0.3, 0.65, 0.45] }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${accentColor}44 0%, rgba(16, 185, 129, 0.15) 35%, rgba(168, 85, 247, 0.1) 55%, transparent 75%)`
            }}
          />

          {/* Anillos de choque holográficos que se expanden hacia afuera */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-64 h-64 rounded-full border border-sky-400/50 pointer-events-none"
          />
          <motion.div
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 1.7, opacity: 0 }}
            transition={{ duration: 0.95, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-64 h-64 rounded-full border border-emerald-400/40 pointer-events-none"
          />

          {/* Contenedor Central del Isotipo y Branding */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Badge Central en Escala Grande con Isotipo µ y Sombra Aurora */}
            <motion.div
              initial={{ scale: 0.5, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="relative p-2"
            >
              {/* Resplandor inmediato detrás del badge */}
              <div 
                className="absolute inset-0 rounded-3xl blur-xl opacity-60 pointer-events-none"
                style={{ backgroundColor: accentColor }}
              />

              <div className="relative transform hover:scale-105 transition-transform duration-300">
                <MicroLogo
                  variant="badge"
                  accentColor={accentColor}
                  size="xl"
                />

                {/* Línea de escaneo láser que recorre el isotipo */}
                <motion.div
                  initial={{ top: '-10%', opacity: 0 }}
                  animate={{ top: '110%', opacity: [0, 0.8, 0.8, 0] }}
                  transition={{ duration: 0.9, delay: 0.2, ease: 'easeInOut' }}
                  className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent pointer-events-none shadow-[0_0_8px_#38bdf8]"
                />
              </div>
            </motion.div>

            {/* Título Micro-it & Píldora Studio & Apps */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>Micro<span className="text-sky-400">-it</span></span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  Studio & Apps
                </span>
              </h1>
              <p className="text-xs md:text-sm text-slate-400 font-light tracking-wide">
                Ingeniería de Software & Soluciones Avanzadas
              </p>
            </motion.div>

            {/* Telemetría Cuántica & Barra de Carga */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="mt-4 flex flex-col items-center gap-2.5 w-64 md:w-72"
            >
              <div className="flex items-center justify-between w-full text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-sky-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{statusText}</span>
                </span>
                <span className="font-bold text-slate-300">{progress}%</span>
              </div>

              {/* Barra de progreso de micro-precisión */}
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden p-[1px]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-purple-500 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                  initial={{ width: '10%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          </div>

          {/* Hint sutil para saltar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-6 text-[11px] font-mono text-slate-500 tracking-wider uppercase"
          >
            Haz clic o presiona cualquier tecla para continuar
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
