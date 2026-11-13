import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Credenciales por defecto del proyecto Firebase micro-it-studio
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCVd-0sBp-U1NKMIe2ki6v5Yxfh6GnLbyI",
  authDomain: "micro-it-studio.firebaseapp.com",
  projectId: "micro-it-studio",
  storageBucket: "micro-it-studio.firebasestorage.app",
  messagingSenderId: "74888642754",
  appId: "1:74888642754:web:9a59c3177de25c5a8bfb5b"
};

// Lee de localStorage (para overrides del admin), luego import.meta.env, y finalmente fallback embebido
const getEnvOrStorage = (key: string, defaultValue: string): string => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(`microit_${key}`);
    if (local) return local;
  }
  const envVal = (import.meta.env && import.meta.env[key]) as string | undefined;
  if (envVal) return envVal;
  return defaultValue;
};

export const getFirebaseConfig = () => {
  return {
    apiKey: getEnvOrStorage('VITE_FIREBASE_API_KEY', DEFAULT_FIREBASE_CONFIG.apiKey),
    authDomain: getEnvOrStorage('VITE_FIREBASE_AUTH_DOMAIN', DEFAULT_FIREBASE_CONFIG.authDomain),
    projectId: getEnvOrStorage('VITE_FIREBASE_PROJECT_ID', DEFAULT_FIREBASE_CONFIG.projectId),
    storageBucket: getEnvOrStorage('VITE_FIREBASE_STORAGE_BUCKET', DEFAULT_FIREBASE_CONFIG.storageBucket),
    messagingSenderId: getEnvOrStorage('VITE_FIREBASE_MESSAGING_SENDER_ID', DEFAULT_FIREBASE_CONFIG.messagingSenderId),
    appId: getEnvOrStorage('VITE_FIREBASE_APP_ID', DEFAULT_FIREBASE_CONFIG.appId)
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
