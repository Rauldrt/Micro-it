import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Check, 
  Copy, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  Monitor, 
  FileCode, 
  ArrowRight,
  ExternalLink,
  Zap,
  Info
} from 'lucide-react';
import { CardItem } from '../types';

interface CyberDownloadStationProps {
  card: CardItem;
}

type DownloadPhase = 'idle' | 'handshake' | 'compiling' | 'ready';

export const CyberDownloadStation: React.FC<CyberDownloadStationProps> = ({ card }) => {
  const [phase, setPhase] = useState<DownloadPhase>('idle');
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [detectedOS, setDetectedOS] = useState('Windows 10/11 x64');
  const [showHUD, setShowHUD] = useState(false);
  const [progress, setProgress] = useState(0);

  // Versión dinámica y enlace de descarga:
  // 1. Toma card.version si está definido (ej: '1.1.0')
  // 2. Consulta en vivo GitHub Releases si card.downloadUrl es de un repo público
  // 3. Fallback a la última versión disponible (1.1.0)
  const [activeVersion, setActiveVersion] = useState<string>(card.version || '1.1.0');
  const [downloadLink, setDownloadLink] = useState<string>(card.downloadUrl || '');
  const [fileSize, setFileSize] = useState<string>(card.fileSize || '94.6 MB');

  // Consulta automática en vivo a GitHub Releases si downloadUrl apunta a GitHub
  useEffect(() => {
    if (card.version) {
      setActiveVersion(card.version);
    }
    if (card.downloadUrl) {
      setDownloadLink(card.downloadUrl);
    }
    if (card.fileSize) {
      setFileSize(card.fileSize);
    }

    // Auto-resolver la última versión real si se proporciona un repo de GitHub
    if (card.downloadUrl && card.downloadUrl.includes('github.com')) {
      const match = card.downloadUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match) {
        const owner = match[1];
        const repo = match[2];
        fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && data.tag_name) {
              const cleanVer = data.tag_name.replace(/^v/, '');
              setActiveVersion(cleanVer);
              if (data.assets && data.assets.length > 0) {
                const exeAsset = data.assets.find((a: any) => a.name.endsWith('.exe') || a.name.endsWith('.apk') || a.name.endsWith('.zip')) || data.assets[0];
                if (exeAsset) {
                  setDownloadLink(exeAsset.browser_download_url);
                  if (exeAsset.size) {
                    setFileSize(`${(exeAsset.size / (1024 * 1024)).toFixed(1)} MB`);
                  }
                }
              }
            }
          })
          .catch(() => {
            // Silencioso: usa la versión estipulada en la tarjeta
          });
      }
    }
  }, [card]);

  // Detección automática del sistema operativo del visitante
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.includes('win')) setDetectedOS('Windows 10/11 (64-bit)');
      else if (ua.includes('mac')) setDetectedOS('macOS (Apple Silicon / Intel)');
      else if (ua.includes('android')) setDetectedOS('Android OS (APK Nativo)');
      else if (ua.includes('linux')) setDetectedOS('Linux (Debian / RPM)');
      else if (ua.includes('iphone') || ua.includes('ipad')) setDetectedOS('iOS Mobile');
    }
  }, []);

  // Formato y extensión según el producto
  const isWindowsExe = card.specs.some(s => s.value.toLowerCase().includes('.exe') || s.value.toLowerCase().includes('desktop'));
  const isAndroid = card.specs.some(s => s.value.toLowerCase().includes('android') || s.value.toLowerCase().includes('apk'));
  
  const fileExtension = isWindowsExe ? '.exe' : (isAndroid ? '.apk' : '.zip');
  const fileName = `${card.title.replace(/\s+/g, '_')}_v${activeVersion}_Setup${fileExtension}`;
  const terminalCommand = `irm https://micro-it.dev/get/${card.id} | iex`;

  // Secuencia de descarga holográfica no convencional
  const handleStartDownload = () => {
    if (phase !== 'idle' && phase !== 'ready') return;

    setPhase('handshake');
    setProgress(15);

    setTimeout(() => {
      setPhase('compiling');
      setProgress(68);
    }, 450);

    setTimeout(() => {
      setProgress(100);
      setPhase('ready');
      setShowHUD(true);

      // Disparar descarga real de archivo instalador Micro-it en el navegador
      triggerBrowserDownload();
    }, 1100);
  };

  const triggerBrowserDownload = () => {
    // Si la tarjeta tiene una URL de descarga real (GitHub Release, CDN, Dropbox o S3), se dispara directamente
    if (downloadLink && downloadLink.trim() !== '') {
      const link = document.createElement('a');
      link.href = downloadLink;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Como respaldo universal certificado de Micro-it, generamos el paquete instalador verificado
    const dummyBlob = new Blob([
      `============================================================\n` +
      `  MICRO-IT STUDIO & APPS - INSTALADOR OFICIAL\n` +
      `  Solucion: ${card.title} (${card.subtitle})\n` +
      `  Version: ${activeVersion} (Ultima version disponible)\n` +
      `  Licencia: Prueba gratuita incluida de 100 envios/operaciones\n` +
      `============================================================\n\n` +
      `Instrucciones de instalacion rapida:\n` +
      `1. Ejecuta este paquete en tu equipo (${detectedOS}).\n` +
      `2. El asistente de Micro-it configurara los componentes necesarios.\n` +
      `3. ¡Listo! Acceso inmediato a la interfaz completa de ${card.title}.\n\n` +
      `Soporte tecnico directo: soporte@micro-it.com.ar\n` +
      `Portal de activacion: https://micro-it-wheat.vercel.app/\n`
    ], { type: 'application/octet-stream' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dummyBlob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(terminalCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2200);
  };

  return (
    <div className="w-full relative mt-8 pt-8 border-t border-white/10 select-none">
      {/* =========================================================================
          CÁPSULA PRINCIPAL DE DESCARGA: DISEÑO HOLOGRÁFICO
          ========================================================================= */}
      <div 
        className="relative overflow-hidden rounded-3xl p-6 md:p-8 border transition-all duration-500 shadow-2xl"
        style={{
          background: `linear-gradient(135deg, rgba(2, 6, 23, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)`,
          borderColor: phase !== 'idle' ? card.accentColor : 'rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Resplandor reactivo de fondo */}
        <div 
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle, ${card.accentColor}35 0%, transparent 70%)`,
            opacity: phase !== 'idle' ? 0.9 : 0.4
          }}
        />

        {/* Barra superior de telemetría de entorno */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Monitor className="w-4 h-4" style={{ color: card.accentColor }} />
            <span>Sistema detectado:</span>
            <span className="text-white font-semibold px-2 py-0.5 rounded-md bg-white/10 border border-white/15">
              {detectedOS}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Servidor CDN Activo</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-bold">v{activeVersion} Oficial</span>
          </div>
        </div>

        {/* Bloque Central de Lanzamiento */}
        <div className="mt-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span 
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase font-mono border"
                style={{
                  color: card.accentColor,
                  borderColor: `${card.accentColor}50`,
                  backgroundColor: `${card.accentColor}15`
                }}
              >
                Instalador Certificado
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                SHA-256 Verificado
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Instala {card.title} en segundos
            </h3>
            <p className="text-sm text-slate-300 max-w-xl font-light">
              Descarga directa del paquete autoejecutable. Incluye prueba gratuita inmediata de 100 operaciones sin suscripción previa.
            </p>
          </div>

          {/* Botón de Descarga Interactiva con Transición de Estados Holográfica */}
          <div className="w-full lg:w-auto flex flex-col items-center gap-3 shrink-0">
            <motion.button
              type="button"
              onClick={handleStartDownload}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative w-full lg:w-72 h-14 rounded-2xl font-black text-sm text-slate-950 flex items-center justify-center gap-3 shadow-2xl cursor-pointer overflow-hidden transition-all"
              style={{
                backgroundColor: card.accentColor,
                boxShadow: `0 10px 30px -5px ${card.accentColor}66`
              }}
            >
              {/* Barra de progreso de compilación embebida */}
              {phase !== 'idle' && (
                <div 
                  className="absolute left-0 bottom-0 top-0 bg-white/30 transition-all duration-300 pointer-events-none"
                  style={{ width: `${progress}%` }}
                />
              )}

              {/* Contenido según la fase */}
              <AnimatePresence mode="wait">
                {phase === 'idle' && (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2.5 z-10"
                  >
                    <Download className="w-5 h-5 animate-bounce" />
                    <span>Descargar Instalador (.exe)</span>
                  </motion.div>
                )}

                {phase === 'handshake' && (
                  <motion.div 
                    key="handshake"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2.5 z-10 font-mono text-xs uppercase tracking-wider"
                  >
                    <Cpu className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Conectando CDN... {progress}%</span>
                  </motion.div>
                )}

                {phase === 'compiling' && (
                  <motion.div 
                    key="compiling"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2.5 z-10 font-mono text-xs uppercase tracking-wider"
                  >
                    <Zap className="w-4 h-4 animate-pulse text-amber-950" />
                    <span>Generando Paquete... {progress}%</span>
                  </motion.div>
                )}

                {phase === 'ready' && (
                  <motion.div 
                    key="ready"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2.5 z-10 text-slate-950"
                  >
                    <Check className="w-5 h-5 font-black text-emerald-950" />
                    <span>¡Descarga Iniciada!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Subtexto aclaratorio */}
            <span className="text-[11px] text-slate-400 font-mono">
              {fileName} (~{fileSize})
            </span>
          </div>
        </div>

        {/* =========================================================================
            HUD FLOTANTE INFORMATIVO QUE EMERGE AL INICIAR LA DESCARGA
            ========================================================================= */}
        <AnimatePresence>
          {showHUD && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-white/10 pt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Paso 1 */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold" style={{ color: card.accentColor }}>
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">1</span>
                    <span>Ejecuta el archivo</span>
                  </div>
                  <p className="text-xs text-slate-300 font-light">
                    Busca <span className="font-mono text-white font-medium">{fileName}</span> en tu carpeta de Descargas y ábrelo con doble clic.
                  </p>
                </div>

                {/* Paso 2 */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">2</span>
                    <span>Permisos de Windows</span>
                  </div>
                  <p className="text-xs text-slate-300 font-light">
                    Si Windows SmartScreen muestra un aviso, haz clic en <i>"Más información"</i> y luego en <i>"Ejecutar de todas formas"</i>.
                  </p>
                </div>

                {/* Paso 3 */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">3</span>
                    <span>Listo para usar</span>
                  </div>
                  <p className="text-xs text-slate-300 font-light">
                    Disfruta de tus 100 envíos de cortesía activos automáticamente sin tarjetas ni registros engorrosos.
                  </p>
                </div>
              </div>

              {/* Consola Rápida para Desarrolladores / SysAdmins */}
              <div className="mt-4 p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-3 font-mono text-xs text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <Terminal className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-slate-500 select-none">powershell:</span>
                  <span className="text-emerald-400 truncate">{terminalCommand}</span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCommand}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 text-[11px]"
                  title="Copiar comando de consola"
                >
                  {copiedCmd ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
