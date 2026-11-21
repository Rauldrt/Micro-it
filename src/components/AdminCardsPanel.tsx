import React, { useState, useEffect } from 'react';
import { CardItem, GalleryImageItem } from '../types';
import { saveCard, deleteCard, seedInitialCards } from '../services/cardsService';
import { isFirebaseConfigured, getFirebaseConfig } from '../lib/firebase';
import { getFirebaseAuth } from '../lib/firebaseAdmin';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Database, 
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
  Lock,
  LogOut,
  UserCheck,
  Upload,
  Film,
  Loader2,
  Download,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  LayoutGrid
} from 'lucide-react';
import { uploadSolutionMedia, uploadGalleryImageFile, VideoProcessingProgress } from '../services/mediaUploadService';

interface AdminCardsPanelProps {
  cards: CardItem[];
  onCardsChange?: () => void;
  onClose?: () => void;
}

export const AdminCardsPanel: React.FC<AdminCardsPanelProps> = ({
  cards,
  onCardsChange,
  onClose
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [editingCard, setEditingCard] = useState<CardItem | null>(null);
  const [showConfig, setShowConfig] = useState<boolean>(!isFirebaseConfigured());
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');

  // Estado para el proceso de subida y optimización de video
  const [uploadProgress, setUploadProgress] = useState<VideoProcessingProgress | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);

  // Estados para la administración de la Galería Bento Tiles
  const [newGalUrl, setNewGalUrl] = useState('');
  const [newGalTitle, setNewGalTitle] = useState('');
  const [newGalCategory, setNewGalCategory] = useState('');
  const [newGalSubtitle, setNewGalSubtitle] = useState('');
  const [newGalSize, setNewGalSize] = useState<GalleryImageItem['size']>('square');
  const [isUploadingGalImage, setIsUploadingGalImage] = useState(false);

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCard) return;

    // Validación de formato
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|mkv)$/i)) {
      alert('Por favor selecciona un archivo de video válido (MP4 o WebM).');
      return;
    }

    setIsUploadingMedia(true);
    setUploadProgress({
      step: 'reading',
      percent: 5,
      message: 'Preparando archivo de video...'
    });

    try {
      const { videoUrl, posterUrl } = await uploadSolutionMedia(
        editingCard.id,
        file,
        (progress) => setUploadProgress(progress)
      );

      // Auto-vincular URLs y setear tipo de media a video
      setEditingCard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          mediaType: 'video',
          videoUrl: videoUrl,
          imageUrl: posterUrl
        };
      });

      setStatusMsg('¡Video y portada optimizados y subidos exitosamente!');
    } catch (err: any) {
      console.error(err);
      alert(`Error al procesar y subir video: ${err.message || err}`);
    } finally {
      setIsUploadingMedia(false);
      setTimeout(() => setUploadProgress(null), 4000);
      // Reset input
      e.target.value = '';
    }
  };

  const handleAddGalleryItem = () => {
    if (!editingCard) return;
    if (!newGalUrl.trim()) {
      alert('Por favor ingresa la URL de la imagen o súbela desde tu equipo.');
      return;
    }
    if (!newGalTitle.trim()) {
      alert('Por favor ingresa un título descriptivo para la imagen.');
      return;
    }

    const newItem: GalleryImageItem = {
      id: `gal-${Date.now()}`,
      url: newGalUrl.trim(),
      title: newGalTitle.trim(),
      category: newGalCategory.trim() || editingCard.category || 'Proyecto',
      subtitle: newGalSubtitle.trim() || undefined,
      size: newGalSize
    };

    setEditingCard({
      ...editingCard,
      gallery: [...(editingCard.gallery || []), newItem]
    });

    // Reset inputs
    setNewGalUrl('');
    setNewGalTitle('');
    setNewGalCategory('');
    setNewGalSubtitle('');
    setNewGalSize('square');
  };

  const handleRemoveGalleryItem = (id: string) => {
    if (!editingCard) return;
    setEditingCard({
      ...editingCard,
      gallery: (editingCard.gallery || []).filter((item) => item.id !== id)
    });
  };

  const handleUpdateGalleryItemSize = (id: string, size: GalleryImageItem['size']) => {
    if (!editingCard) return;
    setEditingCard({
      ...editingCard,
      gallery: (editingCard.gallery || []).map((item) =>
        item.id === id ? { ...item, size } : item
      )
    });
  };

  const handleMoveGalleryItem = (index: number, direction: 'up' | 'down') => {
    if (!editingCard || !editingCard.gallery) return;
    const items = [...editingCard.gallery];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;
    setEditingCard({
      ...editingCard,
      gallery: items
    });
  };

  const handleGalleryImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCard) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    setIsUploadingGalImage(true);
    try {
      const url = await uploadGalleryImageFile(editingCard.id, file);
      setNewGalUrl(url);
      if (!newGalTitle) {
        setNewGalTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error al subir imagen a Firebase Storage: ${err.message || err}`);
    } finally {
      setIsUploadingGalImage(false);
      e.target.value = '';
    }
  };

  // Escuchar estado de sesión de Firebase Auth
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getFirebaseAuth();
    if (!auth) {
      setAuthError('Firebase no está configurado aún.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      setAuthPassword('');
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Error al iniciar sesión.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await signOut(auth);
  };

  // Estados de configuración de Firebase
  const currentConfig = getFirebaseConfig();
  const [apiKey, setApiKey] = useState(currentConfig.apiKey);
  const [projectId, setProjectId] = useState(currentConfig.projectId);
  const [authDomain, setAuthDomain] = useState(currentConfig.authDomain);
  const [storageBucket, setStorageBucket] = useState(currentConfig.storageBucket);
  const [messagingSenderId, setMessagingSenderId] = useState(currentConfig.messagingSenderId);
  const [appId, setAppId] = useState(currentConfig.appId);

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('microit_VITE_FIREBASE_API_KEY', apiKey);
    localStorage.setItem('microit_VITE_FIREBASE_PROJECT_ID', projectId);
    localStorage.setItem('microit_VITE_FIREBASE_AUTH_DOMAIN', authDomain);
    localStorage.setItem('microit_VITE_FIREBASE_STORAGE_BUCKET', storageBucket);
    localStorage.setItem('microit_VITE_FIREBASE_MESSAGING_SENDER_ID', messagingSenderId);
    localStorage.setItem('microit_VITE_FIREBASE_APP_ID', appId);
    setStatusMsg('Configuración guardada. Recargando base de datos...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleNewCard = () => {
    const nextNumber = String(cards.length + 1).padStart(2, '0');
    const newCard: CardItem = {
      id: `solution-${Date.now()}`,
      number: nextNumber,
      title: 'Nueva Solución',
      subtitle: 'Subtítulo descriptivo',
      category: 'Desarrollo Web',
      location: 'Argentina / Latam',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
      accentColor: '#38bdf8',
      gradient: 'from-sky-950/70 via-slate-950/80 to-slate-950',
      glowColor: 'rgba(56, 189, 248, 0.45)',
      badgeBg: 'text-sky-400 border-sky-500/30',
      description: 'Breve descripción de la solución.',
      longDescription: 'Descripción extendida y propuesta de valor completa para esta solución tecnológica creada por Micro-it.',
      tags: ['TypeScript', 'Cloud', 'Micro-it'],
      hasDownload: false,
      specs: [
        { label: 'Modalidad', value: '100% a Medida' },
        { label: 'Plataformas', value: 'Web & Móvil' }
      ]
    };
    setEditingCard(newCard);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    setLoading(true);
    setStatusMsg('');
    try {
      await saveCard(editingCard);
      setStatusMsg('¡Tarjeta guardada exitosamente en Firestore!');
      setEditingCard(null);
      if (onCardsChange) onCardsChange();
    } catch (err: any) {
      console.error('Error detallado al guardar en Firestore:', err);
      alert(`Error al guardar en Firestore: ${err?.message || err}`);
      setStatusMsg(`Error al guardar: ${err?.message || 'Error de permisos o conexión'}`);
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg(''), 4000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta tarjeta?')) return;
    setLoading(true);
    try {
      await deleteCard(id);
      setStatusMsg('Tarjeta eliminada.');
      if (onCardsChange) onCardsChange();
    } catch (err) {
      console.error(err);
      setStatusMsg('Error al eliminar tarjeta.');
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  const handleResetToSeeds = async () => {
    if (!window.confirm('¿Deseas sobreescribir/restablecer con las tarjetas iniciales de muestra?')) return;
    setLoading(true);
    try {
      await seedInitialCards();
      setStatusMsg('Tarjetas iniciales cargadas.');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error(err);
      setStatusMsg('Error al cargar tarjetas iniciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-white pb-6">
      {/* Barra de cabecera con estado de Firebase y Usuario Auth */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold">Gestor de Tarjetas (Firestore)</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                currentUser
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {currentUser ? `Admin: ${currentUser.email}` : 'Acceso Restringido'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {cards.length} soluciones cargadas en el carrusel 3D
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <button
                onClick={handleNewCard}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-lg shadow-sky-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Solución</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 cursor-pointer"
                title="Cerrar Sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            >
              {showConfig ? 'Ocultar Config' : 'Configurar Firebase'}
            </button>
          )}
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-medium text-center animate-fade-in">
          {statusMsg}
        </div>
      )}

      {/* Login Screen si no está autenticado */}
      {!currentUser && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Inicio de Sesión Administrador</h4>
              <p className="text-xs text-slate-400">Ingresá con tu usuario de Firebase Authentication para editar tarjetas</p>
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="text-xs">
              <label className="text-slate-400 block mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="admin@micro-it.com"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                required
              />
            </div>
            <div className="text-xs">
              <label className="text-slate-400 block mb-1">Contraseña</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>{authLoading ? 'Iniciando sesión...' : 'Entrar al Panel de Control'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Formulario de Configuración de Firebase (si no está o se presiona Configurar) */}
      {showConfig && (
        <form onSubmit={handleSaveFirebaseConfig} className="p-5 rounded-2xl bg-black/40 border border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>Credenciales de Firebase Firestore</span>
            </h4>
            <a 
              href="https://console.firebase.google.com/" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Ir a Consola Firebase</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Pegá aquí los valores de tu app web en Firebase (Configuración del proyecto &gt; Tus apps). Si no los cargás, el gestor seguirá funcionando guardando los cambios de forma local en tu navegador.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">API Key (apiKey)</label>
              <input 
                type="text" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                placeholder="AIzaSy..." 
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Project ID (projectId)</label>
              <input 
                type="text" 
                value={projectId} 
                onChange={(e) => setProjectId(e.target.value)} 
                placeholder="micro-it-studio" 
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Auth Domain</label>
              <input 
                type="text" 
                value={authDomain} 
                onChange={(e) => setAuthDomain(e.target.value)} 
                placeholder="micro-it-studio.firebaseapp.com" 
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">App ID</label>
              <input 
                type="text" 
                value={appId} 
                onChange={(e) => setAppId(e.target.value)} 
                placeholder="1:123456789:web:abcdef" 
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleResetToSeeds}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-slate-300 cursor-pointer"
            >
              Restablecer Tarjetas de Muestra
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Guardar y Conectar Firebase
            </button>
          </div>
        </form>
      )}

      {/* Editor de Tarjeta (Modal / Formulario) - Solo visible para usuario autenticado */}
      {currentUser && editingCard && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900 border border-sky-500/40 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-sky-400" />
              <span>Editar Solución: {editingCard.title}</span>
            </h4>
            <button
              type="button"
              onClick={() => setEditingCard(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Número (ej: 01, 02)</label>
              <input 
                type="text" 
                value={editingCard.number} 
                onChange={(e) => setEditingCard({ ...editingCard, number: e.target.value })} 
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Título de la Solución</label>
              <input 
                type="text" 
                value={editingCard.title} 
                onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })} 
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Categoría</label>
              <input 
                type="text" 
                value={editingCard.category} 
                onChange={(e) => setEditingCard({ ...editingCard, category: e.target.value })} 
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Subtítulo Corto</label>
              <input 
                type="text" 
                value={editingCard.subtitle} 
                onChange={(e) => setEditingCard({ ...editingCard, subtitle: e.target.value })} 
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Color Acento (Hexadecimal)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={editingCard.accentColor} 
                  onChange={(e) => setEditingCard({ ...editingCard, accentColor: e.target.value })} 
                  className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                />
                <input 
                  type="text" 
                  value={editingCard.accentColor} 
                  onChange={(e) => setEditingCard({ ...editingCard, accentColor: e.target.value })} 
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Tipo de Fondo Encabezado</label>
              <select
                value={editingCard.mediaType || 'image'}
                onChange={(e) => setEditingCard({ ...editingCard, mediaType: e.target.value as 'image' | 'video' | 'gif' })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:border-sky-400 focus:outline-none"
              >
                <option value="image" className="bg-slate-900 text-white">Imagen Estática (JPG, PNG, WebP)</option>
                <option value="video" className="bg-slate-900 text-white">Video con Parallax & Audio (MP4, WebM)</option>
                <option value="gif" className="bg-slate-900 text-white">GIF Animado</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">URL de Video / GIF</label>
              <input 
                type="text" 
                value={editingCard.videoUrl || ''} 
                onChange={(e) => setEditingCard({ ...editingCard, videoUrl: e.target.value })} 
                placeholder="https://... o sube uno abajo"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
              />
            </div>
          </div>

          {/* Subida & Optimización Directa de Video a Firebase Storage */}
          <div className="p-4 rounded-2xl bg-white/5 border border-sky-500/30 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white">Subir Video con Optimización Web & Portada Automática</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">MP4 / WebM</span>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">
              Selecciona tu video: se extraerá automáticamente un fotograma HD como póster de portada y se subirá optimizado a Firebase Storage con enlace CDN global permanente.
            </p>

            <div className="flex items-center gap-3">
              <label className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isUploadingMedia
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 active:scale-95 shadow-lg shadow-sky-500/20'
              }`}>
                {isUploadingMedia ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>{isUploadingMedia ? 'Procesando Video...' : 'Seleccionar Video desde tu PC'}</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  disabled={isUploadingMedia}
                  onChange={handleVideoFileUpload}
                  className="hidden"
                />
              </label>

              {editingCard.videoUrl && (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono truncate max-w-xs">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Video vinculado</span>
                </span>
              )}
            </div>

            {/* Barra de progreso de optimización y subida */}
            {uploadProgress && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-sky-300">{uploadProgress.message}</span>
                  <span className="text-slate-400 font-bold">{uploadProgress.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress.percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="text-xs">
            <label className="text-slate-400 block mb-1">
              URL de Imagen de Fondo {editingCard.mediaType === 'video' ? '(o Poster previo del Video)' : ''}
            </label>
            <input 
              type="text" 
              value={editingCard.imageUrl} 
              onChange={(e) => setEditingCard({ ...editingCard, imageUrl: e.target.value })} 
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
              required
            />
          </div>

          {/* Módulo de Descargas: Switch de Activación y Configuración */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>Estación de Descarga Oficial (.exe / App)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Activa o desactiva la estación de descarga en el modal de detalle (desactívala para tarjetas informativas o de servicios).
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editingCard.hasDownload || false} 
                  onChange={(e) => setEditingCard({ ...editingCard, hasDownload: e.target.checked })} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
              </label>
            </div>

            {editingCard.hasDownload && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-white/10">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Versión Actual de la App</label>
                  <input 
                    type="text" 
                    value={editingCard.version || ''} 
                    onChange={(e) => setEditingCard({ ...editingCard, version: e.target.value })} 
                    placeholder="Ej: 1.2.0"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-xs focus:border-sky-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Determina el nombre y número oficial de versión descargado</span>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Enlace de Descarga (CDN / GitHub / Storage)</label>
                  <input 
                    type="text" 
                    value={editingCard.downloadUrl || ''} 
                    onChange={(e) => setEditingCard({ ...editingCard, downloadUrl: e.target.value })} 
                    placeholder="https://github.com/.../releases o URL directa"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-xs focus:border-sky-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Si es GitHub Releases, consulta y descarga el último .exe automáticamente</span>
                </div>
              </div>
            )}
          </div>

          {/* =======================================================================
              MÓDULO DE GALERÍA BENTO TILES (WINDOWS STYLE): Administrable desde Ajustes
              ======================================================================= */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-sky-400" />
                  <span>Galería de Imágenes (Bento Tiles de Windows)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Gestiona las imágenes de proyectos en formato Bento Grid. Puedes elegir el tamaño asimétrico de cada tile ('Grande', 'Vertical', 'Cuadrado').
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
                {editingCard.gallery?.length || 0} items
              </span>
            </div>

            {/* Lista de Imágenes Actuales en la Galería */}
            {editingCard.gallery && editingCard.gallery.length > 0 ? (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {editingCard.gallery.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/15 bg-slate-900"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h6 className="font-bold text-white truncate text-xs">{item.title}</h6>
                          {item.category && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono shrink-0">
                              {item.category}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                      {/* Selector de Tamaño del Tile */}
                      <select
                        value={item.size}
                        onChange={(e) => handleUpdateGalleryItemSize(item.id, e.target.value as GalleryImageItem['size'])}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-slate-200 text-[11px] font-mono focus:border-sky-400 focus:outline-none cursor-pointer"
                        title="Tamaño del Tile en el Grid"
                      >
                        <option value="large">Grande (2x2)</option>
                        <option value="tall">Vertical (1x2)</option>
                        <option value="square">Cuadrado (1x1)</option>
                        <option value="small">Pequeño (1x1)</option>
                      </select>

                      {/* Botones de Reordenamiento */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveGalleryItem(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
                          title="Mover arriba"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveGalleryItem(idx, 'down')}
                          disabled={idx === (editingCard.gallery?.length || 0) - 1}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
                          title="Mover abajo"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Botón Eliminar */}
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryItem(item.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors cursor-pointer"
                        title="Eliminar imagen de la galería"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-black/30 border border-dashed border-white/15 text-center text-xs text-slate-400">
                <ImageIcon className="w-6 h-6 mx-auto mb-1.5 opacity-40 text-sky-400" />
                <span>No hay imágenes cargadas en esta galería todavía. Agrega la primera a continuación:</span>
              </div>
            )}

            {/* Formulario para Agregar Nueva Imagen */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Nueva Imagen a la Galería</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">URL de la Imagen</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newGalUrl} 
                      onChange={(e) => setNewGalUrl(e.target.value)} 
                      placeholder="https://images.unsplash.com/... o enlace directo"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-xs focus:border-sky-400 focus:outline-none"
                    />
                    <label 
                      className={`px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer shrink-0 flex items-center justify-center transition-all ${
                        isUploadingGalImage ? 'opacity-50 pointer-events-none' : ''
                      }`}
                      title="Subir archivo de imagen desde tu equipo a Firebase Storage"
                    >
                      {isUploadingGalImage ? (
                        <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                      ) : (
                        <Upload className="w-4 h-4 text-sky-400" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleGalleryImageFileUpload} 
                        className="hidden" 
                        disabled={isUploadingGalImage}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Título de la Captura / Proyecto</label>
                  <input 
                    type="text" 
                    value={newGalTitle} 
                    onChange={(e) => setNewGalTitle(e.target.value)} 
                    placeholder="Ej: Dashboard de Ventas Web & PWA"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Categoría (para filtro interactivo)</label>
                  <input 
                    type="text" 
                    value={newGalCategory} 
                    onChange={(e) => setNewGalCategory(e.target.value)} 
                    placeholder="Ej: Web & PWA, Branding, Hardware POS"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Tamaño del Tile (Geometría Bento)</label>
                  <select
                    value={newGalSize}
                    onChange={(e) => setNewGalSize(e.target.value as GalleryImageItem['size'])}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-sky-400 focus:outline-none cursor-pointer"
                  >
                    <option value="large">Grande (2x2 - Destacado)</option>
                    <option value="tall">Vertical (1x2 - Smartphone / Mobile)</option>
                    <option value="square">Cuadrado (1x1 - Equilibrado)</option>
                    <option value="small">Pequeño (1x1 - Compacto)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1 text-xs">Subtítulo / Breve Explicación (Opcional)</label>
                <input 
                  type="text" 
                  value={newGalSubtitle} 
                  onChange={(e) => setNewGalSubtitle(e.target.value)} 
                  placeholder="Ej: Implementación con React 19 y sincronización en tiempo real"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleAddGalleryItem}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-bold transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insertar Imagen en la Galería</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-xs">
            <label className="text-slate-400 block mb-1">Descripción Breve (Visible en Carrusel)</label>
            <textarea 
              rows={2}
              value={editingCard.description} 
              onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })} 
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              required
            />
          </div>

          <div className="text-xs">
            <label className="text-slate-400 block mb-1">Descripción Detallada (Visible en Modal Completo)</label>
            <textarea 
              rows={4}
              value={editingCard.longDescription} 
              onChange={(e) => setEditingCard({ ...editingCard, longDescription: e.target.value })} 
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setEditingCard(null)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-sky-500/20"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      )}

      {/* Lista de Tarjetas Actuales */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Soluciones Activas en el Sistema
        </h4>

        <div className="grid grid-cols-1 gap-2.5">
          {cards.map((card) => (
            <div 
              key={card.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span 
                  className="text-base font-mono font-black shrink-0"
                  style={{ color: card.accentColor }}
                >
                  {card.number}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-white truncate">{card.title}</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 shrink-0">
                      {card.category}
                    </span>
                    {card.hasDownload ? (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                        <Download className="w-2.5 h-2.5" />
                        <span>Descarga</span>
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5 shrink-0">
                        Informativo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-lg">{card.subtitle}</p>
                </div>
              </div>

              {currentUser && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingCard(card)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-all cursor-pointer"
                    title="Editar Tarjeta"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-all cursor-pointer"
                    title="Eliminar Tarjeta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
