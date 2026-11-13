import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '../lib/firebase';
import { CardItem } from '../types';
import { CARDS_DATA } from '../data/cardsData';

const COLLECTION_NAME = 'cards';

// Escuchar tarjetas en tiempo real si Firebase está configurado, con fallback local
export const subscribeToCards = (
  onCardsUpdate: (cards: CardItem[]) => void,
  onError?: (err: unknown) => void
) => {
  const db = getDb();

  // Si no está configurado Firebase o no hay DB, leemos de localStorage o data estática
  if (!db || !isFirebaseConfigured()) {
    const savedLocal = localStorage.getItem('microit_cards_backup');
    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onCardsUpdate(parsed);
          return () => {};
        }
      } catch (e) {
        console.error('Error parseando backup local:', e);
      }
    }
    onCardsUpdate(CARDS_DATA);
    return () => {};
  }

  const cardsCol = collection(db, COLLECTION_NAME);

  return onSnapshot(
    cardsCol,
    (snapshot) => {
      if (snapshot.empty) {
        // Colección vacía: seed inicial automático con CARDS_DATA
        seedInitialCards().then((seeded) => {
          onCardsUpdate(seeded);
        });
      } else {
        const cards: CardItem[] = [];
        snapshot.forEach((docSnap) => {
          cards.push({ id: docSnap.id, ...docSnap.data() } as CardItem);
        });
        // Ordenar por número
        cards.sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));
        localStorage.setItem('microit_cards_backup', JSON.stringify(cards));
        onCardsUpdate(cards);
      }
    },
    (error) => {
      console.warn('Firestore offline o error de conexión, usando respaldo:', error);
      if (onError) onError(error);
      const savedLocal = localStorage.getItem('microit_cards_backup');
      if (savedLocal) {
        try {
          onCardsUpdate(JSON.parse(savedLocal));
        } catch {
          onCardsUpdate(CARDS_DATA);
        }
      } else {
        onCardsUpdate(CARDS_DATA);
      }
    }
  );
};

// Cargar tarjetas de muestra a Firestore si está vacío
export const seedInitialCards = async (): Promise<CardItem[]> => {
  const db = getDb();
  if (!db) return CARDS_DATA;

  for (const card of CARDS_DATA) {
    const ref = doc(db, COLLECTION_NAME, card.id);
    await setDoc(ref, card);
  }
  return CARDS_DATA;
};

// Guardar o actualizar una tarjeta
export const saveCard = async (card: CardItem): Promise<void> => {
  const db = getDb();
  if (db && isFirebaseConfigured()) {
    const ref = doc(db, COLLECTION_NAME, card.id);
    await setDoc(ref, card, { merge: true });
  }

  // Actualizar también respaldo en localStorage
  const localBackup = localStorage.getItem('microit_cards_backup');
  let currentCards: CardItem[] = localBackup ? JSON.parse(localBackup) : [...CARDS_DATA];
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
  const db = getDb();
  if (db && isFirebaseConfigured()) {
    const ref = doc(db, COLLECTION_NAME, cardId);
    await deleteDoc(ref);
  }

  const localBackup = localStorage.getItem('microit_cards_backup');
  if (localBackup) {
    const currentCards: CardItem[] = JSON.parse(localBackup);
    const filtered = currentCards.filter((c) => c.id !== cardId);
    localStorage.setItem('microit_cards_backup', JSON.stringify(filtered));
  }
};
