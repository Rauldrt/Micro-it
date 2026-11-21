import { isFirebaseConfigured } from '../lib/firebase';
import { CardItem } from '../types';
import { CARDS_DATA } from '../data/cardsData';

const COLLECTION_NAME = 'cards';

const getLocalCardsFallback = (): CardItem[] => {
  if (typeof window === 'undefined') return CARDS_DATA;
  const savedLocal = localStorage.getItem('microit_cards_backup');
  if (savedLocal) {
    try {
      const parsed = JSON.parse(savedLocal);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((card: CardItem) => {
          const fallback = CARDS_DATA.find((c) => c.id === card.id || c.number === card.number);
          return {
            ...fallback,
            ...card,
            hasDownload: card.hasDownload !== undefined ? card.hasDownload : (fallback?.hasDownload ?? false),
            gallery: (card.gallery && Array.isArray(card.gallery) && card.gallery.length > 0) ? card.gallery : (fallback?.gallery || [])
          };
        });
      }
    } catch (e) {
      console.error('Error parseando backup local:', e);
    }
  }
  return CARDS_DATA;
};

const loadFirestore = async () => {
  if (!isFirebaseConfigured()) return null;
  const [{ getFirebaseApp }, firestore] = await Promise.all([
    import('../lib/firebaseApp'),
    import('firebase/firestore'),
  ]);
  const app = getFirebaseApp();
  if (!app) return null;
  return { db: firestore.getFirestore(app), firestore };
};

// Escuchar tarjetas en tiempo real cargando Firestore de forma diferida tras el render inicial
export const subscribeToCards = (
  onCardsUpdate: (cards: CardItem[]) => void,
  onError?: (err: unknown) => void
) => {
  // Respuesta instantánea desde respaldo local o CARDS_DATA sin bloquear el bundle inicial
  onCardsUpdate(getLocalCardsFallback());

  if (!isFirebaseConfigured()) {
    return () => {};
  }

  let cancelled = false;
  let unsubscribeSnapshot: (() => void) | null = null;

  loadFirestore()
    .then((ctx) => {
      if (cancelled || !ctx) return;
      const { db, firestore } = ctx;
      const cardsCol = firestore.collection(db, COLLECTION_NAME);

      unsubscribeSnapshot = firestore.onSnapshot(
        cardsCol,
        (snapshot) => {
          if (cancelled) return;
          if (snapshot.empty) {
            seedInitialCards().then((seeded) => {
              if (!cancelled) onCardsUpdate(seeded);
            });
          } else {
            const cards: CardItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              const fallback = CARDS_DATA.find((c) => c.id === docSnap.id || c.number === data.number);
              cards.push({
                ...fallback,
                ...data,
                id: docSnap.id,
                hasDownload: data.hasDownload !== undefined ? data.hasDownload : (fallback?.hasDownload ?? false),
                gallery: (data.gallery && Array.isArray(data.gallery) && data.gallery.length > 0) ? data.gallery : (fallback?.gallery || [])
              } as CardItem);
            });
            cards.sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));
            localStorage.setItem('microit_cards_backup', JSON.stringify(cards));
            onCardsUpdate(cards);
          }
        },
        (error) => {
          console.warn('Firestore offline o error de conexión, usando respaldo:', error);
          if (onError) onError(error);
          if (!cancelled) {
            onCardsUpdate(getLocalCardsFallback());
          }
        }
      );
    })
    .catch((error) => {
      console.warn('No se pudo inicializar Firestore de forma diferida:', error);
      if (onError) onError(error);
    });

  return () => {
    cancelled = true;
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }
  };
};

// Cargar tarjetas de muestra a Firestore si está vacío
export const seedInitialCards = async (): Promise<CardItem[]> => {
  const ctx = await loadFirestore();
  if (!ctx) return CARDS_DATA;

  const { db, firestore } = ctx;
  await Promise.all(
    CARDS_DATA.map((card) =>
      firestore.setDoc(firestore.doc(db, COLLECTION_NAME, card.id), card)
    )
  );
  return CARDS_DATA;
};

// Guardar o actualizar una tarjeta
export const saveCard = async (card: CardItem): Promise<void> => {
  const ctx = await loadFirestore();
  if (ctx) {
    const { db, firestore } = ctx;
    const ref = firestore.doc(db, COLLECTION_NAME, card.id);
    await firestore.setDoc(ref, card, { merge: true });
  }

  // Actualizar también respaldo en localStorage
  const localBackup = localStorage.getItem('microit_cards_backup');
  const currentCards: CardItem[] = localBackup ? JSON.parse(localBackup) : [...CARDS_DATA];
  const idx = currentCards.findIndex((c) => c.id === card.id);
  if (idx >= 0) {
    currentCards[idx] = card;
  } else {
    currentCards.push(card);
  }
  localStorage.setItem('microit_cards_backup', JSON.stringify(currentCards));
};

// Eliminar una tarjeta
export const deleteCard = async (cardId: string): Promise<void> => {
  const ctx = await loadFirestore();
  if (ctx) {
    const { db, firestore } = ctx;
    const ref = firestore.doc(db, COLLECTION_NAME, cardId);
    await firestore.deleteDoc(ref);
  }

  const localBackup = localStorage.getItem('microit_cards_backup');
  if (localBackup) {
    const currentCards: CardItem[] = JSON.parse(localBackup);
    const filtered = currentCards.filter((c) => c.id !== cardId);
    localStorage.setItem('microit_cards_backup', JSON.stringify(filtered));
  }
};
