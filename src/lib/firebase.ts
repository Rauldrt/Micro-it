import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuración canónica pública de Firebase para Micro-it Studio
// En aplicaciones cliente web (SPA), la configuración de Firebase es pública por diseño de Google.
// La seguridad real y absoluta reside en las reglas de Firestore (firestore.rules) y Firebase Auth.
export const getFirebaseConfig = () => {
  const getVal = (key: string, fallback: string) => {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem(`microit_${key}`);
      if (local) return local;
    }
    const envVal = import.meta.env[key];
    if (typeof envVal === 'string' && envVal.trim() !== '') {
      return envVal.trim();
    }
    return fallback;
  };

  return {
    apiKey: getVal('VITE_FIREBASE_API_KEY', 'AIzaSyCVd-0sBp-U1NKMIe2ki6v5Yxfh6GnLbyI'),
    authDomain: getVal('VITE_FIREBASE_AUTH_DOMAIN', 'micro-it-studio.firebaseapp.com'),
    projectId: getVal('VITE_FIREBASE_PROJECT_ID', 'micro-it-studio'),
    storageBucket: getVal('VITE_FIREBASE_STORAGE_BUCKET', 'micro-it-studio.firebasestorage.app'),
    messagingSenderId: getVal('VITE_FIREBASE_MESSAGING_SENDER_ID', '74888642754'),
    appId: getVal('VITE_FIREBASE_APP_ID', '1:74888642754:web:9a59c3177de25c5a8bfb5b')
  };
};

export const isFirebaseConfigured = (): boolean => {
  const config = getFirebaseConfig();
  return Boolean(config.apiKey && config.projectId);
};

export const getFirebaseApp = () => {
  const config = getFirebaseConfig();
  if (!isFirebaseConfigured()) return null;
  return getApps().length > 0 ? getApp() : initializeApp(config);
};

export const getDb = () => {
  const app = getFirebaseApp();
  return app ? getFirestore(app) : null;
};

export const getFirebaseAuth = () => {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
};
