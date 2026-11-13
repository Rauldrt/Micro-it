import React, { useState, useEffect } from 'react';
import { CardItem } from '../types';
import { saveCard, deleteCard, seedInitialCards } from '../services/cardsService';
import { isFirebaseConfigured, getFirebaseConfig, getFirebaseAuth } from '../lib/firebase';
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
  UserCheck
} from 'lucide-react';

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
    try {
      await saveCard(editingCard);
      setStatusMsg('Tarjeta guardada exitosamente.');
      setEditingCard(null);
      if (onCardsChange) onCardsChange();
    } catch (err) {
      console.error(err);
      setStatusMsg('Error al guardar tarjeta.');
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg(''), 3000);
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

          <div className="text-xs">
            <label className="text-slate-400 block mb-1">URL de Imagen de Fondo</label>
            <input 
              type="text" 
              value={editingCard.imageUrl} 
              onChange={(e) => setEditingCard({ ...editingCard, imageUrl: e.target.value })} 
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
              required
            />
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
