import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Lee de variables de entorno (Vite: import.meta.env) con fallback a localStorage para fácil configuración visual
const getEnvOrStorage = (key: string): string => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(`microit_${key}`);
    if (local) return local;
  }
  return (import.meta.env[key] as string) || '';
};

export const getFirebaseConfig = () => {
  return {
    apiKey: getEnvOrStorage('VITE_FIREBASE_API_KEY'),
    authDomain: getEnvOrStorage('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnvOrStorage('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvOrStorage('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvOrStorage('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvOrStorage('VITE_FIREBASE_APP_ID')
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
